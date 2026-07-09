"use client";

// Urun tablosu: ust arac cubugu (sunucudan gelen filtre slotu + "Yeni Urun"
// accent butonu), hizli filtre cipleri (GET linki, sayilar sunucudan tum
// katalog uzerinden gelir), collapse'li yeni urun formu (createProduct),
// satir ici fiyat/eski fiyat/stok duzenleme (updateProduct, yalniz degisiklik
// varsa Kaydet belirginlesir), cok satan + aktif/pasif toggle'lari ve tam
// duzenleme sayfasina "Duzenle" linki. Sayfalama sunucu tarafli: ust ve alt
// kontroller GET linkidir, k/altk/q/filtre parametreleri korunur. Kategori
// rozetinin altinda kural tabanli alt kategori etiketi gosterilir.

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Check,
  Eye,
  EyeOff,
  PackageX,
  Plus,
  Star,
  Tag,
  Trash2,
  X,
} from "lucide-react";
import {
  createProduct,
  deleteProduct,
  toggleProductActive,
  updateProduct,
} from "@/lib/shop/admin-actions";
import { SHOP_CATEGORIES, CATEGORY_TINTS, categoryBySlug } from "@/lib/shop/categories";
import {
  OTHER_SUB_NAME,
  assignSubcategory,
  subcatsFor,
} from "@/lib/shop/subcategories";
import type { Product } from "@/lib/shop/types";
import styles from "../../admin.module.css";
import pstyles from "./products.module.css";

/** Hizli filtre cipi: sunucuda hesaplanir, link olarak gezinilir. */
export interface ChipData {
  key: "indirimli" | "cok-satan" | "stokta-yok";
  label: string;
  count: number;
  href: string;
  active: boolean;
}

/** Aktif filtre cipi (Kategori / Alt / Arama): tek tikla kaldirilabilir link. */
export interface ActiveFilter {
  key: string;
  label: string;
  href: string;
}

/** Sayfa numarasi listesi elemani: link ya da kisaltma noktasi. */
export type PageItem =
  | { type: "page"; number: number; href: string; current: boolean }
  | { type: "gap" };

/** Sunucuda hesaplanan sayfalama durumu (tum linkler hazir gelir). */
export interface PaginationData {
  page: number;
  totalPages: number;
  total: number;
  rangeStart: number;
  rangeEnd: number;
  prevHref: string | null;
  nextHref: string | null;
  items: PageItem[];
}

/** "12,50" / "12.50" -> 12.5; gecersizse null. */
function parsePrice(value: string): number | null {
  const n = Number.parseFloat(value.replace(",", "."));
  return Number.isFinite(n) && n >= 0 ? n : null;
}

/** Indirim oncesi (eski) fiyat: bos = indirim yok (null); gecersizse undefined. */
function parseCompare(value: string): number | null | undefined {
  const trimmed = value.trim();
  if (trimmed === "") return null;
  const n = Number.parseFloat(trimmed.replace(",", "."));
  return Number.isFinite(n) && n >= 0 ? n : undefined;
}

/** Urun indirimli mi? (eski fiyat, guncel fiyattan yuksek) */
function isDiscounted(p: Product): boolean {
  return p.compare_at_price !== null && p.compare_at_price > p.price;
}

