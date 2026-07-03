-- ============================================================
-- Yeni Mahalle Market — kupon sistemi
-- coupons tablosu + orders'a kupon kolonları + kapalı mesajı güncelle
--
-- KURULUM: Bu dosyanın tamamını Supabase Dashboard → SQL Editor'e
-- yapıştırıp "Run" deyin.
-- ============================================================

-- ------------------------------------------------------------
-- Kuponlar
-- Kod BÜYÜK harf saklanır (örn. HOSGELDIN20); doğrulama sunucuda
-- büyük harfe çevirip arar.
-- ------------------------------------------------------------
create table public.coupons (
  code            text primary key,               -- BÜYÜK harf saklanır (örn. HOSGELDIN20)
  description     text not null default '',       -- müşteriye gösterilen açıklama
  discount_type   text not null check (discount_type in ('percent','fixed')),
  value           numeric(10,2) not null check (value > 0), -- percent: %X, fixed: ₺X
  min_order_total numeric(10,2) not null default 0,         -- 0 = alt sınır yok
  max_uses        int,                            -- null = sınırsız
  used_count      int not null default 0,
  is_active       boolean not null default true,
  expires_at      timestamptz,                    -- null = süresiz
  created_at      timestamptz not null default now()
);

-- RLS: aç ama policy YOK — anon/authenticated kupon listesini OKUYAMAZ.
-- Doğrulama ve tüm yazmalar service-role (Server Action) üzerinden yapılır.
alter table public.coupons enable row level security;

-- Kullanım sayacını atomik artır (yarış koşuluna dayanıklı:
-- update ... set used_count = used_count + 1).
create or replace function public.increment_coupon_usage(p_code text)
returns void
language sql
security definer
set search_path = public
as $$
  update public.coupons set used_count = used_count + 1 where code = p_code;
$$;

-- Yalnız service-role çağırabilsin — anon/authenticated brute-force edemesin.
revoke execute on function public.increment_coupon_usage(text) from public;
revoke execute on function public.increment_coupon_usage(text) from anon, authenticated;
grant execute on function public.increment_coupon_usage(text) to service_role;

-- ------------------------------------------------------------
-- Siparişlere kupon alanları (sipariş anındaki snapshot)
-- ------------------------------------------------------------
alter table public.orders
  add column coupon_code    text,                             -- uygulanan kupon kodu
  add column discount_total numeric(10,2) not null default 0; -- indirim tutarı

-- ------------------------------------------------------------
-- Kapalı mesajı: WhatsApp yerine canlı destek
-- ------------------------------------------------------------
update public.shop_settings
  set closed_message = 'Şu an online sipariş alamıyoruz. Canlı destekten bize yazabilirsiniz.'
  where id = 1;
