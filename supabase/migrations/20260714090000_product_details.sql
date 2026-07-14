-- Ürün etiket/detay bilgileri (Migros tarzı "Ürün Bilgileri / Besin Değerleri"
-- sekmeleri): içindekiler, net miktar, saklama, menşei, üretici, besin100.
-- Uygulama katmanı tipi: lib/shop/types.ts → ProductDetails.
alter table products add column if not exists details jsonb;