const CHIP_ICONS: Record<ChipData["key"], React.ReactNode> = {
  indirimli: <Tag size={14} aria-hidden />,
  "cok-satan": <Star size={14} aria-hidden />,
  "stokta-yok": <PackageX size={14} aria-hidden />,
};

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

  function remove() {
    if (
      !window.confirm(
        `"${product.name}" ürünü kalıcı olarak silinsin mi? Bu işlem geri alınamaz.`,
      )
    ) {
      return;
    }
    setBusy(true);
    startTransition(async () => {
      try {
        await deleteProduct(product.id);
        router.refresh(); // satır listeden düşer
      } catch (e) {
        window.alert(e instanceof Error ? e.message : "Ürün silinemedi.");
        setBusy(false);
      }
    });
  }

  const category = categoryBySlug(product.category_slug);
  const [tintBg, tintFg] = CATEGORY_TINTS[category?.tint ?? 0];
  // Kural tabanli alt kategori etiketi (DB kolonu yok): yonetici, urunun
  // kategori gorunumunde hangi alta dustugunu gorsun. Tanimsiz slug donerse
  // (pratikte "diger") "Diğer" etiketi gosterilir.
  const subs = subcatsFor(product.category_slug);
  const subSlug = assignSubcategory(
    product.category_slug,
    product.name,
    product.brand,
    product.subcategory_slug,
  );
  const subName = subs.find((s) => s.slug === subSlug)?.name ?? OTHER_SUB_NAME;
  const discount = isDiscounted(product);
  const discountPct =
    discount && product.compare_at_price
      ? Math.round(
          ((product.compare_at_price - product.price) / product.compare_at_price) * 100,
        )
      : 0;

  return (
    <tr className={product.is_active ? "" : styles.rowInactive}>
      <td data-label="Ürün">
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
          <div className={styles.prodText}>
            <div className={styles.prodName}>{product.name}</div>
            <div className={styles.prodMeta}>
              {[product.brand, product.size_text].filter(Boolean).join(" · ") || "·"}
            </div>
          </div>
        </div>
      </td>
      <td data-label="Kategori">
        <div className={pstyles.catCell}>
          <span className={styles.catBadge} style={{ background: tintBg, color: tintFg }}>
            {category?.name ?? product.category_slug}
          </span>
          {subs.length > 0 && <span className={pstyles.subTag}>{subName}</span>}
        </div>
      </td>
      <td data-label="Fiyat">
        <span className={styles.priceField}>
          <span className={styles.pricePrefix} aria-hidden>
            ₺
          </span>
          <input
            type="text"
            inputMode="decimal"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className={`${styles.inputSm} ${styles.priceInput}`}
            aria-label={`${product.name} fiyatı`}
          />
        </span>
      </td>
      <td data-label="Eski fiyat">
        <span className={styles.priceField}>
          <span className={styles.pricePrefix} aria-hidden>
            ₺
          </span>
          <input
            type="text"
            inputMode="decimal"
            value={compare}
            onChange={(e) => setCompare(e.target.value)}
            className={`${styles.inputSm} ${styles.priceInput}`}
            placeholder="Yok"
            aria-label={`${product.name} eski (indirim öncesi) fiyatı`}
          />
          {discountPct > 0 && (
            <span className={styles.discountTag}>%{discountPct}</span>
          )}
        </span>
      </td>
      <td data-label="Stok">
        <button
          type="button"
          onClick={() => setInStock((v) => !v)}
          className={`${styles.statusPill} ${
            inStock ? styles["statusPill--ok"] : styles["statusPill--danger"]
          }`}
          aria-pressed={inStock}
          aria-label={`${product.name} stok durumu: ${inStock ? "stokta" : "tükendi"}`}
        >
          {inStock ? <Check size={14} aria-hidden /> : <PackageX size={14} aria-hidden />}
          {inStock ? "Stokta" : "Tükendi"}
        </button>
      </td>
      <td data-label="Çok satan">
        <button
          type="button"
          onClick={toggleBestSeller}
          disabled={busy}
          className={`${styles.statusPill} ${
            product.is_best_seller ? styles["statusPill--star"] : styles["statusPill--muted"]
          }`}
          aria-pressed={product.is_best_seller}
          aria-label={`${product.name} çok satan ${product.is_best_seller ? "işaretini kaldır" : "işaretle"}`}
        >
          <Star
            size={14}
            aria-hidden
            fill={product.is_best_seller ? "currentColor" : "none"}
          />
          {product.is_best_seller ? "Çok Satan" : "İşaretle"}
        </button>
      </td>
      <td data-label="Durum">
        <button
          type="button"
          onClick={toggleActive}
          disabled={busy}
          className={`${styles.statusPill} ${
            product.is_active ? styles["statusPill--ok"] : styles["statusPill--muted"]
          }`}
          aria-pressed={product.is_active}
          aria-label={`${product.name} ${product.is_active ? "pasifleştir" : "aktifleştir"}`}
        >
          {product.is_active ? <Eye size={14} aria-hidden /> : <EyeOff size={14} aria-hidden />}
          {product.is_active ? "Aktif" : "Pasif"}
        </button>
      </td>
      <td data-label="İşlem">
        <div className={styles.cellActions}>
          <button
            type="button"
            onClick={save}
            disabled={!dirty || busy}
            className={`${styles.btnRow} ${dirty ? styles["btnRow--primary"] : ""}`}
          >
            {busy ? "Kaydediliyor" : dirty ? "Kaydet" : "Kayıtlı"}
          </button>
          <Link
            href={`/admin/urunler/${product.id}`}
            className={styles.btnRow}
            aria-label={`${product.name} ürününü düzenle`}
          >
            Düzenle
          </Link>
          <button
            type="button"
            onClick={remove}
            disabled={busy}
            className={`${styles.btnRow} ${styles["btnRow--danger"]}`}
            aria-label={`${product.name} ürününü sil`}
          >
            <Trash2 size={13} aria-hidden />
            Sil
          </button>
        </div>
      </td>
    </tr>
  );
}

