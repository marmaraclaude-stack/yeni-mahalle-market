// Admin paneli ana sayfası (dashboard). KPI kartları düne göre değişim
// rozetleri taşır; gelir özeti, sipariş durumu dağılımı, çok satanlar,
// katalog sağlığı ve topluluk widget'ları eklidir. DB kurulumu yoksa
// kartlar "-" gösterir, bölümler zarif boş durum basar.

import Link from "next/link";
import {
  BadgePercent,
  Bike,
  Clock,
  MessageCircle,
  Package,
  PackageX,
  Plus,
  Receipt,
  Settings,
  ShoppingBag,
  Star,
  TrendingUp,
  Users,
  Wallet,
} from "lucide-react";
import { createAdminClient } from "@/lib/supabase/admin";
import { formatTL, ORDER_STATUS_LABELS } from "@/lib/shop/types";
import type { Order, OrderStatus, ShopSettings } from "@/lib/shop/types";
import styles from "../admin.module.css";
import ds from "./dashboard.module.css";

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
  yesterdayOrders: number | null;
  yesterdayRevenue: number | null;
  statusCounts: Record<OrderStatus, number> | null;
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
  yesterdayOrders: null,
  yesterdayRevenue: null,
  statusCounts: null,
};

type RecentOrder = Pick<
  Order,
  "id" | "order_no" | "customer_name" | "total" | "status" | "created_at"
>;

interface TopProduct {
  name: string;
  qty: number;
  total: number;
}

interface CatalogHealth {
  outOfStock: number;
  discounted: number;
  featured: number;
}

interface CommunityStats {
  unreadChats: number | null;
  members: number | null;
}

type DeltaTone = "up" | "down" | "flat";

interface Delta {
  tone: DeltaTone;
  text: string;
}

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

/** Sipariş sayısı için düne göre değişim rozeti; veri yoksa null (gizlenir). */
function countDelta(today: number | null, yesterday: number | null): Delta | null {
  if (today === null || yesterday === null) return null;
  const diff = today - yesterday;
  if (diff === 0) return { tone: "flat", text: "dünle aynı" };
  const sign = diff > 0 ? "+" : "";
  return { tone: diff > 0 ? "up" : "down", text: `${sign}${diff} düne göre` };
}

