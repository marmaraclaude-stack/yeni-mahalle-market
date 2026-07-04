-- ============================================================
-- Yeni Mahalle Market — siparişe kurye bilgisi (Ajan C, v13)
-- Siparişe atanan kuryenin adı + telefonu. "Kurye Yolda" durumunda
-- müşteri takip sayfasında "Kuryeniz yolda" kartında gösterilir.
--
-- KURULUM: Bu dosyanın tamamını Supabase Dashboard → SQL Editor'e
-- yapıştırıp "Run" deyin (mevcut orders satırları boş değerle güncellenir).
-- ============================================================

alter table public.orders
  add column if not exists courier_name  text not null default '',
  add column if not exists courier_phone text not null default '';
