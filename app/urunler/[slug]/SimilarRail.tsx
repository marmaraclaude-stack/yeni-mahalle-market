"use client";

// Benzer Ürünler raili — sol/sağ ok butonları TÜM cihazlarda (mobil dahil).
// Oklar thumbnail hizasına dikey ortalı, yarı saydam beyaz daire; kaydırma
// başında sol ok, sonunda sağ ok gizlenir (gereksiz ok yok). Mobilde de
// dokunmatik kaydırmaya ek olarak net bir gezinme ipucu verir.

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Product } from "@/lib/shop/types";
import ProductCard from "@/components/shop/ProductCard";
import styles from "./urun.module.css";

export default function SimilarRail({ products }: { products: Product[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(false);

  const update = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setCanLeft(el.scrollLeft > 4);
    setCanRight(el.scrollLeft < max - 4);
  }, []);

  useEffect(() => {
    update();
    const el = ref.current;
    if (!el) return;
    el.addEventListener("scroll", update, { passive: true });
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", update);
      ro.disconnect();
    };
  }, [update, products]);

  const scroll = (dir: 1 | -1) => {
    const el = ref.current;
    if (!el) return;
    // Tam bir sayfa kaydır; zorunlu snap kartları hizalar (yarım kart kalmaz).
    el.scrollBy({ left: dir * el.clientWidth, behavior: "smooth" });
  };

  return (
    <div className={styles.railWrap}>
      <div className={styles.rail} role="list" ref={ref}>
        {products.map((p) => (
          <div key={p.id} className={styles.railItem} role="listitem">
            <ProductCard product={p} />
          </div>
        ))}
      </div>
      {/* Her iki ok da render edilir; kaydırılamayan yön "disabled". Masaüstünde
         ikisi de görünür (biri soluk) — simetrik carousel navigasyonu. Mobilde
         disabled ok CSS ile gizlenir (sadece kullanılabilir ok, kart kenarında). */}
      <button
        type="button"
        className={`${styles.railBtn} ${styles["railBtn--prev"]}`}
        onClick={() => scroll(-1)}
        disabled={!canLeft}
        aria-label="Önceki ürünler"
      >
        <ChevronLeft size={18} strokeWidth={2.2} aria-hidden="true" />
      </button>
      <button
        type="button"
        className={`${styles.railBtn} ${styles["railBtn--next"]}`}
        onClick={() => scroll(1)}
        disabled={!canRight}
        aria-label="Sonraki ürünler"
      >
        <ChevronRight size={18} strokeWidth={2.2} aria-hidden="true" />
      </button>
    </div>
  );
}
