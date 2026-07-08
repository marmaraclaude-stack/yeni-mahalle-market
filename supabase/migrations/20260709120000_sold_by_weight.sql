-- ============================================================
-- Gram bazlı (kilogram fiyatlı) satış — meyve-sebze vb.
-- products.sold_by_weight = true ise fiyat KG başınadır ve müşteri
-- gram seçer. Sepet/sipariş qty'si o üründe GRAM olarak tutulur;
-- bu yüzden cart_items.qty ve order_items.qty üst sınırı gevşetilir.
-- ============================================================

alter table public.products
  add column if not exists sold_by_weight boolean not null default false;

alter table public.order_items
  add column if not exists sold_by_weight boolean not null default false;

-- cart_items.qty eskiden <= 99 idi; gram için 100000'e (100 kg) çıkar.
do $$
declare c text;
begin
  select conname into c
    from pg_constraint
   where conrelid = 'public.cart_items'::regclass
     and contype = 'c'
     and pg_get_constraintdef(oid) ilike '%qty%99%';
  if c is not null then
    execute format('alter table public.cart_items drop constraint %I', c);
  end if;
end $$;

alter table public.cart_items
  add constraint cart_items_qty_range check (qty > 0 and qty <= 100000);
