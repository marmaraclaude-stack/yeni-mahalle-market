-- ============================================================
-- Yeni Mahalle Market — kampanya banner sistemi
-- banners tablosu + RLS + 3 seed banner
--
-- KURULUM: Bu dosyanın tamamını Supabase Dashboard → SQL Editor'e
-- yapıştırıp "Run" deyin.
-- ============================================================

-- ------------------------------------------------------------
-- Bannerlar
-- Vitrin ve /urunler üstünde dönen kampanya kartları.
-- tint: CATEGORY_TINTS index (0-7) — zemin/yazı rengi çifti.
-- ------------------------------------------------------------
create table public.banners (
  id         uuid primary key default gen_random_uuid(),
  title      text not null,
  subtitle   text not null default '',
  cta_text   text not null default '',        -- boş = buton yok
  cta_href   text not null default '',        -- /firsatlar, /urunler?k=... vb.
  tint       smallint not null default 0
             check (tint between 0 and 7),    -- CATEGORY_TINTS index (0-7) zemin
  is_active  boolean not null default true,
  sort       int not null default 0,
  created_at timestamptz not null default now()
);

-- RLS: herkes YALNIZ aktif banner'ları okuyabilir; yazma policy'si
-- bilinçli olarak YOK — tüm yazmalar service-role (admin Server Action)
-- üzerinden yapılır.
alter table public.banners enable row level security;

create policy "Aktif bannerlar herkese acik"
  on public.banners
  for select
  using (is_active = true);

-- ------------------------------------------------------------
-- Seed: 3 başlangıç banner'ı
-- ------------------------------------------------------------
insert into public.banners (title, subtitle, cta_text, cta_href, tint, sort) values
  ('Fırsat ürünleri burada', 'İndirimli ürünleri kaçırma', 'Fırsatları Gör', '/firsatlar', 1, 0),
  ('Sapanca içi aynı gün teslimat', 'Siparişin kapına gelsin', 'Alışverişe Başla', '/urunler', 4, 1),
  ('Kapıda ödeme kolaylığı', 'Nakit veya kartla kapıda öde', '', '', 0, 2);
