-- ============================================================
-- Yeni Mahalle Market — kupon üye-başına kullanım limiti
-- coupons tablosuna per_user_limit kolonu.
--
-- KURULUM: Bu dosyanın tamamını Supabase Dashboard -> SQL Editor'e
-- yapıştırıp "Run" deyin.
-- ============================================================

-- ------------------------------------------------------------
-- Üye başına kullanım limiti
-- Bir üye bu kuponu en fazla kaç iptal-olmayan siparişte kullanabilir.
-- 0 = üye başına sınırsız (yalnız genel max_uses geçerli kalır).
-- Varsayılan 1: mevcut "hesap başına 1 kez" davranışını korur.
-- ------------------------------------------------------------
alter table public.coupons
  add column per_user_limit int not null default 1;
