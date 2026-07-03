"use server";

// Kupon doğrulama Server Action'ı.
// coupons tablosunda RLS açık ama policy YOK — anon okuyamaz; bu yüzden
// doğrulama service-role client ile yapılır. Client'taki sonuç sadece
// GÖSTERİM içindir: createOrder sipariş anında kuponu YENİDEN doğrular.

import { createAdminClient } from "@/lib/supabase/admin";
import { formatTL, type Coupon } from "@/lib/shop/types";

export type CouponValidation =
  | { ok: true; code: string; description: string; discount: number }
  | { ok: false; error: string };

function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

/**
 * Kupon kodunu doğrula ve verilen ara toplam için indirim tutarını hesapla.
 * Kontroller: kod var mı, is_active, expires_at geçmemiş, max_uses aşılmamış,
 * min_order_total sağlanmış.
 * İndirim: percent → subtotal * value / 100 (2 hane), fixed → min(value, subtotal).
 */
export async function validateCoupon(
  code: string,
  subtotal: number,
): Promise<CouponValidation> {
  const normalized = (code ?? "").trim().toUpperCase();
  if (!normalized) return { ok: false, error: "Kupon kodu girin." };

  const cartSubtotal = round2(Math.max(0, Number(subtotal) || 0));

  let coupon: Coupon | null = null;
  try {
    const admin = createAdminClient();
    const { data, error } = await admin
      .from("coupons")
      .select("*")
      .eq("code", normalized)
      .maybeSingle();

    if (error)
      return { ok: false, error: "Kupon doğrulanamadı. Lütfen tekrar deneyin." };
    coupon = (data as Coupon | null) ?? null;
  } catch {
    return { ok: false, error: "Kupon doğrulanamadı. Lütfen tekrar deneyin." };
  }

  if (!coupon) return { ok: false, error: "Kupon kodu geçersiz." };
  if (!coupon.is_active)
    return { ok: false, error: "Bu kupon artık aktif değil." };
  if (coupon.expires_at && new Date(coupon.expires_at).getTime() < Date.now())
    return { ok: false, error: "Bu kuponun süresi dolmuş." };
  if (coupon.max_uses !== null && coupon.used_count >= coupon.max_uses)
    return { ok: false, error: "Bu kupon kullanım limitine ulaştı." };

  const minTotal = Number(coupon.min_order_total) || 0;
  if (cartSubtotal < minTotal)
    return {
      ok: false,
      error: `Bu kupon ${formatTL(minTotal)} ve üzeri sepetlerde geçerli.`,
    };

  const value = Number(coupon.value) || 0;
  const rawDiscount =
    coupon.discount_type === "percent"
      ? (cartSubtotal * value) / 100
      : Math.min(value, cartSubtotal);
  const discount = round2(Math.min(rawDiscount, cartSubtotal));

  if (discount <= 0)
    return { ok: false, error: "Kupon bu sepete indirim sağlamıyor." };

  return {
    ok: true,
    code: coupon.code,
    description: coupon.description ?? "",
    discount,
  };
}
