"use client";

// Kategori barı — YALNIZ mobil/tablet (<1024px; masaüstünde CategorySidebar).
// İKİ katman:
//  1) Sticky bar: başta koyu "Kategoriler" butonu + yatay kaydırılabilir
//     pill raili (özel görünümler + Tümü + kategoriler).
//  2) "Kategoriler" butonu ALT SAYFA (bottom sheet) açar: tüm kategoriler
//     tint renkli ikon karolarıyla 3 sütunlu ızgarada; tek dokunuşla erişim.
//     Kaydırma derdi yok — asıl işlevsellik burada.
// Link tabanlı; arama terimi (q) kategori değişirken korunur.

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { BadgePercent, Flame, LayoutGrid, X } from "lucide-react";
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
  const [sheet, setSheet] = useState(false);

  // Aktif pill ilk yüklemede görünür alana gelsin
  useEffect(() => {
    const el = railRef.current;
    if (!el || !active) return;
    const link = el.querySelector<HTMLElement>('[aria-current="page"]');
    if (!link) return;
    el.scrollTo({ left: Math.max(0, link.offsetLeft - 24) });
  }, [active]);

  // Alt sayfa açıkken arka plan kaymasın
  useEffect(() => {
    if (!sheet) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [sheet]);

  const close = () => setSheet(false);

  return (
    <div className={styles.catbar}>
      <div className="container">
        <nav ref={railRef} className={styles.catRail} aria-label="Kategoriler">
          {/* Tüm kategorilere tek dokunuş: alt sayfa tetikleyici */}
          <button
            type="button"
            className={styles.catAllBtn}
            onClick={() => setSheet(true)}
            aria-haspopup="dialog"
            aria-expanded={sheet}
          >
            <LayoutGrid size={15} strokeWidth={2.1} aria-hidden="true" />
            Kategoriler
          </button>

          <Link
            href={buildHref(null, q)}
            className={`${styles.pill}${!active && !ozel ? ` ${styles.pillActive}` : ""}`}
            aria-current={!active && !ozel ? "page" : undefined}
          >
            Tümü
          </Link>

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

      {/* Alt sayfa: tüm kategoriler ızgarası */}
      {sheet && (
        <div
          className={styles.sheetWrap}
          role="dialog"
          aria-modal="true"
          aria-label="Tüm kategoriler"
        >
          <button
            type="button"
            className={styles.sheetBackdrop}
            aria-label="Kapat"
            onClick={close}
          />
          <div className={styles.sheet}>
            <div className={styles.sheetHead}>
              <span className={styles.sheetTitle}>Kategoriler</span>
              <button
                type="button"
                className={styles.sheetClose}
                onClick={close}
                aria-label="Kapat"
              >
                <X size={19} strokeWidth={2.2} aria-hidden="true" />
              </button>
            </div>

            {/* Özel görünümler + Tümü */}
            <div className={styles.sheetSpecials}>
              <Link
                href={buildHref(null, q)}
                onClick={close}
                className={`${styles.pill}${!active && !ozel ? ` ${styles.pillActive}` : ""}`}
              >
                Tümü
              </Link>
              {SHOP_SPECIALS.map((s) => {
                const Icon = SPECIAL_ICONS[s.key];
                const isActive = ozel === s.key;
                return (
                  <Link
                    key={s.key}
                    href={`/urunler?ozel=${s.key}`}
                    onClick={close}
                    className={`${styles.pill}${isActive ? ` ${styles.pillActive}` : ""}`}
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
            </div>

            <div className={styles.sheetGrid}>
              {SHOP_CATEGORIES.map((c) => {
                const [bg, fg] = CATEGORY_TINTS[c.tint] ?? CATEGORY_TINTS[0];
                const Icon = iconFor(c.icon);
                const isActive = active === c.slug;
                return (
                  <Link
                    key={c.slug}
                    href={buildHref(c.slug, q)}
                    onClick={close}
                    className={`${styles.sheetItem}${
                      isActive ? ` ${styles.sheetItemActive}` : ""
                    }`}
                    aria-current={isActive ? "page" : undefined}
                  >
                    <span
                      className={styles.sheetIcon}
                      style={{ background: bg, color: fg }}
                      aria-hidden="true"
                    >
                      <Icon size={19} strokeWidth={1.9} />
                    </span>
                    <span className={styles.sheetName}>{c.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
