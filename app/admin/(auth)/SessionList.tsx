"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { RealtimeChannel } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import type { ChatSession } from "@/lib/supabase/types";
import styles from "../admin.module.css";

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
  const [sessions, setSessions] = useState<ChatSession[]>(initial);

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
    () => sessions.filter((s) => s.unread_admin && s.status === "open").length,
    [sessions],
  );

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

  return (
    <>
      <h1 className={styles.title}>Sohbetler</h1>
      <p className={styles.subtitle}>
        {sessions.length} sohbet · {unreadCount} okunmamış
      </p>
      <div className={styles.list}>
        {sessions.map((s) => (
          <Link
            key={s.id}
            href={`/admin/${s.id}`}
            className={`${styles.row} ${s.unread_admin ? styles["row--unread"] : ""}`}
          >
            <div style={{ minWidth: 0 }}>
              <div className={styles.rowName}>
                {s.unread_admin && <span className={styles.rowDot} aria-hidden />}
                {s.visitor_name ?? "İsimsiz"}
              </div>
              <div className={styles.rowMeta}>
                {s.visitor_phone ?? "—"} · {timeAgo(s.last_message_at)}
              </div>
            </div>
            <div className={styles.rowRight}>
              <div>{formatDate(s.last_message_at)}</div>
              {s.unread_admin && <span className={styles.rowBadge}>YENİ</span>}
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
