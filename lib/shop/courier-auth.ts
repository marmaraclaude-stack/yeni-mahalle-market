"use server";

// Kurye giriş paneli kimlik doğrulaması — hafif, müşteri auth'undan bağımsız.
// Kurye telefon + kod ile giriş yapar (kodu admin belirler). Oturum, imzalı
// (HMAC) httpOnly çerezde tutulur: "<courierId>.<hmac>". Böylece her sipariş
// için ayrı link göndermeye gerek kalmaz.

import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Courier } from "@/lib/shop/types";

const COOKIE = "ym_courier";
const MAX_AGE = 60 * 60 * 24 * 30; // 30 gün

export interface CourierSession {
  id: string;
  name: string;
  phone: string;
}

/** Telefonun son 10 hanesi (5XXXXXXXXX). */
function last10(value: string): string {
  return String(value ?? "").replace(/\D/g, "").slice(-10);
}

/** courierId'den imza üret (hex). */
function sign(courierId: string): string {
  return createHmac("sha256", process.env.SUPABASE_SERVICE_ROLE_KEY!)
    .update(`courier-session:${courierId}`)
    .digest("hex");
}

/** Sabit zamanlı string karşılaştırması. */
function safeEqual(a: string, b: string): boolean {
  const ba = Buffer.from(a, "utf8");
  const bb = Buffer.from(b, "utf8");
  if (ba.length !== bb.length) return false;
  return timingSafeEqual(ba, bb);
}

export interface CourierLoginResult {
  ok: boolean;
  error?: string;
}

/** Telefon + kod ile giriş; başarılıysa oturum çerezi kurar. */
export async function loginCourier(
  phone: string,
  code: string,
): Promise<CourierLoginResult> {
  const digits = last10(phone);
  const cleanCode = String(code ?? "").trim();
  if (digits.length < 10 || !cleanCode) {
    return { ok: false, error: "Telefon ve kodu girin." };
  }

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("couriers")
    .select("id, name, phone, login_code, is_active")
    .eq("is_active", true);
  if (error) return { ok: false, error: "Giriş yapılamadı, tekrar deneyin." };

  const rows = (data ?? []) as Pick<
    Courier,
    "id" | "name" | "phone" | "login_code" | "is_active"
  >[];
  const courier = rows.find(
    (c) =>
      last10(c.phone) === digits &&
      typeof c.login_code === "string" &&
      c.login_code.trim() !== "" &&
      safeEqual(c.login_code.trim(), cleanCode),
  );
  if (!courier) {
    return { ok: false, error: "Telefon veya kod hatalı." };
  }

  const store = await cookies();
  store.set(COOKIE, `${courier.id}.${sign(courier.id)}`, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE,
  });
  return { ok: true };
}

/** Oturumu kapat. */
export async function logoutCourier(): Promise<void> {
  const store = await cookies();
  store.delete(COOKIE);
}

/** Geçerli oturumdaki kuryeyi döndür (imza + DB doğrulamalı) ya da null. */
export async function getSessionCourier(): Promise<CourierSession | null> {
  const store = await cookies();
  const raw = store.get(COOKIE)?.value;
  if (!raw) return null;
  const dot = raw.lastIndexOf(".");
  if (dot <= 0) return null;
  const id = raw.slice(0, dot);
  const sig = raw.slice(dot + 1);
  if (!safeEqual(sign(id), sig)) return null;

  const supabase = createAdminClient();
  const { data } = await supabase
    .from("couriers")
    .select("id, name, phone, is_active, login_code")
    .eq("id", id)
    .maybeSingle();
  const c = data as Pick<
    Courier,
    "id" | "name" | "phone" | "is_active" | "login_code"
  > | null;
  if (!c || !c.is_active || !c.login_code?.trim()) return null;
  return { id: c.id, name: c.name, phone: c.phone };
}
