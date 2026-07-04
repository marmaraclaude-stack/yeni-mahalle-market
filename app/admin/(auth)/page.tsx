// Admin paneli ana sayfası (dashboard) — 4 özet kart, son siparişler tablosu,
// hızlı işlemler ve mağaza durumu kartları. Sohbet listesi /admin/sohbetler'de.
// DB kurulumu yapılmamışsa kartlar "-" gösterir, bölümler zarif boş durum basar.

import Link from "next/link";
import {
  Bike,
  ChevronRight,
  Clock,
  MessageCircle,
  Package,
  Plus,
  Receipt,
  Settings,
  ShoppingBag,
  TrendingUp,
  Wallet,
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
  weekRevenue: number | null;
  monthRevenue: number | null;
  avgBasket: number | null;
  totalOrders: number | null;
  activeProducts: number | null;
  activeCouriers: number | null;
  last7: { label: string; revenue: number }[] | null;
}

const EMPTY_STATS: ShopStats = {
  todayOrders: null,
  pendingOrders: null,
  todayRevenue: null,
  weekRevenue: null,
  monthRevenue: null,
  avgBasket: null,
  totalOrders: null,
  activeProducts: null,
  activeCouriers: null,
  last7: null,
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

/** İçinde bulunulan ayın ilk gününün başlangıcı (TR saatiyle). */
function istanbulMonthStartISO(): string {
  const day = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Istanbul",
  }).format(new Date()); // "YYYY-MM-DD"
  return `${day.slice(0, 8)}01T00:00:00+03:00`;
}

