// Kampanya banner'ları — Getir/Trendyol kalıbı. Server komponent.
// İKİ KAYNAK birleştirilir:
//  1) Aktif KUPONLAR (coupons tablosu, service-role) → her kupon bir banner'a
//     dönüşür. Böylece Fırsatlar'daki tüm kampanyalar otomatik banner olur ve
//     yeni kupon eklenince banner'lar KENDİLİĞİNDEN güncellenir (senkron kalır).
//  2) banners tablosundaki bilgi/kategori banner'ları (anon client). Kupon
//     banner'ları üretildiyse, tablodaki ESKİ /firsatlar kampanya banner'ları
//     (bayat/tekrar) elenir; yalnız bilgi ve kategori banner'ları kalır.
// Hiç banner yoksa null döner (site patlamaz).
// variant: "home" → section + container kabuğu; "catalog" → kabuksuz blok.

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { formatTL } from "@/lib/shop/types";
import type { Banner, Coupon } from "@/lib/shop/types";
import BannerCarousel from "@/components/shop/BannerCarousel";
import styles from "@/components/shop/PromoBanners.module.css";

// Kupon banner'ları için dönüşümlü zemin tint'leri (CATEGORY_TINTS index).
const COUPON_TINTS = [1, 5, 7, 2, 4, 6];

/** Kupon indirim değeri: "%10" / "₺200" (kuruş varsa "₺49,90"). */
function couponDiscountValue(
  c: Pick<Coupon, "discount_type" | "value">,
): string {
  if (c.discount_type === "percent") return `%${c.value}`;
  const amount = new Intl.NumberFormat("tr-TR", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(c.value);
  return `₺${amount}`;
}

/**
 * Aktif kuponları banner'a çevir. coupons tablosunu yalnız service-role
 * okuyabildiği için createAdminClient (server component). Süresi geçmiş ya da
 * kullanım limiti dolmuş kuponlar elenir. Hata/env yoksa boş dizi döner.
 */
async function getCouponBanners(): Promise<Banner[]> {
  try {
    const admin = createAdminClient();
    const nowIso = new Date().toISOString();
    const { data, error } = await admin
      .from("coupons")
      .select(
        "code, description, discount_type, value, min_order_total, expires_at, max_uses, used_count",
      )
      .eq("is_active", true)
      .or(`expires_at.is.null,expires_at.gt.${nowIso}`)
      .order("created_at", { ascending: false });

    if (error) return [];

    type Row = Pick<
      Coupon,
      | "code"
      | "discount_type"
      | "value"
      | "min_order_total"
      | "max_uses"
      | "used_count"
    >;

    return ((data ?? []) as Row[])
      // PostgREST iki kolonu karşılaştıramaz — limit dolmamış süzgeci burada
      .filter((c) => c.max_uses === null || c.used_count < c.max_uses)
      .map((c, i) => {
        const val = couponDiscountValue(c);
        const cond =
          c.min_order_total > 0
            ? `${formatTL(c.min_order_total)} ve üzeri siparişlerde geçerli.`
            : "Tüm siparişlerinde geçerli.";
        return {
          id: `coupon-${c.code}`,
          title: `${val} indirim · ${c.code}`,
          subtitle: `"${c.code}" kodunu ödeme adımında kullan. ${cond}`,
          cta_text: "",
          cta_href: "/firsatlar",
          icon: "ticket",
          tint: COUPON_TINTS[i % COUPON_TINTS.length],
          is_active: true,
          sort: i,
          created_at: "",
        } satisfies Banner;
      });
  } catch {
    return [];
  }
}

/** banners tablosundaki bilgi/kategori banner'ları (anon client). */
async function getTableBanners(): Promise<Banner[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("banners")
      .select("*")
      .eq("is_active", true)
      .order("sort", { ascending: true })
      .order("created_at", { ascending: true });

    if (error) return [];
    return (data ?? []) as Banner[];
  } catch {
    return [];
  }
}

export default async function PromoBanners({
  variant = "catalog",
}: {
  variant?: "home" | "catalog";
}) {
  const [couponBanners, tableBanners] = await Promise.all([
    getCouponBanners(),
    getTableBanners(),
  ]);

  // Kupon banner'ları varsa, tablodaki ESKİ /firsatlar kampanya banner'larını
  // ele (gerçek kuponlar onların yerini alır); bilgi/kategori banner'ları kalır.
  const infoBanners =
    couponBanners.length > 0
      ? tableBanners.filter((b) => !b.cta_href.startsWith("/firsatlar"))
      : tableBanners;

  const banners = [...couponBanners, ...infoBanners];

  if (banners.length === 0) return null;

  if (variant === "home") {
    // Ana sayfa: hero stat kartları ile banner arasındaki ritmi dengeler
    // (homeSection). homeWrap her ölçüde global .container gibi davranır.
    return (
      <section className={styles.homeSection} aria-label="Kampanyalar">
        <div className={styles.homeWrap}>
          <BannerCarousel banners={banners} variant="home" />
        </div>
      </section>
    );
  }

  return (
    <div className={styles.catalogWrap}>
      <BannerCarousel banners={banners} variant="catalog" />
    </div>
  );
}
