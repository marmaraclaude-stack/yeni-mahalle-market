// Ürün kartı — Getir kart dili. Üstte kare görsel alanı (görsel yoksa kategori
// tint'li lucide placeholder), sağ üst köşede kare-yuvarlak "+" sepete ekle
// butonu (Link'in DIŞINDA — tıklaması navigasyonu tetiklemez), altta fiyat
// (accent bold; indirimde eski fiyat üstü çizili solda), ad (2 satır clamp,
// normal ağırlık), gramaj (gri, küçük).
// variant: "grid" (esnek genişlik, varsayılan) | "rail" (sabit ~168px, scroll-snap).
// Kebab-case lucide ikon haritası buradan export edilir (CategoryRail de kullanır).

import { createElement } from "react";
import Link from "next/link";
import type { Product } from "@/lib/shop/types";
import {
  computeLineTotal,
  formatTL,
  isWeightBased,
  showsPackPrice,
  unitPriceLabel,
  weightMinFor,
} from "@/lib/shop/types";
import { CATEGORY_TINTS, categoryBySlug } from "@/lib/shop/categories";
import AddToCartButton from "@/components/shop/AddToCartButton";
import {
  Carrot,
  Beef,
  Fish,
  Croissant,
  Milk,
  CupSoda,
  Wheat,
  Soup,
  Droplets,
  Cookie,
  Nut,
  Candy,
  Coffee,
  IceCreamCone,
  Snowflake,
  Citrus,
  SprayCan,
  ScrollText,
  Sparkles,
  Pill,
  Utensils,
  Baby,
  PawPrint,
  Lamp,
  Flame,
  FlameKindling,
  BatteryCharging,
  Umbrella,
  Sun,
  LifeBuoy,
  Bug,
  ShoppingBasket,
  type LucideIcon,
} from "lucide-react";
import styles from "@/app/urunler/shop.module.css";

/** lucide kebab-case ikon adı → komponent (lib/shop/categories.ts'teki adlar). */
const CATEGORY_ICONS: Record<string, LucideIcon> = {
  carrot: Carrot,
  beef: Beef,
  fish: Fish,
  croissant: Croissant,
  milk: Milk,
  "cup-soda": CupSoda,
  wheat: Wheat,
  soup: Soup,
  droplets: Droplets,
  cookie: Cookie,
  nut: Nut,
  candy: Candy,
  coffee: Coffee,
  "ice-cream-cone": IceCreamCone,
  snowflake: Snowflake,
  citrus: Citrus,
  "spray-can": SprayCan,
  "scroll-text": ScrollText,
  sparkles: Sparkles,
  pill: Pill,
  utensils: Utensils,
  baby: Baby,
  "paw-print": PawPrint,
  lamp: Lamp,
  flame: Flame,
  "flame-kindling": FlameKindling,
  "battery-charging": BatteryCharging,
  umbrella: Umbrella,
  sun: Sun,
  "life-buoy": LifeBuoy,
  bug: Bug,
  "shopping-basket": ShoppingBasket,
};

/** İkon adını komponente çevirir; bilinmeyen ad → sepet ikonu. */
export function iconFor(name: string): LucideIcon {
  return CATEGORY_ICONS[name] ?? ShoppingBasket;
}

export default function ProductCard({
  product,
  variant = "grid",
}: {
  product: Product;
  variant?: "grid" | "rail";
}) {
  const cat = categoryBySlug(product.category_slug);
  const [tintBg, tintFg] = CATEGORY_TINTS[cat?.tint ?? 0] ?? CATEGORY_TINTS[0];

  const compareAt = product.compare_at_price;
  const discounted = compareAt !== null && compareAt > product.price;
  const byWeight = isWeightBased(product);
  const weightMin = weightMinFor(product);
  // Yalnız birimi "gram" olan ürünlerde kartta EN AZ miktarın fiyatı gösterilir
  // (ör. 125 g → ₺200), altında kg bilgisi. Diğerlerinde ürünün kendi fiyatı.
  const packMode = showsPackPrice(product);
  const displayPrice = packMode
    ? computeLineTotal(product.price, weightMin, true)
    : product.price;
  const displayCompare =
    packMode && compareAt !== null
      ? computeLineTotal(compareAt, weightMin, true)
      : compareAt;
  // Fiyatın altındaki gri birim bilgisi. Ağırlıkta kg fiyatı, adet ürünlerde
  // "₺X / adet", diğer paketlerde size_text'ten hesaplanır.
  const perUnit = byWeight
    ? `${formatTL(product.price)} / kg`
    : product.unit === "adet"
      ? `${formatTL(product.price)} / adet`
      : unitPriceLabel(product);
  const meta = [product.brand, product.size_text]
    .filter(Boolean)
    .join(" · ");

  return (
    <article
      className={`${styles.card}${variant === "rail" ? ` ${styles.cardRail}` : ""}`}
    >
      {/* Kartın tamamı ürün detayına götürür; "+" butonu linkin dışında */}
      <Link href={`/urunler/${product.slug}`} className={styles.cardLink}>
        <div
          className={`${styles.thumb}${!product.in_stock ? ` ${styles.thumbOut}` : ""}`}
          style={
            product.image_url
              ? undefined
              : { background: tintBg, color: tintFg }
          }
        >
          {product.image_url ? (
            <img src={product.image_url} alt={product.name} loading="lazy" />
          ) : (
            createElement(iconFor(cat?.icon ?? "shopping-basket"), {
              size: 40,
              strokeWidth: 1.4,
              "aria-hidden": true,
            })
          )}

          {product.in_stock && discounted && (
            <span className={styles.badge}>İndirim</span>
          )}
        </div>

        <div className={styles.cardBody}>
          <p className={styles.priceRow}>
            {discounted && displayCompare !== null && (
              <s className={styles.compare}>{formatTL(displayCompare)}</s>
            )}
            <span className={styles.price}>{formatTL(displayPrice)}</span>
            {/* kg/gram ürünlerde /kg alttaki gri satırda; burada yalnız paket vb. */}
            {!byWeight &&
              product.unit !== "adet" &&
              product.unit !== "gram" && (
                <span className={styles.unit}>/ {product.unit}</span>
              )}
          </p>
          {/* perUnit her kartta alan ayırır (boşsa da) — kartlar aynı yükseklik */}
          <p className={styles.perUnit}>{perUnit || " "}</p>
          <h3 className={styles.name}>{product.name}</h3>
          <p className={styles.size}>{meta || " "}</p>
        </div>
      </Link>

      <AddToCartButton product={product} />
    </article>
  );
}
