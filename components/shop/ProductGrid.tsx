// Ürün gridi — responsive auto-fill; ürün yoksa boş durum mesajı basar.

import { SearchX } from "lucide-react";
import type { Product } from "@/lib/shop/types";
import ProductCard from "@/components/shop/ProductCard";
import styles from "@/app/urunler/shop.module.css";

export default function ProductGrid({
  products,
  emptyText = "Bu kategoride henüz ürün yok.",
}: {
  products: Product[];
  emptyText?: string;
}) {
  if (products.length === 0) {
    return (
      <div className={styles.empty} role="status">
        <SearchX size={28} strokeWidth={1.6} aria-hidden="true" />
        <p>{emptyText}</p>
      </div>
    );
  }

  return (
    <div className={styles.grid}>
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}
