"use client";

// Kategori pill barı — YALNIZ mobil/tablet (<1024px; gizleme shop.module.css
// .catbar ile, masaüstünde yerini CategorySidebar alır). Sticky (navbar altı),
// yatay kaydırılabilir, scroll-snap. Link tabanlı; aktif pill accent dolgulu.
// Arama terimi (q) kategori değişirken korunur.

import Link from "next/link";
import { useEffect, useRef } from "react";
import { LayoutGrid, BadgePercent, Flame } from "lucide-react";
import { CATEGORY_TINTS, SHOP_CATEGORIES } from "@/lib/shop/categories";
import { SHOP_SPECIALS } from "@/lib/shop/specials";
import { iconFor } from "@/components/shop/ProductCard";
import styles from "@/app/urunler/shop.module.css";

function buildHref(slug: string | null, q?: string): string {
  const params = new URLSearchParams();
  if (slug) params.set("k", slug);
  if (q) params.set("q", q);
  const qs = params.toString();
  return qs ? `/urunler?${qs}` : "/urunler";
}

const SPECIAL_ICONS = {
  tum: LayoutGrid,
  indirimli: BadgePercent,
  "cok-satan": Flame,
} as const;

export default function CategoryRail({
  active,
  q,
  ozel,
}: {
  active?: string;
  q?: string;
  ozel?: string;
}) {
  const railRef = useRef<HTMLElement>(null);

  // Aktif pill ilk yüklemede görünür alana gelsin
  useEffect(() => {
    const el = railRef.current;
    if (!el || !active) return;
    const link = el.querySelector<HTMLElement>('[aria-current="page"]');
    if (!link) return;
    el.scrollTo({ left: Math.max(0, link.offsetLeft - 24) });
  }, [active]);

  return (
    <div className={styles.catbar}>
      <div className="container">
        <nav ref={railRef} className={styles.catRail} aria-label="Kategoriler">
          {SHOP_SPECIALS.map((s) => {
            const Icon = SPECIAL_ICONS[s.key];
            const isActive = ozel === s.key;
            return (
              <Link
                key={s.key}
                href={`/urunler?ozel=${s.key}`}
                className={`${styles.pill}${isActive ? ` ${styles.pillActive}` : ""}`}
                aria-current={isActive ? "page" : undefined}
              >
                <Icon
                  size={15}
                  strokeWidth={1.9}
                  aria-hidden="true"
                  style={isActive ? undefined : { color: s.tintFg }}
                />
                {s.label}
              </Link>
            );
          })}

          <Link
            href={buildHref(null, q)}
            className={`${styles.pill}${!active && !ozel ? ` ${styles.pillActive}` : ""}`}
            aria-current={!active && !ozel ? "page" : undefined}
          >
            Tümü
          </Link>

          {SHOP_CATEGORIES.map((c) => {
            const [, fg] = CATEGORY_TINTS[c.tint] ?? CATEGORY_TINTS[0];
            const Icon = iconFor(c.icon);
            const isActive = active === c.slug;
            return (
              <Link
                key={c.slug}
                href={buildHref(c.slug, q)}
                className={`${styles.pill}${isActive ? ` ${styles.pillActive}` : ""}`}
                aria-current={isActive ? "page" : undefined}
              >
                <Icon
                  size={15}
                  strokeWidth={1.9}
                  aria-hidden="true"
                  style={isActive ? undefined : { color: fg }}
                />
                {c.name}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
