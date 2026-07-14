"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  fetchChatUpdates,
  sendVisitorMessage,
  startChatSession,
} from "@/lib/shop/chat-actions";
import type { ChatMessage } from "@/lib/supabase/types";
import { BUSINESS } from "@/lib/business";
import styles from "./chat-widget.module.css";

// Hızlı başlangıç soruları — sohbette henüz gerçek mesaj yokken gösterilir;
// dokununca mesaj olarak gönderilir (mobilde yazmadan tek dokunuş).
const QUICK_REPLIES = [
  "Sipariş vermek istiyorum",
  "Teslimat ücreti ne kadar?",
  "Siparişim ne durumda?",
  "Bir ürünün fiyatını soracağım",
];

// Polling aralıkları: panel açıkken sık, kapalıyken seyrek (unread rozeti için).
const POLL_OPEN_MS = 4000;
const POLL_CLOSED_MS = 20000;

const STORAGE_KEY = "ymm-chat-session";

// Çalışma saatleri: components/StatusIndicator.tsx ile aynı kural.
const OPEN_MIN = 7 * 60 + 30; // 07:30
const CLOSE_MIN = 2 * 60; // 02:00 (ertesi gün — gece yarısını aşar)

/** Istanbul saatine göre dakika cinsinden şu an. */
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
  // Gece yarısını aşan mesai: 07:30 sonrası ya da 02:00 öncesi açık.
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
    // Eski biçim (token'sız kayıt): server action'lar token istediği için
    // oturum kullanılamaz — sıfırla, ziyaretçi yeni sohbet başlatsın.
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
  "Merhaba 👋 Şu an çevrimdışıyız. Mesajını bırak, market açılınca dönüş yapalım.";

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
  // Widget ssr:false ile yüklendiği için ilk değer client'ta hesaplanabilir.
  const [businessOpen, setBusinessOpen] = useState(isBusinessOpen);

  const bodyRef = useRef<HTMLDivElement | null>(null);
  const panelRef = useRef<HTMLElement | null>(null);

  // Polling yardımcıları state'in güncel kopyasına ref üzerinden erişir;
  // böylece interval callback'leri effect'i yeniden kurmadan çalışır.
  const messagesRef = useRef<ChatMessage[]>(messages);
  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  /** Son GERÇEK mesajın created_at'i (karşılama balonu hariç); yoksa null. */
  const lastMessageIso = useCallback((): string | null => {
    const real = messagesRef.current.filter((m) => m.id !== "__welcome__");
    return real.length > 0 ? real[real.length - 1].created_at : null;
  }, []);

  /**
   * Gelen mesajları id'ye göre tekilleştirip state'e ekle;
   * gerçekten YENİ eklenen admin mesajı sayısını döndür (unread rozeti için).
   */
  const applyIncoming = useCallback((incoming: ChatMessage[]): number => {
    if (incoming.length === 0) return 0;
    const known = new Set(messagesRef.current.map((m) => m.id));
    const fresh = incoming.filter((m) => !known.has(m.id));
    if (fresh.length === 0) return 0;
    setMessages((prev) => {
      const ids = new Set(prev.map((m) => m.id));
      const additions = incoming.filter((m) => !ids.has(m.id));
      return additions.length > 0 ? [...prev, ...additions] : prev;
    });
    return fresh.filter((m) => m.sender === "admin").length;
  }, []);

  // Hydrate stored session
  useEffect(() => {
    const stored = readStoredSession();
    if (stored) setSession(stored);
  }, []);

  // Çalışma saatine göre durumu güncel tut
  useEffect(() => {
    const id = setInterval(() => setBusinessOpen(isBusinessOpen()), 30_000);
    return () => clearInterval(id);
  }, []);

  // Ana sayfadaki "Canlı Destek Başlat" butonu bu event'i tetikler.
  useEffect(() => {
    const openChat = () => setOpen(true);
    window.addEventListener("ym:open-chat", openChat);
    return () => window.removeEventListener("ym:open-chat", openChat);
  }, []);

  // Mobil bottom sheet açıkken arkadaki sayfa kaymasın
  // (sheet altına scroll kaçması sohbeti kullanılmaz yapıyordu).
  useEffect(() => {
    if (!open) return;
    if (!window.matchMedia("(max-width: 560px)").matches) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  // Mobil KLAVYE düzeltmesi (bottom sheet): sheet fixed + bottom:0 durur,
  // yüksekliği CSS'te min(78dvh, 640px). Klavye açılınca iki farklı davranış
  // olabilir ve ikisinde de taşma olmamalı:
  //
  // 1) Android/çoğu tarayıcı: layout viewport klavyeyle KÜÇÜLÜR. bottom:0
  //    zaten klavyenin üstüne oturur; sadece yüksekliği visualViewport'a
  //    sığacak şekilde kısmak yeterli (min(..., vv.height - 12)).
  // 2) iOS Safari: layout viewport küçülMEZ, klavye üstüne biner ve sayfa
  //    görsel olarak kayar. bottom:0 layout viewport'un dibinde (klavyenin
  //    ARKASINDA) kalabilir. Görsel viewport'un alt kenarı layout
  //    koordinatında (vv.offsetTop + vv.height); fixed elemanın dibi ise
  //    window.innerHeight. Aradaki fark kadar yukarı translateY ile
  //    taşırız. Android'de bu fark ~0 çıktığı için transform etkisizdir;
  //    yani formül iki durumda da güvenli, tek koda iner.
  useEffect(() => {
    if (!open) return;
    const vv = window.visualViewport;
    if (!vv || !window.matchMedia("(max-width: 560px)").matches) return;
    const el = panelRef.current;
    if (!el) return;
    const apply = () => {
      // Yüksekliği görünür alana kıs; klavye kapanınca vv.height büyür ve
      // CSS'teki taban değer (tam ekran 100dvh) yine kazanır.
      const maxH = Math.max(160, Math.round(vv.height));
      el.style.height = `min(100dvh, ${maxH}px)`;
      // iOS: fixed dibi ile görsel viewport dibi arasındaki fark kadar kaldır.
      const gap = Math.round(
        window.innerHeight - (vv.offsetTop + vv.height),
      );
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
  }, [open]);

  // Oturum hazır olunca tüm geçmişi server action ile yükle.
  useEffect(() => {
    if (!session) return;
    let cancelled = false;

    (async () => {
      const res = await fetchChatUpdates(session.id, session.token, null);
      if (cancelled) return;
      if (!res.ok || !res.messages) {
        console.error("[chat] load history failed", res.error);
        setError("Geçmiş yüklenemedi.");
        return;
      }
      setMessages([WELCOME_MESSAGE, ...res.messages]);
    })();

    return () => {
      cancelled = true;
    };
  }, [session]);

  // Panel AÇIKKEN: 4 sn'de bir yeni mesajları çek (afterIso = son mesaj).
  useEffect(() => {
    if (!open || !session) return;
    let active = true;

    const id = setInterval(async () => {
      const res = await fetchChatUpdates(session.id, session.token, lastMessageIso());
      if (!active || !res.ok || !res.messages) return;
      applyIncoming(res.messages);
    }, POLL_OPEN_MS);

    return () => {
      active = false;
      clearInterval(id);
    };
  }, [open, session, lastMessageIso, applyIncoming]);

  // Panel KAPALIYKEN (oturum varsa): 20 sn'de bir kontrol et,
  // yeni admin mesajlarını unread rozetine say (mesajlar state'e de eklenir).
  useEffect(() => {
    if (open || !session) return;
    let active = true;

    const id = setInterval(async () => {
      const res = await fetchChatUpdates(session.id, session.token, lastMessageIso());
      if (!active || !res.ok || !res.messages) return;
      const newAdmin = applyIncoming(res.messages);
      if (newAdmin > 0) setUnread((u) => u + newAdmin);
    }, POLL_CLOSED_MS);

    return () => {
      active = false;
      clearInterval(id);
    };
  }, [open, session, lastMessageIso, applyIncoming]);

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
      } catch (err) {
        console.error("[chat] start session failed", err);
        setError("Sohbet başlatılamadı. Lütfen tekrar deneyin.");
      } finally {
        setCreating(false);
      }
    },
    [introName, introPhone],
  );

  /** Gönderim yardımcısı: başarıda true döner
      (composer draft'ı yalnız o zaman temizler). */
  const doSend = useCallback(
    async (content: string): Promise<boolean> => {
      if (!content || !session) return false;
      setSending(true);
      setError(null);
      try {
        const res = await sendVisitorMessage(session.id, session.token, content);
        if (!res.ok || !res.message) {
          console.error("[chat] send failed", res.error);
          setError(res.error ?? "Mesaj gönderilemedi.");
          return false;
        }
        // Optimistic ekleme yok: sunucunun döndürdüğü satır eklenir.
        applyIncoming([res.message]);
        return true;
      } catch (err) {
        console.error("[chat] send failed", err);
        setError("Mesaj gönderilemedi.");
        return false;
      } finally {
        setSending(false);
      }
    },
    [session, applyIncoming],
  );

  const sendMessage = useCallback(
    async (e?: React.FormEvent) => {
      if (e) e.preventDefault();
      const content = draft.trim();
      if (!content) return;
      const ok = await doSend(content);
      if (ok) setDraft("");
    },
    [draft, doSend],
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
          ref={panelRef}
          className={styles.panel}
          role="dialog"
          aria-modal="false"
          aria-label="Yeni Mahalle Market sohbet"
        >
          <header className={styles.header}>
            <div className={styles.headerLeft}>
              <span className={styles.avatar} aria-hidden>
                <img src="/logo.png" alt="" className={styles.avatarImg} />
              </span>
              <div>
                <p className={styles.headerTitle}>Yeni Mahalle Market</p>
                <span className={styles.headerSub}>
                  <span
                    className={`${styles.headerDot} ${
                      businessOpen ? "" : styles["headerDot--off"]
                    }`}
                    aria-hidden
                  />
                  {businessOpen ? "Çevrimiçi" : "Çevrimdışı"}
                </span>
              </div>
            </div>
            <div className={styles.headerBtns}>
              <a
                href={BUSINESS.phone.href}
                className={styles.closeBtn}
                aria-label={`Telefonla ara: ${BUSINESS.phone.display}`}
              >
                <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.13 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.37 1.9.72 2.8a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.35 1.84.59 2.8.72A2 2 0 0 1 22 16.92Z" />
                </svg>
              </a>
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
            </div>
          </header>

          {!session ? (
            <div className={styles.body}>
              <div className={styles.intro}>
                <div>
                  <h3 className={styles.introTitle}>Merhaba 👋</h3>
                  <p className={styles.introLede}>
                    {businessOpen
                      ? "Sorularınızı, siparişinizi ya da fiyat sormak istediğiniz ürünü yazın, en kısa sürede dönüyoruz."
                      : "Şu an çevrimdışıyız. Mesajını bırak, market açılınca dönüş yapalım."}
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
                      maxLength={20}
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
              {/* Hızlı sorular: henüz gerçek mesaj yazılmadıysa tek dokunuşla gönder */}
              {messages.every((m) => m.id === "__welcome__") && (
                <div className={styles.quickRow} aria-label="Hızlı sorular">
                  {QUICK_REPLIES.map((q) => (
                    <button
                      key={q}
                      type="button"
                      className={styles.quickChip}
                      disabled={sending}
                      onClick={() => void doSend(q)}
                    >
                      {q}
                    </button>
                  ))}
                </div>
              )}
              <form className={styles.composer} onSubmit={sendMessage}>
                <textarea
                  className={styles.composerInput}
                  rows={1}
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={handleKeyDown}
                  onFocus={() => {
                    // Klavye açılırken son mesajlar görünür kalsın
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
                  className={`${styles.sendBtn}${
                    draft.trim() ? ` ${styles.sendBtnReady}` : ""
                  }`}
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
