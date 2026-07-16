// Sol kategori sidebar'ı, Getir web düzeni, yalnız masaüstünde görünür
// (gizleme shop.module.css .sidebar ile). Link tabanlı (?k=...), sunucu
// komponenti; aktif satır: accent sol çizgi + accent metin + soft zemin.
// Arama terimi (q) kategori değişirken korunur.
// Aktif kategorinin altında alt kategorileri (subcatsFor) girintili link
// listesi olarak AÇILIR (accordion mantığı: aktif kategori = açık kategori,
// ekstra JS gerekmez). Alt linkler üstteki SubcatTabs ile aynı ?alt= URL'ini
// kullanır; ikisi tutarlı çalışır. Aktif alt kategori (?alt=) vurgulanır.

import { Fragment } from "react";
import Link from "next/link";
import { LayoutGrid, BadgePercent, Flame } from "lucide-react";
// LayoutGrid: "Tümü" kategori satırının ikonu (Keşfet grubunda "Tüm Ürünler" kaldırıldı).
import { CATEGORY_TINTS, SHOP_CATEGORIES } from "@/lib/shop/categories";
import { subcatsFor } from "@/lib/shop/subcategories";
import { SHOP_SPECIALS } from "@/lib/shop/specials";
import { iconFor } from "@/components/shop/ProductCard";
import styles from "@/app/urunler/shop.module.css";

function buildHref(slug: string | null, q?: string, alt?: string): string {
  const params = new URLSearchParams();
  if (slug) params.set("k", slug);
  if (alt) params.set("alt", alt);
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
  alt,
  hiddenCats,
  hiddenSubs,
}: {
  active?: string;
  q?: string;
  ozel?: string;
  /** Aktif alt kategori slug'ı (?alt=...); yalnız aktif kategoride vurgu. */
  alt?: string;
  /** Admin'den pasifleştirilen kategori slug'ları — listede gizlenir. */
  hiddenCats?: string[];
  /** Gizlenen alt kategoriler — "kategori/alt" anahtarları. */
  hiddenSubs?: string[];
}) {
  const cats = hiddenCats?.length
    ? SHOP_CATEGORIES.filter((c) => !hiddenCats.includes(c.slug))
    : SHOP_CATEGORIES;
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

        {cats.map((c) => {
          const [bg, fg] = CATEGORY_TINTS[c.tint] ?? CATEGORY_TINTS[0];
          const Icon = iconFor(c.icon);
          const isActive = active === c.slug;
          // Accordion: alt kategoriler YALNIZ aktif kategorinin altında açılır
          // (aktif kategori = açık kategori; başka kategori açmak isteyen ona
          // tıklayınca gider ve orada açılır). Arama/özel görünümde alt UI yok.
          const subs = (isActive && !q && !ozel ? subcatsFor(c.slug) : []).filter(
            (s) => !hiddenSubs?.includes(`${c.slug}/${s.slug}`),
          );
          return (
            <Fragment key={c.slug}>
              <Link
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
              {subs.length > 0 && (
                <div className={styles.sideSubList}>
                  {/* "Tümü" ilk sırada; ?alt= yoksa vurgulu */}
                  <Link
                    href={buildHref(c.slug, q)}
                    className={`${styles.sideSubLink}${!alt ? ` ${styles.sideSubLinkActive}` : ""}`}
                    aria-current={!alt ? "page" : undefined}
                  >
                    Tümü
                  </Link>
                  {subs.map((s) => {
                    const on = alt === s.slug;
                    return (
                      <Link
                        key={s.slug}
                        href={buildHref(c.slug, q, s.slug)}
                        className={`${styles.sideSubLink}${on ? ` ${styles.sideSubLinkActive}` : ""}`}
                        aria-current={on ? "page" : undefined}
                      >
                        {s.name}
                      </Link>
                    );
                  })}
                </div>
              )}
            </Fragment>
          );
        })}
      </nav>
    </aside>
  );
}
