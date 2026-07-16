// Admin — tam ürün düzenleme sayfası: tüm alanlar + kategori seçimi +
// görsel yükleme/kaldırma. Yazma işlemleri lib/shop/admin-actions üzerinden;
// formlar inline server action ile sarmalanır, sonuç query param mesajıyla gösterilir.

import { notFound, redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  duplicateProduct,
  removeProductImage,
  updateProduct,
  uploadProductImage,
} from "@/lib/shop/admin-actions";
import AdminBack from "../../AdminBack";
import ProductInfoForm from "./ProductInfoForm";
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
  // "gram": sabit gramajlı paket (ör. 125 g ahududu) — gram seçici DEĞİL,
  // pakete göre fiyat + "₺X / kg" bilgisi gösterilir.
  const units = ["adet", "kg", "gram", "paket"];
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

    // Gram bazlı satış işaretliyse fiyat kilogram başınadır; birim otomatik "kg".
    const soldByWeight = formData.get("sold_by_weight") === "on";

    // Gram satış ölçeği (kg cinsinden girilir → grama çevrilir). Yalnız gram
    // bazlı ürünlerde formda bulunur; yoksa alanlar güncellenmez.
    const minKg = Number.parseFloat(
      String(formData.get("weight_min_kg") ?? "").replace(",", "."),
    );
    const stepKg = Number.parseFloat(
      String(formData.get("weight_step_kg") ?? "").replace(",", "."),
    );
    const weightScale: {
      weight_min_grams?: number;
      weight_step_grams?: number;
    } = {};
    if (Number.isFinite(minKg) && minKg > 0)
      weightScale.weight_min_grams = Math.round(minKg * 1000);
    if (Number.isFinite(stepKg) && stepKg > 0)
      weightScale.weight_step_grams = Math.round(stepKg * 1000);

    // Adet paket fiyatları (2/3/4). Boş = o adet için indirim yok.
    const packPrices: Record<string, number> = {};
    for (const n of [2, 3, 4]) {
      const raw = String(formData.get(`pack${n}`) ?? "").trim();
      if (raw) {
        const v = parsePrice(raw);
        if (v !== null && v > 0) packPrices[String(n)] = v;
      }
    }
    const packPricesValue =
      Object.keys(packPrices).length > 0 ? packPrices : null;

    // Etiket bilgileri (details jsonb) — form bölümü yalnız meyve-sebze DIŞI
    // kategorilerde bulunur; bölüm yoksa alan hiç güncellenmez.
    let detailsPatch: { details?: import("@/lib/shop/types").ProductDetails | null } = {};
    if (formData.get("details_present") === "1") {
      const str = (k: string) => {
        const v = String(formData.get(k) ?? "").trim();
        return v || null;
      };
      const numOrNull = (k: string) => {
        const raw = String(formData.get(k) ?? "").trim();
        if (!raw) return null;
        const n = Number.parseFloat(raw.replace(",", "."));
        return Number.isFinite(n) ? n : null;
      };
      const besin = {
        enerji_kcal: numOrNull("det_kcal"),
        enerji_kj: numOrNull("det_kj"),
        yag_g: numOrNull("det_yag"),
        doymus_yag_g: numOrNull("det_doymus"),
        karbonhidrat_g: numOrNull("det_karb"),
        seker_g: numOrNull("det_seker"),
        protein_g: numOrNull("det_protein"),
        tuz_g: numOrNull("det_tuz"),
      };
      const hasBesin = Object.values(besin).some((v) => v !== null);
      const details = {
        icindekiler: str("det_icindekiler"),
        net_miktar: str("det_net_miktar"),
        saklama: str("det_saklama"),
        mensei: str("det_mensei"),
        uretici: str("det_uretici"),
        besin100: hasBesin ? besin : null,
      };
      const hasAny =
        hasBesin ||
        details.icindekiler !== null ||
        details.net_miktar !== null ||
        details.saklama !== null ||
        details.mensei !== null ||
        details.uretici !== null;
      detailsPatch = { details: hasAny ? details : null };
    }

    let errorMessage: string | null = null;
    try {
      await updateProduct(id, {
        name,
        brand: String(formData.get("brand") ?? ""),
        // Gram bazlıysa gramaj anlamsız — temizlenir (müşteri gramı kendi seçer).
        size_text: soldByWeight ? "" : String(formData.get("size_text") ?? ""),
        description: String(formData.get("description") ?? ""),
        unit: soldByWeight ? "kg" : String(formData.get("unit") ?? "adet"),
        category_slug: String(formData.get("category_slug") ?? ""),
        subcategory_slug:
          String(formData.get("subcategory_slug") ?? "").trim() || null,
        price,
        compare_at_price: compareAt,
        sold_by_weight: soldByWeight,
        pack_prices: packPricesValue,
        ...detailsPatch,
        ...weightScale,
        is_featured: formData.get("is_featured") === "on",
        in_stock: formData.get("in_stock") === "on",
        is_active: formData.get("is_active") === "on",
      });
    } catch (e) {
      errorMessage = e instanceof Error ? e.message : "Ürün kaydedilemedi.";
    }
    redirect(errorMessage ? `${back}?hata=${encodeURIComponent(errorMessage)}` : `${back}?kayit=ok`);
  }

  async function duplicateAction() {
    "use server";
    try {
      const copy = await duplicateProduct(id);
      redirect(`/admin/urunler/${copy.id}?kayit=kopya`);
    } catch (e) {
      // redirect() bir istisna fırlatarak çalışır — onu yutma, yeniden fırlat.
      if (e && typeof e === "object" && "digest" in e) throw e;
      const msg = e instanceof Error ? e.message : "Ürün çoğaltılamadı.";
      redirect(`/admin/urunler/${id}?hata=${encodeURIComponent(msg)}`);
    }
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
      <AdminBack href="/admin/urunler" label="Ürünler" />
      <div className={styles.titleRow}>
        <div>
          <h1 className={styles.title}>{product.name}</h1>
          <p className={styles.subtitle}>
            {category?.name ?? product.category_slug} · /urunler/{product.slug}
          </p>
        </div>
        {/* Ürünü çoğalt: tüm alanların kopyası "(Kopyası)" adıyla, PASİF
            olarak oluşturulur ve düzenleme sayfası açılır. */}
        <form action={duplicateAction}>
          <button type="submit" className={styles.actionBtn}>
            Ürünü Çoğalt
          </button>
        </form>
      </div>

      {kayit === "ok" && <p className={styles.msgOk}>Ürün kaydedildi.</p>}
      {kayit === "kopya" && (
        <p className={styles.msgOk}>
          Ürünün kopyası oluşturuldu ve şu an <b>pasif</b>. Bilgileri düzenleyip
          &quot;Durum&quot;u aktifleştirdiğinizde vitrinde görünür.
        </p>
      )}
      {gorsel === "ok" && <p className={styles.msgOk}>Görsel yüklendi.</p>}
      {gorsel === "silindi" && <p className={styles.msgOk}>Görsel kaldırıldı.</p>}
      {hata && <p className={styles.formError} style={{ marginBottom: 18 }}>{hata}</p>}

      <div className={styles.detailGrid}>
        {/* Ürün bilgileri */}
        <section className={styles.panel}>
          <h2 className={styles.panelTitle}>Ürün Bilgileri</h2>
          <ProductInfoForm
            saveAction={saveAction}
            product={product}
            categories={SHOP_CATEGORIES.map((c) => ({
              slug: c.slug,
              name: c.name,
            }))}
            units={units}
          />
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
