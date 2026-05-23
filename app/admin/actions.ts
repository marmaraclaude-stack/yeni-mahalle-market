"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const COOKIE_NAME = "admin_auth";
const COOKIE_VALUE = "1";
const MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // 7 gün

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

  const store = await cookies();
  store.set(COOKIE_NAME, COOKIE_VALUE, {
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
  const store = await cookies();
  return store.get(COOKIE_NAME)?.value === COOKIE_VALUE;
}
