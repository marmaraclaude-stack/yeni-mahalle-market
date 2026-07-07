"use server";

import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";

const COOKIE_NAME = "admin_auth";
const MAX_AGE_SECONDS = 60 * 60 * 12; // 12 saat — oturum kısa tutulur (güvenlik)

// Basit brute-force koruması: IP başına ardışık başarısız deneme sayılır,
// belirli eşikten sonra artan bekleme uygulanır. Bellek içi (instance başına);
// asıl koruma güçlü paylaşımlı parola + kısa oturumdur, bu ek katman otomatik
// deneme hızını düşürür. Serverless çok-instance'ta yaklaşık koruma sağlar.
const attempts = new Map<string, { count: number; blockedUntil: number }>();
const MAX_FREE_ATTEMPTS = 5;
const BASE_LOCK_MS = 30_000; // 6. denemeden sonra 30 sn, sonra üstel

async function clientIp(): Promise<string> {
  const h = await headers();
  const fwd = h.get("x-forwarded-for");
  return fwd?.split(",")[0]?.trim() || h.get("x-real-ip") || "unknown";
}

// Cookie değeri sabit "1" DEĞİL — ADMIN_PASSWORD'dan türetilmiş HMAC token.
// Parolayı bilmeyen biri geçerli cookie üretemez; parola değişince tüm
// oturumlar otomatik düşer.
function sessionToken(): string | null {
  const secret = process.env.ADMIN_PASSWORD;
  if (!secret) return null;
  return createHmac("sha256", secret).update("ym-admin-session-v1").digest("hex");
}

export interface LoginState {
  error?: string;
}

export async function loginAction(
  _prev: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const password = String(formData.get("password") ?? "");
  const expected = process.env.ADMIN_PASSWORD;

  if (!expected) {
    return { error: "Sunucu yapılandırılmamış (ADMIN_PASSWORD eksik)." };
  }

  // Rate limit: kilitli IP ise denemeyi hemen reddet.
  const ip = await clientIp();
  const now = Date.now();
  const rec = attempts.get(ip);
  if (rec && rec.blockedUntil > now) {
    const secs = Math.ceil((rec.blockedUntil - now) / 1000);
    return { error: `Çok fazla deneme. ${secs} saniye sonra tekrar deneyin.` };
  }

  // Parola karşılaştırması timing-safe: iki tarafı da HMAC'leyip (sabit uzunluk)
  // timingSafeEqual ile karşılaştır — uzunluk ve karakter zamanlaması sızmaz.
  const mac = (v: string) =>
    createHmac("sha256", "ym-admin-pw-cmp").update(v).digest();
  const ok = timingSafeEqual(mac(password), mac(expected));

  if (!ok) {
    const next = { count: (rec?.count ?? 0) + 1, blockedUntil: 0 };
    if (next.count > MAX_FREE_ATTEMPTS) {
      // Üstel bekleme: 6. hata 30sn, 7. 60sn, 8. 120sn ... (üst sınır 15dk)
      const factor = 2 ** (next.count - MAX_FREE_ATTEMPTS - 1);
      next.blockedUntil = now + Math.min(BASE_LOCK_MS * factor, 900_000);
    }
    attempts.set(ip, next);
    return { error: "Parola hatalı." };
  }

  // Başarılı giriş: sayacı temizle.
  attempts.delete(ip);

  const token = sessionToken();
  if (!token) {
    return { error: "Sunucu yapılandırılmamış (ADMIN_PASSWORD eksik)." };
  }

  const store = await cookies();
  store.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE_SECONDS,
  });

  redirect("/admin");
}

export async function logoutAction() {
  const store = await cookies();
  store.delete(COOKIE_NAME);
  redirect("/admin/login");
}

export async function isAuthenticated() {
  const expected = sessionToken();
  if (!expected) return false;

  const store = await cookies();
  const got = store.get(COOKIE_NAME)?.value ?? "";
  if (got.length !== expected.length) return false;

  // Zamanlama saldırısına dayanıklı karşılaştırma.
  return timingSafeEqual(Buffer.from(got), Buffer.from(expected));
}
