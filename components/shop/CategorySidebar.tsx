// Sol kategori sidebar'ı — Getir web düzeni, yalnız masaüstünde görünür
// (gizleme shop.module.css .sidebar ile). Link tabanlı (?k=...), sunucu
// komponenti; aktif satır: accent sol çizgi + accent metin + soft zemin.
// Arama terimi (q) kategori değişirken korunur.

import Link from "next/link";
import { LayoutGrid } from "lucide-react";
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

export default function CategorySidebar({
  active,
  q,
}: {
  active?: string;
  q?: string;
}) {
  return (
    <aside className={styles.sidebar} aria-label="Kategoriler">
      <p className={styles.sideTitle}>Kategoriler</p>
      <nav className={styles.sideList}>
        <Link
          href={buildHref(null, q)}
          className={`${styles.sideLink}${!active ? ` ${styles.sideLinkActive}` : ""}`}
          aria-current={!active ? "page" : undefined}
        >
          <span
            className={styles.sideIcon}
            style={{ background: "var(--accent-soft)", color: "var(--accent)" }}
            aria-hidden="true"
          >
            <LayoutGrid size={15} strokeWidth={1.9} />
          </span>
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
              className={`${styles.sideLink}${isActive ? ` ${styles.sideLinkActive}` : ""}`}
              aria-current={isActive ? "page" : undefined}
            >
              <span
                className={styles.sideIcon}
                style={{ background: bg, color: fg }}
                aria-hidden="true"
              >
                <Icon size={15} strokeWidth={1.9} />
              </span>
              {c.name}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
