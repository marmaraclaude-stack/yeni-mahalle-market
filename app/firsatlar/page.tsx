// Fırsatlar — /firsatlar. Tam genişlik kampanya sayfası. Sayfa ritmi:
// (1) İndirimli Ürünler gridi — sayfanın mutlak en üstünde, güçlü başlıkla,
// (2) PromoBanners (catalog variant) fırsat banner'ları, (3) Kampanyalar
// (sade premium kupon kartları: net kod, belirgin indirim değeri, koşul,
// "Kodu Kopyala") + "Nasıl kullanılır" şeridi.
// Üst başlık şeridi ve özet çipleri kaldırıldı; sayfa doğrudan indirimli
// ürünlerle açılır. Kupon verisi service-role ile okunur (vitrine yalnız
// gösterime gereken alanlar iner). İndirimli ürünler: compare_at_price dolu ve
// fiyattan büyük aktif ürünler, en yüksek indirim oranı önce. DB hazır değilse
// veya fırsat yoksa ilgili bölüm zarifçe gizlenir / boş durum gösterilir.

import type { Metadata } from "next";
import Link from "next/link";
import {
  BadgePercent,
  ClipboardCheck,
  Clock,
  Copy,
  Sparkles,
  TicketPercent,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { formatTL } from "@/lib/shop/types";
import type { Coupon, Product } from "@/lib/shop/types";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import PromoBanners from "@/components/shop/PromoBanners";
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

/** Kupon kartındaki büyük değer: "%10" / "₺200" (kuruş varsa "₺49,90"). */
function bigDiscountValue(c: CampaignCoupon): string {
  if (c.discount_type === "percent") return `%${c.value}`;
  const amount = new Intl.NumberFormat("tr-TR", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(c.value);
  return `₺${amount}`;
}

/** Koşul satırı: "₺750,00 üzeri siparişlerde · Son gün: 15 Temmuz 2026 · Hesap başına 1 kez" */
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
          {/* --- İndirimli ürünler: sayfanın mutlak en üstünde, tam genişlik grid --- */}
          {products.length === 0 ? (
            <section className={styles.section} role="status">
              <div className={styles.sectionHead}>
                <span className={styles.sectionIcon} aria-hidden="true">
                  <BadgePercent size={19} strokeWidth={1.9} />
                </span>
                <h1 className={`${styles.sectionTitle} ${styles.sectionTitleLead}`}>
                  İndirimli Ürünler
                </h1>
              </div>
              <div className={styles.empty}>
                <span className={styles.emptyIcon} aria-hidden="true">
                  <BadgePercent size={28} strokeWidth={1.8} />
                </span>
                <h2>Şu an indirimli ürün yok, yakında!</h2>
                <p>
                  İndirimler eklendikçe burada yayınlanacak. O zamana kadar tüm
                  ürünlerimize göz atabilirsin.
                </p>
                <Link href="/urunler" className="btn btn--accent">
                  Ürünlere Göz At
                </Link>
              </div>
            </section>
          ) : (
            <section
              className={styles.section}
              aria-labelledby="indirimli-baslik"
            >
              <div className={styles.sectionHead}>
                <span className={styles.sectionIcon} aria-hidden="true">
                  <BadgePercent size={19} strokeWidth={1.9} />
                </span>
                <h1
                  id="indirimli-baslik"
                  className={`${styles.sectionTitle} ${styles.sectionTitleLead}`}
                >
                  İndirimli Ürünler
                </h1>
                <span className={styles.count}>
                  {products.length} indirimli ürün
                </span>
              </div>
              <p className={styles.sectionSub}>
                Fiyatı düşen ürünler, en yüksek indirim önce. Stok bitmeden
                sepetine ekle.
              </p>
              <div className={styles.grid}>
                {products.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </section>
          )}

          {/* --- Fırsat banner'ları (catalog variant; banner yoksa null) --- */}
          <div className={styles.banners}>
            <PromoBanners variant="catalog" />
          </div>

          {/* --- Kampanyalar: sade premium kupon kartları (kupon yoksa gizli) --- */}
          {coupons.length > 0 && (
            <section
              className={styles.section}
              aria-labelledby="kampanyalar-baslik"
            >
              <div className={styles.sectionHead}>
                <span className={styles.sectionIcon} aria-hidden="true">
                  <TicketPercent size={19} strokeWidth={1.9} />
                </span>
                <h2 id="kampanyalar-baslik" className={styles.sectionTitle}>
                  Kampanyalar
                </h2>
                <span className={styles.count}>
                  {coupons.length} aktif kupon
                </span>
              </div>
              <p className={styles.sectionSub}>
                Kodu kopyala, ödeme adımında kupon alanına yapıştır, indirim
                anında düşsün.
              </p>

              <div className={styles.coupons}>
                {coupons.map((c) => (
                  <article key={c.code} className={styles.coupon}>
                    {/* Üst bölge: rozet + belirgin indirim değeri + açıklama */}
                    <div className={styles.couponTop}>
                      <span className={styles.couponBadge}>
                        <TicketPercent
                          size={13}
                          strokeWidth={2}
                          aria-hidden="true"
                        />
                        İndirim Kuponu
                      </span>
                      <span className={styles.couponValueWrap}>
                        <span className={styles.couponBig}>
                          {bigDiscountValue(c)}
                        </span>
                        <span className={styles.couponValueLabel}>
                          {c.discount_type === "percent"
                            ? "anında indirim"
                            : "sepet indirimi"}
                        </span>
                      </span>
                      {c.description && (
                        <p className={styles.couponDesc}>{c.description}</p>
                      )}
                    </div>

                    {/* Perforasyon ayracı — bilet hissi (kenarlara oyulmuş çentik) */}
                    <div className={styles.couponPerf} aria-hidden="true" />

                    {/* Alt bölge: tıkla-kopyala kod, koşul, "Kodu Kopyala" */}
                    <div className={styles.couponBottom}>
                      {/* Net kod — tıklayınca da kopyalar */}
                      <CopyCodeButton code={c.code} variant="code" />

                      {/* Koşul satırı */}
                      <p className={styles.couponTerms}>
                        <Clock size={14} strokeWidth={2} aria-hidden="true" />
                        {couponTerms(c)}
                      </p>

                      {/* Kopyala aksiyonu — alta yaslı, tam genişlik */}
                      <div className={styles.couponAction}>
                        <CopyCodeButton code={c.code} />
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              {/* Nasıl kullanılır — 3 adımlı ikonlu mini şerit */}
              <div className={styles.howto}>
                <p className={styles.howHead}>Kupon nasıl kullanılır?</p>
                <div className={styles.howSteps}>
                  <div className={styles.step}>
                    <span className={styles.stepNum} aria-hidden="true">
                      1
                    </span>
                    <span className={styles.stepText}>
                      <span className={styles.stepTitle}>
                        <Copy size={16} strokeWidth={2} aria-hidden="true" />
                        Kodu kopyala
                      </span>
                      <span className={styles.stepDesc}>
                        Kupon kartındaki koda dokun, panoya kopyalansın.
                      </span>
                    </span>
                  </div>
                  <div className={styles.step}>
                    <span className={styles.stepNum} aria-hidden="true">
                      2
                    </span>
                    <span className={styles.stepText}>
                      <span className={styles.stepTitle}>
                        <ClipboardCheck
                          size={16}
                          strokeWidth={2}
                          aria-hidden="true"
                        />
                        Ödemede yapıştır
                      </span>
                      <span className={styles.stepDesc}>
                        Sepet ödeme adımındaki kupon alanına kodu yapıştır.
                      </span>
                    </span>
                  </div>
                  <div className={styles.step}>
                    <span className={styles.stepNum} aria-hidden="true">
                      3
                    </span>
                    <span className={styles.stepText}>
                      <span className={styles.stepTitle}>
                        <Sparkles size={16} strokeWidth={2} aria-hidden="true" />
                        İndirim düşer
                      </span>
                      <span className={styles.stepDesc}>
                        Tutar anında güncellenir, indirimli fiyatı ödersin.
                      </span>
                    </span>
                  </div>
                </div>
              </div>
            </section>
          )}

        </div>
      </main>
      <SiteFooter />
    </>
  );
}
