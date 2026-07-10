"use client";

// Konaklama tesisi seçici — native datalist yerine stillenebilir autocomplete.
// Yazdıkça süzer (ad + bölge), en çok 8 öneri; satırda ad + bölge/tip rozeti.
// Dış tıklamada kapanır; seçim onSelect ile üst bileşene bildirilir.

import { useEffect, useMemo, useRef, useState } from "react";
import { BedDouble, Building2, Home, MapPin, Tent } from "lucide-react";
import {
  ACCOMMODATIONS,
  accommodationLabel,
  type Accommodation,
} from "@/lib/shop/accommodations";
import styles from "./AccommodationPicker.module.css";

function typeIcon(type: string) {
  if (type === "bungalov" || type === "tatil köyü") return Tent;
  if (type === "site") return Building2;
  if (type === "apart" || type === "pansiyon") return Home;
  return BedDouble;
}

/** Türkçe duyarlı, aksansız karşılaştırma için normalize. */
function norm(s: string): string {
  return s
    .toLocaleLowerCase("tr-TR")
    .replace(/ı/g, "i")
    .replace(/ş/g, "s")
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c");
}

export default function AccommodationPicker({
  value,
  onSelect,
  onChange,
  placeholder = "Tesis / site adı yazın…",
  inputClassName,
  id,
  required,
}: {
  value: string;
  /** Listeden bir tesis seçildiğinde (tam etiketle) çağrılır. */
  onSelect: (label: string, item: Accommodation) => void;
  /** Serbest yazım değişikliği. */
  onChange: (value: string) => void;
  placeholder?: string;
  inputClassName?: string;
  id?: string;
  required?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [hi, setHi] = useState(0);
  const boxRef = useRef<HTMLDivElement>(null);

  const results = useMemo(() => {
    const q = norm(value.trim());
    const pool = q
      ? ACCOMMODATIONS.filter(
          (a) => norm(a.name).includes(q) || norm(a.area).includes(q),
        )
      : ACCOMMODATIONS;
    return pool.slice(0, 8);
  }, [value]);

  // Dış tıklamada kapan.
  useEffect(() => {
    function onDown(e: MouseEvent | TouchEvent) {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onDown);
    document.addEventListener("touchstart", onDown);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("touchstart", onDown);
    };
  }, []);

  function pick(item: Accommodation) {
    onSelect(accommodationLabel(item), item);
    setOpen(false);
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (!open) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHi((h) => Math.min(h + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHi((h) => Math.max(h - 1, 0));
    } else if (e.key === "Enter" && results[hi]) {
      e.preventDefault();
      pick(results[hi]);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  }

  return (
    <div ref={boxRef} className={styles.box}>
      <input
        id={id}
        type="text"
        value={value}
        required={required}
        placeholder={placeholder}
        className={inputClassName}
        autoComplete="off"
        onChange={(e) => {
          onChange(e.target.value);
          setOpen(true);
          setHi(0);
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={onKeyDown}
        role="combobox"
        aria-expanded={open}
        aria-autocomplete="list"
      />
      {open && results.length > 0 && (
        <ul className={styles.list} role="listbox">
          {results.map((a, i) => {
            const Icon = typeIcon(a.type);
            return (
              <li key={accommodationLabel(a)}>
                <button
                  type="button"
                  role="option"
                  aria-selected={i === hi}
                  className={`${styles.item}${i === hi ? ` ${styles.itemHi}` : ""}`}
                  onMouseEnter={() => setHi(i)}
                  onClick={() => pick(a)}
                >
                  <span className={styles.itemIcon} aria-hidden>
                    <Icon size={15} />
                  </span>
                  <span className={styles.itemName}>{a.name}</span>
                  <span className={styles.itemMeta}>
                    <MapPin size={11} aria-hidden /> {a.area} · {a.type}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
