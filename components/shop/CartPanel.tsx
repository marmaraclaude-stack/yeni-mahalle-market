"use client";

// Sağ "Sepetim" paneli — Getir web düzeni, yalnız masaüstünde görünür
// (gizleme shop.module.css .cartPanel ile). Boş durum: ikon + "Sepetin şu an
// boş". Dolu: kompakt satırlar (küçük thumb, ad 1 satır, mini adet stepper,
// satır fiyatı), altta ücretsiz teslimat ilerlemesi (deliveryFee > 0 ve
// freeDeliveryOver > 0 iken) + Toplam + "Siparişi Tamamla" (/sepet).
// Settings prop'ları sunucudan gelir (app/urunler/page.tsx → getShopSettings).
// Hydration: sunucuda sepet boş kabul edilir (CartProvider localStorage'ı
// yalnız client'ta okur), panel client'ta doğal olarak güncellenir.

import { createElement } from "react";
import Link from "next/link";
import { Minus, Plus, ShoppingBasket, Trash2 } from "lucide-react";
import { computeLineTotal, formatGrams, formatTL } from "@/lib/shop/types";
import { CATEGORY_TINTS, categoryBySlug } from "@/lib/shop/categories";
import { useCart } from "@/components/shop/CartProvider";
import { iconFor } from "@/components/shop/ProductCard";
import styles from "@/app/urunler/shop.module.css";

export default function CartPanel({
  deliveryFee = 0,
  freeDeliveryOver = 0,
}: {
  deliveryFee?: number;
  freeDeliveryOver?: number;
}) {
  const { lines, count, subtotal, setQty } = useCart();

  // Teslimat zaten hep ücretsizse (fee 0) veya eşik tanımsızsa bar gereksiz.
  const showFreeShip = deliveryFee > 0 && freeDeliveryOver > 0;
  const freeShipDone = subtotal >= freeDeliveryOver;

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
              const lStep = l.soldByWeight ? l.weightStep : 1;
              const lMin = l.soldByWeight ? l.weightMin : 1;
              const lRemoves = l.qty - lStep < lMin;
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
                      {formatTL(
                        computeLineTotal(l.price, l.qty, l.soldByWeight),
                      )}
                    </span>
                  </span>

                  <span className={styles.stepper}>
                    <button
                      type="button"
                      className={styles.stepBtn}
                      onClick={() =>
                        setQty(l.productId, lRemoves ? 0 : l.qty - lStep)
                      }
                      aria-label={
                        lRemoves
                          ? `${l.name}, sepetten çıkar`
                          : `${l.name}, miktarı azalt`
                      }
                    >
                      {lRemoves ? (
                        <Trash2 size={13} strokeWidth={2} aria-hidden="true" />
                      ) : (
                        <Minus size={13} strokeWidth={2.4} aria-hidden="true" />
                      )}
                    </button>
                    <span className={styles.stepQty} aria-live="polite">
                      {l.soldByWeight ? formatGrams(l.qty) : l.qty}
                    </span>
                    <button
                      type="button"
                      className={styles.stepBtn}
                      onClick={() =>
                        setQty(
                          l.productId,
                          l.qty + lStep,
                        )
                      }
                      aria-label={`${l.name}, miktarı artır`}
                    >
                      <Plus size={13} strokeWidth={2.4} aria-hidden="true" />
                    </button>
                  </span>
                </li>
              );
            })}
          </ul>

          <div className={styles.cartFoot}>
            {showFreeShip && (
              <div className={styles.freeShip} aria-live="polite">
                {freeShipDone ? (
                  <p
                    className={`${styles.freeShipText} ${styles.freeShipTextDone}`}
                  >
                    Teslimat ücretsiz!
                  </p>
                ) : (
                  <p className={styles.freeShipText}>
                    Ücretsiz teslimata{" "}
                    <strong>{formatTL(freeDeliveryOver - subtotal)}</strong>{" "}
                    kaldı
                  </p>
                )}
                <span className={styles.freeShipBar} aria-hidden="true">
                  <span
                    className={`${styles.freeShipFill}${
                      freeShipDone ? ` ${styles.freeShipFillDone}` : ""
                    }`}
                    style={{
                      width: `${Math.min(100, (subtotal / freeDeliveryOver) * 100)}%`,
                    }}
                  />
                </span>
              </div>
            )}
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
