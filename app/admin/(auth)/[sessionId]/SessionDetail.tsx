"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  fetchSessionMessages,
  markSessionRead,
  sendAdminMessage,
} from "@/lib/shop/admin-actions";
import type { ChatMessage, ChatSession } from "@/lib/supabase/types";
import AdminBack from "../AdminBack";
import styles from "../../admin.module.css";

// Detay polling aralığı — realtime yerine periyodik server action çağrısı.
const POLL_MS = 3500;

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

  // Interval callback'leri güncel mesaj listesine ref üzerinden erişir.
  const messagesRef = useRef<ChatMessage[]>(messages);
  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  /** Gelen mesajları id'ye göre tekilleştirip sona ekle. */
  const appendMessages = useCallback((incoming: ChatMessage[]) => {
    if (incoming.length === 0) return;
    setMessages((prev) => {
      const ids = new Set(prev.map((m) => m.id));
      const fresh = incoming.filter((m) => !ids.has(m.id));
      return fresh.length > 0 ? [...prev, ...fresh] : prev;
    });
  }, []);

  // Mark session as read on mount (server action, service-role)
  useEffect(() => {
    if (!session.unread_admin) return;
    void markSessionRead(session.id);
  }, [session.id, session.unread_admin]);

  // Yeni mesajları polling ile çek: yalnız sekme görünürken,
  // afterIso = eldeki son mesajın created_at'i.
  useEffect(() => {
    let active = true;

    const id = setInterval(async () => {
      if (document.visibilityState !== "visible") return;
      const last = messagesRef.current;
      const afterIso = last.length > 0 ? last[last.length - 1].created_at : null;
      const result = await fetchSessionMessages(session.id, afterIso);
      if (!active || !result.ok) return;
      appendMessages(result.messages);
    }, POLL_MS);

    return () => {
      active = false;
      clearInterval(id);
    };
  }, [session.id, appendMessages]);

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
      try {
        const result = await sendAdminMessage(session.id, content);
        if (result.ok && result.message) {
          appendMessages([result.message]);
          setDraft("");
        } else {
          console.error("[admin] send failed", result.error);
        }
      } catch (err) {
        console.error("[admin] send failed", err);
      } finally {
        setSending(false);
      }
    },
    [draft, session.id, appendMessages],
  );

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void send();
    }
  };

  return (
    <>
      <AdminBack href="/admin/sohbetler" label="Sohbetler" />

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
