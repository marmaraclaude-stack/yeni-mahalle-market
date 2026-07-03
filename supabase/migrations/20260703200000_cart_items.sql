-- ============================================================
-- Yeni Mahalle Market - hesaba bağlı sepet (cart_items)
--
-- Giriş yapmış kullanıcının sepeti bu tabloda tutulur; misafir
-- sepeti tarayıcıda (localStorage) kalır ve girişte buraya
-- birleştirilir (merge).
--
-- KURULUM: Bu dosyanın tamamını Supabase Dashboard → SQL Editor'e
-- yapıştırıp "Run" deyin. (Ana şema kurulmuş olmalı:
--   supabase/migrations/20260703100000_eticaret_schema.sql)
-- ============================================================

-- ------------------------------------------------------------
-- Sepet satırları - kullanıcı + ürün başına tek satır
-- ------------------------------------------------------------
create table public.cart_items (
  user_id    uuid not null references auth.users(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  qty        int  not null check (qty > 0 and qty <= 99),  -- UI ile aynı sınır (1-99)
  updated_at timestamptz not null default now(),
  primary key (user_id, product_id)
);

-- updated_at otomatik güncellensin (fonksiyon ana şemada tanımlı)
create trigger trg_cart_items_touch
before update on public.cart_items
for each row execute function public.touch_updated_at();

-- ------------------------------------------------------------
-- RLS - kullanıcı YALNIZ kendi sepet satırlarını yönetir.
-- Anon (girişsiz) erişim yok: misafir sepeti localStorage'da.
-- ------------------------------------------------------------
alter table public.cart_items enable row level security;

create policy "sepet_kendi_okur" on public.cart_items
  for select using (auth.uid() = user_id);
create policy "sepet_kendi_ekler" on public.cart_items
  for insert with check (auth.uid() = user_id);
create policy "sepet_kendi_gunceller" on public.cart_items
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "sepet_kendi_siler" on public.cart_items
  for delete using (auth.uid() = user_id);
