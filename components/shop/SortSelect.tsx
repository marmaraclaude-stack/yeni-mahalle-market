"use client";

// Sıralama seçici — SubcatSelect ile aynı açılır menü dili. Her seçenek
// normal bir link (?sirala=). Sunucu, ürünleri bu parametreye göre dizer;
// istemci durumu yalnız menünün açık/kapalı hâlidir. Sticky/kaydırma yok.

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  ArrowDown01,
  ArrowUp01,
  ChevronDown,
  Flame,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import styles from "@/app/urunler/shop.module.css";
import { SORT_OPTIONS, type SortKey } from "@/lib/shop/sorting";

const OPTION_ICONS: Record<SortKey, LucideIcon> = {
  onerilen: Sparkles,
  "cok-satan": Flame,
  "fiyat-artan": ArrowUp01,
  "fiyat-azalan": ArrowDown01,
};

/** Geçersiz/boş parametreyi "onerilen"e indirger. */
export function normalizeSort(v: string | undefined): SortKey {
  return SORT_OPTIONS.some((o) => o.key === v) ? (v as SortKey) : "onerilen";
}

export default function SortSelect({
  current,
  params,
}: {
  current: SortKey;
  /** Korunacak mevcut arama parametreleri (k, alt, q, ozel). */
  params: Record<string, string | undefined>;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

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

  const hrefFor = (key: SortKey): string => {
    const sp = new URLSearchParams();
    for (const [k, v] of Object.entries(params)) {
      if (v) sp.set(k, v);
    }
    if (key !== "onerilen") sp.set("sirala", key);
    const qs = sp.toString();
    return qs ? `/urunler?${qs}` : "/urunler";
  };

  const currentOpt = SORT_OPTIONS.find((o) => o.key === current);
  const currentName = currentOpt?.name ?? "Önerilen";
  // Tetikte kompakt etiket (dar hapta taşmaz); menüde tam ad gösterilir.
  const currentShort = currentOpt?.short ?? "Önerilen";
  const isDefault = current === "onerilen";

  return (
    <div className={styles.selWrap} ref={rootRef}>
      <button
        type="button"
        className={`${styles.selBtn}${!isDefault ? ` ${styles.selBtnActive}` : ""}`}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`Sıralama: ${currentName}`}
        onClick={() => setOpen((v) => !v)}
      >
        <span className={styles.selText}>
          <span className={styles.selCaption}>SIRALAMA</span>
          <span className={styles.selCurrent}>{currentShort}</span>
        </span>
        <ChevronDown
          size={17}
          strokeWidth={2.2}
          className={`${styles.selChev}${open ? ` ${styles.selChevOpen}` : ""}`}
          aria-hidden="true"
        />
      </button>

      {open && (
        <div className={styles.selMenu} role="listbox" aria-label="Sıralama seçenekleri">
          <p className={styles.selMenuTitle}>Sıralama</p>
          {SORT_OPTIONS.map((o) => {
            const on = o.key === current;
            const Icon = OPTION_ICONS[o.key];
            return (
              <Link
                key={o.key}
                href={hrefFor(o.key)}
                className={`${styles.selItem}${on ? ` ${styles.selItemActive}` : ""}`}
                role="option"
                aria-selected={on}
                scroll={false}
                onClick={() => setOpen(false)}
              >
                <span className={styles.selItemIcon} aria-hidden="true">
                  <Icon size={15} strokeWidth={2.1} />
                </span>
                <span className={styles.selItemName}>{o.name}</span>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
