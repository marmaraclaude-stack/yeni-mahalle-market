// Ürün kartı — vitrin. Görsel yoksa kategori tint'li lucide placeholder basar.
// Kebab-case lucide ikon haritası buradan export edilir (CategoryRail de kullanır).

import type { Product } from "@/lib/shop/types";
import { formatTL } from "@/lib/shop/types";
import { CATEGORY_TINTS, categoryBySlug } from "@/lib/shop/categories";
import AddToCartButton from "@/components/shop/AddToCartButton";
import {
  Carrot,
  Beef,
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
  Cigarette,
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
  cigarette: Cigarette,
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

export default function ProductCard({ product }: { product: Product }) {
  const cat = categoryBySlug(product.category_slug);
  const [tintBg, tintFg] = CATEGORY_TINTS[cat?.tint ?? 0] ?? CATEGORY_TINTS[0];
  const Icon = iconFor(cat?.icon ?? "shopping-basket");

  const compareAt = product.compare_at_price;
  const discounted = compareAt !== null && compareAt > product.price;

  return (
    <article className={styles.card}>
      <div
        className={styles.thumb}
        style={
          product.image_url
            ? undefined
            : { background: tintBg, color: tintFg }
        }
      >
        {product.image_url ? (
          <img src={product.image_url} alt={product.name} loading="lazy" />
        ) : (
          <Icon size={42} strokeWidth={1.4} aria-hidden="true" />
        )}

        {discounted && <span className={styles.badge}>İndirim</span>}
        {!discounted && product.is_featured && (
          <span className={`${styles.badge} ${styles.badgeFeatured}`}>
            Popüler
          </span>
        )}
        {!product.in_stock && (
          <span className={styles.badgeOut}>Stokta yok</span>
        )}
      </div>

      <div className={styles.cardBody}>
        {(product.brand || product.size_text) && (
          <p className={styles.meta}>
            {product.brand}
            {product.brand && product.size_text ? " · " : ""}
            {product.size_text}
          </p>
        )}
        <h3 className={styles.name}>{product.name}</h3>
        <p className={styles.priceRow}>
          <span className={styles.price}>{formatTL(product.price)}</span>
          {discounted && (
            <s className={styles.compare}>{formatTL(compareAt)}</s>
          )}
          {product.unit !== "adet" && (
            <span className={styles.unit}>/ {product.unit}</span>
          )}
        </p>
      </div>

      <AddToCartButton product={product} />
    </article>
  );
}
