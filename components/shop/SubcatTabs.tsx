"use client";

// Alt kategori sekme barı (/urunler, kategori görünümü). İKİ MOD:
//  1) Bölümlenmiş mod (alt seçili değil): sekmeler BUTON; dokununca sayfa
//     ilgili bölüme (#alt-<slug>) kayar (html scroll-behavior: smooth),
//     URL ?alt= history.replaceState ile güncellenir (sayfa YENİDEN
//     YÜKLENMEZ). IntersectionObserver görünür bölümün sekmesini aktifler
//     ve aktif sekme bar içinde görünür alana kayar.
//  2) Filtreli mod (?alt= ile doğrudan gelindi): sunucu filtreli tek grid
//     korunur; sekmeler normal LINK (Tümü + alt kategoriler).
// Sticky: mobilde catbar'ın hemen altına yapışır, masaüstünde navbar altına
// (bkz. shop.module.css .subBarSticky). Yükseklik --subbar-h CSS
// değişkenine yazılır; catbar kendi yüksekliğini --catbar-h olarak yazar.

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
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
  /** Kategorideki toplam ürün sayısı (filtreli modda "Tümü" sayacı). */
  totalCount: number;
  /** Dolu ise filtreli mod: sekmeler normal link olarak çalışır. */
  activeAlt?: string;
}) {
  const sectioned = !activeAlt;
  const barRef = useRef<HTMLElement>(null);
  // Sekmeye tıklanınca programatik kaydırma bitene dek observer'ın aktif
  // sekmeyi ezmesini engelleyen kilit (scrollend + emniyet zamanlayıcısı).
  const lockRef = useRef(false);
  const lockTimer = useRef<number | undefined>(undefined);
  const [active, setActive] = useState<string>(tabs[0]?.slug ?? "");
  const [resizeTick, setResizeTick] = useState(0);
  const slugsKey = tabs.map((t) => t.slug).join("|");

  // Bar yüksekliği --subbar-h değişkenine yazılır; bölümlerin
  // scroll-margin-top hesabı ve observer üst sınırı bunu kullanır.
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

  // Viewport değişince observer sınırları yeniden hesaplansın.
  useEffect(() => {
    if (!sectioned) return;
    const onResize = () => setResizeTick((t) => t + 1);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [sectioned]);

  // Görünür bölümü izle: iki sticky bar'ın hemen altındaki bantta (üst
  // ofset .. %55 viewport) ilk kesişen bölümün sekmesi aktif olur.
  useEffect(() => {
    if (!sectioned) return;
    const slugs = slugsKey.split("|").filter(Boolean);
    const els = slugs
      .map((s) => document.getElementById(`alt-${s}`))
      .filter((el): el is HTMLElement => el !== null);
    if (els.length === 0) return;

    const desktop = window.matchMedia("(min-width: 1024px)").matches;
    const catbarH = desktop
      ? 0
      : parseFloat(
          getComputedStyle(document.documentElement).getPropertyValue(
            "--catbar-h",
          ),
        ) || 0;
    // Bar hem mobil hem masaüstünde 69px (SiteNav) referansına yapışır;
    // masaüstü nefes payı barın kendi üst dolgusundadır (offsetHeight'a dahil).
    const topOffset =
      69 + catbarH + (barRef.current?.offsetHeight ?? 44);

    const visible = new Set<string>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          const slug = e.target.id.replace(/^alt-/, "");
          if (e.isIntersecting) visible.add(slug);
          else visible.delete(slug);
        }
        if (lockRef.current) return;
        const next = slugs.find((s) => visible.has(s));
        if (next) setActive(next);
      },
      { rootMargin: `-${Math.round(topOffset) + 1}px 0px -45% 0px` },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [sectioned, slugsKey, resizeTick]);

  // Aktif sekme bar içinde görünür alana kaysın.
  useEffect(() => {
    if (!sectioned) return;
    const el = barRef.current?.querySelector<HTMLElement>(
      `[data-slug="${active}"]`,
    );
    el?.scrollIntoView({ inline: "nearest", block: "nearest" });
  }, [active, sectioned]);

  /** Sekme tıklaması (bölümlenmiş mod): anchor scroll + URL güncelle. */
  const go = (slug: string) => {
    setActive(slug);
    const unlock = () => {
      lockRef.current = false;
      window.clearTimeout(lockTimer.current);
    };
    lockRef.current = true;
    window.clearTimeout(lockTimer.current);
    lockTimer.current = window.setTimeout(unlock, 1200);
    window.addEventListener("scrollend", unlock, { once: true });
    // html { scroll-behavior: smooth } + .subSection scroll-margin-top
    // hedefi iki sticky bar'ın altına hizalar (reduced-motion'da anında).
    document.getElementById(`alt-${slug}`)?.scrollIntoView({ block: "start" });
    // URL'i sayfayı yeniden yüklemeden güncelle; Next router state'i korunur.
    const url = new URL(window.location.href);
    url.searchParams.set("alt", slug);
    window.history.replaceState(window.history.state, "", url.toString());
  };

  return (
    <nav
      ref={barRef}
      className={`${styles.subBar} ${styles.subBarSticky}`}
      aria-label="Alt kategoriler"
    >
      {sectioned ? (
        tabs.map((t) => {
          const on = t.slug === active;
          return (
            <button
              key={t.slug}
              type="button"
              data-slug={t.slug}
              onClick={() => go(t.slug)}
              className={`${styles.subChip}${on ? ` ${styles.subChipActive}` : ""}`}
              aria-current={on ? "location" : undefined}
            >
              {t.name}
              <span className={styles.subCount}>{t.count}</span>
            </button>
          );
        })
      ) : (
        <>
          <Link href={hrefFor(catSlug)} className={styles.subChip}>
            Tümü
            <span className={styles.subCount}>{totalCount}</span>
          </Link>
          {tabs.map((t) => {
            const on = t.slug === activeAlt;
            return (
              <Link
                key={t.slug}
                href={hrefFor(catSlug, t.slug)}
                className={`${styles.subChip}${on ? ` ${styles.subChipActive}` : ""}`}
                aria-current={on ? "page" : undefined}
              >
                {t.name}
                <span className={styles.subCount}>{t.count}</span>
              </Link>
            );
          })}
        </>
      )}
    </nav>
  );
}
