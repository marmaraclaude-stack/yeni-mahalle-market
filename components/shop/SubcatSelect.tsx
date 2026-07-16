"use client";

// Alt kategori seçici — AÇILIR MENÜ (dropdown). Eski yatay pil/sekme barının
// yerini alır. Yatay kaydırma / ok / sticky YOKTUR; bu yüzden sayfa dikey
// kaydırılırken (özellikle iOS/macOS Safari'de) titreme/kayma FİZİKSEL olarak
// imkânsızdır. Her seçenek normal bir filtre linkidir (?alt=slug); aktif seçim
// yalnızca URL'den (activeAlt) belirlenir, kaydırmadan etkilenmez.

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import styles from "@/app/urunler/shop.module.css";

export interface SubTab {
  slug: string;
  name: string;
  count: number;
}

/** Kategori (+ opsiyonel alt kategori) görünümü linki. */
function hrefFor(catSlug: string, subSlug?: string): string {
  const params = new URLSearchParams({ k: catSlug });
  if (subSlug) params.set("alt", subSlug);
  return `/urunler?${params.toString()}`;
}

export default function SubcatSelect({
  catSlug,
  tabs,
  totalCount,
  activeAlt,
}: {
  catSlug: string;
  tabs: SubTab[];
  /** Kategorideki toplam ürün sayısı ("Tümü" sayacı). */
  totalCount: number;
  /** Dolu ise o alt kategori aktif; boşsa "Tümü" aktif. */
  activeAlt?: string;
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
    <div className={styles.subSelect} ref={rootRef}>
      <button
        type="button"
        className={styles.subSelectBtn}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`Alt kategori: ${currentName}`}
        onClick={() => setOpen((v) => !v)}
      >
        <span className={styles.subSelectHint}>Alt kategori</span>
        <span className={styles.subSelectCurrent}>{currentName}</span>
        <span className={styles.subSelectCount}>{currentCount}</span>
        <ChevronDown
          size={18}
          strokeWidth={2.2}
          className={`${styles.subSelectChev}${open ? ` ${styles.subSelectChevOpen}` : ""}`}
          aria-hidden="true"
        />
      </button>

      {open && (
        <div className={styles.subSelectMenu} role="listbox" aria-label="Alt kategoriler">
          {items.map((it) => {
            const on = (it.slug || undefined) === activeAlt;
            return (
              <Link
                key={it.slug || "__all__"}
                href={hrefFor(catSlug, it.slug || undefined)}
                className={`${styles.subSelectItem}${on ? ` ${styles.subSelectItemActive}` : ""}`}
                role="option"
                aria-selected={on}
                scroll={false}
                onClick={() => setOpen(false)}
              >
                <span className={styles.subSelectItemName}>{it.name}</span>
                <span className={styles.subSelectItemCount}>{it.count}</span>
                {on && (
                  <Check
                    size={16}
                    strokeWidth={2.4}
                    className={styles.subSelectItemCheck}
                    aria-hidden="true"
                  />
                )}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
