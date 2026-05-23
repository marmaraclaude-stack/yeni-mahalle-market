"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { RealtimeChannel } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import type { ChatMessage } from "@/lib/supabase/types";
import styles from "./chat-widget.module.css";

const STORAGE_KEY = "ymm-chat-session";

interface StoredSession {
  id: string;
  name: string;
}

function readStoredSession(): StoredSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed.id === "string" && typeof parsed.name === "string") {
      return parsed;
    }
  } catch {
    /* ignore */
  }
  return null;
}

function storeSession(session: StoredSession) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  } catch {
    /* ignore */
  }
}

function formatTime(iso: string) {
  try {
    return new Date(iso).toLocaleTimeString("tr-TR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "";
  }
}

const WELCOME_MESSAGE: ChatMessage = {
  id: "__welcome__",
  session_id: "",
  sender: "admin",
  content:
    "Merhaba 👋 Yeni Mahalle Market'e hoş geldiniz. Size nasıl yardımcı olabiliriz?",
  created_at: new Date().toISOString(),
  read_by_recipient: true,
};

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [session, setSession] = useState<StoredSession | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME_MESSAGE]);
  const [draft, setDraft] = useState("");
  const [introName, setIntroName] = useState("");
  const [introPhone, setIntroPhone] = useState("");
  const [creating, setCreating] = useState(false);
  const [sending, setSending] = useState(false);
  const [unread, setUnread] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const supabaseRef = useRef<ReturnType<typeof createClient> | null>(null);
  const channelRef = useRef<RealtimeChannel | null>(null);
  const bodyRef = useRef<HTMLDivElement | null>(null);

  // Hydrate stored session
  useEffect(() => {
    const stored = readStoredSession();
    if (stored) setSession(stored);
  }, []);

  // Init supabase client lazily
  const getSupabase = useCallback(() => {
    if (!supabaseRef.current) {
      supabaseRef.current = createClient();
    }
    return supabaseRef.current;
  }, []);

  // Load history + subscribe when session is ready
  useEffect(() => {
    if (!session) return;

    let cancelled = false;
    const supabase = getSupabase();

    (async () => {
      const { data, error: dbError } = await supabase
        .from("chat_messages")
        .select("*")
        .eq("session_id", session.id)
        .order("created_at", { ascending: true });

      if (cancelled) return;

      if (dbError) {
        console.error("[chat] load history failed", dbError);
        setError("Geçmiş yüklenemedi.");
        return;
      }
      setMessages([WELCOME_MESSAGE, ...((data ?? []) as ChatMessage[])]);
    })();

    const channel = supabase
      .channel(`chat:${session.id}`)
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
          setMessages((prev) => {
            if (prev.some((x) => x.id === m.id)) return prev;
            return [...prev, m];
          });
          if (m.sender === "admin" && !open) {
            setUnread((u) => u + 1);
          }
        },
      )
      .subscribe();

    channelRef.current = channel;

    return () => {
      cancelled = true;
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [session, open, getSupabase]);

  // Auto-scroll to bottom when messages change or panel opens
  useEffect(() => {
    if (!open) return;
    const el = bodyRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [messages, open]);

  // Clear unread badge on open
  useEffect(() => {
    if (open) setUnread(0);
  }, [open]);

  const startSession = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      const name = introName.trim();
      if (!name) return;
      setCreating(true);
      setError(null);
      try {
        const supabase = getSupabase();
        const { data, error: insertError } = await supabase
          .from("chat_sessions")
          .insert({
            visitor_name: name,
            visitor_phone: introPhone.trim() || null,
          })
          .select("id")
          .single();

        if (insertError || !data) {
          throw insertError ?? new Error("session yaratılamadı");
        }
        const stored: StoredSession = { id: data.id as string, name };
        storeSession(stored);
        setSession(stored);
        setIntroName("");
        setIntroPhone("");
      } catch (err) {
        console.error("[chat] start session failed", err);
        setError("Sohbet başlatılamadı. Lütfen tekrar deneyin.");
      } finally {
        setCreating(false);
      }
    },
    [introName, introPhone, getSupabase],
  );

  const sendMessage = useCallback(
    async (e?: React.FormEvent) => {
      if (e) e.preventDefault();
      const content = draft.trim();
      if (!content || !session) return;
      setSending(true);
      setError(null);
      const supabase = getSupabase();
      const { error: insertError } = await supabase.from("chat_messages").insert({
        session_id: session.id,
        sender: "visitor",
        content,
      });
      if (insertError) {
        console.error("[chat] send failed", insertError);
        setError("Mesaj gönderilemedi.");
      } else {
        setDraft("");
      }
      setSending(false);
    },
    [draft, session, getSupabase],
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void sendMessage();
    }
  };

  return (
    <>
      <button
        type="button"
        className={styles.fab}
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Sohbeti kapat" : "Sohbeti aç"}
        aria-expanded={open}
      >
        <svg
          className={styles.fabIcon}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          {open ? (
            <>
              <path d="M6 6l12 12" />
              <path d="M18 6L6 18" />
            </>
          ) : (
            <>
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              <path d="M8 10h8M8 14h5" />
            </>
          )}
        </svg>
        {!open && unread > 0 && (
          <span className={styles.fabBadge} aria-label={`${unread} okunmamış mesaj`}>
            {unread}
          </span>
        )}
      </button>

      {open && (
        <section
          className={styles.panel}
          role="dialog"
          aria-modal="false"
          aria-label="Yeni Mahalle Market sohbet"
        >
          <header className={styles.header}>
            <div className={styles.headerLeft}>
              <span className={styles.avatar} aria-hidden>
                Y
              </span>
              <div>
                <p className={styles.headerTitle}>Yeni Mahalle Market</p>
                <span className={styles.headerSub}>
                  <span className={styles.headerDot} aria-hidden />
                  Çevrimiçi · genelde 5 dk içinde
                </span>
              </div>
            </div>
            <button
              type="button"
              className={styles.closeBtn}
              onClick={() => setOpen(false)}
              aria-label="Sohbeti kapat"
            >
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" aria-hidden>
                <path d="M6 6l12 12" />
                <path d="M18 6L6 18" />
              </svg>
            </button>
          </header>

          {!session ? (
            <div className={styles.body}>
              <div className={styles.intro}>
                <div>
                  <h3 className={styles.introTitle}>Merhaba 👋</h3>
                  <p className={styles.introLede}>
                    Sorularınızı, siparişinizi ya da fiyat sormak istediğiniz ürünü
                    yazın, en kısa sürede dönüyoruz.
                  </p>
                </div>
                <form className={styles.introForm} onSubmit={startSession}>
                  <label className={styles.label}>
                    <span className={styles.labelText}>Adınız</span>
                    <input
                      className={styles.input}
                      type="text"
                      required
                      maxLength={60}
                      value={introName}
                      onChange={(e) => setIntroName(e.target.value)}
                      placeholder="Örn. Ayşe"
                      autoComplete="given-name"
                    />
                  </label>
                  <label className={styles.label}>
                    <span className={styles.labelText}>Telefon (opsiyonel)</span>
                    <input
                      className={styles.input}
                      type="tel"
                      maxLength={30}
                      value={introPhone}
                      onChange={(e) => setIntroPhone(e.target.value)}
                      placeholder="0532 ..."
                      autoComplete="tel"
                      inputMode="tel"
                    />
                  </label>
                  {error && (
                    <p style={{ color: "#a02020", fontSize: 12.5, margin: 0 }}>{error}</p>
                  )}
                  <button
                    type="submit"
                    className={styles.submitBtn}
                    disabled={creating || !introName.trim()}
                  >
                    {creating ? "Bağlanıyor..." : "Sohbete başla"}
                  </button>
                </form>
              </div>
            </div>
          ) : (
            <>
              <div className={styles.body} ref={bodyRef}>
                {messages.map((m) => (
                  <div
                    key={m.id}
                    className={`${styles.msg} ${
                      m.sender === "visitor" ? styles["msg--visitor"] : styles["msg--admin"]
                    }`}
                  >
                    <div className={styles.msg__bubble}>{m.content}</div>
                    {m.id !== "__welcome__" && (
                      <span className={styles.msg__time}>{formatTime(m.created_at)}</span>
                    )}
                  </div>
                ))}
                {error && (
                  <div className={`${styles.msg} ${styles["msg--system"]}`}>
                    <div className={styles.msg__bubble}>{error}</div>
                  </div>
                )}
              </div>
              <form className={styles.composer} onSubmit={sendMessage}>
                <textarea
                  className={styles.composerInput}
                  rows={1}
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Mesajınızı yazın..."
                  aria-label="Mesaj"
                />
                <button
                  type="submit"
                  className={styles.sendBtn}
                  disabled={sending || !draft.trim()}
                  aria-label="Gönder"
                >
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <path d="M4 12l16-8-6 16-2-7-8-1z" />
                  </svg>
                </button>
              </form>
              <div className={styles.footer}>
                {session.name} olarak yazıyorsunuz
              </div>
            </>
          )}
        </section>
      )}
    </>
  );
}
