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

/** Konumu "Kurye Yolda" tüm siparişlere yaz. */
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
