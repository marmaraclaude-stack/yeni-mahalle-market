-- ============================================================
-- Ürün alt kategorisi elle seçilebilsin (override). Null ise kural tabanlı
-- atama (ürün adı/markadan) kullanılır; doluysa admin seçimi geçerlidir.
-- ============================================================

alter table public.products
  add column if not exists subcategory_slug text;
