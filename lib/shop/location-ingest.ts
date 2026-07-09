// Harici konum alımı — SIM'li GPS takip cihazı veya telefon uygulaması
// (GPSLogger/Owntracks) /api/konum adresine konum gönderir; token doğrulanıp
// "Kurye Yolda" siparişlere yazılır. Böylece tarayıcı konum izni / link derdi
// olmadan motora takılı cihaz sürekli konum bildirir. Teslim edilen siparişler
// on_the_way olmadığından otomatik güncellenmez (konum paylaşımı kapanır).

import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";
import { createAdminClient } from "@/lib/supabase/admin";

/** Konum alım ucu için sabit gizli token (service key'den türetilir). */
export function ingestToken(): string {
  return createHmac("sha256", process.env.SUPABASE_SERVICE_ROLE_KEY!)
    .update("location-ingest-v1")
    .digest("hex")
    .slice(0, 32);
}

/** Token'ı sabit zamanlı doğrula. */
export function verifyIngestToken(token: string | null | undefined): boolean {
  if (typeof token !== "string" || token.trim() === "") return false;
  const expected = Buffer.from(ingestToken(), "utf8");
  const provided = Buffer.from(token.trim(), "utf8");
  if (expected.length !== provided.length) return false;
  return timingSafeEqual(expected, provided);
}

/** Kuryeye özel konum alım token'ı (motora takılı cihaz bu linke gönderir). */
export function courierIngestToken(courierId: string): string {
  return createHmac("sha256", process.env.SUPABASE_SERVICE_ROLE_KEY!)
    .update(`courier-ingest:${courierId}`)
    .digest("hex")
    .slice(0, 32);
}

export function verifyCourierIngestToken(
  courierId: string,
  token: string | null | undefined,
): boolean {
  if (!courierId || typeof token !== "string" || token.trim() === "") return false;
  const expected = Buffer.from(courierIngestToken(courierId), "utf8");
  const provided = Buffer.from(token.trim(), "utf8");
  if (expected.length !== provided.length) return false;
  return timingSafeEqual(expected, provided);
}

/** Telefonun son 10 hanesi. */
function last10(v: string): string {
  return String(v ?? "").replace(/\D/g, "").slice(-10);
}

function validCoord(lat: number, lng: number): boolean {
  return (
    Number.isFinite(lat) &&
    Number.isFinite(lng) &&
    lat >= -90 &&
    lat <= 90 &&
    lng >= -180 &&
    lng <= 180
  );
}

export interface IngestResult {
  ok: boolean;
  count?: number;
  error?: string;
}

/** Konumu "Kurye Yolda" TÜM siparişlere yaz (kurye seçilmediyse / owner). */
export async function writeActiveLocation(
  lat: number,
  lng: number,
): Promise<IngestResult> {
  if (!validCoord(lat, lng)) return { ok: false, error: "invalid coords" };
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("orders")
    .update({
      courier_lat: lat,
      courier_lng: lng,
      courier_location_at: new Date().toISOString(),
    })
    .eq("status", "on_the_way")
    .select("id");
  if (error) return { ok: false, error: "db error" };
  return { ok: true, count: (data ?? []).length };
}

/** Konumu YALNIZ bu kuryenin "Kurye Yolda" siparişlerine yaz (telefon eşleşmesi). */
export async function writeCourierLocation(
  courierId: string,
  lat: number,
  lng: number,
): Promise<IngestResult> {
  if (!validCoord(lat, lng)) return { ok: false, error: "invalid coords" };
  const supabase = createAdminClient();

  const { data: cRow } = await supabase
    .from("couriers")
    .select("phone")
    .eq("id", courierId)
    .maybeSingle();
  const phone = (cRow as { phone: string } | null)?.phone ?? "";
  const mine = last10(phone);
  if (mine.length < 10) return { ok: false, error: "courier phone missing" };

  const { data: orders, error: readErr } = await supabase
    .from("orders")
    .select("id, courier_phone")
    .eq("status", "on_the_way");
  if (readErr) return { ok: false, error: "db error" };

  const ids = ((orders ?? []) as { id: string; courier_phone: string }[])
    .filter((o) => last10(o.courier_phone) === mine)
    .map((o) => o.id);
  if (ids.length === 0) return { ok: true, count: 0 };

  const { error } = await supabase
    .from("orders")
    .update({
      courier_lat: lat,
      courier_lng: lng,
      courier_location_at: new Date().toISOString(),
    })
    .in("id", ids);
  if (error) return { ok: false, error: "db error" };
  return { ok: true, count: ids.length };
}