/** Onceki / sayfa numaralari / Sonraki: tumu GET linki, ok ikonu yok. */
function Pager({ pagination }: { pagination: PaginationData }) {
  if (pagination.totalPages <= 1) return null;
  return (
    <nav className={pstyles.pager} aria-label="Sayfalar">
      {pagination.prevHref ? (
        <Link href={pagination.prevHref} className={pstyles.pageBtn}>
          Önceki
        </Link>
      ) : (
        <span className={pstyles.pageBtnOff} aria-disabled="true">
          Önceki
        </span>
      )}
      <span className={pstyles.pageNums}>
        {pagination.items.map((item, i) =>
          item.type === "gap" ? (
            <span key={`gap-${i}`} className={pstyles.pageGap} aria-hidden>
              …
            </span>
          ) : item.current ? (
            <span
              key={item.number}
              className={pstyles.pageNumCurrent}
              aria-current="page"
            >
              {item.number}
            </span>
          ) : (
            <Link
              key={item.number}
              href={item.href}
              className={pstyles.pageNum}
              aria-label={`Sayfa ${item.number}`}
            >
              {item.number}
            </Link>
          ),
        )}
      </span>
      {pagination.nextHref ? (
        <Link href={pagination.nextHref} className={pstyles.pageBtn}>
          Sonraki
        </Link>
      ) : (
        <span className={pstyles.pageBtnOff} aria-disabled="true">
          Sonraki
        </span>
      )}
    </nav>
  );
}

