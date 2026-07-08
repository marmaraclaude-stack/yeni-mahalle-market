"use client";

// Ürün detay aksiyonları — temiz/premium adet seçici + dengeli "Sepete Ekle"
// (buton içinde canlı toplam: adet x fiyat, sağa pinli). useCart sözleşmesini
// tüketir. Ürün sepetteyse "Sepette N adet" satırı + hızlı artır/azalt (setQty)
// gösterilir. Orderable olmayan kategori (örn. sigara-tutun) için buton disabled
// + "mağazadan alınır" notu; stok yoksa buton disabled.

import { useEffect, useRef, useState } from "react";
import {
  Check,
  Minus,
  PackageX,
  Plus,
  ShoppingBasket,
  Store,
} from "lucide-react";
import {
  clampGrams,
  computeLineTotal,
  formatGrams,
  formatTL,
  isWeightBased,
  WEIGHT_MAX_GRAMS,
  WEIGHT_MIN_GRAMS,
  WEIGHT_STEP_GRAMS,
  type Product,
} from "@/lib/shop/types";
import { categoryBySlug } from "@/lib/shop/categories";
import { useCart } from "@/components/shop/CartProvider";
import styles from "./urun.module.css";

const MAX_QTY = 99;
// Gram bazlı ürünlerde hızlı seçim kısayolları.
const WEIGHT_PRESETS = [250, 500, 1000, 2000];

export default function DetailActions({ product }: { product: Product }) {
  const { add, lines, setQty: setCartQty } = useCart();
  const byWeight = isWeightBased(product);
  // Gram bazlıysa varsayılan 500 g; adetliyse 1.
  const [qty, setQty] = useState(byWeight ? WEIGHT_STEP_GRAMS * 2 : 1);
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

  // Ürünün sepetteki mevcut miktarı (adet ya da gram; 0 = sepette değil).
  const inCartQty = lines.find((l) => l.productId === product.id)?.qty ?? 0;

  const step = byWeight ? WEIGHT_STEP_GRAMS : 1;
  const minQ = byWeight ? WEIGHT_MIN_GRAMS : 1;
  const maxQ = byWeight ? WEIGHT_MAX_GRAMS : MAX_QTY;

  const handleAdd = () => {
    add(product, qty);
    setAdded(true);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setAdded(false), 1400);
  };

  const lineTotal = formatTL(computeLineTotal(product.price, qty, byWeight));
  const qtyLabel = byWeight ? formatGrams(qty) : `${qty} adet`;

  return (
    <div className={styles.actions}>
      {byWeight && (
        <div className={styles.weightPicker}>
          <p className={styles.weightHint}>
            Kilogram fiyatı <strong>{formatTL(product.price)}</strong> · ne kadar
            istersiniz?
          </p>
          <div
            className={styles.weightChips}
            role="group"
            aria-label="Hazır miktarlar"
          >
            {WEIGHT_PRESETS.map((g) => (
              <button
                key={g}
                type="button"
                className={`${styles.weightChip}${qty === g ? ` ${styles.weightChipActive}` : ""}`}
                onClick={() => setQty(g)}
                aria-pressed={qty === g}
              >
                {formatGrams(g)}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className={styles.buyRow}>
        <div
          className={styles.qty}
          role="group"
          aria-label={byWeight ? "Miktar seçici" : "Adet seçici"}
        >
          <button
            type="button"
            className={styles.qtyBtn}
            onClick={() => setQty((q) => Math.max(minQ, q - step))}
            disabled={qty <= minQ}
            aria-label={byWeight ? "Miktarı azalt" : "Adedi azalt"}
          >
            <Minus size={17} strokeWidth={2.2} aria-hidden="true" />
          </button>
          {byWeight ? (
            <input
              type="number"
              className={styles.qtyInput}
              value={qty}
              min={WEIGHT_MIN_GRAMS}
              max={WEIGHT_MAX_GRAMS}
              step={WEIGHT_STEP_GRAMS}
              inputMode="numeric"
              aria-label="Gram cinsinden miktar"
              onChange={(e) => {
                const v = Number(e.target.value);
                setQty(Number.isFinite(v) && v > 0 ? Math.round(v) : WEIGHT_MIN_GRAMS);
              }}
              onBlur={() => setQty((q) => clampGrams(q))}
            />
          ) : (
            <span className={styles.qtyValue} aria-live="polite">
              {qty}
            </span>
          )}
          <button
            type="button"
            className={styles.qtyBtn}
            onClick={() => setQty((q) => Math.min(maxQ, q + step))}
            disabled={qty >= maxQ}
            aria-label={byWeight ? "Miktarı artır" : "Adedi artır"}
          >
            <Plus size={17} strokeWidth={2.2} aria-hidden="true" />
          </button>
        </div>

        <button
          type="button"
          className={`${styles.addBtn}${added ? ` ${styles.addBtnDone}` : ""}`}
          onClick={handleAdd}
          aria-label={`${product.name}, ${qtyLabel} sepete ekle`}
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
      </div>

      {byWeight && (
        <p className={styles.weightGramNote}>
          {formatGrams(qty)} için {lineTotal} — en az {formatGrams(WEIGHT_MIN_GRAMS)},{" "}
          {formatGrams(WEIGHT_STEP_GRAMS)} adımlarla.
        </p>
      )}

      {inCartQty > 0 && (
        <div className={styles.inCart}>
          <span className={styles.inCartLabel}>
            <ShoppingBasket size={15} strokeWidth={2.1} aria-hidden="true" />
            Sepette {byWeight ? formatGrams(inCartQty) : `${inCartQty} adet`}
          </span>
          <div
            className={styles.inCartStepper}
            role="group"
            aria-label={
              byWeight ? "Sepetteki miktarı güncelle" : "Sepetteki adedi güncelle"
            }
          >
            <button
              type="button"
              className={styles.inCartStepperBtn}
              onClick={() => setCartQty(product.id, inCartQty - step)}
              aria-label={byWeight ? "Sepetteki miktarı azalt" : "Sepetteki adedi azalt"}
            >
              <Minus size={15} strokeWidth={2.2} aria-hidden="true" />
            </button>
            <span className={styles.inCartStepperValue} aria-live="polite">
              {byWeight ? formatGrams(inCartQty) : inCartQty}
            </span>
            <button
              type="button"
              className={styles.inCartStepperBtn}
              onClick={() => setCartQty(product.id, Math.min(maxQ, inCartQty + step))}
              disabled={inCartQty >= maxQ}
              aria-label={byWeight ? "Sepetteki miktarı artır" : "Sepetteki adedi artır"}
            >
              <Plus size={15} strokeWidth={2.2} aria-hidden="true" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
