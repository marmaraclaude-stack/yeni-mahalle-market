"use server";

// Hesabım adres yönetimi — kullanıcının kendi adresleri.
// Server client (createClient) oturum çerezleriyle çalışır; yazma yetkisini
// customer_addresses RLS'i verir (auth.uid() = user_id). Service-role YOK:
// kullanıcı yalnızca kendi adreslerini ekler/günceller/siler.

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export interface AddressResult {
  error?: string;
  ok?: boolean;
}

/** Yeni adres alanları — client formundan gelir. */
export interface AddressInput {
  title: string;
  line: string;
  district: string;
  note: string;
}

/** Metni kırp, boşsa yedek değere düş. */
function clean(value: unknown, fallback = ""): string {
  const text = typeof value === "string" ? value.trim() : "";
  return text || fallback;
}

/**
 * Profil bilgilerini güncelle (ad soyad + telefon).
 * E-posta değişimi client tarafında auth.updateUser ile yapılır (onay maili).
 * Server client RLS: kullanıcı yalnız kendi profilini günceller.
 */
export async function updateProfile(
  name: string,
  phone: string,
): Promise<AddressResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Bu işlem için giriş yapmalısınız." };
  }

  const fullName = clean(name);
  const phoneClean = clean(phone);

  const { error } = await supabase
    .from("customer_profiles")
    .update({ full_name: fullName, phone: phoneClean })
    .eq("id", user.id);

  if (error) {
    return { error: "Profil güncellenemedi. Lütfen tekrar deneyin." };
  }

  revalidatePath("/hesap");
  return { ok: true };
}

/** Yeni adres ekle. Açık adres (line) zorunlu. */
export async function addAddress(input: AddressInput): Promise<AddressResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Bu işlem için giriş yapmalısınız." };
  }

  const line = clean(input.line);
  if (!line) {
    return { error: "Açık adres boş olamaz." };
  }

  const { error } = await supabase.from("customer_addresses").insert({
    user_id: user.id,
    title: clean(input.title, "Ev"),
    line,
    district: clean(input.district, "Sapanca"),
    note: clean(input.note),
  });

  if (error) {
    return { error: "Adres kaydedilemedi. Lütfen tekrar deneyin." };
  }

  revalidatePath("/hesap");
  return { ok: true };
}

/** Var olan adresi güncelle. RLS yabancı satırı reddeder. */
export async function updateAddress(
  id: string,
  patch: Partial<AddressInput>,
): Promise<AddressResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Bu işlem için giriş yapmalısınız." };
  }

  if (!id) {
    return { error: "Adres bulunamadı." };
  }

  // Yalnızca gönderilen alanları güncelle; line varsa boş olamaz.
  const update: Record<string, string> = {};
  if (patch.title !== undefined) update.title = clean(patch.title, "Ev");
  if (patch.district !== undefined)
    update.district = clean(patch.district, "Sapanca");
  if (patch.note !== undefined) update.note = clean(patch.note);
  if (patch.line !== undefined) {
    const line = clean(patch.line);
    if (!line) {
      return { error: "Açık adres boş olamaz." };
    }
    update.line = line;
  }

  if (Object.keys(update).length === 0) {
    return { ok: true };
  }

  const { error } = await supabase
    .from("customer_addresses")
    .update(update)
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    return { error: "Adres güncellenemedi. Lütfen tekrar deneyin." };
  }

  revalidatePath("/hesap");
  return { ok: true };
}

/** Adresi sil. RLS yalnızca kullanıcının kendi satırını siler. */
export async function deleteAddress(id: string): Promise<AddressResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Bu işlem için giriş yapmalısınız." };
  }

  if (!id) {
    return { error: "Adres bulunamadı." };
  }

  const { error } = await supabase
    .from("customer_addresses")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    return { error: "Adres silinemedi. Lütfen tekrar deneyin." };
  }

  revalidatePath("/hesap");
  return { ok: true };
}
