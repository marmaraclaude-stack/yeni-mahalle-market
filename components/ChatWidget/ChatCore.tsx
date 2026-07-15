"use client";

// Sohbet çekirdeği — hem masaüstü yüzen widget'ta hem mobil/tablet /destek
// sayfasında kullanılan ortak UI + mantık (oturum, mesaj, polling).
// variant="widget": yüzen panel; variant="page": tam sayfa kart.
// Hazır soru çipleri KALDIRILDI (kullanıcı isteği).

import { useCallback, useEffect, useRef, useState } from "react";
import {
  fetchChatUpdates,
  sendVisitorMessage,
  startChatSession,
} from "@/lib/shop/chat-actions";
import type { ChatMessage } from "@/lib/supabase/types";
import { BUSINESS } from "@/lib/business";
import styles from "./chat-widget.module.css";

const POLL_MS = 4000;
const STORAGE_KEY = "ymm-chat-session";
const OPEN_MIN = 7 * 60 + 30; // 07:30
const CLOSE_MIN = 2 * 60; // 02:00 (ertesi gün)

function istanbulMinutes(): number {
  const parts = new Intl.DateTimeFormat("tr-TR", {
    timeZone: "Europe/Istanbul",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(new Date());
  const h = Number(parts.find((p) => p.type === "hour")?.value ?? "0");
  const m = Number(parts.find((p) => p.type === "minute")?.value ?? "0");
  return h * 60 + m;
}
function isBusinessOpen(): boolean {
  const now = istanbulMinutes();
  return now >= OPEN_MIN || now < CLOSE_MIN;
}

interface StoredSession {
  id: string;
  name: string;
  token: string;
}
function readStoredSession(): StoredSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (
      parsed &&
      typeof parsed.id === "string" &&
      typeof parsed.name === "string" &&
      typeof parsed.token === "string"
    ) {
      return parsed;
    }
    window.localStorage.removeItem(STORAGE_KEY);
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
const WELCOME_OFFLINE =
  "Merhaba 👋 Şu an çevrim dışıyız. Mesajınızı bırakın, market açılınca dönüş yapalım.";

export default function ChatCore({
  variant = "widget",
  onClose,
}: {
  variant?: "widget" | "page";
  /** Widget'ta kapatma butonu; sayfada verilmez (X gösterilmez). */
  onClose?: () => void;
}) {
  const isPage = variant === "page";
  const [session, setSession] = useState<StoredSession | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME_MESSAGE]);
  const [draft, setDraft] = useState("");
  const [introName, setIntroName] = useState("");
  const [introPhone, setIntroPhone] = useState("");
  const [introMessage, setIntroMessage] = useState("");
  const [creating, setCreating] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [businessOpen, setBusinessOpen] = useState(isBusinessOpen);

  const bodyRef = useRef<HTMLDivElement | null>(null);
  const cardRef = useRef<HTMLElement | null>(null);
  const messagesRef = useRef<ChatMessage[]>(messages);
  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  const lastMessageIso = useCallback((): string | null => {
    const real = messagesRef.current.filter((m) => m.id !== "__welcome__");
    return real.length > 0 ? real[real.length - 1].created_at : null;
  }, []);

  const applyIncoming = useCallback((incoming: ChatMessage[]): void => {
    if (incoming.length === 0) return;
    setMessages((prev) => {
      const ids = new Set(prev.map((m) => m.id));
      const additions = incoming.filter((m) => !ids.has(m.id));
      return additions.length > 0 ? [...prev, ...additions] : prev;
    });
  }, []);

  useEffect(() => {
    const stored = readStoredSession();
    if (stored) setSession(stored);
  }, []);

  useEffect(() => {
    const id = setInterval(() => setBusinessOpen(isBusinessOpen()), 30_000);
    return () => clearInterval(id);
  }, []);

  // Mobil yüzen widget: klavye açılınca kartı görünür alana sığdır + yukarı taşı.
  // Sayfa modunda gerek yok (normal sayfa; tarayıcı klavyeyi kendisi yönetir).
  useEffect(() => {
    if (isPage) return;
    const vv = window.visualViewport;
    if (!vv || !window.matchMedia("(max-width: 560px)").matches) return;
    const el = cardRef.current;
    if (!el) return;
    const apply = () => {
      const cap = Math.max(220, Math.round(vv.height - 96));
      el.style.height = `min(72dvh, 600px, ${cap}px)`;
      const gap = Math.round(window.innerHeight - (vv.offsetTop + vv.height));
      el.style.transform = gap > 0 ? `translateY(${-gap}px)` : "";
      const b = bodyRef.current;
      if (b) b.scrollTop = b.scrollHeight;
    };
    apply();
    vv.addEventListener("resize", apply);
    vv.addEventListener("scroll", apply);
    return () => {
      vv.removeEventListener("resize", apply);
      vv.removeEventListener("scroll", apply);
      el.style.height = "";
      el.style.transform = "";
    };
  }, [isPage]);

  // Oturum hazır olunca geçmişi yükle.
  useEffect(() => {
    if (!session) return;
    let cancelled = false;
    (async () => {
      const res = await fetchChatUpdates(session.id, session.token, null);
      if (cancelled) return;
      if (!res.ok || !res.messages) {
        setError("Geçmiş yüklenemedi.");
        return;
      }
      setMessages([WELCOME_MESSAGE, ...res.messages]);
    })();
    return () => {
      cancelled = true;
    };
  }, [session]);

  // Mount olduğu sürece 4 sn'de bir yeni mesajları çek.
  useEffect(() => {
    if (!session) return;
    let active = true;
    const id = setInterval(async () => {
      const res = await fetchChatUpdates(
        session.id,
        session.token,
        lastMessageIso(),
      );
      if (!active || !res.ok || !res.messages) return;
      applyIncoming(res.messages);
    }, POLL_MS);
    return () => {
      active = false;
      clearInterval(id);
    };
  }, [session, lastMessageIso, applyIncoming]);

  useEffect(() => {
    const el = bodyRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages]);

  const startSession = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      const name = introName.trim();
      if (!name) return;
      setCreating(true);
      setError(null);
      try {
        const res = await startChatSession(name, introPhone.trim());
        if (!res.ok || !res.sessionId || !res.token) {
          setError(res.error ?? "Sohbet başlatılamadı. Lütfen tekrar deneyin.");
          return;
        }
        const stored: StoredSession = {
          id: res.sessionId,
          name,
          token: res.token,
        };
        storeSession(stored);
        setSession(stored);
        setIntroName("");
        setIntroPhone("");
        const firstMsg = introMessage.trim();
        if (firstMsg) {
          setIntroMessage("");
          try {
            const sent = await sendVisitorMessage(
              res.sessionId,
              res.token,
              firstMsg,
            );
            if (sent.ok && sent.message) applyIncoming([sent.message]);
          } catch {
            /* mesaj gönderilemese de oturum açık kalır */
          }
        }
      } catch {
        setError("Sohbet başlatılamadı. Lütfen tekrar deneyin.");
      } finally {
        setCreating(false);
      }
    },
    [introName, introPhone, introMessage, applyIncoming],
  );

  const sendMessage = useCallback(
    async (e?: React.FormEvent) => {
      if (e) e.preventDefault();
      const content = draft.trim();
      if (!content || !session) return;
      setSending(true);
      setError(null);
      try {
        let res = await sendVisitorMessage(session.id, session.token, content);
        // Oturum DB'de yoksa (eski/silinmiş localStorage oturumu → gönderim
        // başarısız) sessizce yeni oturum aç ve bir kez daha dene. Böylece
        // "Mesaj gönderilemedi" hatası kullanıcıyı takılı bırakmaz.
        if (!res.ok) {
          const fresh = await startChatSession(session.name, "");
          if (fresh.ok && fresh.sessionId && fresh.token) {
            const renewed: StoredSession = {
              id: fresh.sessionId,
              name: session.name,
              token: fresh.token,
            };
            storeSession(renewed);
            setSession(renewed);
            res = await sendVisitorMessage(renewed.id, renewed.token, content);
          }
        }
        if (!res.ok || !res.message) {
          setError(res.error ?? "Mesaj gönderilemedi.");
          return;
        }
        applyIncoming([res.message]);
        setDraft("");
      } catch {
        setError("Mesaj gönderilemedi.");
      } finally {
        setSending(false);
      }
    },
    [draft, session, applyIncoming],
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void sendMessage();
    }
  };

  return (
    <section
      ref={cardRef}
      className={isPage ? styles.pageCard : styles.panel}
      data-intro={!session ? "true" : undefined}
      role={isPage ? undefined : "dialog"}
      aria-modal={isPage ? undefined : "false"}
      aria-label="Yeni Mahalle Market sohbet"
    >
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <span className={styles.avatar} aria-hidden>
            <img src="/logo.png" alt="" className={styles.avatarImg} />
          </span>
          <div>
            <p className={styles.headerTitle}>Canlı Destek</p>
            <span className={styles.headerSub}>
              <span
                className={`${styles.headerDot} ${
                  businessOpen ? "" : styles["headerDot--off"]
                }`}
                aria-hidden
              />
              {businessOpen ? "Çevrim içi" : "Çevrim dışı"}
            </span>
          </div>
        </div>
        <div className={styles.headerBtns}>
          <a
            href={BUSINESS.phone.href}
            className={styles.headerIconBtn}
            aria-label={`Telefonla ara: ${BUSINESS.phone.display}`}
          >
            <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.13 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.37 1.9.72 2.8a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.35 1.84.59 2.8.72A2 2 0 0 1 22 16.92Z" />
            </svg>
          </a>
          {onClose && (
            <button
              type="button"
              className={styles.headerClose}
              onClick={onClose}
              aria-label="Sohbeti kapat"
            >
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
                <path d="M6 6l12 12" />
                <path d="M18 6L6 18" />
              </svg>
            </button>
          )}
        </div>
      </header>

      {!session ? (
        <div className={styles.introBody}>
          <p className={styles.introPrompt}>
            {businessOpen
              ? "Merhaba! Size nasıl yardımcı olabiliriz?"
              : "Şu an çevrim dışıyız. Mesajınızı bırakın, market açılınca dönelim."}
          </p>
          <form className={styles.introForm} onSubmit={startSession}>
            <div className={styles.introRow}>
              <label className={styles.label}>
                <span className={styles.labelText}>Ad</span>
                <input
                  className={styles.input}
                  type="text"
                  required
                  maxLength={60}
                  value={introName}
                  onChange={(e) => setIntroName(e.target.value)}
                  placeholder="Adınız"
                  autoComplete="given-name"
                />
              </label>
              <label className={styles.label}>
                <span className={styles.labelText}>Telefon</span>
                <input
                  className={styles.input}
                  type="tel"
                  maxLength={20}
                  value={introPhone}
                  onChange={(e) => setIntroPhone(e.target.value)}
                  placeholder="05XX ..."
                  autoComplete="tel"
                  inputMode="tel"
                />
              </label>
            </div>
            <label className={styles.label}>
              <span className={styles.labelText}>Mesajınız</span>
              <textarea
                className={styles.introTextarea}
                rows={3}
                maxLength={1000}
                value={introMessage}
                onChange={(e) => setIntroMessage(e.target.value)}
                placeholder="Sipariş, fiyat ya da sorunuzu yazın (isteğe bağlı)"
              />
            </label>
            {error && <p className={styles.introError}>{error}</p>}
            <button
              type="submit"
              className={styles.submitBtn}
              disabled={creating || !introName.trim()}
            >
              {creating ? "Bağlanıyor..." : "Görüşmeyi başlat"}
            </button>
          </form>
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
                <div className={styles.msg__bubble}>
                  {m.id === "__welcome__" && !businessOpen
                    ? WELCOME_OFFLINE
                    : m.content}
                </div>
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
              onFocus={() => {
                setTimeout(() => {
                  const b = bodyRef.current;
                  if (b) b.scrollTop = b.scrollHeight;
                }, 60);
              }}
              enterKeyHint="send"
              placeholder="Mesajınızı yazın..."
              aria-label="Mesaj"
            />
            <button
              type="submit"
              className={`${styles.sendBtn}${draft.trim() ? ` ${styles.sendBtnReady}` : ""}`}
              disabled={sending || !draft.trim()}
              aria-label="Gönder"
            >
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M4 12l16-8-6 16-2-7-8-1z" />
              </svg>
            </button>
          </form>
          <div className={styles.footer}>{session.name} olarak yazıyorsunuz</div>
        </>
      )}
    </section>
  );
}
