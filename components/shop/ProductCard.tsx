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
import { productPills, type PillTone } from "@/lib/shop/pills";
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
  Apple, Banana, Cherry, Grape, Salad, Sandwich, Pizza, CakeSlice, Donut,
  Egg, EggFried, Ham, Drumstick, Popcorn, Lollipop, IceCreamBowl, GlassWater,
  Wine, Beer, Martini, UtensilsCrossed, ChefHat, CookingPot, Microwave,
  Refrigerator, Home, Lightbulb, Plug, Battery, Wrench, Hammer, Scissors,
  Paintbrush, WashingMachine, Shirt, Bone, Cat, Dog, Bird, Rabbit, Squirrel,
  Flower2, Leaf, Sprout, TreePine, Tent, Gift, Heart, Star, Package,
  ShoppingBag, ShoppingCart, Store, Truck, Bike, Car, Fuel, Stethoscope,
  Bandage, Thermometer, Waves, Sailboat, Gamepad2, Music, BookOpen, Newspaper,
  Pencil, Brush, Smartphone, Tv, Headphones, Camera, Watch, Key, Lock, MapPin,
  Globe, Recycle, Cigarette,
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
  apple: Apple, banana: Banana, cherry: Cherry, grape: Grape, salad: Salad,
  sandwich: Sandwich, pizza: Pizza, "cake-slice": CakeSlice, donut: Donut,
  egg: Egg, "egg-fried": EggFried, ham: Ham, drumstick: Drumstick,
  popcorn: Popcorn, lollipop: Lollipop, "ice-cream-bowl": IceCreamBowl,
  "glass-water": GlassWater, wine: Wine, beer: Beer, martini: Martini,
  "utensils-crossed": UtensilsCrossed, "chef-hat": ChefHat,
  "cooking-pot": CookingPot, microwave: Microwave, refrigerator: Refrigerator,
  home: Home, lightbulb: Lightbulb, plug: Plug, battery: Battery,
  wrench: Wrench, hammer: Hammer, scissors: Scissors, paintbrush: Paintbrush,
  "washing-machine": WashingMachine, shirt: Shirt, bone: Bone, cat: Cat,
  dog: Dog, bird: Bird, rabbit: Rabbit, squirrel: Squirrel,
  "flower-2": Flower2, leaf: Leaf, sprout: Sprout, "tree-pine": TreePine,
  tent: Tent, gift: Gift, heart: Heart, star: Star, package: Package,
  "shopping-bag": ShoppingBag, "shopping-cart": ShoppingCart, store: Store,
  truck: Truck, bike: Bike, car: Car, fuel: Fuel, stethoscope: Stethoscope,
  bandage: Bandage, thermometer: Thermometer, waves: Waves, sailboat: Sailboat,
  "gamepad-2": Gamepad2, music: Music, "book-open": BookOpen,
  newspaper: Newspaper, pencil: Pencil, brush: Brush, smartphone: Smartphone,
  tv: Tv, headphones: Headphones, camera: Camera, watch: Watch, key: Key,
  lock: Lock, "map-pin": MapPin, globe: Globe, recycle: Recycle,
  cigarette: Cigarette,
  "shopping-basket": ShoppingBasket,
};

/** İkon adını komponente çevirir; bilinmeyen ad → sepet ikonu. */
export function iconFor(name: string): LucideIcon {
  return CATEGORY_ICONS[name] ?? ShoppingBasket;
}

/** Pil tonu → CSS modülü sınıfı (dinamik anahtar yerine açık eşleme). */
const PILL_TONE_CLASS: Record<PillTone, string> = {
  info: styles.badgeInfo,
  fresh: styles.badgeFresh,
  cold: styles.badgeCold,
  alt: styles.badgeAlt,
  accent: styles.badge,
};

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
  // "2.si %X İndirimli" pili: 2'li paket fiyatı tekli fiyatın 2 katından
  // ucuzsa ikinci ürünün indirimi hesaplanır (en az %5 ise gösterilir).
  const pack2 = product.pack_prices?.["2"];
  const packPill = (() => {
    if (!pack2 || product.price <= 0) return null;
    const pct = Math.round(((2 * product.price - pack2) / product.price) * 100);
    return pct >= 5 ? `2.si %${pct} İndirimli` : null;
  })();
  // Yöneticinin seçtiği ürün pilleri. Kart dar olduğu için en fazla 2 tanesi
  // gösterilir (katalog sırasına göre); tamamı ürün detay sayfasında çıkar.
  const pills = productPills(product).slice(0, 2);
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

          {/* Görsel üstü pil yığını: İndirim + 2'li kampanya + marka
             kampanyası + Laktozsuz (Migros dili). */}
          <span className={styles.badgeStack}>
            {product.in_stock && discounted && (
              <span className={styles.badge}>İndirim</span>
            )}
            {product.in_stock && packPill && (
              <span className={`${styles.badge} ${styles.badgeAlt}`}>{packPill}</span>
            )}
            {product.in_stock && product.brand_campaign && (
              <span className={`${styles.badge} ${styles.badgeAlt}`}>
                {product.brand_campaign}
              </span>
            )}
            {pills.map((p) => (
              <span key={p.key} className={`${styles.badge} ${PILL_TONE_CLASS[p.tone]}`}>
                {p.label}
              </span>
            ))}
          </span>
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
