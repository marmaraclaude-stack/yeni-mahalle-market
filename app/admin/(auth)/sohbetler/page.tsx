// Admin — sohbetler sayfası: chat oturum listesi (SessionList, realtime).
// Eskiden panel ana sayfasındaydı; v3 ile ayrı sayfaya taşındı.

import { createAdminClient } from "@/lib/supabase/admin";
import type { ChatSession } from "@/lib/supabase/types";
import SessionList from "../SessionList";
import styles from "../../admin.module.css";

export const dynamic = "force-dynamic";
export const metadata = { title: "Sohbetler" };

export default async function AdminChatsPage() {
  let sessions: ChatSession[] = [];
  let loadError: string | null = null;

  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("chat_sessions")
      .select("*")
      .order("last_message_at", { ascending: false })
      .limit(200);
    if (error) {
      loadError = error.message;
    } else {
      sessions = (data ?? []) as ChatSession[];
    }
  } catch (e) {
    loadError = e instanceof Error ? e.message : "Bilinmeyen hata";
  }

  if (loadError) {
    return (
      <>
        <h1 className={styles.title}>Sohbetler</h1>
        <div className={styles.empty}>Sohbetler yüklenemedi: {loadError}</div>
      </>
    );
  }

  return <SessionList initial={sessions} />;
}
