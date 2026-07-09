"use server";

// Canlı kurye takibi — GPS konumu yaz/oku.
// Yazma: kurye tokenli /kurye/[orderNo] sayfasından çağırır; order.id'ye
//   bağlı HMAC token doğrulanır (service-role ile RLS aşılır).
// Okuma: müşteri takip sayfası order_no ile son konumu yoklar. order_no
//   entropisi (30^6) asıl koruma; konum düşük hassasiyetli veridir.

import { createAdminClient } from "@/lib/supabase/admin";
import { verifyCourierToken } from "@/lib/shop/courier-token";
import { getSessionCourier } from "@/lib/shop/courier-auth";
import type { Order } from "@/lib/shop/types";

/** Telefonun son 10 hanesi. */
function last10(v: string): string {
  return String(v ?? "").replace(/\D/g, "").slice(-10);
}

export interface CourierLocation {
  lat: number;
  lng: number;
  at: string;
}

export interface CourierLocationState {
  /** Kurye hâlâ yolda mı — takip sayfası buna göre polling'i durdurur. */
  active: boolean;
  location?: CourierLocation;
}

/** Koordinat geçerli aralıkta bir sayı mı? */
function isValidCoord(lat: unknown, lng: unknown): lat is number {
  return (
    typeof lat === "number" &&
    typeof lng === "number" &&
    Number.isFinite(lat) &&
    Number.isFinite(lng) &&
    lat >= -90 &&
    lat <= 90 &&
    lng >= -180 &&
    lng <= 180
  );
}

export interface UpdateLocationResult {
  ok: boolean;
  error?: string;
}

/** Kurye GPS konumunu kaydet (token doğrulamalı). */
export async function updateCourierLocation(
  orderNo: string,
  token: string,
  lat: number,
  lng: number,
): Promise<UpdateLocationResult> {
  const no = String(orderNo ?? "").trim().toUpperCase();
  if (!no) return { ok: false, error: "Sipariş numarası eksik." };
  if (!isValidCoord(lat, lng)) return { ok: false, error: "Konum geçersiz." };

  const supabase = createAdminClient();
  const { data: orderRow, error: orderErr } = await supabase
    .from("orders")
    .select("id, status")
    .eq("order_no", no)
    .maybeSingle();

  if (orderErr || !orderRow) return { ok: false, error: "Sipariş bulunamadı." };
  const order = orderRow as Pick<Order, "id" | "status">;

  if (!verifyCourierToken(order.id, token)) {
    return { ok: false, error: "Yetkisiz erişim." };
  }

  const { error: updateErr } = await supabase
    .from("orders")
    .update({
      courier_lat: lat,
      courier_lng: lng,
      courier_location_at: new Date().toISOString(),
    })
    .eq("id", order.id);

  if (updateErr) return { ok: false, error: "Konum kaydedilemedi." };
  return { ok: true };
}

/** Müşteri takip sayfası: kuryenin son konumunu order_no ile oku. */
export async function getCourierLocation(
  orderNo: string,
): Promise<CourierLocationState> {
  const no = String(orderNo ?? "").trim().toUpperCase();
  if (!no) return { active: false };

  const supabase = createAdminClient();
  const { data: orderRow, error } = await supabase
    .from("orders")
    .select("status, courier_lat, courier_lng, courier_location_at")
    .eq("order_no", no)
    .maybeSingle();

  if (error || !orderRow) return { active: false };
  const row = orderRow as Pick<
    Order,
    "status" | "courier_lat" | "courier_lng" | "courier_location_at"
  >;

  // Teslim/iptal ise takip biter.
  const active = row.status !== "delivered" && row.status !== "cancelled";
  if (!active) return { active: false };

  if (
    row.courier_lat == null ||
    row.courier_lng == null ||
    !row.courier_location_at
  ) {
    return { active: true };
  }

  return {
    active: true,
    location: {
      lat: row.courier_lat,
      lng: row.courier_lng,
      at: row.courier_location_at,
    },
  };
}

// ------------------------------------------------------------
// Kurye giriş paneli — oturumdaki kurye kendi siparişlerini görür ve
// konumunu paylaşır (her sipariş için ayrı link gerekmez).
// ------------------------------------------------------------

export interface CourierPanelOrder {
  orderNo: string;
  customerName: string;
  addressLine: string;
  addressNote: string;
  status: string;
}

/** Oturumdaki kuryenin aktif (teslim/iptal olmayan) siparişleri. */
export async function getCourierActiveOrders(): Promise<CourierPanelOrder[]> {
  const courier = await getSessionCourier();
  if (!courier) return [];
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("orders")
    .select(
      "order_no, customer_name, address_line, address_note, status, courier_phone",
    )
    .not("status", "in", "(delivered,cancelled)")
    .order("created_at", { ascending: true });
  if (error || !data) return [];

  type Row = {
    order_no: string;
    customer_name: string;
    address_line: string;
    address_note: string;
    status: string;
    courier_phone: string;
  };
  const mine = last10(courier.phone);
  return (data as Row[])
    .filter((o) => last10(o.courier_phone) === mine && mine.length === 10)
    .map((o) => ({
      orderNo: o.order_no,
      customerName: o.customer_name,
      addressLine: o.address_line,
      addressNote: o.address_note,
      status: o.status,
    }));
}

/** Oturumdaki kuryenin GPS konumunu TÜM aktif siparişlerine yazar. */
export async function shareCourierLocation(
  lat: number,
  lng: number,
): Promise<UpdateLocationResult & { count?: number }> {
  const courier = await getSessionCourier();
  if (!courier) return { ok: false, error: "Oturum bulunamadı." };
  if (!isValidCoord(lat, lng)) return { ok: false, error: "Konum geçersiz." };

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("orders")
    .select("id, courier_phone, status")
    .not("status", "in", "(delivered,cancelled)");
  if (error || !data) return { ok: false, error: "Siparişler okunamadı." };

  const mine = last10(courier.phone);
  const ids = (data as { id: string; courier_phone: string }[])
    .filter((o) => last10(o.courier_phone) === mine && mine.length === 10)
    .map((o) => o.id);
  if (ids.length === 0) return { ok: true, count: 0 };

  const { error: updErr } = await supabase
    .from("orders")
    .update({
      courier_lat: lat,
      courier_lng: lng,
      courier_location_at: new Date().toISOString(),
    })
    .in("id", ids);
  if (updErr) return { ok: false, error: "Konum kaydedilemedi." };
  return { ok: true, count: ids.length };
}
