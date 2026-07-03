"use client";

// Sepet görünümü — satır düzenleme (adet +/−, kaldır), toplamlar, ödeme adımına geçiş.

import Link from "next/link";
import {
  ArrowRight,
  Minus,
  Plus,
  ShoppingBasket,
  Trash2,
} from "lucide-react";
import { useCart } from "@/components/shop/CartProvider";
import { CATEGORY_TINTS, categoryBySlug } from "@/lib/shop/categories";
import { formatTL } from "@/lib/shop/types";
import styles from "./sepet.module.css";

interface CartViewProps {
  deliveryFee: number;
  freeDeliveryOver: number;
  minOrderTotal: number;
  orderingOpen: boolean;
  closedMessage: string;
}

export default function CartView({
  deliveryFee,
  freeDeliveryOver,
  minOrderTotal,
  orderingOpen,
  closedMessage,
}: CartViewProps) {
  const { lines, count, subtotal, setQty, remove } = useCart();

  // 0 = ücretsiz teslimat eşiği yok (ücret her siparişe uygulanır) — settings.calcDeliveryFee ile aynı kural
  const fee =
    freeDeliveryOver > 0 && subtotal >= freeDeliveryOver ? 0 : deliveryFee;
  const total = Math.round((subtotal + fee) * 100) / 100;
  const belowMin = minOrderTotal > 0 && subtotal < minOrderTotal;
  const canCheckout = lines.length > 0 && !belowMin && orderingOpen;

  if (lines.length === 0) {
    return (
      <main className={styles.page}>
        <div className={styles.container}>
          <h1 className={styles.title}>Sepetim</h1>
          <div className={styles.empty}>
            <ShoppingBasket aria-hidden="true" className={styles.emptyIcon} />
            <p>Sepetiniz şu an boş.</p>
            <Link href="/urunler" className="btn btn--accent">
              Alışverişe Başla <ArrowRight aria-hidden="true" />
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <h1 className={styles.title}>
          Sepetim <span className={styles.countNote}>({count} ürün)</span>
        </h1>

        {!orderingOpen && (
          <p className={styles.closedBanner} role="status">
            {closedMessage}
          </p>
        )}

        <div className={styles.layout}>
          <ul className={styles.lines}>
            {lines.map((line) => {
              const category = categoryBySlug(line.categorySlug);
              const [bg, fg] = CATEGORY_TINTS[category?.tint ?? 0];
              return (
                <li key={line.productId} className={styles.line}>
                  <div
                    className={styles.thumb}
                    style={
                      line.imageUrl ? undefined : { background: bg, color: fg }
                    }
                  >
                    {line.imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={line.imageUrl} alt="" loading="lazy" />
                    ) : (
                      <ShoppingBasket aria-hidden="true" />
                    )}
                  </div>

                  <div className={styles.lineInfo}>
                    <span className={styles.lineName}>{line.name}</span>
                    <span className={styles.lineMeta}>
                      {[line.brand, line.sizeText].filter(Boolean).join(" · ")}
                    </span>
                    <span className={styles.lineUnitPrice}>
                      {formatTL(line.price)}
                    </span>
                  </div>

                  <div className={styles.lineActions}>
                    <div
                      className={styles.stepper}
                      role="group"
                      aria-label={`${line.name} adedi`}
                    >
                      <button
                        type="button"
                        className={styles.stepBtn}
                        onClick={() => setQty(line.productId, line.qty - 1)}
                        aria-label={`${line.name} adedini azalt`}
                      >
                        <Minus aria-hidden="true" />
                      </button>
                      <span className={styles.stepQty} aria-live="polite">
                        {line.qty}
                      </span>
                      <button
                        type="button"
                        className={styles.stepBtn}
                        onClick={() => setQty(line.productId, line.qty + 1)}
                        aria-label={`${line.name} adedini artır`}
                      >
                        <Plus aria-hidden="true" />
                      </button>
                    </div>
                    <span className={styles.lineTotal}>
                      {formatTL(line.price * line.qty)}
                    </span>
                    <button
                      type="button"
                      className={styles.removeBtn}
                      onClick={() => remove(line.productId)}
                      aria-label={`${line.name} ürününü sepetten kaldır`}
                    >
                      <Trash2 aria-hidden="true" />
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>

          <aside className={styles.summary} aria-label="Sipariş özeti">
            <h2 className={styles.summaryTitle}>Sipariş Özeti</h2>
            <dl className={styles.summaryRows}>
              <div className={styles.summaryRow}>
                <dt>Ara Toplam</dt>
                <dd>{formatTL(subtotal)}</dd>
              </div>
              <div className={styles.summaryRow}>
                <dt>Teslimat Ücreti</dt>
                <dd>{fee === 0 ? "Ücretsiz" : formatTL(fee)}</dd>
              </div>
              <div className={`${styles.summaryRow} ${styles.summaryTotal}`}>
                <dt>Toplam</dt>
                <dd>{formatTL(total)}</dd>
              </div>
            </dl>

            {fee > 0 && freeDeliveryOver > 0 && (
              <p className={styles.hint}>
                {formatTL(freeDeliveryOver)} üzeri siparişlerde teslimat ücretsiz.
              </p>
            )}
            {belowMin && (
              <p className={styles.warn} role="status">
                Minimum sipariş tutarı {formatTL(minOrderTotal)}. Sepetinize{" "}
                {formatTL(minOrderTotal - subtotal)} değerinde ürün daha ekleyin.
              </p>
            )}

            {canCheckout ? (
              <Link href="/odeme" className={`btn btn--accent ${styles.checkoutBtn}`}>
                Siparişi Tamamla <ArrowRight aria-hidden="true" />
              </Link>
            ) : (
              <span
                className={`btn btn--accent ${styles.checkoutBtn} ${styles.checkoutDisabled}`}
                aria-disabled="true"
              >
                Siparişi Tamamla <ArrowRight aria-hidden="true" />
              </span>
            )}
            <Link href="/urunler" className={styles.continueLink}>
              Alışverişe devam et
            </Link>
          </aside>
        </div>
      </div>
    </main>
  );
}
