// Kurye konum paylaşım linki için yetki token'ı.
// order.id'den deterministik HMAC türetilir; token'ı bilen kurye
// /kurye/[orderNo]?t=<token> sayfasından GPS paylaşabilir.
// Sabit zamanlı doğrulama ile brute-force sızıntısı engellenir.
import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";

/** Sipariş id'sinden deterministik kurye paylaşım token'ı üret (hex). */
export function courierShareToken(orderId: string): string {
  return createHmac("sha256", process.env.SUPABASE_SERVICE_ROLE_KEY!)
    .update(`courier:${orderId}`)
    .digest("hex");
}

/** Token'ı sabit zamanlı karşılaştırmayla doğrula. */
export function verifyCourierToken(orderId: string, token: string): boolean {
  if (typeof orderId !== "string" || typeof token !== "string") return false;
  if (!orderId.trim() || !token.trim()) return false;
  const expected = Buffer.from(courierShareToken(orderId), "utf8");
  const provided = Buffer.from(token, "utf8");
  if (expected.length !== provided.length) return false;
  return timingSafeEqual(expected, provided);
}
