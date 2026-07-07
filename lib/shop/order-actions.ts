"use server";

// Sipariş Server Action'ları — createOrder + getOrderForTracking.
// ÜYELİK ZORUNLU: createOrder yalnız girişli kullanıcı için çalışır (sunucuda doğrulanır).
// Fiyatlar ASLA client'tan alınmaz: ürünler DB'den çekilir, toplamlar sunucuda hesaplanır.
// Tüm yazmalar service-role client ile (RLS'te insert policy bilinçli olarak yok).

import { randomInt } from "node:crypto";
import { headers } from "next/headers";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { categoryBySlug } from "@/lib/shop/categories";
import { validateCoupon } from "@/lib/shop/coupons";
import {
  initializeCheckoutForm,
  isIyzicoConfigured,
  type IyzicoBasketItemInput,
} from "@/lib/shop/iyzico";
import { calcDeliveryFee, getShopSettings } from "@/lib/shop/settings";
import {
  formatTL,
  type Order,
  type OrderEvent,
  type OrderItem,
  type PaymentMethod,
} from "@/lib/shop/types";

const MAX_QTY = 99;
const MAX_LINES = 100;

export interface CreateOrderLine {
  productId: string;
  qty: number;
}

export interface CreateOrderPayload {
  customerName: string;
  phone: string;
  addressLine: string;
  addressNote: string;
  note: string;
  paymentMethod: PaymentMethod;
  lines: CreateOrderLine[];
  /** Opsiyonel kupon kodu — sunucuda YENİDEN doğrulanır. */
  couponCode?: string;
}

export type CreateOrderResult =
  | { ok: true; orderNo: string; paymentPageUrl: string | null }
  | { ok: false; error: string };

/** DB'den çekilen ürün satırı — sadece sipariş için gereken alanlar. */
interface ProductRow {
  id: string;
  name: string;
  brand: string;
  size_text: string;
  category_slug: string;
  price: number;
  is_active: boolean;
  in_stock: boolean;
}

function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

/** Telefonun son 10 hanesi (karşılaştırma anahtarı). */
function last10Digits(phone: string): string {
  return phone.replace(/\D/g, "").slice(-10);
}

// Karışan karakterler yok (0/O, 1/I) — telefonda okunabilir, 30^6 ≈ 729M olasılık
// (6 haneli sayıya göre ~800 kat fazla; takipte brute-force alanını daraltır).
const ORDER_NO_CHARS = "23456789ABCDEFGHJKLMNPRSTUVYZ";

function randomOrderNo(): string {
  let s = "";
  for (let i = 0; i < 6; i++) {
    s += ORDER_NO_CHARS[randomInt(0, ORDER_NO_CHARS.length)];
  }
  return "YM-" + s;
}

/** İstek origin'i — iyzico callback URL'i için (env override > proxy header). */
async function getRequestOrigin(): Promise<string> {
  const envUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (envUrl) return envUrl.replace(/\/$/, "");
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000";
  const proto =
    h.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  return `${proto}://${host}`;
}

/**
 * Kupon kullanımını ATOMIK rezerve et: DB fonksiyonu yalnız
 * max_uses dolmamışsa sayacı artırır (yarış durumu kapalı).
 * false = limit doldu. RPC hatasında (eski şema) sipariş engellenmez.
 */
async function reserveCouponUsage(
  admin: ReturnType<typeof createAdminClient>,
  code: string,
): Promise<boolean> {
  try {
    const { data, error } = await admin.rpc("increment_coupon_usage", {
      p_code: code,
    });
    if (error) return true; // fonksiyon henüz güncellenmediyse engelleme
    return data !== false;
  } catch {
    return true;
  }
}

/** Sipariş oluşmadıysa rezerve edilen kupon kullanımını geri bırak. */
async function releaseCouponUsage(
  admin: ReturnType<typeof createAdminClient>,
  code: string | null,
): Promise<void> {
  if (!code) return;
  try {
    await admin.rpc("release_coupon_usage", { p_code: code });
  } catch {
    // Kritik değil.
  }
}

