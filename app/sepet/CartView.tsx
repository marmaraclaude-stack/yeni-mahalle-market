"use client";

// Sepet görünümü: satır düzenleme (adet +/−, kaldır), toplamlar, ödeme adımına
// geçiş. Girişsiz kullanıcıya özet kartı İÇİNDE, "Siparişi Tamamla" butonunun
// ÜSTÜNDE giriş/kayıt yönlendirme bloğu gösterilir; buton da disabled görünür
// ama tıklanınca /giris?next=/odeme'ye götürür. Satır adı ürün detayına Link.
// Sepet doluyken satırların altında "Bunları unutma" öneri grid'i (is_featured
// ürünler; sepette olanlar elenir, ilk 4 gösterilir).

import Link from "next/link";
import { useState } from "react";
import {
  Minus,
  Plus,
  ShoppingBasket,
  Trash2,
  UserRound,
} from "lucide-react";
import { useCart } from "@/components/shop/CartProvider";
import { CATEGORY_TINTS, categoryBySlug } from "@/lib/shop/categories";
import {
  computeLineTotal,
  formatGrams,
  formatTL,
  type Product,
} from "@/lib/shop/types";
import ProductCard from "@/components/shop/ProductCard";
import styles from "./sepet.module.css";

interface CartViewProps {
  loggedIn: boolean;
  deliveryFee: number;
  freeDeliveryOver: number;
  minOrderTotal: number;
  orderingOpen: boolean;
  closedMessage: string;
  /** "Bunları unutma" önerileri (is_featured, aktif, stokta). */
  featured: Product[];
}

