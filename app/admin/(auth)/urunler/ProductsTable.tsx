"use client";

// Ürün tablosu — satır içi fiyat/stok düzenleme (Kaydet → updateProduct),
// anında aktif/pasif toggle (toggleProductActive) ve yeni ürün ekleme formu.

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  createProduct,
  toggleProductActive,
  updateProduct,
} from "@/lib/shop/admin-actions";
import { SHOP_CATEGORIES, categoryBySlug } from "@/lib/shop/categories";
import { formatTL } from "@/lib/shop/types";
import type { Product } from "@/lib/shop/types";
import styles from "../../admin.module.css";

/** "12,50" / "12.50" → 12.5; geçersizse null. */
function parsePrice(value: string): number | null {
  const n = Number.parseFloat(value.replace(",", "."));
  return Number.isFinite(n) && n >= 0 ? n : null;
}

function ProductRow({ product }: { product: Product }) {
  const router = useRouter();
  const [price, setPrice] = useState(String(product.price));
  const [inStock, setInStock] = useState(product.in_stock);
  const [busy, setBusy] = useState(false);
  const [, startTransition] = useTransition();

  const dirty =
    parsePrice(price) !== Number(product.price) || inStock !== product.in_stock;

  function save() {
    const parsed = parsePrice(price);
    if (parsed === null) {
      window.alert("Geçerli bir fiyat girin.");
      return;
    }
    setBusy(true);
    startTransition(async () => {
      try {
        await updateProduct(product.id, { price: parsed, in_stock: inStock });
        router.refresh();
      } finally {
        setBusy(false);
      }
    });
  }

  function toggleActive() {
    setBusy(true);
    startTransition(async () => {
      try {
        await toggleProductActive(product.id, !product.is_active);
        router.refresh();
      } finally {
        setBusy(false);
      }
    });
  }

  return (
    <tr className={product.is_active ? "" : styles.rowInactive}>
      <td>
        <div className={styles.prodName}>{product.name}</div>
        <div className={styles.prodMeta}>
          {[product.brand, product.size_text].filter(Boolean).join(" · ") || "—"}
        </div>
      </td>
      <td>{categoryBySlug(product.category_slug)?.name ?? product.category_slug}</td>
      <td>
        <input
          type="text"
          inputMode="decimal"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className={styles.inputSm}
          aria-label={`${product.name} fiyatı`}
        />
        {product.compare_at_price !== null && (
          <div className={styles.prodMeta}>
            eski: {formatTL(Number(product.compare_at_price))}
          </div>
        )}
      </td>
      <td>
        <label className={styles.checkLabel}>
          <input
            type="checkbox"
            checked={inStock}
            onChange={(e) => setInStock(e.target.checked)}
            aria-label={`${product.name} stok durumu`}
          />
          Stokta
        </label>
      </td>
      <td>
        <button
          type="button"
          onClick={toggleActive}
          disabled={busy}
          className={`${styles.pillBtn} ${product.is_active ? styles["pillBtn--on"] : ""}`}
          aria-label={`${product.name} ${product.is_active ? "pasifleştir" : "aktifleştir"}`}
        >
          {product.is_active ? "Aktif" : "Pasif"}
        </button>
      </td>
      <td>
        <button
          type="button"
          onClick={save}
          disabled={!dirty || busy}
          className={`${styles.actionBtn} ${styles["actionBtn--primary"]}`}
        >
          {busy ? "…" : "Kaydet"}
        </button>
      </td>
    </tr>
  );
}

export default function ProductsTable({ products }: { products: Product[] }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const price = parsePrice(String(fd.get("price") ?? ""));
    const name = String(fd.get("name") ?? "").trim();
    const categorySlug = String(fd.get("category_slug") ?? "");
    if (!name || !categorySlug || price === null) {
      setFormError("Kategori, ürün adı ve geçerli bir fiyat zorunlu.");
      return;
    }
    setFormError(null);
    setBusy(true);
    startTransition(async () => {
      try {
        await createProduct({
          category_slug: categorySlug,
          name,
          price,
          brand: String(fd.get("brand") ?? ""),
          size_text: String(fd.get("size_text") ?? ""),
        });
        form.reset();
        router.refresh();
      } catch (err) {
        setFormError(err instanceof Error ? err.message : "Ürün eklenemedi.");
      } finally {
        setBusy(false);
      }
    });
  }

  return (
    <>
      {/* Yeni ürün formu */}
      <section className={styles.panel} style={{ marginBottom: 20 }}>
        <h2 className={styles.panelTitle}>Yeni Ürün Ekle</h2>
        <form onSubmit={handleCreate} className={styles.newProductForm}>
          <select
            name="category_slug"
            required
            defaultValue=""
            className={styles.select}
            aria-label="Kategori"
          >
            <option value="" disabled>
              Kategori seçin…
            </option>
            {SHOP_CATEGORIES.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
          <input
            name="name"
            required
            placeholder="Ürün adı *"
            className={styles.input}
            aria-label="Ürün adı"
          />
          <input
            name="brand"
            placeholder="Marka"
            className={styles.input}
            aria-label="Marka"
          />
          <input
            name="size_text"
            placeholder="Gramaj (örn. 1 L, 350 g)"
            className={styles.input}
            aria-label="Gramaj"
          />
          <input
            name="price"
            required
            inputMode="decimal"
            placeholder="Fiyat (TL) *"
            className={styles.input}
            aria-label="Fiyat"
          />
          <button
            type="submit"
            disabled={busy}
            className={`${styles.actionBtn} ${styles["actionBtn--primary"]}`}
          >
            {busy ? "Ekleniyor…" : "Ekle"}
          </button>
        </form>
        {formError && <p className={styles.formError}>{formError}</p>}
      </section>

      {/* Ürün tablosu */}
      {products.length === 0 ? (
        <div className={styles.empty}>Bu filtrede ürün yok.</div>
      ) : (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Ürün</th>
                <th>Kategori</th>
                <th>Fiyat (TL)</th>
                <th>Stok</th>
                <th>Durum</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <ProductRow key={p.id} product={p} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
