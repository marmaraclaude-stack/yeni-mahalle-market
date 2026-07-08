"use client";

// Benzer Ürünler raili — client: ana sayfa kategori carousel'indeki gibi
// sol/sağ ok butonları taşır (kaydırılabilirlik görünür olsun). Mobilde
// kart genişliği ~%34: 3 kart birden görünür, taşan kenar kaydırmayı
// kendiliğinden ima eder. Ok istisnası: carousel gezinme butonları.

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Product } from "@/lib/shop/types";
import ProductCard from "@/components/shop/ProductCard";
import styles from "./urun.module.css";

export default function SimilarRail({ products }: { products: Product[] }) {
  const ref = useRef<HTMLDivElement>(null);

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
      <button
        type="button"
        className={`${styles.railBtn} ${styles["railBtn--prev"]}`}
        onClick={() => scroll(-1)}
        aria-label="Önceki ürünler"
      >
        <ChevronLeft size={18} strokeWidth={2.2} aria-hidden="true" />
      </button>
      <button
        type="button"
        className={`${styles.railBtn} ${styles["railBtn--next"]}`}
        onClick={() => scroll(1)}
        aria-label="Sonraki ürünler"
      >
        <ChevronRight size={18} strokeWidth={2.2} aria-hidden="true" />
      </button>
    </div>
  );
}