export async function createOrder(
  payload: CreateOrderPayload,
): Promise<CreateOrderResult> {
  // --- 0) ÜYELİK ZORUNLU: sunucu tarafı auth kontrolü ---
  // Client kontrolüne güvenilmez; oturum yoksa sipariş oluşturulmaz.
  let userId: string | null = null;
  let userEmail: string | null = null;
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    userId = user?.id ?? null;
    userEmail = user?.email ?? null;
  } catch {
    userId = null;
  }
  if (!userId) {
    return { ok: false, error: "Sipariş için giriş yapmalısınız." };
  }

  // --- 1) Form doğrulama ---
  const customerName = payload.customerName?.trim() ?? "";
  const phone = payload.phone?.trim() ?? "";
  const addressLine = payload.addressLine?.trim() ?? "";
  const addressNote = payload.addressNote?.trim() ?? "";
  const note = payload.note?.trim() ?? "";

  if (customerName.length < 2) return { ok: false, error: "Ad soyad girin." };
  if (last10Digits(phone).length < 10)
    return { ok: false, error: "Geçerli bir telefon numarası girin (10 hane)." };
  if (addressLine.length < 10)
    return { ok: false, error: "Teslimat adresini açık şekilde yazın." };

  const rawLines = Array.isArray(payload.lines) ? payload.lines : [];
  const lines = rawLines
    .filter((l) => typeof l?.productId === "string" && l.productId.length > 0)
    .map((l) => ({
      productId: l.productId,
      qty: Math.min(MAX_QTY, Math.max(1, Math.floor(Number(l.qty) || 0))),
    }))
    .filter((l) => l.qty > 0)
    .slice(0, MAX_LINES);

  if (lines.length === 0) return { ok: false, error: "Sepetiniz boş." };

  // --- 2) Ayarlar + ödeme yöntemi kontrolü ---
  const settings = await getShopSettings();
  if (!settings.ordering_open) return { ok: false, error: settings.closed_message };

  const method = payload.paymentMethod;
  const methodAllowed =
    (method === "cod_cash" && settings.cod_cash_enabled) ||
    (method === "cod_card" && settings.cod_card_enabled) ||
    (method === "iyzico" && settings.iyzico_enabled && isIyzicoConfigured());
  if (!methodAllowed)
    return { ok: false, error: "Seçilen ödeme yöntemi şu an kullanılamıyor." };

  // --- 3) Ürünleri DB'den çek, fiyat/stok/orderable doğrula ---
  const admin = createAdminClient();
  const productIds = [...new Set(lines.map((l) => l.productId))];

  const { data: productData, error: productError } = await admin
    .from("products")
    .select("id, name, brand, size_text, category_slug, price, is_active, in_stock")
    .in("id", productIds);

  if (productError)
    return { ok: false, error: "Ürünler doğrulanamadı. Lütfen tekrar deneyin." };

  const products = new Map(
    ((productData ?? []) as ProductRow[]).map((p) => [p.id, p]),
  );

  let subtotal = 0;
  const orderItems: Array<{
    product_id: string;
    name: string;
    unit_price: number;
    qty: number;
    line_total: number;
  }> = [];
  const basketItems: IyzicoBasketItemInput[] = [];

  for (const line of lines) {
    const product = products.get(line.productId);
    if (!product || !product.is_active)
      return { ok: false, error: "Sepetinizde artık satışta olmayan bir ürün var. Lütfen sepeti güncelleyin." };
    if (!product.in_stock)
      return { ok: false, error: `"${product.name}" şu an stokta yok. Lütfen sepetten çıkarın.` };

    const category = categoryBySlug(product.category_slug);
    if (category && !category.orderable)
      return { ok: false, error: `"${product.name}" online satılamıyor (mağazadan alınır). Lütfen sepetten çıkarın.` };

    const unitPrice = round2(Number(product.price));
    const lineTotal = round2(unitPrice * line.qty);
    subtotal = round2(subtotal + lineTotal);

    const displayName = [product.brand, product.name, product.size_text]
      .filter(Boolean)
      .join(" ")
      .trim();

    orderItems.push({
      product_id: product.id,
      name: displayName || product.name,
      unit_price: unitPrice,
      qty: line.qty,
      line_total: lineTotal,
    });
    basketItems.push({
      id: product.id,
      name: displayName || product.name,
      category: category?.name ?? "Market",
      lineTotal,
    });
  }

  if (subtotal < settings.min_order_total)
    return {
      ok: false,
      error: `Minimum sipariş tutarı ${formatTL(settings.min_order_total)}. Sepetinize ürün ekleyin.`,
    };

  // --- 3.5) Kupon (opsiyonel) — sunucuda YENİDEN doğrula, client sonucuna güvenme.
  // Kod gönderilmiş ama doğrulanamıyorsa kuponsuz devam ETME: hata dön.
  const rawCouponCode = payload.couponCode?.trim() ?? "";
  let couponCode: string | null = null;
  let discountTotal = 0;
  if (rawCouponCode) {
    const coupon = await validateCoupon(rawCouponCode, subtotal);
    if (!coupon.ok) return { ok: false, error: coupon.error };

    // Kupon üye başına kullanım limiti: kuponun per_user_limit değeri kadar
    // (iptal edilmemiş) siparişte kullanılabilir. 0 = üye başına sınırsız
    // (yalnız genel max_uses geçerli). per_user_limit = 1 klasik "hesap başına
    // 1 kez" davranışıdır ("ilk siparişe özel" kuponlar bununla çalışır).
    const { data: limitRow } = await admin
      .from("coupons")
      .select("per_user_limit")
      .eq("code", coupon.code)
      .maybeSingle();
    const perUserLimit = Number(
      (limitRow as { per_user_limit: number } | null)?.per_user_limit ?? 1,
    );
    if (perUserLimit > 0) {
      const { count: priorUse } = await admin
        .from("orders")
        .select("id", { count: "exact", head: true })
        .eq("user_id", userId)
        .eq("coupon_code", coupon.code)
        .neq("status", "cancelled");
      if ((priorUse ?? 0) >= perUserLimit) {
        return {
          ok: false,
          error: "Bu kuponu kullanım limitinize ulaştınız.",
        };
      }
    }

    couponCode = coupon.code;
    discountTotal = coupon.discount;
  }

  const deliveryFee = calcDeliveryFee(settings, subtotal);
  const total = Math.max(0, round2(subtotal + deliveryFee - discountTotal));

  // --- 3.5) Kupon kullanımını atomik rezerve et: eşzamanlı siparişler
  // limitin üzerine çıkamaz. Aşağıdaki başarısızlık yollarında geri bırakılır.
  if (couponCode) {
    const reserved = await reserveCouponUsage(admin, couponCode);
    if (!reserved) {
      return { ok: false, error: "Bu kuponun kullanım limiti doldu." };
    }
  }

  // --- 4) Sipariş yaz — user_id her siparişte set (adım 0'da doğrulandı).
  // order_no çakışırsa yeniden dene ---
  let order: Order | null = null;
  for (let attempt = 0; attempt < 5 && !order; attempt++) {
    const orderNo = randomOrderNo();
    const { data, error } = await admin
      .from("orders")
      .insert({
        order_no: orderNo,
        user_id: userId,
        customer_name: customerName,
        phone,
        address_line: addressLine,
        address_note: addressNote,
        items_subtotal: subtotal,
        delivery_fee: deliveryFee,
        coupon_code: couponCode,
        discount_total: discountTotal,
        total,
        payment_method: method,
        payment_status: "pending",
        status: "new",
        note,
      })
      .select("*")
      .single();

    if (!error && data) {
      order = data as Order;
      break;
    }
    // 23505 = unique violation (order_no çakıştı) → yeni numarayla dene
    if (error && error.code !== "23505") {
      await releaseCouponUsage(admin, couponCode);
      return { ok: false, error: "Sipariş kaydedilemedi. Lütfen tekrar deneyin." };
    }
  }

  if (!order) {
    await releaseCouponUsage(admin, couponCode);
    return { ok: false, error: "Sipariş numarası üretilemedi. Lütfen tekrar deneyin." };
  }

  const { error: itemsError } = await admin
    .from("order_items")
    .insert(orderItems.map((item) => ({ ...item, order_id: order!.id })));

  if (itemsError) {
    // Yarım sipariş bırakma — kalemler yazılamadıysa siparişi geri al.
    await admin.from("orders").delete().eq("id", order.id);
    await releaseCouponUsage(admin, couponCode);
    return { ok: false, error: "Sipariş kaydedilemedi. Lütfen tekrar deneyin." };
  }

  // --- 5) Online ödeme ise iyzico Checkout Form başlat ---
  if (method === "iyzico") {
    try {
      const origin = await getRequestOrigin();
      const h = await headers();
      const buyerIp =
        h.get("x-forwarded-for")?.split(",")[0]?.trim() || "127.0.0.1";

      const init = await initializeCheckoutForm(
        {
          orderNo: order.order_no,
          customerName,
          phone,
          addressLine,
          email: userEmail || "siparis@sapancayenimahallemarket.com",
          subtotal,
          total,
          buyerIp,
        },
        basketItems,
        `${origin}/api/iyzico/callback`,
      );

      await admin
        .from("orders")
        .update({ iyzico_token: init.token })
        .eq("id", order.id);

      return { ok: true, orderNo: order.order_no, paymentPageUrl: init.paymentPageUrl };
    } catch {
      // Ödeme sayfası açılamadıysa yarım sipariş bırakma (cascade: items + events silinir).
      await admin.from("orders").delete().eq("id", order.id);
      await releaseCouponUsage(admin, couponCode);
      return {
        ok: false,
        error:
          "Online ödeme şu an başlatılamıyor. Kapıda ödeme seçeneğiyle deneyebilirsiniz.",
      };
    }
  }

  return { ok: true, orderNo: order.order_no, paymentPageUrl: null };
}

// Misafir sipariş takibi lib/shop/tracking-actions.ts'te (rate limit'li).
