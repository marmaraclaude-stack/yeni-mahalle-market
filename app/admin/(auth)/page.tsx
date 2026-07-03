// Admin paneli ana sayfası (dashboard) — 4 özet kart, son siparişler tablosu,
// hızlı işlemler ve mağaza durumu kartları. Sohbet listesi /admin/sohbetler'de.
// DB kurulumu yapılmamışsa kartlar "-" gösterir, bölümler zarif boş durum basar.

import Link from "next/link";
import {
  ChevronRight,
  Clock,
  MessageCircle,
  Package,
  Plus,
  Receipt,
  Settings,
  ShoppingBag,
  TrendingUp,
} from "lucide-react";
import { createAdminClient } from "@/lib/supabase/admin";
import { formatTL, ORDER_STATUS_LABELS } from "@/lib/shop/types";
import type { Order, ShopSettings } from "@/lib/shop/types";
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

type RecentOrder = Pick<
  Order,
  "id" | "order_no" | "customer_name" | "total" | "status" | "created_at"
>;

/** Türkiye saatiyle bugünün başlangıcı (TR sabit UTC+3, yaz saati yok). */
function istanbulDayStartISO(): string {
  const day = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Istanbul",
  }).format(new Date()); // "YYYY-MM-DD"
  return `${day}T00:00:00+03:00`;
}

