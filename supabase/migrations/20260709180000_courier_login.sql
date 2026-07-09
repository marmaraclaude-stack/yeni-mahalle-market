-- ============================================================
-- Kurye giriş paneli: kurye telefon + kod ile /kurye adresinden giriş yapar.
-- Kod admin tarafından belirlenir; boş = giriş kapalı. (İç kullanım, düşük
-- hassasiyet — yalnız kendi siparişlerini görme + konum paylaşımı yetkisi.)
-- ============================================================

alter table public.couriers
  add column if not exists login_code text not null default '';
