-- ============================================================
-- Yeni Mahalle Market — kuryeler + ürün/banner bayrakları (Ajan A, v15)
-- 1) Kayıtlı kurye rehberi: sipariş detayında dropdown'dan seçilir,
--    seçilen kaydın adı + telefonu orders.courier_name/phone'a yazılır.
-- 2) products.is_best_seller: vitrinde "Çok Satan" grubunu besler.
-- 3) banners.icon: admin ikon seçici + BannerCarousel resolveBannerIcon.
--
-- KURULUM: Bu dosyanın tamamını Supabase Dashboard -> SQL Editor'e
-- yapıştırıp "Run" deyin. Idempotent (tekrar çalıştırılabilir).
-- ============================================================

-- ------------------------------------------------------------
-- Kuryeler — kayıtlı kurye rehberi (yalnız service-role okur/yazar)
-- ------------------------------------------------------------
create table if not exists public.couriers (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  phone      text not null default '',
  is_active  boolean not null default true,
  created_at timestamptz not null default now()
);

-- RLS açık ama policy YOK — tüm erişim SUPABASE_SERVICE_ROLE_KEY ile
-- Server Action'lardan yapılır (orders/products ile aynı desen).
alter table public.couriers enable row level security;

-- ------------------------------------------------------------
-- Ürün bayrağı: çok satan
-- ------------------------------------------------------------
alter table public.products
  add column if not exists is_best_seller boolean not null default false;

-- ------------------------------------------------------------
-- Banner ikonu: BANNER_ICON_OPTIONS anahtarı (boş = otomatik tahmin)
-- ------------------------------------------------------------
alter table public.banners
  add column if not exists icon text not null default '';
