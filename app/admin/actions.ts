"use server";

import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const COOKIE_NAME = "admin_auth";
const MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // 7 gün

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

  if (password !== expected) {
    return { error: "Parola hatalı." };
  }

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
