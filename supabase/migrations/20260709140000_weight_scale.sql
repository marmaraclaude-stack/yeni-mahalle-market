-- ============================================================
-- Ürün bazında gram satış ölçeği: en az miktar + adım.
-- Karpuz/kavun gibi iri ürünlerde admin 5000 / 1000 (5 kg / 1 kg) girer;
-- müşteri 5-6-7-8 kg gibi seçer. Varsayılan 250 g / 250 g (normal meyve-sebze).
-- ============================================================

alter table public.products
  add column if not exists weight_min_grams integer not null default 250,
  add column if not exists weight_step_grams integer not null default 250;
