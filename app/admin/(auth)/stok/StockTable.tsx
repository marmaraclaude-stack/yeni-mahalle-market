"use client";

// Stok tablosu — Ürünler sayfasıyla aynı yapı: araç çubuğu (filtre slotu),
// sayılı hızlı filtre çipleri (GET linki), üst/alt sayfa kontrolü, thumb'lı
// tablo. Satır içi stok düzenleme (Kaydet yalnız değişince aktif).

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertTriangle, PackageX, Scale } from "lucide-react";
import {
  setProductStock,
  type StockFilter,
  type StockRow,
} from "@/lib/shop/admin-actions";
import { categoryBySlug, CATEGORY_TINTS } from "@/lib/shop/categories";
import { formatGrams, isWeightBased } from "@/lib/shop/types";
import styles from "../../admin.module.css";
import pstyles from "../urunler/products.module.css";

export type StockPageItem =
  | { type: "page"; number: number; href: string; current: boolean }
  | { type: "gap" };

export interface StockPagination {
  page: number;
  totalPages: number;
  total: number;
  rangeStart: number;
  rangeEnd: number;
  prevHref: string | null;
  nextHref: string | null;
  items: StockPageItem[];
}

export interface StockChip {
  key: StockFilter;
  label: string;
  count: number;
  href: string;
  active: boolean;
}

/** Sunucudan gelen çözülmüş kategori listesi (DB adları + özel kategoriler). */
export interface StockCat {
  slug: string;
  name: string;
  tint: number;
}

/** Satır durumu: tükendi / düşük / stokta / takipsiz.
 *  Gram bazlılık isWeightBased ile (unit=kg/gram + meyve-sebze dahil). */
function stateOf(
  r: StockRow,
  byWeight: boolean,
): "tukendi" | "dusuk" | "ok" | "takipsiz" {
  if (r.stock_qty === null) return r.in_stock ? "takipsiz" : "tukendi";
  if (r.stock_qty <= 0 || !r.in_stock) return "tukendi";
  if (r.stock_qty <= (byWeight ? 2000 : 5)) return "dusuk";
  return "ok";
}

/** kg metni: 5000 g → "5" · 2500 g → "2,5". */
function gramsToKgText(grams: number): string {
  return String(grams / 1000).replace(".", ",");
}

/** Stok satırı — gram bazlı üründe giriş KG cinsindendir (2,5 = 2500 g);
 *  adetli üründe adet. Kaydet, Ürünler'deki gibi sağdaki İşlem hücresinde. */
