"use client";

// Sağ "Sepetim" paneli — Getir web düzeni, yalnız masaüstünde görünür
// (gizleme shop.module.css .cartPanel ile). Boş durum: ikon + "Sepetin şu an
// boş". Dolu: kompakt satırlar (küçük thumb, ad 1 satır, mini adet stepper,
// satır fiyatı), altta Toplam + "Siparişi Tamamla" (/sepet).
// Hydration: sunucuda sepet boş kabul edilir (CartProvider localStorage'ı
// yalnız client'ta okur), panel client'ta doğal olarak güncellenir.

import { createElement } from "react";
import Link from "next/link";
import { Minus, Plus, ShoppingBasket, Trash2 } from "lucide-react";
import { formatTL } from "@/lib/shop/types";
import { CATEGORY_TINTS, categoryBySlug } from "@/lib/shop/categories";
import { useCart } from "@/components/shop/CartProvider";
import { iconFor } from "@/components/shop/ProductCard";
import styles from "@/app/urunler/shop.module.css";

export default function CartPanel() {
  const { lines, count, subtotal, setQty } = useCart();

  return (
    <aside className={styles.cartPanel} aria-label="Sepetim">
      <div className={styles.cartHead}>
        <p className={styles.cartTitle}>Sepetim</p>
        {count > 0 && (
          <span className={styles.cartCount} aria-label={`${count} ürün`}>
            {count}
          </span>
        )}
      </div>

      {lines.length === 0 ? (
        <div className={styles.cartEmpty}>
          <span className={styles.cartEmptyIcon} aria-hidden="true">
            <ShoppingBasket size={26} strokeWidth={1.8} />
          </span>
          <p className={styles.cartEmptyTitle}>Sepetin şu an boş</p>
          <p className={styles.cartEmptyText}>
            Sipariş vermek için sepetine ürün ekle.
          </p>
        </div>
      ) : (
        <>
          <ul className={styles.cartLines}>
            {lines.map((l) => {
              const cat = categoryBySlug(l.categorySlug);
              const [bg, fg] =
                CATEGORY_TINTS[cat?.tint ?? 0] ?? CATEGORY_TINTS[0];
              return (
                <li key={l.productId} className={styles.cartLine}>
                  <span
                    className={styles.cartThumb}
                    style={
                      l.imageUrl ? undefined : { background: bg, color: fg }
                    }
                    aria-hidden="true"
                  >
                    {l.imageUrl ? (
                      <img src={l.imageUrl} alt="" loading="lazy" />
                    ) : (
                      createElement(iconFor(cat?.icon ?? "shopping-basket"), {
                        size: 18,
                        strokeWidth: 1.6,
                      })
                    )}
                  </span>

                  <span className={styles.cartLineInfo}>
                    <span className={styles.cartLineName} title={l.name}>
                      {l.name}
                    </span>
                    <span className={styles.cartLinePrice}>
                      {formatTL(l.price * l.qty)}
                    </span>
                  </span>

                  <span className={styles.stepper}>
                    <button
                      type="button"
                      className={styles.stepBtn}
                      onClick={() => setQty(l.productId, l.qty - 1)}
                      aria-label={
                        l.qty <= 1
                          ? `${l.name}, sepetten çıkar`
                          : `${l.name}, adedi azalt`
                      }
                    >
                      {l.qty <= 1 ? (
                        <Trash2 size={13} strokeWidth={2} aria-hidden="true" />
                      ) : (
                        <Minus size={13} strokeWidth={2.4} aria-hidden="true" />
                      )}
                    </button>
                    <span className={styles.stepQty} aria-live="polite">
                      {l.qty}
                    </span>
                    <button
                      type="button"
                      className={styles.stepBtn}
                      onClick={() => setQty(l.productId, l.qty + 1)}
                      aria-label={`${l.name}, adedi artır`}
                    >
                      <Plus size={13} strokeWidth={2.4} aria-hidden="true" />
                    </button>
                  </span>
                </li>
              );
            })}
          </ul>

          <div className={styles.cartFoot}>
            <p className={styles.cartTotalRow}>
              <span className={styles.cartTotalLabel}>Toplam</span>
              <span className={styles.cartTotalValue}>
                {formatTL(subtotal)}
              </span>
            </p>
            <Link href="/sepet" className={styles.checkoutBtn}>
              Siparişi Tamamla
            </Link>
          </div>
        </>
      )}
    </aside>
  );
}
