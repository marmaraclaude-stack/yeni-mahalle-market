"use client";

// Sepete ekle butonu — CartProvider'daki useCart sözleşmesini tüketir.
// Kategori orderable değilse (örn. sigara-tutun) veya stok yoksa disabled.

import { useEffect, useRef, useState } from "react";
import { Check, PackageX, Plus, Store } from "lucide-react";
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
      <button
        type="button"
        className={`${styles.addBtn} ${styles.addBtnMuted}`}
        disabled
        title="Bu ürün yalnızca mağazadan satın alınabilir"
      >
        <Store size={15} strokeWidth={2} aria-hidden="true" />
        Mağazadan alınır
      </button>
    );
  }

  if (!product.in_stock) {
    return (
      <button
        type="button"
        className={`${styles.addBtn} ${styles.addBtnMuted}`}
        disabled
      >
        <PackageX size={15} strokeWidth={2} aria-hidden="true" />
        Stokta yok
      </button>
    );
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
      className={`${styles.addBtn}${added ? ` ${styles.addBtnDone}` : ""}`}
      onClick={handleAdd}
      aria-label={`${product.name}, sepete ekle`}
    >
      {added ? (
        <Check size={15} strokeWidth={2.4} aria-hidden="true" />
      ) : (
        <Plus size={15} strokeWidth={2.4} aria-hidden="true" />
      )}
      {added ? "Eklendi" : "Sepete Ekle"}
    </button>
  );
}