function StockRowView({ row, cats }: { row: StockRow; cats?: StockCat[] }) {
  const router = useRouter();
  const byWeight = isWeightBased(row);
  const initial =
    row.stock_qty === null
      ? ""
      : byWeight
        ? gramsToKgText(row.stock_qty)
        : String(row.stock_qty);
  const [value, setValue] = useState(initial);
  const [busy, setBusy] = useState(false);
  const [, startTransition] = useTransition();

  const dirty = value.trim() !== initial;
  const cat =
    cats?.find((c) => c.slug === row.category_slug) ??
    categoryBySlug(row.category_slug);
  const [bg, fg] = CATEGORY_TINTS[cat?.tint ?? 0];
  const st = stateOf(row, byWeight);

  function save() {
    const raw = value.trim();
    let qty: number | null = null;
    if (raw !== "") {
      const n = Number(raw.replace(",", "."));
      if (!Number.isFinite(n) || n < 0) {
        window.alert(
          byWeight
            ? "Geçerli bir kg değeri girin (örn. 2,5). Boş = takibi kapat."
            : "Geçerli bir stok adedi girin (boş = takibi kapat).",
        );
        return;
      }
      qty = Math.round(byWeight ? n * 1000 : n);
    }
    setBusy(true);
    startTransition(async () => {
      try {
        const res = await setProductStock(row.id, qty);
        if (!res.ok) window.alert(res.error ?? "Stok güncellenemedi.");
        router.refresh();
      } finally {
        setBusy(false);
      }
    });
  }

  return (
    <tr className={st === "tukendi" ? styles.rowInactive : ""}>
      <td data-label="Ürün">
        <div className={styles.prodCell}>
          {row.image_url ? (
            <img
              src={row.image_url}
              alt=""
              width={44}
              height={44}
              loading="lazy"
              className={styles.thumb}
            />
          ) : (
            <span
              className={styles.thumbEmpty}
              style={{ background: bg, color: fg }}
              aria-hidden
            >
              {row.name.charAt(0).toLocaleUpperCase("tr-TR")}
            </span>
          )}
          <div className={styles.prodText}>
            <div className={styles.prodName}>{row.name}</div>
            <div className={styles.prodMeta}>
              {[row.brand, row.size_text].filter(Boolean).join(" · ") || "·"}
              {byWeight && " · kg ile satılır"}
            </div>
          </div>
        </div>
      </td>
      <td data-label="Kategori">
        <span className={styles.catBadge} style={{ background: bg, color: fg }}>
          {cat?.name ?? row.category_slug}
        </span>
      </td>
      <td data-label="Durum">
        {st === "tukendi" && (
          <span className={`${styles.pill} ${styles["pill--err"]}`}>Tükendi</span>
        )}
        {st === "dusuk" && (
          <span className={`${styles.pill} ${styles["pill--warn"]}`}>
            Düşük
            {row.stock_qty !== null &&
              ` · ${byWeight ? formatGrams(row.stock_qty) : row.stock_qty}`}
          </span>
        )}
        {st === "ok" && (
          <span className={`${styles.pill} ${styles["pill--ok"]}`}>
            Stokta
            {row.stock_qty !== null &&
              ` · ${byWeight ? formatGrams(row.stock_qty) : row.stock_qty}`}
          </span>
        )}
        {st === "takipsiz" && <span className={styles.pill}>Takipsiz</span>}
      </td>
      <td data-label="Stok">
        <span className={styles.stockCell}>
          <input
            type="text"
            inputMode="decimal"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="-"
            className={`${styles.inputSm} ${styles.stockInput}`}
            aria-label={`${row.name} stok (${byWeight ? "kg" : "adet"})`}
          />
          <span className={styles.stockUnit}>{byWeight ? "kg" : "adet"}</span>
        </span>
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
        </div>
      </td>
    </tr>
  );
}

/** Önceki / sayfa numaraları / Sonraki — Ürünler ile aynı görünüm. */
function Pager({ pagination }: { pagination: StockPagination }) {
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

export default function StockTable({
  rows,
  cats,
  chips,
  pagination,
  filterSlot,
}: {
  rows: StockRow[];
  /** Çözülmüş kategori listesi (rozet adı/rengi buradan gelir). */
  cats?: StockCat[];
  chips: StockChip[];
  pagination: StockPagination;
  filterSlot?: React.ReactNode;
}) {
  return (
    <>
      {/* Araç çubuğu: arama + kategori + Filtrele (Ürünler ile aynı) */}
      <div className={styles.toolbar}>{filterSlot}</div>

      {/* Hızlı filtre çipleri — sayılı, GET linki */}
      <div className={styles.quickBar}>
        <div className={styles.quickChips}>
          {chips.map((c) => (
            <Link
              key={c.key}
              href={c.href}
              className={`${styles.chip} ${c.active ? styles["chip--active"] : ""}`}
              aria-current={c.active ? "true" : undefined}
            >
              {c.key === "dusuk" && <AlertTriangle size={14} aria-hidden />}
              {c.key === "tukendi" && <PackageX size={14} aria-hidden />}
              {c.key === "takipsiz" && <Scale size={14} aria-hidden />}
              {c.label}
              <span className={styles.chipCount}>{c.count}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Liste üstü: aralık bilgisi + sayfa kontrolü */}
      <div className={pstyles.pagerBar}>
        <span className={pstyles.rangeInfo}>
          {pagination.total === 0
            ? "Sonuç yok"
            : `${pagination.rangeStart}-${pagination.rangeEnd} arası, toplam ${pagination.total} ürün`}
        </span>
        <Pager pagination={pagination} />
      </div>

      {rows.length === 0 ? (
        <div className={styles.empty}>Bu filtreyle eşleşen ürün yok.</div>
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
                    <th>Durum</th>
                    <th>Stok</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r) => (
                    <StockRowView key={r.id} row={r} cats={cats} />
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className={pstyles.pagerBottom}>
            <Pager pagination={pagination} />
          </div>
        </>
      )}
    </>
  );
}
