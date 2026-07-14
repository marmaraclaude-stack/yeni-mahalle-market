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
import { useCallback, useEffect, useRef, useState } from "react";
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
  /** Kategorideki toplam ürün sayısı (filtreli modda "Tümü" sayacı). */
  totalCount: number;
  /** Dolu ise filtreli mod: sekmeler normal link olarak çalışır. */
  activeAlt?: string;
}) {
  const sectioned = !activeAlt;
  const barRef = useRef<HTMLElement>(null);
  // Yatay kaydırılan çip şeridi + ok butonları durumu.
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(false);
  // Şerit hiç taşmıyorsa (az sayıda çip) okları göstermeyiz.
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
     (yarım çip kalmaz, son çip de tam görünür — "son eleman" bug'ı yok). */
  const nudge = (dir: -1 | 1) => {
    const el = scrollRef.current;
    if (!el) return;
    const kids = Array.from(el.children) as HTMLElement[];
    const pad = 10;
    const cur = el.scrollLeft;
    if (dir === 1) {
      // Mevcut sol kenardan sonraki ilk çipi sola getir (bir çip ileri).
      const next = kids.find((c) => c.offsetLeft > cur + 2);
      el.scrollTo({
        left: next ? next.offsetLeft - pad : el.scrollWidth,
        behavior: "smooth",
      });
    } else {
      // Sol kenardan önceki son çipi sola getir (bir çip geri).
      const prev = [...kids].reverse().find((c) => c.offsetLeft < cur - 2);
      el.scrollTo({
        left: prev ? Math.max(0, prev.offsetLeft - pad) : 0,
        behavior: "smooth",
      });
    }
  };
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

  /** Belirtilen çipi YALNIZ yatay olarak görünür alana getir (sayfayı asla
     dikey kaydırmaz). Yalnızca kullanıcı tıklamasında çağrılır — sayfa dikey
     kaydırılırken observer aktif pili değiştirse bile şerit yerinde kalır,
     böylece pil şeridi kendiliğinden yatay zıplamaz. */
  const scrollChipIntoView = (slug: string) => {
    const el = scrollRef.current;
    const chip = el?.querySelector<HTMLElement>(`[data-slug="${slug}"]`);
    if (!el || !chip) return;
    const chipLeft = chip.offsetLeft;
    const chipRight = chipLeft + chip.offsetWidth;
    if (chipLeft < el.scrollLeft) {
      el.scrollTo({ left: Math.max(0, chipLeft - 12), behavior: "smooth" });
    } else if (chipRight > el.scrollLeft + el.clientWidth) {
      el.scrollTo({ left: chipRight - el.clientWidth + 12, behavior: "smooth" });
    }
  };

  /** Sekme tıklaması (bölümlenmiş mod): anchor scroll + URL güncelle. */
  const go = (slug: string) => {
    setActive(slug);
    scrollChipIntoView(slug);
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

  const chips = sectioned ? (
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
  );

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
        {chips}
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
