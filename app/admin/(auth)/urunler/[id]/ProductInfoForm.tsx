"use client";

// Admin ürün bilgi formu — istemci adası.
// "Gram bazlı sat" işaretlenince: Gramaj ve Birim alanları GİZLENİR
// (gramı müşteri seçer, birim otomatik "kg"), fiyat etiketi "kilogram fiyatı"
// olur. saveAction sunucudan prop olarak gelir; alan adları aynı kalır.

import Link from "next/link";
import { useState } from "react";
import type { Product } from "@/lib/shop/types";
import styles from "../../../admin.module.css";

interface Props {
  saveAction: (formData: FormData) => void | Promise<void>;
  product: Product;
  categories: { slug: string; name: string }[];
  units: string[];
}

export default function ProductInfoForm({
  saveAction,
  product,
  categories,
  units,
}: Props) {
  const [byWeight, setByWeight] = useState(product.sold_by_weight);

  return (
    <form action={saveAction}>
      <div className={styles.editFormGrid}>
        <div className={`${styles.field} ${styles.fieldFull}`}>
          <label className={styles.label} htmlFor="p-name">
            Ürün adı *
          </label>
          <input
            id="p-name"
            name="name"
            required
            defaultValue={product.name}
            className={styles.input}
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="p-brand">
            Marka
          </label>
          <input
            id="p-brand"
            name="brand"
            defaultValue={product.brand}
            className={styles.input}
          />
        </div>

        {/* Gram bazlı satışta gramaj anlamsız — gizlenir. */}
        {!byWeight && (
          <div className={styles.field}>
            <label className={styles.label} htmlFor="p-size">
              Gramaj (örn. 1 L, 350 g)
            </label>
            <input
              id="p-size"
              name="size_text"
              defaultValue={product.size_text}
              className={styles.input}
            />
          </div>
        )}

        <div className={styles.field}>
          <label className={styles.label} htmlFor="p-category">
            Kategori
          </label>
          <select
            id="p-category"
            name="category_slug"
            defaultValue={product.category_slug}
            className={styles.select}
          >
            {categories.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Gram bazlıysa birim otomatik "kg" — seçime gerek yok. */}
        {!byWeight && (
          <div className={styles.field}>
            <label className={styles.label} htmlFor="p-unit">
              Birim
            </label>
            <select
              id="p-unit"
              name="unit"
              defaultValue={product.unit || "adet"}
              className={styles.select}
            >
              {units.map((u) => (
                <option key={u} value={u}>
                  {u}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className={styles.field}>
          <label className={styles.label} htmlFor="p-price">
            {byWeight ? "Kilogram fiyatı (₺/kg) *" : "Fiyat (TL) *"}
          </label>
          <input
            id="p-price"
            name="price"
            required
            inputMode="decimal"
            defaultValue={String(product.price)}
            className={styles.input}
          />
        </div>

        <div className={`${styles.field} ${styles.fieldFull}`}>
          <label className={styles.checkLabel}>
            <input
              type="checkbox"
              name="sold_by_weight"
              checked={byWeight}
              onChange={(e) => setByWeight(e.target.checked)}
            />
            Gram bazlı sat (kilogram fiyatı) — müşteri kaç gram istediğini seçer,
            fiyat kg üzerinden hesaplanır. Meyve-sebze için idealdir.
          </label>
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="p-compare">
            Eski fiyat (indirim için, boş bırakılabilir)
          </label>
          <input
            id="p-compare"
            name="compare_at_price"
            inputMode="decimal"
            defaultValue={
              product.compare_at_price !== null
                ? String(product.compare_at_price)
                : ""
            }
            className={styles.input}
          />
        </div>

        <div className={`${styles.field} ${styles.fieldFull}`}>
          <label className={styles.label} htmlFor="p-desc">
            Açıklama
          </label>
          <textarea
            id="p-desc"
            name="description"
            rows={3}
            defaultValue={product.description}
            className={styles.textarea}
          />
        </div>

        <div className={`${styles.fieldFull} ${styles.checksRow}`}>
          <label className={styles.checkLabel}>
            <input
              type="checkbox"
              name="in_stock"
              defaultChecked={product.in_stock}
            />
            Stokta
          </label>
          <label className={styles.checkLabel}>
            <input
              type="checkbox"
              name="is_active"
              defaultChecked={product.is_active}
            />
            Aktif (vitrinde görünür)
          </label>
          <label className={styles.checkLabel}>
            <input
              type="checkbox"
              name="is_featured"
              defaultChecked={product.is_featured}
            />
            Öne çıkan
          </label>
        </div>
      </div>

      <div className={styles.formFoot}>
        <button
          type="submit"
          className={`${styles.actionBtn} ${styles["actionBtn--primary"]}`}
        >
          Kaydet
        </button>
        <Link href="/admin/urunler" className={styles.actionBtn}>
          Vazgeç
        </Link>
      </div>
    </form>
  );
}