export default function CartView({
  loggedIn,
  deliveryFee,
  freeDeliveryOver,
  minOrderTotal,
  orderingOpen,
  closedMessage,
  featured,
}: CartViewProps) {
  const { lines, count, subtotal, setQty, remove, clear } = useCart();

  // Kaldırılan satır önce yumuşakça solar, sonra sepetten çıkar (görsel geçiş).
  const [removingId, setRemovingId] = useState<string | null>(null);
  function removeWithFade(productId: string) {
    if (removingId) return;
    setRemovingId(productId);
    window.setTimeout(() => {
      remove(productId);
      setRemovingId(null);
    }, 200);
  }

  function clearWithConfirm() {
    if (window.confirm("Sepetteki tüm ürünler kaldırılsın mı?")) {
      clear();
    }
  }

  // 0 = ücretsiz teslimat eşiği yok (ücret her siparişe uygulanır): settings.calcDeliveryFee ile aynı kural
  const fee =
    freeDeliveryOver > 0 && subtotal >= freeDeliveryOver ? 0 : deliveryFee;
  const total = Math.round((subtotal + fee) * 100) / 100;
  const belowMin = minOrderTotal > 0 && subtotal < minOrderTotal;
  const canCheckout = lines.length > 0 && !belowMin && orderingOpen;

  // Ücretsiz teslimat ilerlemesi — teslimat zaten hep ücretsizse (fee 0)
  // veya eşik tanımsızsa gösterilmez.
  const showFreeShip = deliveryFee > 0 && freeDeliveryOver > 0;
  const freeShipDone = freeDeliveryOver > 0 && subtotal >= freeDeliveryOver;

  // Öneriler: sepette zaten olan ürünler elenir, en fazla 4 gösterilir.
  const suggestions = featured
    .filter((p) => !lines.some((l) => l.productId === p.id))
    .slice(0, 4);

  if (lines.length === 0) {
    return (
      <main className={styles.page}>
        <div className="container">
          <header className={styles.head}>
            <h1 className={styles.title}>Sepetim</h1>
            <p className={styles.sub}>
              Ürünlerini gözden geçir, adetleri düzenle, siparişini tamamla.
            </p>
          </header>
          <div className={styles.empty}>
            <span className={styles.emptyBadge} aria-hidden="true">
              <ShoppingBasket />
            </span>
            <h2 className={styles.emptyTitle}>Sepetiniz şu an boş</h2>
            <p className={styles.emptyText}>
              Taze ürünler ve mahalle fiyatları sizi bekliyor. Alışverişe
              başlayın, siparişinizi kapınıza getirelim.
            </p>
            <Link href="/urunler" className="btn btn--accent btn--lg">
              Alışverişe Başla
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.page}>
      <div className="container">
        <header className={styles.head}>
          <h1 className={styles.title}>
            Sepetim <span className={styles.countNote}>({count} ürün)</span>
          </h1>
          <p className={styles.sub}>
            Ürünlerini gözden geçir, adetleri düzenle, siparişini tamamla.
          </p>
        </header>

        {!orderingOpen && (
          <p className={styles.closedBanner} role="status">
            {closedMessage}
          </p>
        )}

        <div className={styles.layout}>
          <div className={styles.linesCol}>
            <ul className={styles.lines}>
              {lines.map((line) => {
                const category = categoryBySlug(line.categorySlug);
                const [bg, fg] = CATEGORY_TINTS[category?.tint ?? 0];
                const lineStep = line.soldByWeight ? line.weightStep : 1;
                const lineMin = line.soldByWeight ? line.weightMin : 1;
                return (
                  <li
                    key={line.productId}
                    className={`${styles.line} ${
                      removingId === line.productId ? styles.lineRemoving : ""
                    }`}
                  >
                    <Link
                      href={`/urunler/${line.slug}`}
                      className={styles.thumb}
                      style={
                        line.imageUrl
                          ? undefined
                          : { background: bg, color: fg }
                      }
                      tabIndex={-1}
                      aria-hidden="true"
                    >
                      {line.imageUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={line.imageUrl} alt="" loading="lazy" />
                      ) : (
                        <ShoppingBasket aria-hidden="true" />
                      )}
                    </Link>

                    <div className={styles.lineInfo}>
                      <Link
                        href={`/urunler/${line.slug}`}
                        className={styles.lineName}
                      >
                        {line.name}
                      </Link>
                      <span className={styles.lineMeta}>
                        {[line.brand, line.soldByWeight ? "" : line.sizeText]
                          .filter(Boolean)
                          .join(" · ")}
                      </span>
                      <span className={styles.lineUnitPrice}>
                        Birim {formatTL(line.price)}
                        {line.soldByWeight ? " / kg" : ""}
                      </span>
                    </div>

                    <div className={styles.lineActions}>
                      <div
                        className={styles.stepper}
                        role="group"
                        aria-label={
                          line.soldByWeight
                            ? `${line.name} miktarı`
                            : `${line.name} adedi`
                        }
                      >
                        <button
                          type="button"
                          className={styles.stepBtn}
                          onClick={() =>
                            setQty(
                              line.productId,
                              line.qty - lineStep < lineMin
                                ? 0
                                : line.qty - lineStep,
                            )
                          }
                          aria-label={`${line.name} miktarını azalt`}
                        >
                          <Minus aria-hidden="true" />
                        </button>
                        <span className={styles.stepQty} aria-live="polite">
                          {line.soldByWeight ? formatGrams(line.qty) : line.qty}
                        </span>
                        <button
                          type="button"
                          className={styles.stepBtn}
                          onClick={() => setQty(line.productId, line.qty + lineStep)}
                          aria-label={`${line.name} miktarını artır`}
                        >
                          <Plus aria-hidden="true" />
                        </button>
                      </div>
                      <span className={styles.lineTotal}>
                        {formatTL(
                          computeLineTotal(
                            line.price,
                            line.qty,
                            line.soldByWeight,
                            line.packPrices,
                          ),
                        )}
                      </span>
                      <button
                        type="button"
                        className={styles.removeBtn}
                        onClick={() => removeWithFade(line.productId)}
                        aria-label={`${line.name} ürününü sepetten kaldır`}
                      >
                        <Trash2 aria-hidden="true" />
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>

            {suggestions.length > 0 && (
              <section
                className={styles.suggest}
                aria-labelledby="suggest-title"
              >
                <div className={styles.suggestHead}>
                  <h2 id="suggest-title" className={styles.suggestTitle}>
                    Bunları unutma
                  </h2>
                  <p className={styles.suggestSub}>
                    Sepetine eklemek isteyebileceğin öne çıkan ürünler.
                  </p>
                </div>
                <div className={styles.suggestGrid}>
                  {suggestions.map((p) => (
                    <ProductCard key={p.id} product={p} />
                  ))}
                </div>
              </section>
            )}
          </div>

          <aside className={styles.summary} aria-label="Sipariş özeti">
            <h2 className={styles.summaryTitle}>Sipariş Özeti</h2>

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

            <dl className={styles.summaryRows}>
              <div className={styles.summaryRow}>
                <dt>Ürün Adedi</dt>
                <dd>{count}</dd>
              </div>
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

            {belowMin && (
              <p className={styles.warn} role="status">
                Minimum sipariş tutarı {formatTL(minOrderTotal)}. Sepetinize{" "}
                {formatTL(minOrderTotal - subtotal)} değerinde ürün daha ekleyin.
              </p>
            )}

            {!loggedIn && (
              <div className={styles.authBox} role="note">
                <span className={styles.authBoxIcon} aria-hidden="true">
                  <UserRound />
                </span>
                <p className={styles.authBoxText}>
                  Siparişini tamamlamak için giriş yap
                </p>
                <div className={styles.authBoxBtns}>
                  <Link
                    href="/giris?next=/odeme"
                    className={`btn btn--accent ${styles.authBtn}`}
                  >
                    Giriş Yap
                  </Link>
                  <Link
                    href="/kayit?next=/odeme"
                    className={`btn btn--ghost ${styles.authBtn}`}
                  >
                    Kayıt Ol
                  </Link>
                </div>
              </div>
            )}

            {!loggedIn && orderingOpen ? (
              /* Girişsiz: disabled görünümlü ama tıklanabilir → giriş sayfası */
              <Link
                href="/giris?next=/odeme"
                className={`btn btn--accent btn--lg ${styles.checkoutBtn} ${styles.checkoutLocked}`}
                aria-disabled="true"
              >
                Siparişi Tamamla
              </Link>
            ) : canCheckout ? (
              <Link
                href="/odeme"
                className={`btn btn--accent btn--lg ${styles.checkoutBtn}`}
              >
                Siparişi Tamamla
              </Link>
            ) : (
              <span
                className={`btn btn--accent btn--lg ${styles.checkoutBtn} ${styles.checkoutDisabled}`}
                aria-disabled="true"
              >
                Siparişi Tamamla
              </span>
            )}

            <Link href="/urunler" className={styles.continueLink}>
              Alışverişe devam et
            </Link>
            <button
              type="button"
              className={styles.clearCart}
              onClick={clearWithConfirm}
            >
              <Trash2 aria-hidden="true" /> Sepeti Temizle
            </button>
          </aside>
        </div>
      </div>
    </main>
  );
}
