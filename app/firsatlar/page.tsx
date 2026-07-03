// Fırsatlar — /firsatlar. Üstte "Kampanyalar": aktif kupon kodları
// (service-role ile okunur, vitrine yalnız gösterime gereken alanlar iner).
// Altta "İndirimli Ürünler": compare_at_price dolu ve fiyattan büyük olan
// aktif ürünler, en yüksek indirim oranı önce. DB hazır değilse veya fırsat
// yoksa zarif boş durum gösterilir.

import type { Metadata } from "next";
import Link from "next/link";
import { BadgePercent, TicketPercent } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { formatTL } from "@/lib/shop/types";
import type { Coupon, Product } from "@/lib/shop/types";
import SiteNav from "@/components/SiteNav";
import ProductCard from "@/components/shop/ProductCard";
import CopyCodeButton from "./CopyCodeButton";
import styles from "./firsatlar.module.css";

export const metadata: Metadata = {
  title: "Fırsatlar",
  description:
    "Yeni Mahalle Market'te kampanyalar ve indirimli ürünler. Kupon kodunu kopyala, fırsatları kaçırma, Sapanca içinde kapına gelsin.",
};

/** İndirim oranı (0-1). compare_at_price dolu ürünler için çağrılır. */
function discountRate(p: Product): number {
  if (p.compare_at_price === null || p.compare_at_price <= 0) return 0;
  return (p.compare_at_price - p.price) / p.compare_at_price;
}

/** Vitrine inen kupon görünümü — kullanım sayacı gibi iç alanlar dışarı çıkmaz. */
type CampaignCoupon = Pick<
  Coupon,
  "code" | "description" | "discount_type" | "value" | "min_order_total" | "expires_at"
>;

/**
 * Aktif kuponlar: is_active + süresi geçmemiş + kullanım limiti dolmamış.
 * coupons tablosunu yalnız service-role okuyabildiği için createAdminClient
 * kullanılır (server component, anahtar tarayıcıya inmez).
 */
async function getActiveCoupons(): Promise<CampaignCoupon[]> {
  try {
    const admin = createAdminClient();
    const { data, error } = await admin
      .from("coupons")
      .select(
        "code, description, discount_type, value, min_order_total, expires_at, max_uses, used_count",
      )
      .eq("is_active", true)
      .or(`expires_at.is.null,expires_at.gt.${new Date().toISOString()}`)
      .order("created_at", { ascending: false });

    if (error) throw error;

    type Row = CampaignCoupon & Pick<Coupon, "max_uses" | "used_count">;
    return ((data ?? []) as Row[])
      // PostgREST iki kolonu karşılaştıramaz — max_uses dolmamış süzgeci burada
      .filter((c) => c.max_uses === null || c.used_count < c.max_uses)
      .map(({ code, description, discount_type, value, min_order_total, expires_at }) => ({
        code,
        description,
        discount_type,
        value,
        min_order_total,
        expires_at,
      }));
  } catch {
    // DB hazır değilse kampanya bölümü sessizce gizlenir
    return [];
  }
}

/** "%20 indirim" / "₺50,00 indirim" rozet metni. */
function discountLabel(c: CampaignCoupon): string {
  return c.discount_type === "percent"
    ? `%${c.value} indirim`
    : `${formatTL(c.value)} indirim`;
}

/** Koşul satırı: "₺750,00 üzeri siparişlerde · Son gün: 15 Temmuz 2026" */
function couponTerms(c: CampaignCoupon): string {
  const parts: string[] = [];
  if (c.min_order_total > 0) {
    parts.push(`${formatTL(c.min_order_total)} üzeri siparişlerde`);
  }
  if (c.expires_at) {
    const date = new Intl.DateTimeFormat("tr-TR", {
      day: "numeric",
      month: "long",
      year: "numeric",
      timeZone: "Europe/Istanbul",
    }).format(new Date(c.expires_at));
    parts.push(`Son gün: ${date}`);
  }
  return parts.length > 0 ? parts.join(" · ") : "Tüm siparişlerde geçerli";
}

