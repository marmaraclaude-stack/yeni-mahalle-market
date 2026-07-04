"use client";

// Ürün tablosu — üst araç çubuğu (sunucudan gelen filtre slotu + "Yeni Ürün"
// accent butonu), collapse'lı yeni ürün formu (createProduct), satır içi
// fiyat/stok düzenleme (updateProduct), aktif/pasif toggle (toggleProductActive),
// görsel küçük önizleme ve tam düzenleme sayfasına "Düzenle" linki.
// Tablo başlıkları kaydırma alanında sabittir (sticky).

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plus, X } from "lucide-react";
import {
  createProduct,
  toggleProductActive,
  updateProduct,
} from "@/lib/shop/admin-actions";
import { SHOP_CATEGORIES, CATEGORY_TINTS, categoryBySlug } from "@/lib/shop/categories";
import type { Product } from "@/lib/shop/types";
import styles from "../../admin.module.css";

/** "12,50" / "12.50" → 12.5; geçersizse null. */
function parsePrice(value: string): number | null {
  const n = Number.parseFloat(value.replace(",", "."));
  return Number.isFinite(n) && n >= 0 ? n : null;
}

/** İndirim öncesi (eski) fiyat: boş = indirim yok (null); geçersizse undefined. */
function parseCompare(value: string): number | null | undefined {
  const trimmed = value.trim();
  if (trimmed === "") return null;
  const n = Number.parseFloat(trimmed.replace(",", "."));
  return Number.isFinite(n) && n >= 0 ? n : undefined;
}

function ProductRow({ product }: { product: Product }) {
  const router = useRouter();
  const [price, setPrice] = useState(String(product.price));
  const [compare, setCompare] = useState(
    product.compare_at_price === null ? "" : String(product.compare_at_price),
  );
  const [inStock, setInStock] = useState(product.in_stock);
  const [busy, setBusy] = useState(false);
  const [, startTransition] = useTransition();

  const compareInitial =
    product.compare_at_price === null ? "" : String(product.compare_at_price);
  const dirty =
    parsePrice(price) !== Number(product.price) ||
    compare.trim() !== compareInitial ||
    inStock !== product.in_stock;

  function save() {
    const parsed = parsePrice(price);
    if (parsed === null) {
      window.alert("Geçerli bir fiyat girin.");
      return;
    }
    const parsedCompare = parseCompare(compare);
    if (parsedCompare === undefined) {
      window.alert("Eski fiyat geçersiz. Boş bırakın veya geçerli bir sayı girin.");
      return;
    }
    if (parsedCompare !== null && parsedCompare <= parsed) {
      window.alert("Eski fiyat, güncel fiyattan yüksek olmalı (indirim için).");
      return;
    }
    setBusy(true);
    startTransition(async () => {
      try {
        await updateProduct(product.id, {
          price: parsed,
          in_stock: inStock,
          compare_at_price: parsedCompare,
        });
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

  function toggleBestSeller() {
    setBusy(true);
    startTransition(async () => {
      try {
        await updateProduct(product.id, {
          is_best_seller: !product.is_best_seller,
        });
        router.refresh();
      } finally {
        setBusy(false);
      }
    });
  }

  const category = categoryBySlug(product.category_slug);
  const [tintBg, tintFg] = CATEGORY_TINTS[category?.tint ?? 0];

  return (
    <tr className={product.is_active ? "" : styles.rowInactive}>
      <td>
        <div className={styles.prodCell}>
          {product.image_url ? (
            <img
              src={product.image_url}
              alt=""
              width={44}
              height={44}
              loading="lazy"
              className={styles.thumb}
            />
          ) : (
            <span
              className={styles.thumbEmpty}
              style={{ background: tintBg, color: tintFg }}
              aria-hidden
            >
              {product.name.charAt(0).toLocaleUpperCase("tr-TR")}
            </span>
          )}
          <div>
            <div className={styles.prodName}>{product.name}</div>
            <div className={styles.prodMeta}>
              {[product.brand, product.size_text].filter(Boolean).join(" · ") || "·"}
            </div>
          </div>
        </div>
      </td>
      <td>{category?.name ?? product.category_slug}</td>
      <td>
        <input
          type="text"
          inputMode="decimal"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className={styles.inputSm}
          aria-label={`${product.name} fiyatı`}
        />
      </td>
      <td>
        <input
          type="text"
          inputMode="decimal"
          value={compare}
          onChange={(e) => setCompare(e.target.value)}
          className={styles.inputSm}
          placeholder="—"
          aria-label={`${product.name} eski (indirim öncesi) fiyatı`}
        />
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
          onClick={toggleBestSeller}
          disabled={busy}
          className={`${styles.pillBtn} ${product.is_best_seller ? styles["pillBtn--on"] : ""}`}
          aria-label={`${product.name} çok satan ${product.is_best_seller ? "işaretini kaldır" : "işaretle"}`}
        >
          {product.is_best_seller ? "Çok Satan" : "İşaretle"}
        </button>
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
        <div className={styles.cellActions}>
          <button
            type="button"
            onClick={save}
            disabled={!dirty || busy}
            className={`${styles.actionBtn} ${styles["actionBtn--primary"]}`}
          >
            {busy ? "…" : "Kaydet"}
          </button>
          <Link
            href={`/admin/urunler/${product.id}`}
            className={styles.actionBtn}
            aria-label={`${product.name} ürününü düzenle`}
          >
            Düzenle
          </Link>
        </div>
      </td>
    </tr>
  );
}

export default function ProductsTable({
  products,
  filterSlot,
  openForm = false,
}: {
  products: Product[];
  filterSlot?: React.ReactNode;
  openForm?: boolean;
}) {
  const router = useRouter();
  const [showForm, setShowForm] = useState(openForm);
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
      {/* Üst araç çubuğu: filtre (sunucu GET formu) + Yeni Ürün accent butonu */}
      <div className={styles.toolbar}>
        {filterSlot}
        <button
          type="button"
          onClick={() => setShowForm((v) => !v)}
          className={styles.accentBtn}
          aria-expanded={showForm}
        >
          {showForm ? (
            <X size={15} strokeWidth={2.4} aria-hidden />
          ) : (
            <Plus size={15} strokeWidth={2.4} aria-hidden />
          )}
          {showForm ? "Formu Kapat" : "Yeni Ürün"}
        </button>
      </div>

      {/* Yeni ürün formu (collapse) */}
      {showForm && (
        <section className={styles.panel} style={{ marginBottom: 16 }}>
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
            <button type="submit" disabled={busy} className={styles.accentBtn}>
              {busy ? "Ekleniyor…" : "Ekle"}
            </button>
          </form>
          {formError && <p className={styles.formError}>{formError}</p>}
        </section>
      )}

      {/* Ürün tablosu — başlıklar kaydırma alanında sabit */}
      {products.length === 0 ? (
        <div className={styles.empty}>Bu filtrede ürün yok.</div>
      ) : (
        <div className={styles.tableCard}>
          <div className={styles.tableScroll}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Ürün</th>
                  <th>Kategori</th>
                  <th>Fiyat (TL)</th>
                  <th>Eski Fiyat</th>
                  <th>Stok</th>
                  <th>Çok Satan</th>
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
        </div>
      )}
    </>
  );
}
