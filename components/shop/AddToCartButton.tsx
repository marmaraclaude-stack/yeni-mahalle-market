"use client";

// Yuvarlak "+" sepete ekle butonu — ürün kartında görselin sağ üst köşesine
// bindirilir (konum shop.module.css .plusBtn ile gelir). Kart linkinin DIŞINDA
// render edildiği için tıklaması navigasyonu tetiklemez. Tıklanınca kısa ✓
// animasyonu oynar. Kategori orderable değilse (örn. sigara-tutun) veya stok
// yoksa buton yerine küçük gri rozet basılır.

import { useEffect, useRef, useState } from "react";
import { Check, Plus } from "lucide-react";
import type { Product } from "@/lib/shop/types";
import { categoryBySlug } from "@/lib/shop/categories";
import { useCart } from "@/components/shop/CartProvider";
import styles from "@/app/urunler/shop.module.css";

export default function AddToCartButton({ product }: { product: Product }) {
  const { add } = useCart();
  const [added, setAdded] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Unmount'ta bekleyen zamanlayıcıyı temizle
  useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  // Tütün vb. — yasal olarak online satılamaz, sadece mağazadan
  const orderable = categoryBySlug(product.category_slug)?.orderable ?? true;

  if (!orderable) {
    return (
      <span
        className={styles.cornerBadge}
        title="Bu ürün yalnızca mağazadan satın alınabilir"
      >
        Mağazadan alınır
      </span>
    );
  }

  if (!product.in_stock) {
    return <span className={styles.cornerBadge}>Stokta yok</span>;
  }

  const handleAdd = () => {
    add(product);
    setAdded(true);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setAdded(false), 1200);
  };

  return (
    <button
      type="button"
      className={`${styles.plusBtn}${added ? ` ${styles.plusBtnDone}` : ""}`}
      onClick={handleAdd}
      aria-label={`${product.name}, sepete ekle`}
    >
      {added ? (
        <Check size={16} strokeWidth={2.6} aria-hidden="true" />
      ) : (
        <Plus size={16} strokeWidth={2.4} aria-hidden="true" />
      )}
    </button>
  );
}
