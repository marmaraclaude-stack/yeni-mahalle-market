"use client";

// Admin araç çubuğu açılır menüsü — vitrindeki SortSelect ile AYNI görsel dil
// (shop.module.css sel* sınıfları paylaşılır). Her seçenek normal bir link
// (GET parametreli); seçilince anında o adrese gidilir, ayrı "Filtrele"
// düğmesi gerekmez. İstemci durumu yalnız menünün açık/kapalı hâlidir.

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  ArrowDownAZ,
  ArrowDownWideNarrow,
  ArrowUpNarrowWide,
  ChevronDown,
  Clock,
  Layers,
  LayoutGrid,
  ListFilter,
  type LucideIcon,
} from "lucide-react";
import styles from "@/app/urunler/shop.module.css";

// İkonlar burada (client) eşlenir — server component'ten client'a fonksiyon
// (ikon bileşeni) prop geçilemeyeceğinden yalnız string anahtar taşınır.
const ICONS: Record<string, LucideIcon> = {
  grid: LayoutGrid,
  layers: Layers,
  filter: ListFilter,
  az: ArrowDownAZ,
  up: ArrowUpNarrowWide,
  down: ArrowDownWideNarrow,
  clock: Clock,
};

export interface AdminSelectOption {
  key: string;
  name: string;
  href: string;
  /** ICONS içindeki anahtar (opsiyonel). */
  iconKey?: string;
  active?: boolean;
}

export default function AdminSelect({
  label,
  currentName,
  options,
  ariaLabel,
}: {
  /** Tetikteki gri ön etiket, ör. "Sıralama:". */
  label: string;
  /** Tetikte gösterilen seçili değer. */
  currentName: string;
  options: AdminSelectOption[];
  ariaLabel?: string;
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

  return (
    <div className={styles.selWrap} ref={rootRef}>
      <button
        type="button"
        className={styles.selBtn}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={ariaLabel ?? `${label} ${currentName}`}
        onClick={() => setOpen((v) => !v)}
      >
        <span className={styles.selLabel}>{label}</span>
        <span className={styles.selCurrent}>{currentName}</span>
        <ChevronDown
          size={17}
          strokeWidth={2.2}
          className={`${styles.selChev}${open ? ` ${styles.selChevOpen}` : ""}`}
          aria-hidden="true"
        />
      </button>

      {open && (
        <div className={styles.selMenu} role="listbox" aria-label={ariaLabel ?? label}>
          {options.map((o) => {
            const Icon = o.iconKey ? ICONS[o.iconKey] : undefined;
            return (
              <Link
                key={o.key}
                href={o.href}
                scroll={false}
                className={`${styles.selItem}${o.active ? ` ${styles.selItemActive}` : ""}`}
                role="option"
                aria-selected={o.active ?? false}
                onClick={() => setOpen(false)}
              >
                {Icon && (
                  <span className={styles.selItemIcon} aria-hidden="true">
                    <Icon size={15} strokeWidth={2.1} />
                  </span>
                )}
                <span className={styles.selItemName}>{o.name}</span>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
