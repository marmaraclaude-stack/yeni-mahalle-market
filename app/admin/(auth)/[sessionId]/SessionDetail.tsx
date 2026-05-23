"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { RealtimeChannel } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import type { ChatMessage, ChatSession } from "@/lib/supabase/types";
import styles from "../../admin.module.css";

function formatTime(iso: string) {
  try {
    return new Date(iso).toLocaleString("tr-TR", {
      day: "2-digit",
      month: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "";
  }
}

interface Props {
  session: ChatSession;
  initialMessages: ChatMessage[];
}

export default function SessionDetail({ session, initialMessages }: Props) {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const bodyRef = useRef<HTMLDivElement | null>(null);
  const supabaseRef = useRef<ReturnType<typeof createClient> | null>(null);

  const getSupabase = useCallback(() => {
    if (!supabaseRef.current) supabaseRef.current = createClient();
    return supabaseRef.current;
  }, []);

  // Mark session as read on mount
  useEffect(() => {
    if (!session.unread_admin) return;
    void getSupabase()
      .from("chat_sessions")
      .update({ unread_admin: false })
      .eq("id", session.id);
  }, [session.id, session.unread_admin, getSupabase]);

  // Subscribe to new messages
  useEffect(() => {
    const supabase = getSupabase();
    let channel: RealtimeChannel | null = null;

    channel = supabase
      .channel(`admin-thread:${session.id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "chat_messages",
          filter: `session_id=eq.${session.id}`,
        },
        (payload) => {
          const m = payload.new as ChatMessage;
          setMessages((prev) => (prev.some((x) => x.id === m.id) ? prev : [...prev, m]));
        },
      )
      .subscribe();

    return () => {
      if (channel) supabase.removeChannel(channel);
    };
  }, [session.id, getSupabase]);

  // Auto-scroll to bottom
  useEffect(() => {
    const el = bodyRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages]);

  const send = useCallback(
    async (e?: React.FormEvent) => {
      if (e) e.preventDefault();
      const content = draft.trim();
      if (!content) return;
      setSending(true);
      const supabase = getSupabase();
      const { error } = await supabase.from("chat_messages").insert({
        session_id: session.id,
        sender: "admin",
        content,
      });
      if (!error) setDraft("");
      else console.error("[admin] send failed", error);
      setSending(false);
    },
    [draft, session.id, getSupabase],
  );

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void send();
    }
  };

  return (
    <>
      <div style={{ marginBottom: 14 }}>
        <Link
          href="/admin"
          style={{ fontSize: 13, color: "var(--muted)", letterSpacing: "0.04em" }}
        >
          ← Tüm sohbetler
        </Link>
      </div>

      <div className={styles.thread}>
        <div className={styles.threadHead}>
          <div>
            <div className={styles.threadHeadName}>
              {session.visitor_name ?? "İsimsiz"}
            </div>
            <div className={styles.threadHeadMeta}>
              {session.visitor_phone ?? "telefon yok"} · başlangıç{" "}
              {formatTime(session.created_at)}
            </div>
          </div>
          <div className={styles.threadHeadMeta}>
            #{session.id.slice(0, 8)} · {session.status}
          </div>
        </div>

        <div className={styles.threadBody} ref={bodyRef}>
          {messages.length === 0 && (
            <div style={{ textAlign: "center", color: "var(--muted)", fontSize: 13 }}>
              Bu sohbette henüz mesaj yok.
            </div>
          )}
          {messages.map((m) => (
            <div
              key={m.id}
              className={`${styles.bubble} ${
                m.sender === "visitor" ? styles["bubble--visitor"] : styles["bubble--admin"]
              }`}
            >
              <div className={styles.bubble__body}>{m.content}</div>
              <span className={styles.bubble__time}>{formatTime(m.created_at)}</span>
            </div>
          ))}
        </div>

        <form className={styles.threadComposer} onSubmit={send}>
          <textarea
            rows={1}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Yanıtınızı yazın... (Enter = gönder, Shift+Enter = yeni satır)"
            aria-label="Mesaj"
          />
          <button type="submit" className={styles.threadSend} disabled={sending || !draft.trim()}>
            {sending ? "..." : "Gönder"}
          </button>
        </form>
      </div>
    </>
  );
}
