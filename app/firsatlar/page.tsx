// Fırsatlar — /firsatlar. Üstte "Kampanyalar": aktif kupon kodları full-width
// yatay kampanya biletleri olarak (service-role ile okunur, vitrine yalnız
// gösterime gereken alanlar iner). Altta "İndirimli Ürünler": compare_at_price
// dolu ve fiyattan büyük olan aktif ürünler, en yüksek indirim oranı önce.
// En altta ince bilgi şeridi. DB hazır değilse veya fırsat yoksa zarif boş
// durum gösterilir.

import type { Metadata } from "next";
import Link from "next/link";
import { BadgePercent, Info, TicketPercent } from "lucide-react";
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

/** Bilet sol bloğundaki büyük değer: "%10" / "₺200" (kuruş varsa "₺49,90"). */
function bigDiscountValue(c: CampaignCoupon): string {
  if (c.discount_type === "percent") return `%${c.value}`;
  const amount = new Intl.NumberFormat("tr-TR", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(c.value);
  return `₺${amount}`;
}

/** Koşul satırı: "₺750,00 üzeri · Son gün: 15 Temmuz 2026 · Hesap başına 1 kez" */
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
  if (parts.length === 0) parts.push("Tüm siparişlerde geçerli");
  parts.push("Hesap başına 1 kez");
  return parts.join(" · ");
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
              <div className={styles.tickets}>
                {coupons.map((c) => (
                  <article key={c.code} className={styles.ticket}>
                    {/* Sol: accent renk bloğu, büyük indirim değeri */}
                    <div className={styles.ticketValue}>
                      <span className={styles.valueBig}>
                        {bigDiscountValue(c)}
                      </span>
                      <span className={styles.valueLabel}>İNDİRİM</span>
                    </div>
                    {/* Orta: büyük mono kod (tıklayınca kopyalar) + açıklama + koşullar */}
                    <div className={styles.ticketBody}>
                      <CopyCodeButton code={c.code} variant="code" />
                      {c.description && (
                        <p className={styles.couponDesc}>{c.description}</p>
                      )}
                      <p className={styles.couponTerms}>{couponTerms(c)}</p>
                    </div>
                    {/* Sağ: dikey buton grubu */}
                    <div className={styles.ticketActions}>
                      <CopyCodeButton code={c.code} />
                      <Link
                        href="/urunler"
                        className={`btn btn--ghost ${styles.ticketGhost}`}
                      >
                        Alışverişe Başla
                      </Link>
                    </div>
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

          {/* --- İnce bilgi şeridi (kupon varken anlamlı) --- */}
          {coupons.length > 0 && (
            <aside className={styles.infoStrip}>
              <Info size={15} strokeWidth={2} aria-hidden="true" />
              <p>
                Kuponlar ödeme adımındaki kupon alanına yapıştırılır · Her
                kupon hesap başına 1 kez kullanılabilir
              </p>
            </aside>
          )}
        </div>
      </main>
    </>
  );
}