/** Ciro için düne göre yüzde değişim rozeti; veri yoksa null (gizlenir). */
function revenueDelta(today: number | null, yesterday: number | null): Delta | null {
  if (today === null || yesterday === null) return null;
  if (yesterday <= 0) {
    if (today <= 0) return { tone: "flat", text: "dünle aynı" };
    return { tone: "up", text: `+${formatTL(today)} düne göre` };
  }
  const pct = Math.round(((today - yesterday) / yesterday) * 100);
  if (pct === 0) return { tone: "flat", text: "dünle yakın" };
  const sign = pct > 0 ? "+" : "-";
  return { tone: pct > 0 ? "up" : "down", text: `${sign}%${Math.abs(pct)} düne göre` };
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
    const yesterdayStartTs = dayStartTs - 86_400_000;
    // Pencere: ay başı ile son 7 günün en erkeni. Dün ve son 7 gün her
    // durumda pencerenin içinde kalır; tek fetch ile tüm kovalar dolar.
    const sevenAgoTs = dayStartTs - 6 * 86_400_000;
    const fetchStartISO = new Date(Math.min(monthStartTs, sevenAgoTs)).toISOString();

    const [todayRes, pendingRes, windowRes, productsRes, totalRes, couriersRes] =
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
          .select("total, status, payment_method, payment_status, created_at")
          .gte("created_at", fetchStartISO),
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

    if (todayRes.error || pendingRes.error || windowRes.error || productsRes.error) {
      return EMPTY_STATS;
    }

    // Pencere satırları iptaller dahil çekilir: durum dağılımı ve sipariş
    // adedi kıyası hepsini sayar; ciro hesabı iptalleri aşağıda eler.
    const rows = (windowRes.data ?? []) as {
      total: number;
      status: OrderStatus;
      payment_method: string;
      payment_status: string;
      created_at: string;
    }[];

    // Ciro: iptal olmayan siparişler. Kapıda ödeme (teslimatta tahsil) her
    // durumda sayılır, online (iyzico) sadece "paid" ise sayılır.
    const qualifying = rows.filter(
      (r) =>
        r.status !== "cancelled" &&
        (r.payment_method !== "iyzico" || r.payment_status === "paid"),
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

    // Durum dağılımı: son 7 günün tüm siparişleri (iptal dahil).
    const statusCounts: Record<OrderStatus, number> = {
      new: 0,
      confirmed: 0,
      preparing: 0,
      on_the_way: 0,
      delivered: 0,
      cancelled: 0,
    };
    let yesterdayOrders = 0;
    for (const r of rows) {
      const t = new Date(r.created_at).getTime();
      if (t >= yesterdayStartTs && t < dayStartTs) yesterdayOrders += 1;
      if (t >= sevenAgoTs && statusCounts[r.status] !== undefined) {
        statusCounts[r.status] += 1;
      }
    }

    let monthRevenue = 0;
    let weekRevenue = 0;
    let todayRevenue = 0;
    let yesterdayRevenue = 0;
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
      if (t >= yesterdayStartTs && t < dayStartTs) yesterdayRevenue += total;
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
      yesterdayOrders,
      yesterdayRevenue,
      statusCounts,
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

/**
 * Son 7 günün en çok satan 5 ürünü. order_items'ta tarih olmadığı için
 * iki adım: pencere siparişlerinin id'leri, sonra kalemler (join yok).
 */
async function loadTopProducts(): Promise<TopProduct[] | null> {
  try {
    const supabase = createAdminClient();
    const sevenAgoISO = new Date(
      new Date(istanbulDayStartISO()).getTime() - 6 * 86_400_000,
    ).toISOString();
    const orderRes = await supabase
      .from("orders")
      .select("id")
      .gte("created_at", sevenAgoISO)
      .neq("status", "cancelled")
      .order("created_at", { ascending: false })
      .limit(150);
    if (orderRes.error) return null;
    const ids = ((orderRes.data ?? []) as { id: string }[]).map((r) => r.id);
    if (ids.length === 0) return [];
    const itemsRes = await supabase
      .from("order_items")
      .select("name, qty, line_total")
      .in("order_id", ids);
    if (itemsRes.error) return null;
    const byName = new Map<string, TopProduct>();
    const items = (itemsRes.data ?? []) as {
      name: string;
      qty: number;
      line_total: number;
    }[];
    for (const item of items) {
      const cur = byName.get(item.name) ?? { name: item.name, qty: 0, total: 0 };
      cur.qty += Number(item.qty);
      cur.total += Number(item.line_total);
      byName.set(item.name, cur);
    }
    return [...byName.values()].sort((a, b) => b.qty - a.qty).slice(0, 5);
  } catch {
    return null;
  }
}

/** Katalog sağlığı: stok dışı / indirimli / öne çıkan aktif ürün sayıları. */
async function loadCatalogHealth(): Promise<CatalogHealth | null> {
  try {
    const supabase = createAdminClient();
    const [stockRes, saleRes, featRes] = await Promise.all([
      supabase
        .from("products")
        .select("id", { count: "exact", head: true })
        .eq("is_active", true)
        .eq("in_stock", false),
      supabase
        .from("products")
        .select("id", { count: "exact", head: true })
        .eq("is_active", true)
        .not("compare_at_price", "is", null),
      supabase
        .from("products")
        .select("id", { count: "exact", head: true })
        .eq("is_active", true)
        .eq("is_featured", true),
    ]);
    if (stockRes.error || saleRes.error || featRes.error) return null;
    return {
      outOfStock: stockRes.count ?? 0,
      discounted: saleRes.count ?? 0,
      featured: featRes.count ?? 0,
    };
  } catch {
    return null;
  }
}

/** Bekleyen (okunmamış, açık) sohbet ve kayıtlı üye sayısı. */
async function loadCommunityStats(): Promise<CommunityStats | null> {
  try {
    const supabase = createAdminClient();
    const [chatRes, memberRes] = await Promise.all([
      supabase
        .from("chat_sessions")
        .select("id", { count: "exact", head: true })
        .eq("status", "open")
        .eq("unread_admin", true),
      supabase
        .from("customer_profiles")
        .select("id", { count: "exact", head: true }),
    ]);
    const unreadChats = chatRes.error ? null : chatRes.count ?? 0;
    const members = memberRes.error ? null : memberRes.count ?? 0;
    if (unreadChats === null && members === null) return null;
    return { unreadChats, members };
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

const STATUS_ORDER: OrderStatus[] = [
  "new",
  "confirmed",
  "preparing",
  "on_the_way",
  "delivered",
  "cancelled",
];

export default async function AdminHome() {
  const [stats, recentOrders, settings, topProducts, catalog, community] =
    await Promise.all([
      loadShopStats(),
      loadRecentOrders(),
      loadSettings(),
      loadTopProducts(),
      loadCatalogHealth(),
      loadCommunityStats(),
    ]);

  const todayLabel = new Intl.DateTimeFormat("tr-TR", {
    timeZone: "Europe/Istanbul",
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(new Date());

  const cards: {
    href: string;
    label: string;
    value: string;
    icon: typeof Receipt;
    highlight: boolean;
    delta: Delta | null;
  }[] = [
    {
      href: "/admin/siparisler",
      label: "Bugünkü Sipariş",
      value: stats.todayOrders === null ? "-" : String(stats.todayOrders),
      icon: Receipt,
      highlight: false,
      delta: countDelta(stats.todayOrders, stats.yesterdayOrders),
    },
    {
      href: "/admin/siparisler",
      label: "Bekleyen Sipariş",
      value: stats.pendingOrders === null ? "-" : String(stats.pendingOrders),
      icon: Clock,
      highlight: (stats.pendingOrders ?? 0) > 0,
      delta: null,
    },
    {
      href: "/admin/siparisler",
      label: "Bugünkü Ciro",
      value: stats.todayRevenue === null ? "-" : formatTL(stats.todayRevenue),
      icon: TrendingUp,
      highlight: false,
      delta: revenueDelta(stats.todayRevenue, stats.yesterdayRevenue),
    },
    {
      href: "/admin/urunler",
      label: "Aktif Ürün",
      value: stats.activeProducts === null ? "-" : String(stats.activeProducts),
      icon: Package,
      highlight: false,
      delta: null,
    },
  ];

  const statusTotal = stats.statusCounts
    ? STATUS_ORDER.reduce((sum, s) => sum + (stats.statusCounts?.[s] ?? 0), 0)
    : 0;
  const statusMax = stats.statusCounts
    ? Math.max(...STATUS_ORDER.map((s) => stats.statusCounts?.[s] ?? 0), 1)
    : 1;

  const topMax = topProducts && topProducts.length > 0
    ? Math.max(...topProducts.map((p) => p.qty), 1)
    : 1;

  return (
    <>
      <h1 className={styles.title}>Panel</h1>
      <p className={styles.subtitle}>Mağazanın günlük özeti · {todayLabel}</p>

      {/* KPI kartları: düne göre değişim rozetli */}
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
              {card.delta && (
                <span className={`${ds.delta} ${ds[`delta--${card.delta.tone}`]}`}>
                  {card.delta.text}
                </span>
              )}
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
                      const isToday = i === series.length - 1;
                      const tip = `${d.label}: ${formatTL(d.revenue)}`;
                      return (
                        <div
                          key={i}
                          className={styles.miniBarCol}
                          title={tip}
                          aria-label={tip}
                        >
                          <span className={styles.miniBarTrack}>
                            {d.revenue > 0 ? (
                              <span
                                className={styles.miniBarFill}
                                style={{ height: `${Math.max(pct, 3)}%` }}
                              />
                            ) : (
                              <span className={ds.barZero} />
                            )}
                          </span>
                          <span
                            className={
                              isToday ? ds.barLabelToday : styles.miniBarLabel
                            }
                          >
                            {d.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                  <span className={styles.miniChartCap}>
                    Son 7 gün geliri · boş günler taban çizgisiyle gösterilir
                  </span>
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
        {/* Sol ana kolon: son siparişler + çok satanlar */}
        <div className={ds.colStack}>
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

          {/* Çok satanlar: son 7 günün kalem toplamları */}
          <section className={styles.panel}>
            <div className={styles.panelHead}>
              <h2 className={styles.panelTitle}>Çok Satanlar</h2>
              <Link href="/admin/urunler" className={styles.panelLink}>
                Ürünler
              </Link>
            </div>
            {topProducts === null ? (
              <div className={styles.emptySm}>
                Satış verisi okunamadı. Veritabanı kurulumu yapılmamış olabilir.
              </div>
            ) : topProducts.length === 0 ? (
              <div className={styles.emptySm}>Henüz satış verisi yok.</div>
            ) : (
              <>
                <div className={ds.topList}>
                  {topProducts.map((p, i) => (
                    <div key={p.name} className={ds.topRow}>
                      <span
                        className={`${ds.topRank} ${i === 0 ? ds["topRank--first"] : ""}`}
                        aria-hidden
                      >
                        {i + 1}
                      </span>
                      <span className={ds.topInfo}>
                        <span className={ds.topName}>{p.name}</span>
                        <span className={ds.topBar} aria-hidden>
                          <span
                            className={ds.topBarFill}
                            style={{
                              width: `${Math.max(Math.round((p.qty / topMax) * 100), 4)}%`,
                            }}
                          />
                        </span>
                      </span>
                      <span className={ds.topSide}>
                        <span className={ds.topTotal}>{formatTL(p.total)}</span>
                        <span className={ds.topQty}>{p.qty} adet</span>
                      </span>
                    </div>
                  ))}
                </div>
                <p className={ds.panelCap}>Son 7 gün · adede göre sıralı</p>
              </>
            )}
          </section>
        </div>

        {/* Sağ yan kolon */}
        <div className={styles.dashSide}>
          {/* Sipariş durumu dağılımı */}
          <section className={styles.panel}>
            <div className={styles.panelHead}>
              <h2 className={styles.panelTitle}>Sipariş Durumu</h2>
              <Link href="/admin/siparisler" className={styles.panelLink}>
                Yönet
              </Link>
            </div>
            {stats.statusCounts === null ? (
              <div className={styles.emptySm}>
                Durum verisi okunamadı. Veritabanı kurulumu yapılmamış olabilir.
              </div>
            ) : statusTotal === 0 ? (
              <div className={styles.emptySm}>Son 7 günde sipariş yok.</div>
            ) : (
              <>
                <div className={ds.statusList}>
                  {STATUS_ORDER.map((s) => {
                    const n = stats.statusCounts?.[s] ?? 0;
                    const width = n > 0 ? Math.max((n / statusMax) * 100, 4) : 0;
                    return (
                      <Link
                        key={s}
                        href="/admin/siparisler"
                        className={ds.statusRow}
                      >
                        <span
                          className={`${styles.chipDot} ${styles[`chipDot--${s}`]}`}
                          aria-hidden
                        />
                        <span className={ds.statusName}>
                          {ORDER_STATUS_LABELS[s]}
                        </span>
                        <span className={ds.statusTrack} aria-hidden>
                          <span
                            className={`${ds.statusFill} ${ds[`statusFill--${s}`]}`}
                            style={{ width: `${width}%` }}
                          />
                        </span>
                        <span className={ds.statusCount}>{n}</span>
                      </Link>
                    );
                  })}
                </div>
                <p className={ds.panelCap}>Son 7 gün · {statusTotal} sipariş</p>
              </>
            )}
          </section>

          {/* Topluluk: bekleyen sohbet + kayıtlı üye */}
          {community && (
            <div className={ds.duoGrid}>
              {community.unreadChats !== null && (
                <Link
                  href="/admin/sohbetler"
                  className={`${ds.duoCard} ${community.unreadChats > 0 ? ds["duoCard--hot"] : ""}`}
                >
                  <span className={ds.duoIcon} aria-hidden>
                    <MessageCircle size={15} strokeWidth={2} />
                  </span>
                  <span className={ds.duoValue}>{community.unreadChats}</span>
                  <span className={ds.duoLabel}>Bekleyen Sohbet</span>
                </Link>
              )}
              {community.members !== null && (
                <div className={ds.duoCard}>
                  <span className={ds.duoIcon} aria-hidden>
                    <Users size={15} strokeWidth={2} />
                  </span>
                  <span className={ds.duoValue}>{community.members}</span>
                  <span className={ds.duoLabel}>Kayıtlı Üye</span>
                </div>
              )}
            </div>
          )}

          {/* Katalog sağlığı */}
          {catalog && (
            <section className={styles.panel}>
              <div className={styles.panelHead}>
                <h2 className={styles.panelTitle}>Katalog Sağlığı</h2>
                <Link href="/admin/urunler" className={styles.panelLink}>
                  Ürünler
                </Link>
              </div>
              <div className={ds.healthList}>
                <Link href="/admin/urunler" className={ds.healthRow}>
                  <span
                    className={`${ds.healthIcon} ${ds["healthIcon--warn"]}`}
                    aria-hidden
                  >
                    <PackageX size={15} strokeWidth={2} />
                  </span>
                  <span className={ds.healthLabel}>Stokta olmayan</span>
                  <span
                    className={`${ds.healthCount} ${catalog.outOfStock > 0 ? ds["healthCount--warn"] : ""}`}
                  >
                    {catalog.outOfStock}
                  </span>
                </Link>
                <Link href="/admin/urunler" className={ds.healthRow}>
                  <span
                    className={`${ds.healthIcon} ${ds["healthIcon--sale"]}`}
                    aria-hidden
                  >
                    <BadgePercent size={15} strokeWidth={2} />
                  </span>
                  <span className={ds.healthLabel}>İndirimli ürün</span>
                  <span className={ds.healthCount}>{catalog.discounted}</span>
                </Link>
                <Link href="/admin/urunler" className={ds.healthRow}>
                  <span
                    className={`${ds.healthIcon} ${ds["healthIcon--star"]}`}
                    aria-hidden
                  >
                    <Star size={15} strokeWidth={2} />
                  </span>
                  <span className={ds.healthLabel}>Öne çıkan</span>
                  <span className={ds.healthCount}>{catalog.featured}</span>
                </Link>
              </div>
            </section>
          )}

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
