-- ============================================================
-- Mesafeye göre teslimat ücreti altyapısı.
-- delivery_fee = taban ücret; per_km = dahil km sonrası km başı ek ücret.
-- orders.delivery_km: sipariş anında hesaplanan kuş uçuşu mesafe (görünürlük).
-- ============================================================

alter table public.shop_settings
  add column if not exists delivery_per_km numeric(10,2) not null default 0,
  add column if not exists delivery_km_included numeric(10,2) not null default 0;

alter table public.orders
  add column if not exists delivery_km double precision;
