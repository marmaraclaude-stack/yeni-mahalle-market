"use client";

// Ürün detay aksiyonları — adet seçici (+/-) ve "Sepete Ekle".
// useCart sözleşmesini tüketir. Orderable olmayan kategori (örn. sigara-tutun)
// için buton disabled + "mağazadan alınır" notu gösterilir.

import { useEffect, useRef, useState } from "react";
import {
  Check,
  Minus,
  PackageX,
  Plus,
  ShoppingBasket,
  Store,
} from "lucide-react";
import type { Product } from "@/lib/shop/types";
import { categoryBySlug } from "@/lib/shop/categories";
import { useCart } from "@/components/shop/CartProvider";
import styles from "./urun.module.css";

const MAX_QTY = 99;

export default function DetailActions({ product }: { product: Product }) {
  const { add } = useCart();
  const [qty, setQty] = useState(1);
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
      <div className={styles.actions}>
        <button
          type="button"
          className={`${styles.addBtn} ${styles.addBtnMuted}`}
          disabled
        >
          <Store size={17} strokeWidth={2} aria-hidden="true" />
          Mağazadan alınır
        </button>
        <p className={styles.storeNote}>
          Bu ürün yalnızca mağazadan satın alınabilir.
        </p>
      </div>
    );
  }

  if (!product.in_stock) {
    return (
      <div className={styles.actions}>
        <button
          type="button"
          className={`${styles.addBtn} ${styles.addBtnMuted}`}
          disabled
        >
          <PackageX size={17} strokeWidth={2} aria-hidden="true" />
          Stokta yok
        </button>
      </div>
    );
  }

  const handleAdd = () => {
    add(product, qty);
    setAdded(true);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setAdded(false), 1400);
  };

  return (
    <div className={styles.actions}>
      <div className={styles.qty} role="group" aria-label="Adet seçici">
        <button
          type="button"
          className={styles.qtyBtn}
          onClick={() => setQty((q) => Math.max(1, q - 1))}
          disabled={qty <= 1}
          aria-label="Adedi azalt"
        >
          <Minus size={16} strokeWidth={2.2} aria-hidden="true" />
        </button>
        <span className={styles.qtyValue} aria-live="polite">
          {qty}
        </span>
        <button
          type="button"
          className={styles.qtyBtn}
          onClick={() => setQty((q) => Math.min(MAX_QTY, q + 1))}
          disabled={qty >= MAX_QTY}
          aria-label="Adedi artır"
        >
          <Plus size={16} strokeWidth={2.2} aria-hidden="true" />
        </button>
      </div>

      <button
        type="button"
        className={`${styles.addBtn}${added ? ` ${styles.addBtnDone}` : ""}`}
        onClick={handleAdd}
        aria-label={`${product.name}, ${qty} adet sepete ekle`}
      >
        {added ? (
          <Check size={17} strokeWidth={2.4} aria-hidden="true" />
        ) : (
          <ShoppingBasket size={17} strokeWidth={2.1} aria-hidden="true" />
        )}
        {added ? "Sepete eklendi" : "Sepete Ekle"}
      </button>
    </div>
  );
}
