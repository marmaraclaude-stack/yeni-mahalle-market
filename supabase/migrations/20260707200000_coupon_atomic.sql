-- ============================================================
-- Kupon sayaci ATOMIK: limit dolduysa artis reddedilir.
-- Onceki increment_coupon_usage kosulsuz +1 yapiyordu; es zamanli
-- iki siparis max_uses kontrolunu birlikte gecip limiti asabiliyordu.
-- Donus tipi degistigi (void -> boolean) icin fonksiyon dusurulup
-- yeniden olusturulur. release_coupon_usage: siparis olusturma
-- basarisiz olursa rezervasyonu geri birakir.
-- ============================================================

drop function if exists public.increment_coupon_usage(text);

create function public.increment_coupon_usage(p_code text)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.coupons
     set used_count = used_count + 1
   where code = p_code
     and (max_uses is null or used_count < max_uses);
  return found;
end;
$$;

create or replace function public.release_coupon_usage(p_code text)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.coupons
     set used_count = greatest(used_count - 1, 0)
   where code = p_code;
end;
$$;

revoke execute on function public.increment_coupon_usage(text) from public;
revoke execute on function public.increment_coupon_usage(text) from anon, authenticated;
grant execute on function public.increment_coupon_usage(text) to service_role;

revoke execute on function public.release_coupon_usage(text) from public;
revoke execute on function public.release_coupon_usage(text) from anon, authenticated;
grant execute on function public.release_coupon_usage(text) to service_role;
