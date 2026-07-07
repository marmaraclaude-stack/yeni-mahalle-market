"use server";

// Ziyaretçi tarafı canlı destek Server Action'ları.
// RLS kilitli olduğundan (anon policy yok) tüm erişim service-role ile yapılır.
// Yetki: oturum token'ı = HMAC-SHA256(sessionId, SUPABASE_SERVICE_ROLE_KEY).
// Token DB'de tutulmaz; sunucuda türetilir, client'a verilir, her çağrıda
// timingSafeEqual ile doğrulanır. Token'ı bilmeyen kimse oturuma erişemez.

import { createHmac, timingSafeEqual } from "node:crypto";
import { createAdminClient } from "@/lib/supabase/admin";
import type { ChatMessage } from "@/lib/supabase/types";

/** Ziyaretçi chat action'larının ortak dönüş tipleri. */
export interface StartChatResult {
  ok: boolean;
  sessionId?: string;
  token?: string;
  error?: string;
}

export interface ChatUpdatesResult {
  ok: boolean;
  messages?: ChatMessage[];
  error?: string;
}

export interface SendMessageResult {
  ok: boolean;
  message?: ChatMessage;
  error?: string;
}

/** Oturum kimliğinden deterministik yetki token'ı üret (hex). */
function deriveToken(sessionId: string): string {
  return createHmac("sha256", process.env.SUPABASE_SERVICE_ROLE_KEY!)
    .update(sessionId)
    .digest("hex");
}

/** Token'ı sabit zamanlı karşılaştırmayla doğrula. */
function verifyToken(sessionId: string, token: string): boolean {
  if (typeof sessionId !== "string" || typeof token !== "string") return false;
  if (!sessionId.trim() || !token.trim()) return false;
  const expected = Buffer.from(deriveToken(sessionId), "utf8");
  const provided = Buffer.from(token, "utf8");
  if (expected.length !== provided.length) return false;
  return timingSafeEqual(expected, provided);
}

/** Yeni sohbet oturumu aç; sessionId + yetki token'ı döndür. */
export async function startChatSession(
  name: string,
  phone: string,
): Promise<StartChatResult> {
  try {
    const cleanName = typeof name === "string" ? name.trim() : "";
    const cleanPhone = typeof phone === "string" ? phone.trim() : "";
    if (cleanName.length < 1 || cleanName.length > 60) {
      return { ok: false, error: "Adınız 1-60 karakter olmalı." };
    }
    if (cleanPhone.length > 20) {
      return { ok: false, error: "Telefon en fazla 20 karakter olabilir." };
    }

    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("chat_sessions")
      .insert({
        visitor_name: cleanName,
        visitor_phone: cleanPhone || null,
      })
      .select("id")
      .single();
    if (error || !data) {
      return { ok: false, error: "Sohbet başlatılamadı. Lütfen tekrar deneyin." };
    }

    const sessionId = (data as { id: string }).id;
    return { ok: true, sessionId, token: deriveToken(sessionId) };
  } catch {
    return { ok: false, error: "Sohbet başlatılamadı. Lütfen tekrar deneyin." };
  }
}

/**
 * Oturumun mesajlarını getir. afterIso verilirse yalnız created_at > afterIso
 * olan yeni mesajlar döner (polling için); verilmezse tüm geçmiş (artan sırada).
 */
export async function fetchChatUpdates(
  sessionId: string,
  token: string,
  afterIso?: string | null,
): Promise<ChatUpdatesResult> {
  try {
    if (!verifyToken(sessionId, token)) {
      return { ok: false, error: "Yetkisiz erişim." };
    }

    const supabase = createAdminClient();
    let query = supabase
      .from("chat_messages")
      .select("*")
      .eq("session_id", sessionId)
      .order("created_at", { ascending: true });
    if (afterIso) {
      query = query.gt("created_at", afterIso);
    }

    const { data, error } = await query;
    if (error) {
      return { ok: false, error: "Mesajlar yüklenemedi." };
    }
    return { ok: true, messages: (data ?? []) as ChatMessage[] };
  } catch {
    return { ok: false, error: "Mesajlar yüklenemedi." };
  }
}

/** Ziyaretçi mesajı gönder; eklenen satırı döndür. */
export async function sendVisitorMessage(
  sessionId: string,
  token: string,
  text: string,
): Promise<SendMessageResult> {
  try {
    if (!verifyToken(sessionId, token)) {
      return { ok: false, error: "Yetkisiz erişim." };
    }
    const content = typeof text === "string" ? text.trim() : "";
    if (content.length < 1 || content.length > 1000) {
      return { ok: false, error: "Mesaj 1-1000 karakter olmalı." };
    }

    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("chat_messages")
      .insert({
        session_id: sessionId,
        sender: "visitor",
        content,
      })
      .select("*")
      .single();
    if (error || !data) {
      return { ok: false, error: "Mesaj gönderilemedi." };
    }
    return { ok: true, message: data as ChatMessage };
  } catch {
    return { ok: false, error: "Mesaj gönderilemedi." };
  }
}
