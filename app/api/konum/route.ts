// Konum alım ucu — /api/konum
// GPS takip cihazı (SIM'li) veya telefon uygulaması (GPSLogger, Owntracks vb.)
// bu adrese konum gönderir. GET ve POST desteklenir; token zorunlu.
//   GET:  /api/konum?key=<token>&lat=40.69&lng=30.26
//   POST: JSON {key,lat,lng} veya form-encoded
// Konum "Kurye Yolda" siparişlere yazılır; müşteri canlı takip eder.

import { NextResponse } from "next/server";
import {
  verifyIngestToken,
  verifyCourierIngestToken,
  writeActiveLocation,
  writeCourierLocation,
} from "@/lib/shop/location-ingest";

export const dynamic = "force-dynamic";

function num(v: unknown): number {
  return typeof v === "string" ? Number(v.replace(",", ".")) : Number(v);
}

async function handle(
  courierId: string | null,
  key: string | null,
  lat: number,
  lng: number,
): Promise<NextResponse> {
  // Kuryeye özel mod: c + key. Yoksa genel mod (tüm on_the_way).
  if (courierId) {
    if (!verifyCourierIngestToken(courierId, key)) {
      return NextResponse.json(
        { ok: false, error: "unauthorized" },
        { status: 401 },
      );
    }
    const res = await writeCourierLocation(courierId, lat, lng);
    return NextResponse.json(res, { status: res.ok ? 200 : 400 });
  }
  if (!verifyIngestToken(key)) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }
  const res = await writeActiveLocation(lat, lng);
  return NextResponse.json(res, { status: res.ok ? 200 : 400 });
}

export async function GET(req: Request) {
  const q = new URL(req.url).searchParams;
  return handle(
    q.get("c") ?? q.get("courier"),
    q.get("key") ?? q.get("token"),
    num(q.get("lat") ?? q.get("latitude")),
    num(q.get("lng") ?? q.get("lon") ?? q.get("longitude")),
  );
}

export async function POST(req: Request) {
  const q = new URL(req.url).searchParams;
  let courierId = q.get("c") ?? q.get("courier");
  let key = q.get("key") ?? q.get("token");
  let lat = num(q.get("lat") ?? q.get("latitude"));
  let lng = num(q.get("lng") ?? q.get("lon") ?? q.get("longitude"));

  const ct = req.headers.get("content-type") ?? "";
  try {
    if (ct.includes("application/json")) {
      const body = (await req.json()) as Record<string, unknown>;
      courierId = courierId ?? (body.c as string) ?? (body.courier as string) ?? null;
      key = key ?? (body.key as string) ?? (body.token as string) ?? null;
      if (!Number.isFinite(lat)) lat = num(body.lat ?? body.latitude);
      if (!Number.isFinite(lng)) lng = num(body.lng ?? body.lon ?? body.longitude);
    } else if (
      ct.includes("application/x-www-form-urlencoded") ||
      ct.includes("multipart/form-data")
    ) {
      const form = await req.formData();
      courierId =
        courierId ?? (form.get("c") as string) ?? (form.get("courier") as string) ?? null;
      key = key ?? (form.get("key") as string) ?? (form.get("token") as string) ?? null;
      if (!Number.isFinite(lat)) lat = num(form.get("lat") ?? form.get("latitude"));
      if (!Number.isFinite(lng))
        lng = num(form.get("lng") ?? form.get("lon") ?? form.get("longitude"));
    }
  } catch {
    // gövde okunamadı — query değerleriyle devam
  }

  return handle(courierId, key, lat, lng);
}