/** "az önce" / "5 dk önce" / "3 sa önce" / "2 gün önce" biçiminde göreli zaman. */
function timeAgo(iso: string): string {
  const diff = Math.max(0, Date.now() - new Date(iso).getTime());
  const m = Math.floor(diff / 60000);
  if (m < 1) return "az önce";
  if (m < 60) return `${m} dk önce`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} sa önce`;
  return `${Math.floor(h / 24)} gün önce`;
}

/** Özet sayıları service-role ile çek; tablolar yoksa null döner (kart "-" basar). */
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

/** Son 8 sipariş; tablo yoksa null (bölüm boş durum basar). */
async function loadRecentOrders(): Promise<RecentOrder[] | null> {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("orders")
      .select("id, order_no, customer_name, total, status, created_at")
      .order("created_at", { ascending: false })
      .limit(8);
    if (error) return null;
    return (data ?? []) as RecentOrder[];
  } catch {
    return null;
  }
}

/** Mağaza ayarları (id=1); okunamazsa null. */
async function loadSettings(): Promise<ShopSettings | null> {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("shop_settings")
      .select("*")
      .eq("id", 1)
      .maybeSingle();
    if (error || !data) return null;
    return data as ShopSettings;
  } catch {
    return null;
  }
}

const QUICK_ACTIONS = [
  { href: "/admin/urunler?yeni=1", label: "Yeni ürün ekle", icon: Plus },
  { href: "/admin/siparisler", label: "Siparişleri yönet", icon: ShoppingBag },
  { href: "/admin/ayarlar", label: "Mağaza ayarları", icon: Settings },
  { href: "/admin/sohbetler", label: "Sohbetlere bak", icon: MessageCircle },
];

export default async function AdminHome() {
  const [stats, recentOrders, settings] = await Promise.all([
    loadShopStats(),
    loadRecentOrders(),
    loadSettings(),
  ]);

  const cards = [
    {
      href: "/admin/siparisler",
      label: "Bugünkü Sipariş",
      value: stats.todayOrders === null ? "-" : String(stats.todayOrders),
      icon: Receipt,
      highlight: false,
    },
    {
      href: "/admin/siparisler",
      label: "Bekleyen Sipariş",
      value: stats.pendingOrders === null ? "-" : String(stats.pendingOrders),
      icon: Clock,
      highlight: (stats.pendingOrders ?? 0) > 0,
    },
    {
      href: "/admin/siparisler",
      label: "Bugünkü Ciro",
      value: stats.todayRevenue === null ? "-" : formatTL(stats.todayRevenue),
      icon: TrendingUp,
      highlight: false,
    },
    {
      href: "/admin/urunler",
      label: "Aktif Ürün",
      value: stats.activeProducts === null ? "-" : String(stats.activeProducts),
      icon: Package,
      highlight: false,
    },
  ];

  return (
    <>
      <h1 className={styles.title}>Panel</h1>
      <p className={styles.subtitle}>Mağazanın günlük özeti.</p>

      {/* Özet kartları */}
      <div className={styles.statGrid}>
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.label}
              href={card.href}
              className={`${styles.statCard} ${card.highlight ? styles["statCard--hot"] : ""}`}
            >
              <span className={styles.statIcon} aria-hidden>
                <Icon size={17} strokeWidth={2} />
              </span>
              <span className={styles.statValue}>{card.value}</span>
              <span className={styles.statLabel}>{card.label}</span>
            </Link>
          );
        })}
      </div>

      <div className={styles.dashGrid}>
        {/* Son siparişler */}
        <section className={styles.panel}>
          <div className={styles.panelHead}>
            <h2 className={styles.panelTitle}>Son Siparişler</h2>
            <Link href="/admin/siparisler" className={styles.panelLink}>
              Tümünü gör
            </Link>
          </div>
          {recentOrders === null ? (
            <div className={styles.emptySm}>
              Siparişler okunamadı. Veritabanı kurulumu yapılmamış olabilir.
            </div>
          ) : recentOrders.length === 0 ? (
            <div className={styles.emptySm}>
              Henüz sipariş yok. İlk sipariş geldiğinde burada görünecek.
            </div>
          ) : (
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Sipariş</th>
                    <th>Müşteri</th>
                    <th>Tutar</th>
                    <th>Durum</th>
                    <th>Zaman</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((o) => (
                    <tr key={o.id}>
                      <td>
                        <Link
                          href={`/admin/siparisler/${o.id}`}
                          className={styles.orderNo}
                        >
                          {o.order_no}
                        </Link>
                      </td>
                      <td>{o.customer_name}</td>
                      <td>{formatTL(Number(o.total))}</td>
                      <td>
                        <span
                          className={`${styles.badge} ${styles[`badge--${o.status}`]}`}
                        >
                          {ORDER_STATUS_LABELS[o.status]}
                        </span>
                      </td>
                      <td className={styles.timeCell}>{timeAgo(o.created_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <div className={styles.dashSide}>
          {/* Hızlı işlemler */}
          <section className={styles.panel}>
            <h2 className={styles.panelTitle}>Hızlı İşlemler</h2>
            <div className={styles.quickList}>
              {QUICK_ACTIONS.map((action) => {
                const Icon = action.icon;
                return (
                  <Link
                    key={action.href}
                    href={action.href}
                    className={styles.quickLink}
                  >
                    <span className={styles.quickIcon} aria-hidden>
                      <Icon size={15} strokeWidth={2.2} />
                    </span>
                    {action.label}
                    <span className={styles.quickArrow} aria-hidden>
                      <ChevronRight size={15} />
                    </span>
                  </Link>
                );
              })}
            </div>
          </section>

          {/* Mağaza durumu */}
          <section className={styles.panel}>
            <div className={styles.panelHead}>
              <h2 className={styles.panelTitle}>Mağaza Durumu</h2>
              <Link href="/admin/ayarlar" className={styles.panelLink}>
                Ayarlar
              </Link>
            </div>
            {settings === null ? (
              <div className={styles.emptySm}>
                Ayarlar okunamadı. Veritabanı kurulumu yapılmamış olabilir.
              </div>
            ) : (
              <div className={styles.storeRows}>
                <div className={styles.storeRow}>
                  <span className={styles.storeRowLabel}>Sipariş alımı</span>
                  <span
                    className={`${styles.badge} ${
                      settings.ordering_open
                        ? styles["badge--delivered"]
                        : styles["badge--cancelled"]
                    }`}
                  >
                    {settings.ordering_open ? "Açık" : "Kapalı"}
                  </span>
                </div>
                <div className={styles.storeRow}>
                  <span className={styles.storeRowLabel}>Teslimat ücreti</span>
                  <span className={styles.storeRowValue}>
                    {formatTL(Number(settings.delivery_fee))}
                  </span>
                </div>
                <div className={styles.storeRow}>
                  <span className={styles.storeRowLabel}>Ücretsiz teslimat</span>
                  <span className={styles.storeRowValue}>
                    {Number(settings.free_delivery_over) > 0
                      ? `${formatTL(Number(settings.free_delivery_over))} üzeri`
                      : "Her siparişte"}
                  </span>
                </div>
                <div className={styles.storeRow}>
                  <span className={styles.storeRowLabel}>Minimum sepet</span>
                  <span className={styles.storeRowValue}>
                    {Number(settings.min_order_total) > 0
                      ? formatTL(Number(settings.min_order_total))
                      : "Yok"}
                  </span>
                </div>
              </div>
            )}
          </section>
        </div>
      </div>
    </>
  );
}
