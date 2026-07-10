-- Teslimat bölgesi sınırı: en uzak teslimat mesafesi (km, kuş uçuşu).
-- 0 = sınırsız. Aşan siparişler sunucuda reddedilir.
alter table public.shop_settings
  add column if not exists delivery_max_km numeric(10,2) not null default 0;
