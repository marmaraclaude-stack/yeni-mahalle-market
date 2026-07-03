// Admin — tam ürün düzenleme sayfası: tüm alanlar + kategori seçimi +
// görsel yükleme/kaldırma. Yazma işlemleri lib/shop/admin-actions üzerinden;
// formlar inline server action ile sarmalanır, sonuç query param mesajıyla gösterilir.

import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  removeProductImage,
  updateProduct,
  uploadProductImage,
} from "@/lib/shop/admin-actions";
import { SHOP_CATEGORIES, CATEGORY_TINTS, categoryBySlug } from "@/lib/shop/categories";
import type { Product } from "@/lib/shop/types";
import styles from "../../../admin.module.css";

export const dynamic = "force-dynamic";
export const metadata = { title: "Ürün Düzenle" };

/** "12,50" / "12.50" → 12.5; geçersizse null. */
function parsePrice(value: string): number | null {
  const n = Number.parseFloat(value.replace(",", "."));
  return Number.isFinite(n) && n >= 0 ? n : null;
}

export default async function AdminProductEditPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ kayit?: string; gorsel?: string; hata?: string }>;
}) {
  const { id } = await params;
  const { kayit, gorsel, hata } = await searchParams;

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    return (
      <>
        <h1 className={styles.title}>Ürün</h1>
        <div className={styles.empty}>Ürün yüklenemedi: {error.message}</div>
      </>
    );
  }
  if (!data) notFound();
  const product = data as Product;

  const category = categoryBySlug(product.category_slug);
  const [tintBg, tintFg] = CATEGORY_TINTS[category?.tint ?? 0];

  // Birim seçenekleri — üründe farklı bir değer varsa listeye eklenir.
  const units = ["adet", "kg", "paket"];
  if (product.unit && !units.includes(product.unit)) units.push(product.unit);

  // ---- Inline server action'lar ----

  async function saveAction(formData: FormData) {
    "use server";
    const back = `/admin/urunler/${id}`;

    const name = String(formData.get("name") ?? "").trim();
    const price = parsePrice(String(formData.get("price") ?? ""));
    if (!name || price === null) {
      redirect(`${back}?hata=${encodeURIComponent("Ürün adı ve geçerli bir fiyat zorunlu.")}`);
    }

    const compareRaw = String(formData.get("compare_at_price") ?? "").trim();
    const compareAt = compareRaw ? parsePrice(compareRaw) : null;
    if (compareRaw && compareAt === null) {
      redirect(`${back}?hata=${encodeURIComponent("Eski fiyat geçersiz. Boş bırakabilirsin.")}`);
    }

    let errorMessage: string | null = null;
    try {
      await updateProduct(id, {
        name,
        brand: String(formData.get("brand") ?? ""),
        size_text: String(formData.get("size_text") ?? ""),
        description: String(formData.get("description") ?? ""),
        unit: String(formData.get("unit") ?? "adet"),
        category_slug: String(formData.get("category_slug") ?? ""),
        price,
        compare_at_price: compareAt,
        is_featured: formData.get("is_featured") === "on",
        in_stock: formData.get("in_stock") === "on",
        is_active: formData.get("is_active") === "on",
      });
    } catch (e) {
      errorMessage = e instanceof Error ? e.message : "Ürün kaydedilemedi.";
    }
    redirect(errorMessage ? `${back}?hata=${encodeURIComponent(errorMessage)}` : `${back}?kayit=ok`);
  }

  async function uploadImageAction(formData: FormData) {
    "use server";
    const back = `/admin/urunler/${id}`;
    const result = await uploadProductImage(id, formData);
    redirect(
      result.ok
        ? `${back}?gorsel=ok`
        : `${back}?hata=${encodeURIComponent(result.error ?? "Görsel yüklenemedi.")}`,
    );
  }

  async function removeImageAction() {
    "use server";
    const back = `/admin/urunler/${id}`;
    const result = await removeProductImage(id);
    redirect(
      result.ok
        ? `${back}?gorsel=silindi`
        : `${back}?hata=${encodeURIComponent(result.error ?? "Görsel kaldırılamadı.")}`,
    );
  }

  return (
    <>
      <Link href="/admin/urunler" className={styles.backLink}>
        ← Ürünler
      </Link>
      <h1 className={styles.title}>{product.name}</h1>
      <p className={styles.subtitle}>
        {category?.name ?? product.category_slug} · /urunler/{product.slug}
      </p>

      {kayit === "ok" && <p className={styles.msgOk}>Ürün kaydedildi.</p>}
      {gorsel === "ok" && <p className={styles.msgOk}>Görsel yüklendi.</p>}
      {gorsel === "silindi" && <p className={styles.msgOk}>Görsel kaldırıldı.</p>}
      {hata && <p className={styles.formError} style={{ marginBottom: 18 }}>{hata}</p>}

      <div className={styles.detailGrid}>
        {/* Ürün bilgileri */}
        <section className={styles.panel}>
          <h2 className={styles.panelTitle}>Ürün Bilgileri</h2>
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
                  {SHOP_CATEGORIES.map((c) => (
                    <option key={c.slug} value={c.slug}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

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

              <div className={styles.field}>
                <label className={styles.label} htmlFor="p-price">
                  Fiyat (TL) *
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
        </section>

        {/* Görsel yönetimi */}
        <section className={styles.panel}>
          <h2 className={styles.panelTitle}>Ürün Görseli</h2>
          <div className={styles.imageStack}>
            {product.image_url ? (
              <img
                src={product.image_url}
                alt={product.name}
                className={styles.editImage}
                loading="lazy"
              />
            ) : (
              <div
                className={styles.editImageEmpty}
                style={{ background: tintBg, color: tintFg }}
                aria-hidden
              >
                Görsel yok
              </div>
            )}

            <form action={uploadImageAction} className={styles.stackForm}>
              <label className={styles.label} htmlFor="p-image">
                Yeni görsel (JPEG, PNG veya WebP · en fazla 4 MB)
              </label>
              <input
                id="p-image"
                type="file"
                name="image"
                required
                accept="image/jpeg,image/png,image/webp"
                className={styles.fileInput}
              />
              <button
                type="submit"
                className={`${styles.actionBtn} ${styles["actionBtn--primary"]}`}
              >
                Görseli Yükle
              </button>
            </form>

            {product.image_url && (
              <form action={removeImageAction}>
                <button
                  type="submit"
                  className={`${styles.actionBtn} ${styles["actionBtn--danger"]}`}
                >
                  Görseli Kaldır
                </button>
              </form>
            )}
          </div>
        </section>
      </div>
    </>
  );
}
