"use client";

// Ürün detay aksiyonları — temiz/premium adet seçici + dengeli "Sepete Ekle"
// (buton içinde canlı toplam: adet x fiyat, sağa pinli). useCart sözleşmesini
// tüketir. Ürün sepetteyse "Sepette N adet" satırı + hızlı artır/azalt (setQty)
// gösterilir. Orderable olmayan kategori (örn. sigara-tutun) için buton disabled
// + "mağazadan alınır" notu; stok yoksa buton disabled.

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Check,
  CreditCard,
  Minus,
  PackageX,
  Plus,
  ShoppingBasket,
  Store,
} from "lucide-react";
import type { Product } from "@/lib/shop/types";
import { formatTL } from "@/lib/shop/types";
import { categoryBySlug } from "@/lib/shop/categories";
import { useCart } from "@/components/shop/CartProvider";
import styles from "./urun.module.css";

const MAX_QTY = 99;

export default function DetailActions({ product }: { product: Product }) {
  const router = useRouter();
  const { add, lines, setQty: setCartQty } = useCart();
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
          <span className={styles.addBtnMain}>
            <Store size={18} strokeWidth={2} aria-hidden="true" />
            Mağazadan alınır
          </span>
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
          <span className={styles.addBtnMain}>
            <PackageX size={18} strokeWidth={2} aria-hidden="true" />
            Stokta yok
          </span>
        </button>
      </div>
    );
  }

  // Ürünün sepetteki mevcut adedi (0 = sepette değil).
  const inCartQty = lines.find((l) => l.productId === product.id)?.qty ?? 0;

  const handleAdd = () => {
    add(product, qty);
    setAdded(true);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setAdded(false), 1400);
  };

  // Satın Al — seçili adedi sepete ekle, ardından ödeme sayfasına geç.
  const handleBuyNow = () => {
    add(product, qty);
    router.push("/odeme");
  };

  const lineTotal = formatTL(Math.round(product.price * qty * 100) / 100);

  return (
    <div className={styles.actions}>
      <div className={styles.buyRow}>
        <div className={styles.qty} role="group" aria-label="Adet seçici">
          <button
            type="button"
            className={styles.qtyBtn}
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            disabled={qty <= 1}
            aria-label="Adedi azalt"
          >
            <Minus size={17} strokeWidth={2.2} aria-hidden="true" />
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
            <Plus size={17} strokeWidth={2.2} aria-hidden="true" />
          </button>
        </div>

        <button
          type="button"
          className={`${styles.addBtn}${added ? ` ${styles.addBtnDone}` : ""}`}
          onClick={handleAdd}
          aria-label={`${product.name}, ${qty} adet sepete ekle`}
        >
          {added ? (
            <span className={styles.addBtnMain}>
              <Check size={18} strokeWidth={2.4} aria-hidden="true" />
              Sepete eklendi
            </span>
          ) : (
            <>
              <span className={styles.addBtnMain}>
                <ShoppingBasket size={18} strokeWidth={2.1} aria-hidden="true" />
                Sepete Ekle
              </span>
              <span className={styles.addBtnPrice}>{lineTotal}</span>
            </>
          )}
        </button>

        <button
          type="button"
          className={styles.buyNowBtn}
          onClick={handleBuyNow}
          aria-label={`${product.name}, ${qty} adet satın al`}
        >
          <span className={styles.addBtnMain}>
            <CreditCard size={18} strokeWidth={2.1} aria-hidden="true" />
            Satın Al
          </span>
        </button>
      </div>

      {inCartQty > 0 && (
        <div className={styles.inCart}>
          <span className={styles.inCartLabel}>
            <ShoppingBasket size={15} strokeWidth={2.1} aria-hidden="true" />
            Sepette {inCartQty} adet
          </span>
          <div
            className={styles.inCartStepper}
            role="group"
            aria-label="Sepetteki adedi güncelle"
          >
            <button
              type="button"
              className={styles.inCartStepperBtn}
              onClick={() => setCartQty(product.id, inCartQty - 1)}
              aria-label="Sepetteki adedi azalt"
            >
              <Minus size={15} strokeWidth={2.2} aria-hidden="true" />
            </button>
            <span className={styles.inCartStepperValue} aria-live="polite">
              {inCartQty}
            </span>
            <button
              type="button"
              className={styles.inCartStepperBtn}
              onClick={() => setCartQty(product.id, Math.min(MAX_QTY, inCartQty + 1))}
              disabled={inCartQty >= MAX_QTY}
              aria-label="Sepetteki adedi artır"
            >
              <Plus size={15} strokeWidth={2.2} aria-hidden="true" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
