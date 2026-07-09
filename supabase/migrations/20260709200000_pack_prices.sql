-- ============================================================
-- Adet ürünlerde paket fiyatları (toplu alım indirimi).
-- { "2": 189.99, "3": 279.99, "4": 359.99 } — o adet için toplam fiyat.
-- Null = paket fiyatı yok (adet × birim fiyat).
-- ============================================================

alter table public.products
  add column if not exists pack_prices jsonb;
