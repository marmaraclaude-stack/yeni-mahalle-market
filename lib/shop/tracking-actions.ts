"use server";

// Misafir sipariş takibi — service-role client ile order_no + telefon
// eşleşmesi (son 10 hane). RLS'i aşan tek yer burası; telefon doğrulaması
// zorunlu olduğu için sipariş bilgisi yalnızca sahibine gösterilir.
// NOT: Ajan C'nin lib/shop/order-actions.ts dosyasından bağımsızdır.

import { createAdminClient } from "@/lib/supabase/admin";
import type { Order, OrderEvent, OrderItem } from "@/lib/shop/types";

export interface TrackedOrder {
  order: Order;
  items: OrderItem[];
  events: OrderEvent[];
}

export interface TrackingState {
  error?: string;
  data?: TrackedOrder;
  /** Doğrulanan telefonun son 10 hanesi — client polling'de yeniden kullanılır. */
  phone?: string;
}

/** Telefonun yalnız rakamlarını al, son 10 haneyi döndür (5XXXXXXXXX). */
function lastTenDigits(value: string): string {
  return value.replace(/\D/g, "").slice(-10);
}

// ------------------------------------------------------------
// Basit bellek-içi rate limit — brute-force yavaşlatma.
// Serverless'ta instance başınadır (mükemmel değil, savunma katmanı);
// order_no entropisi (30^6) asıl koruma. Pencere: 10 dk / 10 deneme.
// ------------------------------------------------------------
// Yalnızca BAŞARISIZ denemeler sayılır — doğrulanmış müşterinin 20 sn'lik
// takip polling'i engellenmez (başarıda anahtar temizlenir).
const RATE_WINDOW_MS = 10 * 60 * 1000;
const RATE_MAX_FAILURES = 10;
const failures = new Map<string, number[]>();

function isBlocked(key: string): boolean {
  const now = Date.now();
  const list = (failures.get(key) ?? []).filter((t) => now - t < RATE_WINDOW_MS);
  failures.set(key, list);
  return list.length >= RATE_MAX_FAILURES;
}

function recordFailure(key: string): void {
  const now = Date.now();
  const list = (failures.get(key) ?? []).filter((t) => now - t < RATE_WINDOW_MS);
  list.push(now);
  failures.set(key, list);
  // Map büyümesin — eski anahtarları ara sıra temizle
  if (failures.size > 500) {
    for (const [k, v] of failures) {
      if (v.every((t) => now - t >= RATE_WINDOW_MS)) failures.delete(k);
    }
  }
}

/** order_no + telefon eşleşirse sipariş + kalemler + olayları döndürür. */
export async function trackOrder(
  orderNo: string,
  phone: string,
): Promise<TrackingState> {
  const no = orderNo.trim().toUpperCase();
  const digits = lastTenDigits(phone);

  if (!no) {
    return { error: "Sipariş numarası eksik." };
  }
  if (digits.length < 10) {
    return { error: "Geçerli bir telefon numarası girin (örn. 05XX XXX XX XX)." };
  }

  // Deneme sınırı: aynı sipariş no'suna art arda BAŞARISIZ telefon denemesini kes.
  if (isBlocked(no)) {
    return {
      error: "Çok fazla deneme yapıldı. Lütfen 10 dakika sonra tekrar deneyin.",
    };
  }

  const supabase = createAdminClient();

  const { data: orderRow, error: orderErr } = await supabase
    .from("orders")
    .select("*")
    .eq("order_no", no)
    .maybeSingle();

  if (orderErr) {
    return { error: "Sipariş sorgulanamadı. Lütfen biraz sonra tekrar deneyin." };
  }

  const order = orderRow as Order | null;
  if (!order || lastTenDigits(order.phone) !== digits) {
    recordFailure(no);
    // Sipariş var/yok bilgisini sızdırmamak için tek tip mesaj.
    return {
      error:
        "Bu sipariş numarası ile telefon eşleşmedi. Bilgileri kontrol edip tekrar deneyin.",
    };
  }

  // Doğrulama başarılı — meşru polling engellenmesin diye sayaç sıfırlanır.
  failures.delete(no);

  const [itemsRes, eventsRes] = await Promise.all([
    supabase.from("order_items").select("*").eq("order_id", order.id),
    supabase
      .from("order_events")
      .select("*")
      .eq("order_id", order.id)
      .order("created_at", { ascending: true }),
  ]);

  if (itemsRes.error || eventsRes.error) {
    return { error: "Sipariş detayları alınamadı. Lütfen tekrar deneyin." };
  }

  return {
    data: {
      order,
      items: (itemsRes.data ?? []) as OrderItem[],
      events: (eventsRes.data ?? []) as OrderEvent[],
    },
    phone: digits,
  };
}

/** useActionState uyumlu form action'ı — misafir takip formu kullanır. */
export async function trackOrderAction(
  _prev: TrackingState,
  formData: FormData,
): Promise<TrackingState> {
  return trackOrder(
    String(formData.get("orderNo") ?? ""),
    String(formData.get("phone") ?? ""),
  );
}
