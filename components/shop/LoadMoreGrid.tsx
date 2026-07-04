"use client";

// Kademeli ürün gridi — "özel görünümlerde" (Tüm Ürünler / İndirimli / Çok
// Satan) yüzlerce ürünü tek seferde basmak yerine ilk N kartı gösterir,
// altındaki "Daha Fazla Yükle" butonu her tıklamada STEP kadar daha açar.
// Tüm ürünler sunucudan tek sorguda gelir; burada yalnız görünen dilim
// render edilir (performans). Buton oku YOK.

import { useState } from "react";
import { SearchX } from "lucide-react";
import type { Product } from "@/lib/shop/types";
import ProductCard from "@/components/shop/ProductCard";
import styles from "@/app/urunler/shop.module.css";

const INITIAL = 60;
const STEP = 60;

export default function LoadMoreGrid({
  products,
  emptyText = "Bu listede henüz ürün yok.",
}: {
  products: Product[];
  emptyText?: string;
}) {
  const [visible, setVisible] = useState(INITIAL);

  if (products.length === 0) {
    return (
      <div className={styles.empty} role="status">
        <SearchX size={28} strokeWidth={1.6} aria-hidden="true" />
        <p>{emptyText}</p>
      </div>
    );
  }

  const shown = products.slice(0, visible);
  const remaining = products.length - shown.length;

  return (
    <>
      <div className={styles.grid}>
        {shown.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>

      {remaining > 0 && (
        <div className={styles.loadMoreWrap}>
          <button
            type="button"
            className={styles.loadMoreBtn}
            onClick={() => setVisible((v) => v + STEP)}
          >
            Daha Fazla Yükle
            <span className={styles.loadMoreCount}>
              {remaining} ürün daha
            </span>
          </button>
        </div>
      )}
    </>
  );
}
