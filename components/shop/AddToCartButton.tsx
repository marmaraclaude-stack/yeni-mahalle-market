"use client";

// Kare-yuvarlak "+" sepete ekle butonu + kart içi stepper — Getir davranışı:
// ürün sepette değilken beyaz zeminli ince borderli "+" butonu; sepete
// eklenince aynı köşede kompakt [-] adet [+] stepper'a dönüşür. "-" ile adet
// 0'a düşünce satır sepetten çıkar ve buton tekrar "+" olur. Kartın sağ üst
// köşesine bindirilir (konum shop.module.css ile gelir) ve kart linkinin
// DIŞINDA render edildiği için tıklaması navigasyonu tetiklemez.
// Kategori orderable değilse (örn. sigara-tutun) veya stok yoksa buton
// yerine küçük gri rozet basılır.
// Hydration: sunucuda sepet boş kabul edilir ("+" çizilir), stepper client'ta
// CartProvider yüklenince doğal olarak görünür.

import { Minus, Plus, Trash2 } from "lucide-react";
import {
  formatGrams,
  isWeightBased,
  weightMinFor,
  weightStepFor,
  type Product,
} from "@/lib/shop/types";
import { categoryBySlug } from "@/lib/shop/categories";
import { useCart } from "@/components/shop/CartProvider";
import styles from "@/app/urunler/shop.module.css";

export default function AddToCartButton({ product }: { product: Product }) {
  const { add, setQty, lines } = useCart();

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

  const qty = lines.find((l) => l.productId === product.id)?.qty ?? 0;
  const byWeight = isWeightBased(product);
  const step = byWeight ? weightStepFor(product) : 1;
  const min = byWeight ? weightMinFor(product) : 1;
  // Bir adım azaltınca min'in altına düşüyorsa satır sepetten çıkar.
  const removesOnDec = qty - step < min;

  // Ürün sepette: "+" yerine kompakt stepper (Getir kart davranışı)
  if (qty > 0) {
    return (
      <span
        className={`${styles.cardStepper}${byWeight ? ` ${styles.cardStepperWeight}` : ""}`}
        role="group"
        aria-label={byWeight ? `${product.name} miktarı` : `${product.name} adedi`}
      >
        <button
          type="button"
          className={styles.cardStepBtn}
          onClick={() => setQty(product.id, removesOnDec ? 0 : qty - step)}
          aria-label={
            removesOnDec
              ? `${product.name}, sepetten çıkar`
              : `${product.name}, miktarı azalt`
          }
        >
          {removesOnDec ? (
            <Trash2 size={14} strokeWidth={2} aria-hidden="true" />
          ) : (
            <Minus size={14} strokeWidth={2.4} aria-hidden="true" />
          )}
        </button>
        <span className={styles.cardStepQty} aria-live="polite">
          {byWeight ? formatGrams(qty) : qty}
        </span>
        <button
          type="button"
          className={styles.cardStepBtn}
          onClick={() => add(product)}
          aria-label={`${product.name}, adedi artır`}
        >
          <Plus size={14} strokeWidth={2.4} aria-hidden="true" />
        </button>
      </span>
    );
  }

  return (
    <button
      type="button"
      className={styles.plusBtn}
      onClick={() => add(product)}
      aria-label={`${product.name}, sepete ekle`}
    >
      <Plus size={16} strokeWidth={2.4} aria-hidden="true" />
    </button>
  );
}
