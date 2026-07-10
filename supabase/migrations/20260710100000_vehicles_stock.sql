-- ============================================================
-- Faz 1+2: Araçlar (GPS cihazı araca takılır, kurye ataması değişebilir)
-- ve stok takibi (adet girilir, sipariş geldikçe otomatik düşer).
-- ============================================================

-- Araçlar: GPS cihazı araca bağlıdır; courier_id o an aracı kullanan kurye.
create table if not exists public.vehicles (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  plate text not null default '',
  courier_id uuid references public.couriers(id) on delete set null,
  last_lat double precision,
  last_lng double precision,
  last_at timestamptz,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);
alter table public.vehicles enable row level security;
-- Policy yok: yalnız service-role okur/yazar.

-- Stok: null = adet takibi yok (yalnız stokta/tükendi bayrağı).
-- Adetli üründe adet, gram bazlı üründe GRAM cinsinden tutulur (qty ile aynı birim).
alter table public.products
  add column if not exists stock_qty integer;

-- Sipariş oluşunca stoğu atomik düş; 0'a inince ürün otomatik "tükendi".
create or replace function public.decrement_stock(pid uuid, amount integer)
returns void language sql security definer as $$
  update public.products
     set stock_qty = greatest(coalesce(stock_qty, 0) - amount, 0),
         in_stock  = (coalesce(stock_qty, 0) - amount) > 0
   where id = pid and stock_qty is not null;
$$;

-- İptalde stoğu geri ekle; ürün yeniden satılabilir olur.
create or replace function public.restore_stock(pid uuid, amount integer)
returns void language sql security definer as $$
  update public.products
     set stock_qty = coalesce(stock_qty, 0) + amount,
         in_stock  = true
   where id = pid and stock_qty is not null;
$$;