export default function ProductsTable({
  products,
  chips,
  activeFilters,
  clearFilterHref,
  clearAllHref,
  resetHref,
  hasActiveFilters,
  pagination,
  filterSlot,
  openForm = false,
}: {
  products: Product[];
  chips: ChipData[];
  activeFilters: ActiveFilter[];
  clearFilterHref: string | null;
  clearAllHref: string;
  resetHref: string;
  hasActiveFilters: boolean;
  pagination: PaginationData;
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
        const created = await createProduct({
          category_slug: categorySlug,
          name,
          price,
          brand: String(fd.get("brand") ?? ""),
          size_text: String(fd.get("size_text") ?? ""),
          unit: String(fd.get("unit") ?? "adet"),
        });
        // Görsel, alt kategori ve ölçek için tam düzenleme sayfasına geç.
        router.push(`/admin/urunler/${created.id}`);
      } catch (err) {
        setFormError(err instanceof Error ? err.message : "Ürün eklenemedi.");
        setBusy(false);
      }
    });
  }

  return (
    <>
      {/* Ust arac cubugu: filtre (sunucu GET formu) + Yeni Urun accent butonu */}
      <div className={styles.toolbar}>
        {filterSlot}
        <button
          type="button"
          onClick={() => setShowForm((v) => !v)}
          className={styles.btnLg}
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

      {/* Aktif filtreler: tek tikla kaldirilabilir cipler + hepsini temizle */}
      {activeFilters.length > 0 && (
        <div className={pstyles.activeFilters}>
          {activeFilters.map((f) => (
            <Link
              key={f.key}
              href={f.href}
              className={`${styles.chip} ${styles["chip--active"]}`}
              aria-label={`${f.label} filtresini kaldır`}
            >
              {f.label}
              <X size={13} aria-hidden />
            </Link>
          ))}
          <Link href={clearAllHref} className={styles.quickClear}>
            Hepsini temizle
          </Link>
        </div>
      )}

      {/* Hizli filtre cipleri: GET linki, sayilar tum katalogdan (sunucu) */}
      <div className={styles.quickBar}>
        <div className={styles.quickChips}>
          {chips.map((c) => (
            <Link
              key={c.key}
              href={c.href}
              className={`${styles.chip} ${c.active ? styles["chip--active"] : ""}`}
              aria-current={c.active ? "true" : undefined}
            >
              {CHIP_ICONS[c.key]}
              {c.label}
              <span className={styles.chipCount}>{c.count}</span>
            </Link>
          ))}
          {clearFilterHref && (
            <Link href={clearFilterHref} className={styles.quickClear}>
              Filtreyi temizle
            </Link>
          )}
        </div>
      </div>

      {/* Yeni urun formu (collapse) — etiketli grid; kaydedince tam duzenleme
          sayfasi acilir (gorsel, alt kategori, gram olcegi vs. orada). */}
      {showForm && (
        <section className={styles.panel} style={{ marginBottom: 16 }}>
          <h2 className={styles.panelTitle}>Yeni Ürün Ekle</h2>
          <p
            className={styles.subtitle}
            style={{ marginTop: -2, marginBottom: 14 }}
          >
            Temel bilgileri girin. Kaydedince <b>görsel yükleme</b>, alt kategori
            ve fiyat ölçeği için düzenleme sayfası açılır.
          </p>
          <form onSubmit={handleCreate}>
            <div className={styles.editFormGrid}>
              <div className={`${styles.field} ${styles.fieldFull}`}>
                <label className={styles.label} htmlFor="np-name">
                  Ürün adı *
                </label>
                <input
                  id="np-name"
                  name="name"
                  required
                  placeholder="Ör. Hindistan Cevizi"
                  className={styles.input}
                />
              </div>
              <div className={styles.field}>
                <label className={styles.label} htmlFor="np-cat">
                  Kategori *
                </label>
                <select
                  id="np-cat"
                  name="category_slug"
                  required
                  defaultValue=""
                  className={styles.select}
                >
                  <option value="" disabled>
                    Seçin…
                  </option>
                  {SHOP_CATEGORIES.map((c) => (
                    <option key={c.slug} value={c.slug}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className={styles.field}>
                <label className={styles.label} htmlFor="np-brand">
                  Marka
                </label>
                <input
                  id="np-brand"
                  name="brand"
                  placeholder="(opsiyonel)"
                  className={styles.input}
                />
              </div>
              <div className={styles.field}>
                <label className={styles.label} htmlFor="np-unit">
                  Birim
                </label>
                <select
                  id="np-unit"
                  name="unit"
                  defaultValue="adet"
                  className={styles.select}
                >
                  {["adet", "kg", "gram", "paket"].map((u) => (
                    <option key={u} value={u}>
                      {u}
                    </option>
                  ))}
                </select>
              </div>
              <div className={styles.field}>
                <label className={styles.label} htmlFor="np-size">
                  Gramaj
                </label>
                <input
                  id="np-size"
                  name="size_text"
                  placeholder="Ör. 1 L, 350 g"
                  className={styles.input}
                />
              </div>
              <div className={styles.field}>
                <label className={styles.label} htmlFor="np-price">
                  Fiyat (TL) *
                </label>
                <input
                  id="np-price"
                  name="price"
                  required
                  inputMode="decimal"
                  placeholder="0,00"
                  className={styles.input}
                />
              </div>
            </div>
            <div className={styles.formFoot}>
              <button
                type="submit"
                disabled={busy}
                className={`${styles.actionBtn} ${styles["actionBtn--primary"]}`}
                style={{ display: "inline-flex", alignItems: "center", gap: 6 }}
              >
                <Plus size={15} strokeWidth={2.4} aria-hidden />
                {busy ? "Ekleniyor…" : "Ekle ve Düzenle"}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className={styles.actionBtn}
              >
                Vazgeç
              </button>
            </div>
            {formError && <p className={styles.formError}>{formError}</p>}
          </form>
        </section>
      )}

      {/* Liste ustu: aralik bilgisi + sayfa kontrolu */}
      <div className={pstyles.pagerBar}>
        <span className={pstyles.rangeInfo}>
          {pagination.total === 0
            ? "Sonuç yok"
            : `${pagination.rangeStart}-${pagination.rangeEnd} arası, toplam ${pagination.total} ürün`}
        </span>
        <Pager pagination={pagination} />
      </div>

      {/* Urun tablosu: dogal sayfa akisi (dikey ic scroll yok), dar ekranda kart */}
      {products.length === 0 ? (
        <div className={styles.empty}>
          {hasActiveFilters
            ? "Bu filtrelerle eşleşen ürün bulunamadı."
            : "Henüz ürün eklenmemiş."}
          {hasActiveFilters && (
            <div>
              <Link href={resetHref} className={pstyles.resetLink}>
                Filtreleri temizle
              </Link>
            </div>
          )}
        </div>
      ) : (
        <>
          <div className={styles.tableCard}>
            <div className={pstyles.tableFlow}>
              <table
                className={`${styles.table} ${styles.productTable} ${pstyles.compactTable}`}
              >
                <thead>
                  <tr>
                    <th>Ürün</th>
                    <th>Kategori</th>
                    <th>Fiyat</th>
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

          {/* Liste alti sayfa kontrolu */}
          <div className={pstyles.pagerBottom}>
            <Pager pagination={pagination} />
          </div>
        </>
      )}
    </>
  );
}
