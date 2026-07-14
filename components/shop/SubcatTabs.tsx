"use client";

// Alt kategori sekme barı (/urunler, kategori görünümü) — SAF FİLTRE MODU.
// Her sekme normal LINK: "Tümü" + alt kategoriler. Tıklanınca ?alt= ile o alt
// kategoriye süzülür (sunucu filtreli tek grid). Aktif sekme YALNIZCA URL'den
// (activeAlt) belirlenir; sayfa dikey kaydırılınca DEĞİŞMEZ. Böylece eski
// scroll-spy (IntersectionObserver) kaynaklı "yukarı-aşağı kaydırınca pil
// zıplaması" bug'ı tamamen ortadan kalkar.
// Şerit yatay taşarsa sol/sağ ok butonları TEK çip ilerletir (yalnız yatay,
// sayfayı asla dikey kaydırmaz). Sticky: bkz. shop.module.css .subBarSticky.

import Link from "next/link";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
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

export default function SubcatTabs({
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
  const barRef = useRef<HTMLElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(false);
  // Şerit hiç taşmıyorsa (az çip) okları göstermeyiz.
  const [overflow, setOverflow] = useState(false);

  /** Ok görünürlüğü: şerit başta/sonda mı, taşma var mı? */
  const updateArrows = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setOverflow(max > 4);
    setCanLeft(el.scrollLeft > 4);
    setCanRight(el.scrollLeft < max - 4);
  }, []);

  useEffect(() => {
    updateArrows();
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateArrows, { passive: true });
    const ro = new ResizeObserver(updateArrows);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", updateArrows);
      ro.disconnect();
    };
  }, [updateArrows, tabs]);

  /** Ok tıklaması: TEK bir çip ilerle/geri git; hedefi sol kenara hizala
     (yarım çip kalmaz, son çip de tam görünür). Yalnız yatay kaydırma. */
  const nudge = (dir: -1 | 1) => {
    const el = scrollRef.current;
    if (!el) return;
    const kids = Array.from(el.children) as HTMLElement[];
    const pad = 10;
    const cur = el.scrollLeft;
    if (dir === 1) {
      const next = kids.find((c) => c.offsetLeft > cur + 2);
      el.scrollTo({
        left: next ? next.offsetLeft - pad : el.scrollWidth,
        behavior: "smooth",
      });
    } else {
      const prev = [...kids].reverse().find((c) => c.offsetLeft < cur - 2);
      el.scrollTo({
        left: prev ? Math.max(0, prev.offsetLeft - pad) : 0,
        behavior: "smooth",
      });
    }
  };

  // Bar yüksekliği --subbar-h değişkenine yazılır (sticky offset hesapları).
  useEffect(() => {
    const el = barRef.current;
    if (!el) return;
    const root = document.documentElement;
    const apply = () =>
      root.style.setProperty("--subbar-h", `${el.offsetHeight}px`);
    apply();
    const ro = new ResizeObserver(apply);
    ro.observe(el);
    return () => {
      ro.disconnect();
      root.style.removeProperty("--subbar-h");
    };
  }, []);

  // İlk yüklemede / aktif alt değişince aktif çipi YALNIZ yatay olarak
  // ORTALA (anında; dikey kaydırma yok). ?alt=x ile gelindiğinde aktif pil
  // fade/ok altında yarım kalmaz, net şekilde görünür.
  useLayoutEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const slug = activeAlt ?? "__all__";
    const chip = el.querySelector<HTMLElement>(`[data-slug="${slug}"]`);
    if (!chip) return;
    const center = chip.offsetLeft + chip.offsetWidth / 2 - el.clientWidth / 2;
    const max = el.scrollWidth - el.clientWidth;
    el.scrollLeft = Math.max(0, Math.min(center, max));
  }, [activeAlt]);

  return (
    <nav
      ref={barRef}
      className={`${styles.subBar} ${styles.subBarSticky}`}
      aria-label="Alt kategoriler"
    >
      {overflow && (
        <button
          type="button"
          className={styles.subNavBtn}
          onClick={() => nudge(-1)}
          disabled={!canLeft}
          aria-label="Alt kategorileri sola kaydır"
        >
          <ChevronLeft size={17} strokeWidth={2.2} aria-hidden="true" />
        </button>
      )}
      <div
        ref={scrollRef}
        className={`${styles.subScroll}${canLeft ? ` ${styles.subScrollFadeL}` : ""}${
          canRight ? ` ${styles.subScrollFadeR}` : ""
        }`}
      >
        <Link
          href={hrefFor(catSlug)}
          data-slug="__all__"
          className={`${styles.subChip}${!activeAlt ? ` ${styles.subChipActive}` : ""}`}
          aria-current={!activeAlt ? "page" : undefined}
          scroll={false}
        >
          Tümü
          <span className={styles.subCount}>{totalCount}</span>
        </Link>
        {tabs.map((t) => {
          const on = t.slug === activeAlt;
          return (
            <Link
              key={t.slug}
              href={hrefFor(catSlug, t.slug)}
              data-slug={t.slug}
              className={`${styles.subChip}${on ? ` ${styles.subChipActive}` : ""}`}
              aria-current={on ? "page" : undefined}
              scroll={false}
            >
              {t.name}
              <span className={styles.subCount}>{t.count}</span>
            </Link>
          );
        })}
      </div>
      {overflow && (
        <button
          type="button"
          className={styles.subNavBtn}
          onClick={() => nudge(1)}
          disabled={!canRight}
          aria-label="Alt kategorileri sağa kaydır"
        >
          <ChevronRight size={17} strokeWidth={2.2} aria-hidden="true" />
        </button>
      )}
    </nav>
  );
}
