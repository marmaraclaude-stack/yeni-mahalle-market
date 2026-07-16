"use client";

// Benzer Ürünler raili — başlık satırının SAĞ ucunda gezinme okları
// (Trendyol/Getir dili), kartların ÜZERİNE binen ok yok. Mobilde bir sonraki
// kartın kenarı görünür (peek) → kaydırılabilirlik kendini anlatır; altta
// ince ilerleme çubuğu konumu gösterir. Kaydırma scroll-snap ile karta
// hizalanır; oklar bir "sayfa" ilerletir.

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Product } from "@/lib/shop/types";
import ProductCard from "@/components/shop/ProductCard";
import styles from "./urun.module.css";

export default function SimilarRail({ products }: { products: Product[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(false);
  // Taşma yoksa (az ürün) oklar gizlenir.
  const [overflow, setOverflow] = useState(false);

  const update = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setOverflow(max > 4);
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
    // Bir "sayfa" kaydır; snap kartları hizalar (yarım kart kalmaz).
    el.scrollBy({ left: dir * el.clientWidth, behavior: "smooth" });
  };

  return (
    <div>
      <div className={styles.similarHead}>
        <div className={styles.similarHeadText}>
          <h2 id="benzer-urunler" className={styles.similarTitle}>
            Benzer Ürünler
          </h2>
          <p className={styles.similarSub}>
            Aynı kategoriden senin için seçtiklerimiz
          </p>
        </div>
        {overflow && (
          <div className={styles.railNav} aria-hidden={false}>
            <button
              type="button"
              className={styles.railNavBtn}
              onClick={() => scroll(-1)}
              disabled={!canLeft}
              aria-label="Önceki ürünler"
            >
              <ChevronLeft size={19} strokeWidth={2.2} aria-hidden="true" />
            </button>
            <button
              type="button"
              className={styles.railNavBtn}
              onClick={() => scroll(1)}
              disabled={!canRight}
              aria-label="Sonraki ürünler"
            >
              <ChevronRight size={19} strokeWidth={2.2} aria-hidden="true" />
            </button>
          </div>
        )}
      </div>

      <div className={styles.rail} role="list" ref={ref}>
        {products.map((p) => (
          <div key={p.id} className={styles.railItem} role="listitem">
            <ProductCard product={p} />
          </div>
        ))}
      </div>
    </div>
  );
}
