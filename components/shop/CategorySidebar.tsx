// Sol kategori sidebar'ı — Getir web düzeni, yalnız masaüstünde görünür
// (gizleme shop.module.css .sidebar ile). Link tabanlı (?k=...), sunucu
// komponenti; aktif satır: accent sol çizgi + accent metin + soft zemin.
// Arama terimi (q) kategori değişirken korunur.
// Yalnız ana kategoriler + Keşfet listelenir; alt kategori navigasyonu tek
// kaynaktan, içerik kolonunun üstündeki sekme barından (SubcatTabs) yürür.

import Link from "next/link";
import { LayoutGrid, BadgePercent, Flame } from "lucide-react";
// LayoutGrid: "Tümü" kategori satırının ikonu (Keşfet grubunda "Tüm Ürünler" kaldırıldı).
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

/** Özel görünüm linki (?ozel=...). Arama terimi taşınmaz — ayrı akış. */
function buildOzelHref(key: string): string {
  return `/urunler?ozel=${key}`;
}

/** Özel görünüm ikonları (sabit ikon adları yerine bileşen). */
const SPECIAL_ICONS = {
  indirimli: BadgePercent,
  "cok-satan": Flame,
} as const;

export default function CategorySidebar({
  active,
  q,
  ozel,
}: {
  active?: string;
  q?: string;
  ozel?: string;
}) {
  return (
    <aside className={styles.sidebar} aria-label="Kategoriler">
      {/* Keşfet grubu — tüm ürünler / indirimli / çok satan */}
      <p className={styles.sideTitle}>Keşfet</p>
      <nav className={styles.sideList}>
        {SHOP_SPECIALS.map((s) => {
          const Icon = SPECIAL_ICONS[s.key];
          const isActive = ozel === s.key;
          return (
            <Link
              key={s.key}
              href={buildOzelHref(s.key)}
              className={`${styles.sideLink}${isActive ? ` ${styles.sideLinkActive}` : ""}`}
              aria-current={isActive ? "page" : undefined}
            >
              <span
                className={styles.sideIcon}
                style={{ background: s.tintBg, color: s.tintFg }}
                aria-hidden="true"
              >
                <Icon size={15} strokeWidth={1.9} />
              </span>
              {s.label}
            </Link>
          );
        })}
      </nav>

      <p className={`${styles.sideTitle} ${styles.sideTitleGap}`}>Kategoriler</p>
      <nav className={styles.sideList}>
        <Link
          href={buildHref(null, q)}
          className={`${styles.sideLink}${!active && !ozel ? ` ${styles.sideLinkActive}` : ""}`}
          aria-current={!active && !ozel ? "page" : undefined}
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
