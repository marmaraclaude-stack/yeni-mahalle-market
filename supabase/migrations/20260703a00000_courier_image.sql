-- ============================================================
-- Yeni Mahalle Market — kurye görseli (Ajan A, v16)
-- Kayıtlı kuryelere avatar foto: admin Kuryeler sayfasından yüklenir,
-- "courier-images" storage bucket'ına konur, public URL bu kolona yazılır.
--
-- KURULUM: Bu dosyanın tamamını Supabase Dashboard -> SQL Editor'e
-- yapıştırıp "Run" deyin. Idempotent (tekrar çalıştırılabilir).
-- ============================================================

-- Kurye avatar görselinin public URL'i (boş = görsel yok).
alter table public.couriers
  add column if not exists image_url text not null default '';