export default async function FirsatlarPage() {
  let products: Product[] = [];

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("is_active", true)
      .not("compare_at_price", "is", null)
      .order("sort", { ascending: true })
      .order("name", { ascending: true });

    if (error) throw error;
    // PostgREST iki kolonu karşılaştıramaz — compare_at_price > price süzgeci burada
    products = ((data ?? []) as Product[]).filter(
      (p) => p.compare_at_price !== null && p.compare_at_price > p.price,
    );
    // En yüksek indirim oranı önce
    products.sort((a, b) => discountRate(b) - discountRate(a));
  } catch {
    // DB henüz kurulmamış olabilir — site patlamasın, boş durum gösterilir
    products = [];
  }

  const coupons = await getActiveCoupons();

  return (
    <>
      <SiteNav />
      <main className={styles.page}>
        <div className="container">
          <header className={styles.head}>
            <div className={styles.titleRow}>
              <span className={styles.titleIcon} aria-hidden="true">
                <BadgePercent size={22} strokeWidth={1.9} />
              </span>
              <h1 className={styles.title}>Fırsatlar</h1>
            </div>
            <p className={styles.sub}>
              Kampanyalar ve indirimli ürünler burada. Seç, sepete ekle,
              Sapanca içinde kapına gelsin.
            </p>
          </header>

          {/* --- Kampanyalar: aktif kupon kodları (kupon yoksa bölüm gizli) --- */}
          {coupons.length > 0 && (
            <section
              className={styles.campaigns}
              aria-labelledby="kampanyalar-baslik"
            >
              <div className={styles.sectionHead}>
                <span className={styles.sectionIcon} aria-hidden="true">
                  <TicketPercent size={18} strokeWidth={1.9} />
                </span>
                <h2 id="kampanyalar-baslik" className={styles.sectionTitle}>
                  Kampanyalar
                </h2>
              </div>
              <p className={styles.sectionSub}>
                Kodu kopyala, ödeme adımında kupon alanına yapıştır, indirim
                anında düşsün.
              </p>
              <div className={styles.couponGrid}>
                {coupons.map((c) => (
                  <article key={c.code} className={styles.couponCard}>
                    <span className={styles.couponBadge}>
                      {discountLabel(c)}
                    </span>
                    <p className={styles.couponCode}>{c.code}</p>
                    {c.description && (
                      <p className={styles.couponDesc}>{c.description}</p>
                    )}
                    <p className={styles.couponTerms}>{couponTerms(c)}</p>
                    <CopyCodeButton code={c.code} />
                  </article>
                ))}
              </div>
            </section>
          )}

          {/* --- İndirimli ürünler --- */}
          {products.length === 0 ? (
            <section className={styles.empty} role="status">
              <span className={styles.emptyIcon} aria-hidden="true">
                <BadgePercent size={26} strokeWidth={1.8} />
              </span>
              <h2>Şu an indirimli ürün yok, yakında!</h2>
              <p>
                İndirimler eklendikçe burada yayınlanacak. O zamana kadar tüm
                ürünlerimize göz atabilirsin.
              </p>
              <Link href="/urunler" className="btn btn--accent">
                Ürünlere Göz At
              </Link>
            </section>
          ) : (
            <section aria-labelledby="indirimli-baslik">
              <div className={styles.sectionHead}>
                <span className={styles.sectionIcon} aria-hidden="true">
                  <BadgePercent size={18} strokeWidth={1.9} />
                </span>
                <h2 id="indirimli-baslik" className={styles.sectionTitle}>
                  İndirimli Ürünler
                </h2>
                <span className={styles.count}>
                  {products.length} indirimli ürün
                </span>
              </div>
              <div className={styles.grid}>
                {products.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
    </>
  );
}
