-- ============================================================
-- Canli kurye takibi: siparise kuryenin son GPS konumu.
-- Kurye, tokenli /kurye/[orderNo] sayfasindan konum paylasir;
-- musteri takip sayfasi bu koordinatlari yoklayip haritada gosterir.
-- Yazma service-role token dogrulamali server action ile yapilir;
-- yeni RLS policy gerekmez (musteri okumasi mevcut yoldan gider).
-- ============================================================

alter table public.orders
  add column if not exists courier_lat double precision,
  add column if not exists courier_lng double precision,
  add column if not exists courier_location_at timestamptz;
