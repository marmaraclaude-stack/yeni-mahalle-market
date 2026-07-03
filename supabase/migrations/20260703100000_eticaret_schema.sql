-- ============================================================
-- Yeni Mahalle Market — e-ticaret şeması
-- Katalog + sepet siparişi + ödeme (iyzico/kapıda) + takip + ayarlar
--
-- KURULUM: Bu dosyanın tamamını Supabase Dashboard → SQL Editor'e
-- yapıştırıp "Run" deyin. Ardından seed dosyasını çalıştırın:
--   supabase/migrations/20260703100001_eticaret_seed.sql
-- ============================================================

-- ------------------------------------------------------------
-- Kategoriler — UI'daki 30 kategori ile birebir aynı
-- ------------------------------------------------------------
create table public.shop_categories (
  slug        text primary key,
  name        text not null,
  tint        smallint not null default 0,          -- CategoryGrid TINTS index (0-7)
  icon        text not null default 'shopping-basket', -- lucide ikon adı (kebab-case)
  sort        int  not null default 0,
  -- Yasal not: tütün ürünleri Türkiye'de online SATILAMAZ (4207/4733).
  -- false → katalogda görünür ama sepete eklenemez, "mağazada" rozeti.
  is_orderable boolean not null default true
);

-- ------------------------------------------------------------
-- Ürünler
-- ------------------------------------------------------------
create table public.products (
  id            uuid primary key default gen_random_uuid(),
  category_slug text not null references public.shop_categories(slug) on delete restrict,
  name          text not null,
  slug          text not null unique,
  brand         text not null default '',
  size_text     text not null default '',            -- "1 L", "350 g", "6'lı"
  description   text not null default '',
  price         numeric(10,2) not null check (price >= 0),
  compare_at_price numeric(10,2),                    -- indirim öncesi fiyat (opsiyonel)
  unit          text not null default 'adet',        -- adet | kg | paket ...
  image_url     text,                                -- boşsa UI kategori renkli placeholder basar
  is_active     boolean not null default true,
  in_stock      boolean not null default true,
  is_featured   boolean not null default false,
  sort          int not null default 0,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index idx_products_category on public.products(category_slug, is_active, sort);
create index idx_products_featured on public.products(is_featured) where is_featured;
-- Türkçe arama için basit trigram yerine ilike kullanılıyor; ölçek büyürse pg_trgm eklenir.

-- updated_at otomatik güncelle
create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger trg_products_touch
before update on public.products
for each row execute function public.touch_updated_at();

-- ------------------------------------------------------------
-- Müşteri profilleri + adresler (Supabase Auth üzerine)
-- ------------------------------------------------------------
create table public.customer_profiles (
  id         uuid primary key references auth.users(id) on delete cascade,
  full_name  text not null default '',
  phone      text not null default '',
  created_at timestamptz not null default now()
);

create table public.customer_addresses (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users(id) on delete cascade,
  title      text not null default 'Ev',              -- Ev, İş, Bungalov...
  line       text not null,                            -- açık adres
  district   text not null default 'Sapanca',
  note       text not null default '',                 -- tarif, kapı kodu
  created_at timestamptz not null default now()
);

create index idx_addresses_user on public.customer_addresses(user_id);

-- Kayıt olduğunda profil satırı otomatik açılsın
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.customer_profiles (id, full_name, phone)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    coalesce(new.raw_user_meta_data->>'phone', '')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger trg_on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

-- ------------------------------------------------------------
-- Siparişler
-- ------------------------------------------------------------
create table public.orders (
  id             uuid primary key default gen_random_uuid(),
  order_no       text not null unique,                -- "YM-482913" — müşteriye gösterilen
  user_id        uuid references auth.users(id) on delete set null, -- misafir siparişte null
  customer_name  text not null,
  phone          text not null,
  address_line   text not null,
  address_note   text not null default '',
  items_subtotal numeric(10,2) not null,
  delivery_fee   numeric(10,2) not null default 0,
  total          numeric(10,2) not null,
  payment_method text not null check (payment_method in ('cod_cash','cod_card','iyzico')),
  payment_status text not null default 'pending'
                 check (payment_status in ('pending','paid','failed','refunded')),
  status         text not null default 'new'
                 check (status in ('new','confirmed','preparing','on_the_way','delivered','cancelled')),
  note           text not null default '',            -- müşteri sipariş notu
  admin_note     text not null default '',            -- iç not (kurye adı vs.)
  iyzico_token   text,                                 -- checkout form token
  iyzico_payment_id text,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

create index idx_orders_status on public.orders(status, created_at desc);
create index idx_orders_user on public.orders(user_id, created_at desc);
create index idx_orders_phone on public.orders(phone);

create trigger trg_orders_touch
before update on public.orders
for each row execute function public.touch_updated_at();

create table public.order_items (
  id         uuid primary key default gen_random_uuid(),
  order_id   uuid not null references public.orders(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  name       text not null,                            -- sipariş anındaki ad (snapshot)
  unit_price numeric(10,2) not null,                   -- sipariş anındaki fiyat (snapshot)
  qty        int not null check (qty > 0),
  line_total numeric(10,2) not null
);

create index idx_order_items_order on public.order_items(order_id);

-- Sipariş durum geçmişi — takip sayfasındaki zaman çizelgesi
create table public.order_events (
  id         uuid primary key default gen_random_uuid(),
  order_id   uuid not null references public.orders(id) on delete cascade,
  status     text not null,
  note       text not null default '',
  created_at timestamptz not null default now()
);

create index idx_order_events_order on public.order_events(order_id, created_at);

-- Sipariş oluşturulunca ilk event otomatik düşsün
create or replace function public.log_order_created()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.order_events (order_id, status, note)
  values (new.id, new.status, 'Sipariş alındı');
  return new;
end;
$$;

create trigger trg_orders_log_created
after insert on public.orders
for each row execute function public.log_order_created();

-- Durum değişince event düşsün
create or replace function public.log_order_status_change()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.status is distinct from old.status then
    insert into public.order_events (order_id, status, note) values (new.id, new.status, '');
  end if;
  return new;
end;
$$;

create trigger trg_orders_log_status
after update on public.orders
for each row execute function public.log_order_status_change();

-- ------------------------------------------------------------
-- Mağaza ayarları — tek satır (id=1)
-- ------------------------------------------------------------
create table public.shop_settings (
  id                 int primary key default 1 check (id = 1),
  delivery_fee       numeric(10,2) not null default 0,
  free_delivery_over numeric(10,2) not null default 0,  -- 0 = ücretsiz teslimat eşiği yok (ücret hep uygulanır)
  min_order_total    numeric(10,2) not null default 0,
  cod_cash_enabled   boolean not null default true,
  cod_card_enabled   boolean not null default true,
  iyzico_enabled     boolean not null default false,     -- API anahtarı girilince açılır
  ordering_open      boolean not null default true,      -- acil kapatma anahtarı
  closed_message     text not null default 'Şu an online sipariş alamıyoruz. WhatsApp üzerinden yazabilirsiniz.'
);

insert into public.shop_settings (id) values (1);

-- ------------------------------------------------------------
-- RLS
-- Yazma işlemlerinin TAMAMI service-role (Server Action) üzerinden.
-- Anon sadece kataloğu okur; müşteri kendi verisini okur.
-- ------------------------------------------------------------
alter table public.shop_categories   enable row level security;
alter table public.products          enable row level security;
alter table public.customer_profiles enable row level security;
alter table public.customer_addresses enable row level security;
alter table public.orders            enable row level security;
alter table public.order_items       enable row level security;
alter table public.order_events      enable row level security;
alter table public.shop_settings     enable row level security;

-- Katalog: herkes okur
create policy "kategoriler_herkes_okur" on public.shop_categories
  for select using (true);
create policy "urunler_herkes_okur" on public.products
  for select using (is_active = true);
create policy "ayarlar_herkes_okur" on public.shop_settings
  for select using (true);

-- Profil: kullanıcı kendisininkini okur/günceller
create policy "profil_kendi_okur" on public.customer_profiles
  for select using (auth.uid() = id);
create policy "profil_kendi_gunceller" on public.customer_profiles
  for update using (auth.uid() = id) with check (auth.uid() = id);

-- Adres: kullanıcı kendi adreslerini yönetir
create policy "adres_kendi_okur" on public.customer_addresses
  for select using (auth.uid() = user_id);
create policy "adres_kendi_ekler" on public.customer_addresses
  for insert with check (auth.uid() = user_id);
create policy "adres_kendi_gunceller" on public.customer_addresses
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "adres_kendi_siler" on public.customer_addresses
  for delete using (auth.uid() = user_id);

-- Sipariş: giriş yapmış kullanıcı kendi siparişini okur.
-- Misafir takip, service-role üzerinden (order_no + telefon eşleşmesi) yapılır.
create policy "siparis_kendi_okur" on public.orders
  for select using (auth.uid() = user_id);
create policy "siparis_kalemi_kendi_okur" on public.order_items
  for select using (
    exists (select 1 from public.orders o where o.id = order_id and o.user_id = auth.uid())
  );
create policy "siparis_event_kendi_okur" on public.order_events
  for select using (
    exists (select 1 from public.orders o where o.id = order_id and o.user_id = auth.uid())
  );

-- NOT: insert/update/delete policy'si bilinçli olarak YOK —
-- tüm yazmalar SUPABASE_SERVICE_ROLE_KEY ile Server Action'lardan yapılır.
