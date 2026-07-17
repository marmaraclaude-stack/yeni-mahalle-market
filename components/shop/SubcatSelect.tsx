"use client";

// Alt kategori seçici — AÇILIR MENÜ (dropdown). Eski yatay pil/sekme barının
// yerini alır. Yatay kaydırma / ok / sticky YOKTUR; bu yüzden sayfa dikey
// kaydırılırken (özellikle iOS/macOS Safari'de) titreme/kayma FİZİKSEL olarak
// imkânsızdır. Her seçenek normal bir filtre linkidir (?alt=slug); aktif seçim
// yalnızca URL'den (activeAlt) belirlenir, kaydırmadan etkilenmez.

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import styles from "@/app/urunler/shop.module.css";

export interface SubTab {
  slug: string;
  name: string;
  count: number;
}

/** Kategori (+ opsiyonel alt kategori) görünümü linki. */
function hrefFor(catSlug: string, subSlug?: string, sirala?: string): string {
  const params = new URLSearchParams({ k: catSlug });
  if (subSlug) params.set("alt", subSlug);
  if (sirala && sirala !== "onerilen") params.set("sirala", sirala);
  return `/urunler?${params.toString()}`;
}

export default function SubcatSelect({
  catSlug,
  tabs,
  totalCount,
  activeAlt,
  sirala,
}: {
  catSlug: string;
  tabs: SubTab[];
  /** Kategorideki toplam ürün sayısı ("Tümü" sayacı). */
  totalCount: number;
  /** Dolu ise o alt kategori aktif; boşsa "Tümü" aktif. */
  activeAlt?: string;
  /** Mevcut sıralama — alt kategori değişince korunur. */
  sirala?: string;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const activeTab = activeAlt
    ? tabs.find((t) => t.slug === activeAlt)
    : undefined;
  const currentName = activeTab?.name ?? "Tümü";
  const currentCount = activeTab?.count ?? totalCount;

  // Dışarı tıklama + Escape ile kapan.
  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const items = [{ slug: "", name: "Tümü", count: totalCount }, ...tabs];

  return (
    <div className={styles.selWrap} ref={rootRef}>
      <button
        type="button"
        className={`${styles.selBtn}${activeAlt ? ` ${styles.selBtnActive}` : ""}`}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`Alt kategori: ${currentName}`}
        onClick={() => setOpen((v) => !v)}
      >
        {/* Tek satır, büyük harf yok: "Alt kategori: Sosis · 24".
           (Büyük harfli başlık 10px'te İ'nin noktasını yutuyordu.) */}
        <span className={styles.selLabel}>Alt kategori:</span>
        <span className={styles.selCurrent}>{currentName}</span>
        <span className={styles.selCount}>{currentCount}</span>
        <ChevronDown
          size={17}
          strokeWidth={2.2}
          className={`${styles.selChev}${open ? ` ${styles.selChevOpen}` : ""}`}
          aria-hidden="true"
        />
      </button>

      {open && (
        <div className={styles.selMenu} role="listbox" aria-label="Alt kategoriler">
          {items.map((it) => {
            const on = (it.slug || undefined) === activeAlt;
            return (
              <Link
                key={it.slug || "__all__"}
                href={hrefFor(catSlug, it.slug || undefined, sirala)}
                className={`${styles.selItem}${on ? ` ${styles.selItemActive}` : ""}`}
                role="option"
                aria-selected={on}
                scroll={false}
                onClick={() => setOpen(false)}
              >
                <span className={styles.selItemName}>{it.name}</span>
                <span className={styles.selItemCount}>{it.count}</span>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
