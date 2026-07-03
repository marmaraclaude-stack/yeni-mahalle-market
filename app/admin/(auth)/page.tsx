// Admin paneli ana sayfası — üstte e-ticaret özet kartları, altında chat listesi.
// DB kurulumu yapılmamışsa kartlar "—" gösterir; chat işlevi etkilenmez.

import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";
import type { ChatSession } from "@/lib/supabase/types";
import { formatTL } from "@/lib/shop/types";
import SessionList from "./SessionList";
import styles from "../admin.module.css";

export const dynamic = "force-dynamic";
export const metadata = { title: "Admin Paneli" };

interface ShopStats {
  todayOrders: number | null;
  pendingOrders: number | null;
  todayRevenue: number | null;
  activeProducts: number | null;
}

const EMPTY_STATS: ShopStats = {
  todayOrders: null,
  pendingOrders: null,
  todayRevenue: null,
  activeProducts: null,
};

/** Türkiye saatiyle bugünün başlangıcı (TR sabit UTC+3, yaz saati yok). */
function istanbulDayStartISO(): string {
  const day = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Istanbul",
  }).format(new Date()); // "YYYY-MM-DD"
  return `${day}T00:00:00+03:00`;
}

/** Özet sayıları service-role ile çek; tablolar yoksa null döner (kart "—" basar). */
async function loadShopStats(): Promise<ShopStats> {
  try {
    const supabase = createAdminClient();
    const dayStart = istanbulDayStartISO();

    const [todayRes, pendingRes, revenueRes, productsRes] = await Promise.all([
      supabase
        .from("orders")
        .select("id", { count: "exact", head: true })
        .gte("created_at", dayStart),
      supabase
        .from("orders")
        .select("id", { count: "exact", head: true })
        .in("status", ["new", "confirmed", "preparing", "on_the_way"]),
      supabase
        .from("orders")
        .select("total, payment_method, payment_status")
        .gte("created_at", dayStart)
        .neq("status", "cancelled"),
      supabase
        .from("products")
        .select("id", { count: "exact", head: true })
        .eq("is_active", true),
    ]);

    if (todayRes.error || pendingRes.error || revenueRes.error || productsRes.error) {
      return EMPTY_STATS;
    }

    // Ciro: bugünkü iptal olmayan siparişler — kapıda ödeme (teslimatta tahsil)
    // her durumda sayılır, online (iyzico) sadece "paid" ise sayılır.
    const rows = (revenueRes.data ?? []) as {
      total: number;
      payment_method: string;
      payment_status: string;
    }[];
    const todayRevenue = rows
      .filter((r) => r.payment_method !== "iyzico" || r.payment_status === "paid")
      .reduce((sum, r) => sum + Number(r.total), 0);

    return {
      todayOrders: todayRes.count ?? 0,
      pendingOrders: pendingRes.count ?? 0,
      todayRevenue,
      activeProducts: productsRes.count ?? 0,
    };
  } catch {
    return EMPTY_STATS;
  }
}

export default async function AdminHome() {
  const supabase = createAdminClient();
  const [stats, sessionsRes] = await Promise.all([
    loadShopStats(),
    supabase
      .from("chat_sessions")
      .select("*")
      .order("last_message_at", { ascending: false })
      .limit(200),
  ]);

  const cards: {
    href: string;
    label: string;
    value: string;
    highlight?: boolean;
  }[] = [
    {
      href: "/admin/siparisler",
      label: "Bugünkü Sipariş",
      value: stats.todayOrders === null ? "—" : String(stats.todayOrders),
    },
    {
      href: "/admin/siparisler",
      label: "Bekleyen Sipariş",
      value: stats.pendingOrders === null ? "—" : String(stats.pendingOrders),
      highlight: (stats.pendingOrders ?? 0) > 0,
    },
    {
      href: "/admin/siparisler",
      label: "Bugünkü Ciro",
      value: stats.todayRevenue === null ? "—" : formatTL(stats.todayRevenue),
    },
    {
      href: "/admin/urunler",
      label: "Aktif Ürün",
      value: stats.activeProducts === null ? "—" : String(stats.activeProducts),
    },
  ];

  return (
    <>
      <h1 className={styles.title}>Panel</h1>
      <p className={styles.subtitle}>Günün özeti ve sohbetler.</p>

      <div className={styles.statGrid}>
        {cards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className={`${styles.statCard} ${card.highlight ? styles["statCard--hot"] : ""}`}
          >
            <span className={styles.statValue}>{card.value}</span>
            <span className={styles.statLabel}>{card.label}</span>
          </Link>
        ))}
      </div>

      <div id="sohbetler" className={styles.chatSection}>
        {sessionsRes.error ? (
          <div className={styles.empty}>
            Sohbetler yüklenemedi: {sessionsRes.error.message}
          </div>
        ) : (
          <SessionList initial={(sessionsRes.data ?? []) as ChatSession[]} />
        )}
      </div>
    </>
  );
}