/** İçinde bulunulan haftanın (Pazartesi) başlangıcı (TR saatiyle). */
function istanbulWeekStartISO(): string {
  const day = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Istanbul",
  }).format(new Date()); // "YYYY-MM-DD"
  const [y, m, d] = day.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  const diff = (dt.getUTCDay() + 6) % 7; // Pazartesi'den bu yana geçen gün
  dt.setUTCDate(dt.getUTCDate() - diff);
  const wy = dt.getUTCFullYear();
  const wm = String(dt.getUTCMonth() + 1).padStart(2, "0");
  const wd = String(dt.getUTCDate()).padStart(2, "0");
  return `${wy}-${wm}-${wd}T00:00:00+03:00`;
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
    const dayStartISO = istanbulDayStartISO();
    const weekStartISO = istanbulWeekStartISO();
    const monthStartISO = istanbulMonthStartISO();
    const dayStartTs = new Date(dayStartISO).getTime();
    const weekStartTs = new Date(weekStartISO).getTime();
    const monthStartTs = new Date(monthStartISO).getTime();
    // Ciro penceresi: ay başı ile son 7 günün en erkeni (mini bar için yeterli).
    const sevenAgoTs = dayStartTs - 6 * 86_400_000;
    const fetchStartISO = new Date(Math.min(monthStartTs, sevenAgoTs)).toISOString();

    const [todayRes, pendingRes, revenueRes, productsRes, totalRes, couriersRes] =
      await Promise.all([
        supabase
          .from("orders")
          .select("id", { count: "exact", head: true })
          .gte("created_at", dayStartISO),
        supabase
          .from("orders")
          .select("id", { count: "exact", head: true })
          .in("status", ["new", "confirmed", "preparing", "on_the_way"]),
        supabase
          .from("orders")
          .select("total, payment_method, payment_status, created_at")
          .gte("created_at", fetchStartISO)
          .neq("status", "cancelled"),
        supabase
          .from("products")
          .select("id", { count: "exact", head: true })
          .eq("is_active", true),
        supabase.from("orders").select("id", { count: "exact", head: true }),
        supabase
          .from("couriers")
          .select("id", { count: "exact", head: true })
          .eq("is_active", true),
      ]);

    if (todayRes.error || pendingRes.error || revenueRes.error || productsRes.error) {
      return EMPTY_STATS;
    }

    // Ciro: iptal olmayan siparişler — kapıda ödeme (teslimatta tahsil) her durumda
    // sayılır, online (iyzico) sadece "paid" ise sayılır. Tek sorgudan ay/hafta/gün.
    const rows = (revenueRes.data ?? []) as {
      total: number;
      payment_method: string;
      payment_status: string;
      created_at: string;
    }[];
    const qualifying = rows.filter(
      (r) => r.payment_method !== "iyzico" || r.payment_status === "paid",
    );

    // Son 7 gün kovaları (bugün dahil), TR günlük anahtarına göre.
    const dayKeyFmt = new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Istanbul" });
    const dayLabelFmt = new Intl.DateTimeFormat("tr-TR", {
      timeZone: "Europe/Istanbul",
      weekday: "short",
    });
    const last7: { label: string; revenue: number }[] = [];
    const keyIndex = new Map<string, number>();
    for (let i = 6; i >= 0; i--) {
      const dt = new Date(dayStartTs - i * 86_400_000);
      keyIndex.set(dayKeyFmt.format(dt), last7.length);
      last7.push({ label: dayLabelFmt.format(dt), revenue: 0 });
    }

    let monthRevenue = 0;
    let weekRevenue = 0;
    let todayRevenue = 0;
    let monthOrders = 0;
    for (const r of qualifying) {
      const t = new Date(r.created_at).getTime();
      const total = Number(r.total);
      if (t >= monthStartTs) {
        monthRevenue += total;
        monthOrders += 1;
      }
      if (t >= weekStartTs) weekRevenue += total;
      if (t >= dayStartTs) todayRevenue += total;
      const idx = keyIndex.get(dayKeyFmt.format(new Date(r.created_at)));
      if (idx !== undefined) last7[idx].revenue += total;
    }

    const avgBasket = monthOrders > 0 ? monthRevenue / monthOrders : 0;

    return {
      todayOrders: todayRes.count ?? 0,
      pendingOrders: pendingRes.count ?? 0,
      todayRevenue,
      weekRevenue,
      monthRevenue,
      avgBasket,
      totalOrders: totalRes.error ? null : totalRes.count ?? 0,
      activeProducts: productsRes.count ?? 0,
      activeCouriers: couriersRes.error ? null : couriersRes.count ?? 0,
      last7,
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

/** Null gelir/tutarı "-" olarak, aksi halde TL biçiminde göster. */
function fmtTL(value: number | null): string {
  return value === null ? "-" : formatTL(value);
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

      {/* Gelir özeti: ay / hafta / gün + son 7 gün mini bar + ek metrikler */}
      <section className={`${styles.panel} ${styles.revPanel}`}>
        <div className={styles.panelHead}>
          <h2 className={styles.panelTitle}>Gelir Özeti</h2>
          <Link href="/admin/siparisler" className={styles.panelLink}>
            Siparişler
          </Link>
        </div>

        <div className={styles.revGrid}>
          <div className={styles.revStats}>
            <div className={`${styles.revStat} ${styles["revStat--hero"]}`}>
              <span className={styles.revStatLabel}>Bu Ay</span>
              <span className={styles.revStatValue}>{fmtTL(stats.monthRevenue)}</span>
            </div>
            <div className={styles.revStatPair}>
              <div className={styles.revStat}>
                <span className={styles.revStatLabel}>Bu Hafta</span>
                <span className={styles.revStatValue}>{fmtTL(stats.weekRevenue)}</span>
              </div>
              <div className={styles.revStat}>
                <span className={styles.revStatLabel}>Bugün</span>
                <span className={styles.revStatValue}>{fmtTL(stats.todayRevenue)}</span>
              </div>
            </div>
          </div>

          {stats.last7 &&
            stats.last7.length > 0 &&
            (() => {
              const series = stats.last7;
              const max = Math.max(...series.map((x) => x.revenue), 1);
              return (
                <div className={styles.miniChart}>
                  <div className={styles.miniBars}>
                    {series.map((d, i) => {
                      const pct = Math.round((d.revenue / max) * 100);
                      return (
                        <div
                          key={i}
                          className={styles.miniBarCol}
                          title={`${d.label}: ${formatTL(d.revenue)}`}
                        >
                          <span className={styles.miniBarTrack}>
                            <span
                              className={styles.miniBarFill}
                              style={{ height: `${Math.max(pct, 3)}%` }}
                            />
                          </span>
                          <span className={styles.miniBarLabel}>{d.label}</span>
                        </div>
                      );
                    })}
                  </div>
                  <span className={styles.miniChartCap}>Son 7 gün geliri</span>
                </div>
              );
            })()}
        </div>

        <div className={styles.revMetrics}>
          <div className={styles.revMetric}>
            <span className={styles.revMetricIcon} aria-hidden>
              <Wallet size={16} strokeWidth={2} />
            </span>
            <span className={styles.revMetricText}>
              <span className={styles.revMetricValue}>{fmtTL(stats.avgBasket)}</span>
              <span className={styles.revMetricLabel}>Ortalama Sepet</span>
            </span>
          </div>
          <div className={styles.revMetric}>
            <span className={styles.revMetricIcon} aria-hidden>
              <ShoppingBag size={16} strokeWidth={2} />
            </span>
            <span className={styles.revMetricText}>
              <span className={styles.revMetricValue}>
                {stats.totalOrders === null ? "-" : String(stats.totalOrders)}
              </span>
              <span className={styles.revMetricLabel}>Toplam Sipariş</span>
            </span>
          </div>
          <div className={styles.revMetric}>
            <span className={styles.revMetricIcon} aria-hidden>
              <Bike size={16} strokeWidth={2} />
            </span>
            <span className={styles.revMetricText}>
              <span className={styles.revMetricValue}>
                {stats.activeCouriers === null ? "-" : String(stats.activeCouriers)}
              </span>
              <span className={styles.revMetricLabel}>Aktif Kurye</span>
            </span>
          </div>
        </div>
      </section>

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
