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

function StockCell({ row, byWeight }: { row: StockRow; byWeight: boolean }) {
  const router = useRouter();
  const [value, setValue] = useState(
    row.stock_qty === null ? "" : String(row.stock_qty),
  );
  const [busy, setBusy] = useState(false);
  const [, startTransition] = useTransition();

  const initial = row.stock_qty === null ? "" : String(row.stock_qty);
  const dirty = value.trim() !== initial;

  function save() {
    const raw = value.trim();
    const qty = raw === "" ? null : Math.round(Number(raw.replace(",", ".")));
    if (raw !== "" && (!Number.isFinite(qty!) || qty! < 0)) {
      window.alert("Geçerli bir stok adedi girin (boş = takibi kapat).");
      return;
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
    <div className={styles.stockCell}>
      <input
        type="text"
        inputMode="numeric"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="—"
        className={`${styles.inputSm} ${styles.stockInput}`}
        aria-label={`${row.name} stok adedi`}
      />
      {byWeight && <span className={styles.stockUnit}>g</span>}
      <button
        type="button"
        onClick={save}
        disabled={!dirty || busy}
        className={`${styles.btnRow} ${dirty ? styles["btnRow--primary"] : ""}`}
      >
        {busy ? "Kaydediliyor…" : dirty ? "Kaydet" : "Kayıtlı"}
      </button>
    </div>
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
  chips,
  pagination,
  filterSlot,
}: {
  rows: StockRow[];
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
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r) => {
                    const cat = categoryBySlug(r.category_slug);
                    const [bg, fg] = CATEGORY_TINTS[cat?.tint ?? 0];
                    const byWeight = isWeightBased(r);
                    const st = stateOf(r, byWeight);
                    return (
                      <tr
                        key={r.id}
                        className={st === "tukendi" ? styles.rowInactive : ""}
                      >
                        <td data-label="Ürün">
                          <div className={styles.prodCell}>
                            {r.image_url ? (
                              <img
                                src={r.image_url}
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
                                {r.name.charAt(0).toLocaleUpperCase("tr-TR")}
                              </span>
                            )}
                            <div className={styles.prodText}>
                              <div className={styles.prodName}>{r.name}</div>
                              <div className={styles.prodMeta}>
                                {[r.brand, r.size_text]
                                  .filter(Boolean)
                                  .join(" · ") || "·"}
                                {byWeight && " · gram bazlı"}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td data-label="Kategori">
                          <span
                            className={styles.catBadge}
                            style={{ background: bg, color: fg }}
                          >
                            {cat?.name ?? r.category_slug}
                          </span>
                        </td>
                        <td data-label="Durum">
                          {st === "tukendi" && (
                            <span className={`${styles.pill} ${styles["pill--err"]}`}>
                              Tükendi
                            </span>
                          )}
                          {st === "dusuk" && (
                            <span className={`${styles.pill} ${styles["pill--warn"]}`}>
                              Düşük
                              {r.stock_qty !== null &&
                                ` · ${byWeight ? formatGrams(r.stock_qty) : r.stock_qty}`}
                            </span>
                          )}
                          {st === "ok" && (
                            <span className={`${styles.pill} ${styles["pill--ok"]}`}>
                              Stokta
                              {r.stock_qty !== null &&
                                ` · ${byWeight ? formatGrams(r.stock_qty) : r.stock_qty}`}
                            </span>
                          )}
                          {st === "takipsiz" && (
                            <span className={styles.pill}>Takipsiz</span>
                          )}
                        </td>
                        <td data-label="Stok">
                          <StockCell row={r} byWeight={byWeight} />
                        </td>
                      </tr>
                    );
                  })}
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
