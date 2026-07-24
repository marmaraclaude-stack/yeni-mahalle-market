"use client";

// Urun tablosu: ust arac cubugu (sunucudan gelen filtre slotu + "Yeni Urun"
// accent butonu), hizli filtre cipleri (GET linki, sayilar sunucudan tum
// katalog uzerinden gelir), collapse'li yeni urun formu (createProduct),
// satir ici fiyat/eski fiyat/stok duzenleme (updateProduct, yalniz degisiklik
// varsa Kaydet belirginlesir), cok satan + aktif/pasif toggle'lari ve tam
// duzenleme sayfasina "Duzenle" linki. Sayfalama sunucu tarafli: ust ve alt
// kontroller GET linkidir, k/altk/q/filtre parametreleri korunur. Kategori
// rozetinin altinda kural tabanli alt kategori etiketi gosterilir.

import { useEffect, useRef, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Check,
  Eye,
  EyeOff,
  GripVertical,
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
  updateProductSortBulk,
  updateSubcatSortBulk,
} from "@/lib/shop/admin-actions";
import { SHOP_CATEGORIES, CATEGORY_TINTS, categoryBySlug } from "@/lib/shop/categories";
import {
  OTHER_SUB_NAME,
  assignSubcategory,
  dtoToSub,
  type SubcatDTO,
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

/** Sunucudan gelen çözülmüş kategori listesi (DB adları + özel kategoriler). */
export interface CatDTO {
  slug: string;
  name: string;
  tint: number;
}

/** Sürükle-bırak sıralama modunda satıra geçirilen bağlam. */
export interface ReorderCtx {
  /** 1 tabanlı görünen pozisyon (listedeki gerçek sıra). */
  position: number;
  onDragStart: (id: string) => void;
  onDragEnd: () => void;
  onDragOverRow: (e: React.DragEvent, id: string) => void;
  onDropOnRow: (id: string) => void;
  /** Pozisyon kutusuna yazılan numaraya taşı (1 tabanlı). */
  onMoveTo: (id: string, pos: number) => void;
  isDragging: boolean;
  isDropTarget: boolean;
}

function ProductRow({
  product,
  subcats,
  cats,
  reorder,
  staticPosition,
}: {
  product: Product;
  /** Çözümlenmiş alt kategori tanımları (kategori slug -> liste). */
  subcats: Record<string, SubcatDTO[]>;
  /** Çözülmüş kategori listesi (rozet adı/rengi buradan gelir). */
  cats?: CatDTO[];
  /** Dolu ise Sıra hücresi sürükleme kolu + pozisyon kutusuna dönüşür. */
  reorder?: ReorderCtx;
  /** Bir sıralama (fiyat/isim/yeni) etkinken: elle düzenlenemeyen, salt-okunur
   *  görünen pozisyon. Bu modda Sıra kutusu düzenlenmez (liste zaten o ölçüte
   *  göre dizili; ham sort değeri karıştırıyordu). */
  staticPosition?: number;
}) {
  const router = useRouter();
  const [price, setPrice] = useState(String(product.price));
  const [compare, setCompare] = useState(
    product.compare_at_price === null ? "" : String(product.compare_at_price),
  );
  const [inStock, setInStock] = useState(product.in_stock);
  // Gösterim sırası (products.sort) — vitrinde ürünler bu değere göre
  // (küçükten büyüğe) dizilir; buradaki değişiklik /urunler'e birebir yansır.
  const [sortVal, setSortVal] = useState(String(product.sort));
  const [busy, setBusy] = useState(false);
  const [, startTransition] = useTransition();

  // Toplu sıralama kaydından sonra router.refresh ile yeni sort değerleri
  // gelir; yerel durum güncellenmezse satır yanlışlıkla "değişti" görünür ve
  // Kaydet, bayat değeri geri yazıp sıralamayı bozar. Bu senkron onu önler.
  useEffect(() => {
    setSortVal(String(product.sort));
  }, [product.sort]);

  const compareInitial =
    product.compare_at_price === null ? "" : String(product.compare_at_price);
  // Sort alanı bu satırdan yalnızca "manuel sıra" modunda yönetilir. Sürükle-
  // bırak (reorder) modunda pozisyon kutusu + otomatik kayıt üstlenir; bir
  // sıralama (fiyat/isim/yeni) etkinken (staticPosition) Sıra salt-okunur
  // pozisyon gösterir. Her iki durumda da sort dirty/kayda dahil edilmez.
  const manageSortHere = !reorder && staticPosition === undefined;
  const dirty =
    parsePrice(price) !== Number(product.price) ||
    compare.trim() !== compareInitial ||
    inStock !== product.in_stock ||
    (manageSortHere && sortVal.trim() !== String(product.sort));

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
    const patch: Parameters<typeof updateProduct>[1] = {
      price: parsed,
      in_stock: inStock,
      compare_at_price: parsedCompare,
    };
    if (manageSortHere) {
      const parsedSort = Math.round(Number(sortVal.trim()));
      if (sortVal.trim() === "" || !Number.isFinite(parsedSort)) {
        window.alert("Geçerli bir sıra numarası girin (tam sayı, küçük olan önce gösterilir).");
        return;
      }
      patch.sort = parsedSort;
    }
    setBusy(true);
    startTransition(async () => {
      try {
        await updateProduct(product.id, patch);
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

  const category =
    cats?.find((c) => c.slug === product.category_slug) ??
    categoryBySlug(product.category_slug);
  const [tintBg, tintFg] = CATEGORY_TINTS[category?.tint ?? 0];
  // Kural tabanli alt kategori etiketi (DB kolonu yok): yonetici, urunun
  // kategori gorunumunde hangi alta dustugunu gorsun. Tanimsiz slug donerse
  // (pratikte "diger") "Diğer" etiketi gosterilir.
  const subs = (subcats[product.category_slug] ?? []).map(dtoToSub);
  const subSlug = assignSubcategory(
    subs,
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

  const rowClasses = [
    product.is_active ? "" : styles.rowInactive,
    reorder?.isDragging ? pstyles.rowDragging : "",
    reorder?.isDropTarget ? pstyles.rowDropTarget : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <tr
      className={rowClasses}
      draggable={Boolean(reorder)}
      onDragStart={reorder ? () => reorder.onDragStart(product.id) : undefined}
      onDragEnd={reorder ? () => reorder.onDragEnd() : undefined}
      onDragOver={reorder ? (e) => reorder.onDragOverRow(e, product.id) : undefined}
      onDrop={reorder ? () => reorder.onDropOnRow(product.id) : undefined}
    >
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
      <td data-label="Sıra">
        {reorder ? (
          /* Sıralama modu: sürükleme kolu + 1 tabanlı pozisyon kutusu.
             Kutuya numara yazıp Enter/odak dışı → satır o pozisyona taşınır.
             key=position: sıra değişince kutu yeni değerle tazelenir. */
          <span className={pstyles.orderCell}>
            <span
              className={pstyles.dragHandle}
              title="Sürükleyerek sırala"
              aria-hidden="true"
            >
              <GripVertical size={15} strokeWidth={2} />
            </span>
            <input
              key={reorder.position}
              type="number"
              inputMode="numeric"
              min={1}
              defaultValue={reorder.position}
              onBlur={(e) => {
                const v = Math.round(Number(e.target.value));
                if (Number.isFinite(v) && v !== reorder.position) {
                  reorder.onMoveTo(product.id, v);
                }
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") (e.target as HTMLInputElement).blur();
              }}
              className={`${styles.inputSm} ${pstyles.sortInput}`}
              title="Görünen pozisyon: numara yazıp Enter ile taşı, ya da satırı sürükle"
              aria-label={`${product.name} pozisyonu`}
            />
          </span>
        ) : staticPosition !== undefined ? (
          /* Bir sıralama (fiyat/isim/yeni) etkin: liste zaten o ölçüte göre
             dizili. Sıra kutusu ham sort değerini (110, 120…) düzenletmek
             yerine yalnız görünen pozisyonu (1, 2, 3…) salt-okunur gösterir. */
          <span
            style={{
              opacity: 0.5,
              fontVariantNumeric: "tabular-nums",
              display: "inline-block",
              paddingLeft: 6,
            }}
            title="Sıralama etkinken görünen pozisyon. Sırayı elle değiştirmek için 'Sıralama: Varsayılan'a dönün."
          >
            {staticPosition}
          </span>
        ) : (
          <input
            type="number"
            inputMode="numeric"
            value={sortVal}
            onChange={(e) => setSortVal(e.target.value)}
            className={`${styles.inputSm} ${pstyles.sortInput}`}
            title="Gösterim sırası: küçük numara vitrinde önce gösterilir"
            aria-label={`${product.name} gösterim sırası`}
          />
        )}
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
            {busy ? "Kaydediliyor…" : dirty ? "Kaydet" : "Kayıtlı"}
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
  subcats,
  cats,
  reorderable = false,
  reorderCategorySlug,
  sortActive = false,
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
  /** Çözümlenmiş alt kategori tanımları (satır etiketleri için). */
  subcats: Record<string, SubcatDTO[]>;
  /** Çözülmüş kategori listesi (DB adları); yoksa koddaki liste kullanılır. */
  cats?: CatDTO[];
  /** Tek kategori görünümünde sürükle-bırak sıralama açık mı? */
  reorderable?: boolean;
  /** Sıralama kaydında hedef kategori (alt küme birleştirmesi için şart). */
  reorderCategorySlug?: string;
  /** Bir sıralama (fiyat/isim/yeni) etkin mi? Etkinse Sıra sütunu salt-okunur
   *  görünen pozisyon gösterir (ham sort değeri 110,120… yerine 1,2,3…). */
  sortActive?: boolean;
}) {
  const router = useRouter();
  const [showForm, setShowForm] = useState(openForm);
  const [busy, setBusy] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  // --- Sürükle-bırak sıralama (yalnız reorderable modda) ---
  // items: yerel sıra; products değişince (filtre/refresh) senkronlanır.
  // Kayıt OTOMATİKTİR: her taşımadan kısa bir bekleme (debounce) sonra sunucuya
  // yazılır; ayrıca bir "Sırayı Kaydet" düğmesi yoktur.
  const [items, setItems] = useState<Product[]>(products);
  const [dragId, setDragId] = useState<string | null>(null);
  const [overId, setOverId] = useState<string | null>(null);
  const [orderStatus, setOrderStatus] = useState<"idle" | "saving" | "saved">(
    "idle",
  );
  const itemsRef = useRef<Product[]>(products);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const statusTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    setItems(products);
    itemsRef.current = products;
  }, [products]);
  useEffect(() => {
    itemsRef.current = items;
  }, [items]);
  useEffect(() => {
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
      if (statusTimer.current) clearTimeout(statusTimer.current);
    };
  }, []);

  /** Yeni sırayı sunucuya yaz. Kategori slug'ı varsa alt-küme-farkındalıklı
     kayıt: üyeler kategori listesindeki kendi slotlarına yerleşir, kategori
     geneli yeniden numaralanır; alt küme dışındakilerin sırası bozulmaz. */
  const persistOrder = () => {
    setOrderStatus("saving");
    startTransition(async () => {
      try {
        const snapshot = itemsRef.current;
        if (reorderCategorySlug) {
          await updateSubcatSortBulk(
            reorderCategorySlug,
            snapshot.map((p) => p.id),
          );
        } else {
          await updateProductSortBulk(
            snapshot.map((p, i) => ({ id: p.id, sort: (i + 1) * 10 })),
          );
        }
        setOrderStatus("saved");
        if (statusTimer.current) clearTimeout(statusTimer.current);
        statusTimer.current = setTimeout(() => setOrderStatus("idle"), 2500);
        router.refresh();
      } catch (e) {
        setOrderStatus("idle");
        window.alert(
          e instanceof Error ? e.message : "Sıralama kaydedilemedi.",
        );
      }
    });
  };

  /** Taşımaları grupla: son değişiklikten 700 ms sonra tek seferde kaydet. */
  const scheduleOrderSave = () => {
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(persistOrder, 700);
  };

  /** Listeyi yeni dizilime geçir ve otomatik kaydı planla (değişiklik yoksa hiçbir şey yapma). */
  const applyOrder = (next: Product[]) => {
    const prev = itemsRef.current;
    if (next.length === prev.length && next.every((p, i) => p.id === prev[i].id)) {
      return;
    }
    setItems(next);
    itemsRef.current = next;
    scheduleOrderSave();
  };

  /** id'li satırı 1 tabanlı hedef pozisyona taşı. */
  const moveTo = (id: string, pos: number) => {
    const prev = itemsRef.current;
    const from = prev.findIndex((p) => p.id === id);
    if (from === -1) return;
    const to = Math.max(0, Math.min(prev.length - 1, Math.round(pos) - 1));
    if (to === from) return;
    const next = [...prev];
    const [row] = next.splice(from, 1);
    next.splice(to, 0, row);
    applyOrder(next);
  };

  const dropOn = (targetId: string) => {
    const id = dragId;
    setDragId(null);
    setOverId(null);
    if (!id || id === targetId) return;
    const prev = itemsRef.current;
    const from = prev.findIndex((p) => p.id === id);
    const to = prev.findIndex((p) => p.id === targetId);
    if (from === -1 || to === -1) return;
    const next = [...prev];
    const [row] = next.splice(from, 1);
    next.splice(to, 0, row);
    applyOrder(next);
  };

  /** Tek tık otomatik sıralama: çok satan işaretliler öne (kararlı sıralama;
     kendi aralarındaki ve kalanların bağıl sırası korunur). Otomatik kaydedilir. */
  function autoSortBestSellers() {
    const next = [...itemsRef.current].sort(
      (a, b) => Number(b.is_best_seller) - Number(a.is_best_seller),
    );
    applyOrder(next);
  }

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
                  {(cats ?? SHOP_CATEGORIES).map((c) => (
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

      {/* Sıralama modu bilgi çubuğu: değişiklikler OTOMATİK kaydedilir,
          durum (kaydediliyor / kaydedildi) burada gösterilir. */}
      {reorderable && (
        <div
          className={`${pstyles.orderBar}${
            orderStatus === "saving"
              ? ` ${pstyles.orderBarDirty}`
              : orderStatus === "saved"
                ? ` ${pstyles.orderBarSaved}`
                : ""
          }`}
          aria-live="polite"
        >
          <span className={pstyles.orderBarText}>
            {orderStatus === "saving"
              ? "Sıra kaydediliyor..."
              : orderStatus === "saved"
                ? "Sıra kaydedildi. Vitrindeki gösterim güncellendi."
                : "Satırları sürükleyerek ya da Sıra kutusuna pozisyon yazarak sırayı düzenleyin. Değişiklikler otomatik kaydedilir."}
          </span>
          <span className={pstyles.orderBarBtns}>
            <button
              type="button"
              onClick={autoSortBestSellers}
              disabled={orderStatus === "saving"}
              className={styles.btnRow}
              title="Çok satan işaretli ürünleri listenin başına al (otomatik kaydedilir)"
            >
              <Star size={13} aria-hidden />
              Çok Satanları Öne Al
            </button>
          </span>
        </div>
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
                    <th title="Gösterim sırası: küçük numara vitrinde önce">Sıra</th>
                    <th>Fiyat</th>
                    <th>Eski Fiyat</th>
                    <th>Stok</th>
                    <th>Çok Satan</th>
                    <th>Durum</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {(reorderable ? items : products).map((p, i) => (
                    <ProductRow
                      key={p.id}
                      product={p}
                      subcats={subcats}
                      cats={cats}
                      staticPosition={
                        !reorderable && sortActive
                          ? pagination.rangeStart + i
                          : undefined
                      }
                      reorder={
                        reorderable
                          ? {
                              position: i + 1,
                              onDragStart: (id) => setDragId(id),
                              onDragEnd: () => {
                                setDragId(null);
                                setOverId(null);
                              },
                              onDragOverRow: (e, id) => {
                                e.preventDefault(); // drop'a izin ver
                                if (id !== overId) setOverId(id);
                              },
                              onDropOnRow: dropOn,
                              onMoveTo: moveTo,
                              isDragging: dragId === p.id,
                              isDropTarget:
                                overId === p.id && dragId !== null && dragId !== p.id,
                            }
                          : undefined
                      }
                    />
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
