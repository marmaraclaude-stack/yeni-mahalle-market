"use client";

// Ana sayfa kategori vitrini — her kart /urunler?k=<slug> linkidir.
// Slug'lar lib/shop/categories.ts SHOP_CATEGORIES ile birebir aynı sırada.
// Mobilde yatay kaydırma + ok kontrolleri; masaüstünde grid (globals.css .cats).

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
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
  Sparkles,
  Pill,
  Utensils,
  ChevronLeft,
  ChevronRight,
  type LucideIcon,
} from "lucide-react";
import { SHOP_CATEGORIES } from "@/lib/shop/categories";

type Cat = { Icon: LucideIcon; label: string; slug: string; t: number };

// Yumuşak pastel paleti [arka plan, ön plan] — kategori grubuna göre.
const TINTS: [string, string][] = [
  ["#eafaf0", "#159b57"], // 0 yeşil
  ["#fdeceb", "#df513c"], // 1 mercan
  ["#fdf4e1", "#cf8910"], // 2 amber
  ["#eaf1fe", "#2f6fed"], // 3 mavi
  ["#e6f7fb", "#0e93a8"], // 4 cam göbeği
  ["#f2ecfd", "#7a52d6"], // 5 mor
  ["#fdebf3", "#d6489b"], // 6 pembe
  ["#e7f6f2", "#11917a"], // 7 deniz yeşili
];

// İkonlar SHOP_CATEGORIES ile aynı sırada — index üzerinden eşlenir.
const ICONS: LucideIcon[] = [
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
];

const CATEGORIES: Cat[] = SHOP_CATEGORIES.map((c, i) => ({
  Icon: ICONS[i],
  label: c.name,
  slug: c.slug,
  t: c.tint,
}));

export default function CategoryGrid() {
  const railRef = useRef<HTMLDivElement>(null);
  const snapTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  const scrollByCol = (dir: 1 | -1) => {
    const el = railRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>(".cat");
    const gap = parseFloat(getComputedStyle(el).columnGap || "10") || 10;
    const step = (card ? card.getBoundingClientRect().width + gap : el.clientWidth / 2) * 2;
    // iOS Safari: kaydırma sırasında snap'i kapat, sonra aç (jank önle)
    el.style.scrollSnapType = "none";
    el.scrollBy({ left: dir * step, behavior: "smooth" });
    if (snapTimer.current) clearTimeout(snapTimer.current);
    snapTimer.current = setTimeout(() => {
      el.style.scrollSnapType = "";
    }, 450);
  };

  useEffect(() => {
    const el = railRef.current;
    if (!el) return;
    const update = () => {
      const max = el.scrollWidth - el.clientWidth;
      setCanPrev(el.scrollLeft > 4);
      setCanNext(el.scrollLeft < max - 4);
    };
    update();
    el.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      el.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <div className="cats__wrap">
      <div ref={railRef} className="cats" role="list">
        {CATEGORIES.map((c) => {
          const [bg, fg] = TINTS[c.t];
          return (
            <Link
              key={c.slug}
              href={`/urunler?k=${c.slug}`}
              className="cat"
              role="listitem"
              style={{ "--cat-bg": bg, "--cat-fg": fg } as React.CSSProperties}
              aria-label={`${c.label} ürünlerini gör`}
            >
              <span className="cat__icon" aria-hidden="true">
                <c.Icon size={24} strokeWidth={1.6} />
              </span>
              <span className="cat__label">{c.label}</span>
            </Link>
          );
        })}
      </div>

      {/* mobil kaydırma kontrolleri — grid'in kenarına yüzer */}
      <div className="cats__nav" aria-hidden="true">
        <button
          type="button"
          className="cats__arrow"
          aria-label="Önceki kategoriler"
          onClick={() => scrollByCol(-1)}
          disabled={!canPrev}
        >
          <ChevronLeft size={18} strokeWidth={2.2} />
        </button>
        <button
          type="button"
          className="cats__arrow"
          aria-label="Sonraki kategoriler"
          onClick={() => scrollByCol(1)}
          disabled={!canNext}
        >
          <ChevronRight size={18} strokeWidth={2.2} />
        </button>
      </div>
    </div>
  );
}
