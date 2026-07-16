"use client";

// Kategori/alt kategori görünürlük anahtarları — istemci bileşeni.
// Her anahtar iyimser (optimistic) güncellenir; sunucu aksiyonu başarısız
// olursa eski duruma döner ve uyarı gösterilir.

import { useState, useTransition } from "react";
import { Eye, EyeOff } from "lucide-react";
import {
  toggleCategoryActive,
  toggleSubcategoryHidden,
} from "@/lib/shop/admin-actions";
import { CATEGORY_TINTS } from "@/lib/shop/categories";
import { iconFor } from "@/components/shop/ProductCard";
import styles from "../../admin.module.css";
import kstyles from "./kategoriler.module.css";

interface CatDef {
  slug: string;
  name: string;
  tint: number;
  icon: string;
  subs: { slug: string; name: string }[];
}

export default function CategoriesManager({
  categories,
  initialInactive,
  initialHidden,
}: {
  categories: CatDef[];
  initialInactive: string[];
  initialHidden: string[]; // "kategori/alt" anahtarları
}) {
  const [inactive, setInactive] = useState<Set<string>>(
    () => new Set(initialInactive),
  );
  const [hidden, setHidden] = useState<Set<string>>(() => new Set(initialHidden));
  const [error, setError] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  function flipCategory(slug: string) {
    const makeActive = inactive.has(slug); // pasifse aktifleştir
    setError(null);
    setInactive((prev) => {
      const next = new Set(prev);
      if (makeActive) next.delete(slug);
      else next.add(slug);
      return next;
    });
    startTransition(async () => {
      try {
        await toggleCategoryActive(slug, makeActive);
      } catch (e) {
        // geri al
        setInactive((prev) => {
          const next = new Set(prev);
          if (makeActive) next.add(slug);
          else next.delete(slug);
          return next;
        });
        setError(e instanceof Error ? e.message : "Kategori güncellenemedi.");
      }
    });
  }

  function flipSub(catSlug: string, subSlug: string) {
    const key = `${catSlug}/${subSlug}`;
    const makeHidden = !hidden.has(key);
    setError(null);
    setHidden((prev) => {
      const next = new Set(prev);
      if (makeHidden) next.add(key);
      else next.delete(key);
      return next;
    });
    startTransition(async () => {
      try {
        await toggleSubcategoryHidden(catSlug, subSlug, makeHidden);
      } catch (e) {
        setHidden((prev) => {
          const next = new Set(prev);
          if (makeHidden) next.delete(key);
          else next.add(key);
          return next;
        });
        setError(e instanceof Error ? e.message : "Alt kategori güncellenemedi.");
      }
    });
  }

  return (
    <>
      {error && <p className={styles.formError}>{error}</p>}
      <div className={kstyles.grid}>
        {categories.map((c) => {
          const [bg, fg] = CATEGORY_TINTS[c.tint] ?? CATEGORY_TINTS[0];
          const Icon = iconFor(c.icon);
          const catOff = inactive.has(c.slug);
          return (
            <section
              key={c.slug}
              className={`${kstyles.card}${catOff ? ` ${kstyles.cardOff}` : ""}`}
            >
              <header className={kstyles.head}>
                <span
                  className={kstyles.icon}
                  style={{ background: bg, color: fg }}
                  aria-hidden="true"
                >
                  <Icon size={18} strokeWidth={1.9} />
                </span>
                <div className={kstyles.headText}>
                  <span className={kstyles.name}>{c.name}</span>
                  <span className={kstyles.state}>
                    {catOff ? "Vitrinde gizli" : "Vitrinde görünür"}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => flipCategory(c.slug)}
                  className={`${styles.statusPill} ${
                    catOff ? styles["statusPill--muted"] : styles["statusPill--ok"]
                  }`}
                  aria-pressed={!catOff}
                  aria-label={`${c.name} kategorisini ${catOff ? "aktifleştir" : "pasifleştir"}`}
                >
                  {catOff ? (
                    <EyeOff size={14} aria-hidden />
                  ) : (
                    <Eye size={14} aria-hidden />
                  )}
                  {catOff ? "Pasif" : "Aktif"}
                </button>
              </header>

              {c.subs.length > 0 && (
                <div className={kstyles.subList}>
                  {c.subs.map((s) => {
                    const off = hidden.has(`${c.slug}/${s.slug}`);
                    return (
                      <button
                        key={s.slug}
                        type="button"
                        onClick={() => flipSub(c.slug, s.slug)}
                        className={`${kstyles.subChip}${off ? ` ${kstyles.subChipOff}` : ""}`}
                        aria-pressed={!off}
                        title={
                          off
                            ? "Gizli — vitrinde göstermek için tıkla"
                            : "Görünür — vitrinden gizlemek için tıkla"
                        }
                      >
                        {off ? (
                          <EyeOff size={13} aria-hidden />
                        ) : (
                          <Eye size={13} aria-hidden />
                        )}
                        {s.name}
                      </button>
                    );
                  })}
                </div>
              )}
            </section>
          );
        })}
      </div>
    </>
  );
}
