"use client";

// Kategori pill barı — sticky (navbar altı), yatay kaydırılabilir, scroll-snap.
// Masaüstünde kenar okları: ReviewsRail'deki exact-step scrollBy + snap-disable
// deseni. Link tabanlı; aktif pill accent dolgulu. Arama terimi (q) kategori
// değişirken korunur.

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { CATEGORY_TINTS, SHOP_CATEGORIES } from "@/lib/shop/categories";
import { iconFor } from "@/components/shop/ProductCard";
import styles from "@/app/urunler/shop.module.css";

function buildHref(slug: string | null, q?: string): string {
  const params = new URLSearchParams();
  if (slug) params.set("k", slug);
  if (q) params.set("q", q);
  const qs = params.toString();
  return qs ? `/urunler?${qs}` : "/urunler";
}

export default function CategoryRail({
  active,
  q,
}: {
  active?: string;
  q?: string;
}) {
  const railRef = useRef<HTMLElement>(null);
  const snapTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  const scrollByStep = (dir: 1 | -1) => {
    const el = railRef.current;
    if (!el) return;
    // Görünür genişliğe yakın bir adım — pill genişlikleri değişken olduğundan
    // kart bazlı değil sayfa bazlı adım kullanılır
    const step = Math.max(el.clientWidth - 96, 160);
    // iOS Safari: programatik kaydırma sırasında snap'i kapat, sonra aç
    el.style.scrollSnapType = "none";
    el.scrollBy({ left: dir * step, behavior: "smooth" });
    if (snapTimer.current) clearTimeout(snapTimer.current);
    snapTimer.current = setTimeout(() => {
      el.style.scrollSnapType = "";
    }, 450);
  };

  useEffect(() => {
    const el = railRef.current;
    if (!el) return;
    const update = () => {
      const max = el.scrollWidth - el.clientWidth;
      setCanPrev(el.scrollLeft > 4);
      setCanNext(el.scrollLeft < max - 4);
    };
    update();
    el.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      el.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      if (snapTimer.current) clearTimeout(snapTimer.current);
    };
  }, []);

  // Aktif pill ilk yüklemede görünür alana gelsin
  useEffect(() => {
    const el = railRef.current;
    if (!el || !active) return;
    const link = el.querySelector<HTMLElement>('[aria-current="page"]');
    if (!link) return;
    el.scrollTo({ left: Math.max(0, link.offsetLeft - 24) });
  }, [active]);

  return (
    <div className={styles.catbar}>
      <div className={`container ${styles.catbarInner}`}>
        <button
          type="button"
          className={styles.catArrow}
          aria-label="Kategorileri geri kaydır"
          onClick={() => scrollByStep(-1)}
          disabled={!canPrev}
        >
          <ChevronLeft size={16} strokeWidth={2.2} aria-hidden="true" />
        </button>

        <nav ref={railRef} className={styles.catRail} aria-label="Kategoriler">
          <Link
            href={buildHref(null, q)}
            className={`${styles.pill}${!active ? ` ${styles.pillActive}` : ""}`}
            aria-current={!active ? "page" : undefined}
          >
            Tümü
          </Link>

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

        <button
          type="button"
          className={styles.catArrow}
          aria-label="Kategorileri ileri kaydır"
          onClick={() => scrollByStep(1)}
          disabled={!canNext}
        >
          <ChevronRight size={16} strokeWidth={2.2} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
