// Yatay kategori chip raili — link tabanlı; aktif kategori kendi tint
// rengiyle vurgulanır. Arama terimi (q) kategori değişirken korunur.

import Link from "next/link";
import type { CSSProperties } from "react";
import { CATEGORY_TINTS, SHOP_CATEGORIES } from "@/lib/shop/categories";
import { iconFor } from "@/components/shop/ProductCard";
import styles from "@/app/urunler/shop.module.css";

function buildHref(slug: string | null, q?: string): string {
  const params = new URLSearchParams();
  if (slug) params.set("k", slug);
  if (q) params.set("q", q);
  const qs = params.toString();
  return qs ? `/urunler?${qs}` : "/urunler";
}

export default function CategoryRail({
  active,
  q,
}: {
  active?: string;
  q?: string;
}) {
  return (
    <nav className={styles.rail} aria-label="Kategoriler">
      <Link
        href={buildHref(null, q)}
        className={`${styles.chip}${!active ? ` ${styles.chipActive}` : ""}`}
        aria-current={!active ? "page" : undefined}
        style={
          {
            "--chip-bg": "var(--gray-100)",
            "--chip-fg": "var(--ink)",
          } as CSSProperties
        }
      >
        Tümü
      </Link>

      {SHOP_CATEGORIES.map((c) => {
        const [bg, fg] = CATEGORY_TINTS[c.tint] ?? CATEGORY_TINTS[0];
        const Icon = iconFor(c.icon);
        const isActive = active === c.slug;
        return (
          <Link
            key={c.slug}
            href={buildHref(c.slug, q)}
            className={`${styles.chip}${isActive ? ` ${styles.chipActive}` : ""}`}
            aria-current={isActive ? "page" : undefined}
            style={{ "--chip-bg": bg, "--chip-fg": fg } as CSSProperties}
          >
            <Icon size={15} strokeWidth={1.8} aria-hidden="true" />
            {c.name}
          </Link>
        );
      })}
    </nav>
  );
}
