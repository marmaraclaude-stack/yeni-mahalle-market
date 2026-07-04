"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { RealtimeChannel } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import { deleteChatSession } from "@/lib/shop/admin-actions";
import type { ChatSession } from "@/lib/supabase/types";
import styles from "../admin.module.css";

type Filter = "all" | "unread" | "read";

function timeAgo(iso: string) {
  const t = new Date(iso).getTime();
  const diff = Math.max(0, Date.now() - t);
  const m = Math.floor(diff / 60000);
  if (m < 1) return "az önce";
  if (m < 60) return `${m} dk önce`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} sa önce`;
  const d = Math.floor(h / 24);
  return `${d} gün önce`;
}

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleString("tr-TR", {
      day: "2-digit",
      month: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

export default function SessionList({ initial }: { initial: ChatSession[] }) {
  const router = useRouter();
  const [sessions, setSessions] = useState<ChatSession[]>(initial);
  const [filter, setFilter] = useState<Filter>("all");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  useEffect(() => {
    const supabase = createClient();
    let channel: RealtimeChannel | null = null;

    channel = supabase
      .channel("admin:sessions")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "chat_sessions" },
        (payload) => {
          setSessions((prev) => {
            if (payload.eventType === "DELETE") {
              const oldId = (payload.old as ChatSession | null)?.id;
              return prev.filter((s) => s.id !== oldId);
            }
            const next = payload.new as ChatSession;
            const idx = prev.findIndex((s) => s.id === next.id);
            const merged = idx === -1 ? [next, ...prev] : prev.map((s) => (s.id === next.id ? next : s));
            return [...merged].sort(
              (a, b) =>
                new Date(b.last_message_at).getTime() -
                new Date(a.last_message_at).getTime(),
            );
          });
        },
      )
      .subscribe();

    return () => {
      if (channel) supabase.removeChannel(channel);
    };
  }, []);

  const unreadCount = useMemo(
    () => sessions.filter((s) => s.unread_admin).length,
    [sessions],
  );
  const readCount = sessions.length - unreadCount;

  const visible = useMemo(() => {
    if (filter === "unread") return sessions.filter((s) => s.unread_admin);
    if (filter === "read") return sessions.filter((s) => !s.unread_admin);
    return sessions;
  }, [sessions, filter]);

  function handleDelete(session: ChatSession, e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    const who = session.visitor_name ?? "İsimsiz";
    const onay = window.confirm(
      `"${who}" ile olan sohbet ve tüm mesajları kalıcı olarak silinecek. Emin misiniz?`,
    );
    if (!onay) return;
    setDeletingId(session.id);
    startTransition(async () => {
      try {
        const result = await deleteChatSession(session.id);
        if (!result.ok) {
          window.alert(result.error ?? "Sohbet silinemedi.");
          return;
        }
        setSessions((prev) => prev.filter((s) => s.id !== session.id));
        router.refresh();
      } finally {
        setDeletingId(null);
      }
    });
  }

  if (sessions.length === 0) {
    return (
      <>
        <h1 className={styles.title}>Sohbetler</h1>
        <p className={styles.subtitle}>Henüz hiç sohbet açılmamış.</p>
        <div className={styles.empty}>
          Site üzerinden ilk mesaj geldiğinde burada görünecek.
        </div>
      </>
    );
  }

  const chips: { key: Filter; label: string; count: number }[] = [
    { key: "all", label: "Tümü", count: sessions.length },
    { key: "unread", label: "Okunmamış", count: unreadCount },
    { key: "read", label: "Okunmuş", count: readCount },
  ];

  return (
    <>
      <h1 className={styles.title}>Sohbetler</h1>
      <p className={styles.subtitle}>
        {sessions.length} sohbet · {unreadCount} okunmamış
      </p>

      <div className={styles.chips}>
        {chips.map((c) => (
          <button
            key={c.key}
            type="button"
            onClick={() => setFilter(c.key)}
            className={`${styles.chip} ${filter === c.key ? styles["chip--active"] : ""}`}
            aria-pressed={filter === c.key}
          >
            {c.key === "unread" && (
              <span className={styles.rowDot} aria-hidden />
            )}
            {c.label}
            <span className={styles.chipCount}>{c.count}</span>
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <div className={styles.empty}>
          {filter === "unread"
            ? "Okunmamış sohbet yok."
            : "Okunmuş sohbet yok."}
        </div>
      ) : (
        <div className={styles.list}>
          {visible.map((s) => (
            <div
              key={s.id}
              className={`${styles.row} ${s.unread_admin ? styles["row--unread"] : ""}`}
            >
              <Link href={`/admin/${s.id}`} className={styles.rowMain}>
                <div className={styles.rowName}>
                  {s.unread_admin && (
                    <span className={styles.rowDot} aria-hidden />
                  )}
                  {s.visitor_name ?? "İsimsiz"}
                </div>
                <div className={styles.rowMeta}>
                  {s.visitor_phone ?? "·"} · {timeAgo(s.last_message_at)}
                </div>
              </Link>
              <div className={styles.rowSide}>
                <div className={styles.rowRight}>
                  <div>{formatDate(s.last_message_at)}</div>
                  {s.unread_admin && <span className={styles.rowBadge}>YENİ</span>}
                </div>
                <button
                  type="button"
                  onClick={(e) => handleDelete(s, e)}
                  disabled={deletingId === s.id}
                  className={styles.rowDelete}
                  aria-label={`${s.visitor_name ?? "İsimsiz"} sohbetini sil`}
                >
                  {deletingId === s.id ? "Siliniyor…" : "Sil"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
