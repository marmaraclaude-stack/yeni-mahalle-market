// iyzico Checkout Form callback'i — ödeme sayfasından POST (form-data: token) gelir.
// Token ile sonuç sorgulanır, sipariş payment_status güncellenir (service role),
// müşteri /siparis/[orderNo]?odeme=ok|hata sayfasına yönlendirilir.

import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isIyzicoConfigured, retrieveCheckoutResult } from "@/lib/shop/iyzico";

interface OrderRef {
  id: string;
  order_no: string;
  total: number;
}

export async function POST(request: Request) {
  const redirectTo = (path: string) =>
    NextResponse.redirect(new URL(path, request.url), 303);

  let token = "";
  try {
    const form = await request.formData();
    token = String(form.get("token") ?? "").trim();
  } catch {
    // form-data okunamadı — aşağıda token boş kontrolüne düşer
  }

  if (!token || !isIyzicoConfigured()) {
    return redirectTo("/sepet");
  }

  // Siparişi iyzico_token eşleşmesiyle bul (service role — RLS'e takılmaz).
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("orders")
    .select("id, order_no, total")
    .eq("iyzico_token", token)
    .maybeSingle();

  if (error || !data) {
    return redirectTo("/sepet");
  }
  const order = data as OrderRef;

  // Ödeme sonucunu iyzico'dan doğrula — callback verisine değil retrieve'e güven.
  let paid = false;
  let paymentId: string | null = null;
  try {
    const result = await retrieveCheckoutResult(token);
    paid = result.status === "success" && result.paymentStatus === "SUCCESS";
    // Tahsil edilen tutar sipariş toplamından farklıysa "paid" sayma —
    // eksik/parçalı tahsilat elle incelensin (1 kuruş toleransı: float).
    if (paid && result.paidPrice !== null) {
      const expected = Number(order.total);
      if (Math.abs(result.paidPrice - expected) > 0.01) {
        paid = false;
      }
    }
    paymentId = result.paymentId;
  } catch {
    paid = false;
  }

  await admin
    .from("orders")
    .update({
      payment_status: paid ? "paid" : "failed",
      iyzico_payment_id: paymentId,
    })
    .eq("id", order.id);

  return redirectTo(`/siparis/${order.order_no}?odeme=${paid ? "ok" : "hata"}`);
}
