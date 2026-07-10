"use client";

// Stok tablosu — satır içi stok düzenleme (kaydet yalnız değişince aktif),
// hızlı filtre çipleri (GET linki) ve ürün adı araması.

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertTriangle, PackageX, Search, Scale } from "lucide-react";
import { setProductStock, type StockRow } from "@/lib/shop/admin-actions";
import { categoryBySlug, CATEGORY_TINTS } from "@/lib/shop/categories";
import { formatGrams } from "@/lib/shop/types";
import styles from "../../admin.module.css";

function hrefFor(q: string, filtre?: string): string {
  const p = new URLSearchParams();
  if (q) p.set("q", q);
  if (filtre) p.set("filtre", filtre);
  const s = p.toString();
  return s ? `/admin/stok?${s}` : "/admin/stok";
}

/** Satır durumu: tükendi / düşük / stokta / takipsiz. */
function stateOf(r: StockRow): "tukendi" | "dusuk" | "ok" | "takipsiz" {
  if (r.stock_qty === null) return r.in_stock ? "takipsiz" : "tukendi";
  if (r.stock_qty <= 0 || !r.in_stock) return "tukendi";
  if (r.stock_qty <= (r.sold_by_weight ? 2000 : 5)) return "dusuk";
  return "ok";
}

function StockCell({ row }: { row: StockRow }) {
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
      {row.sold_by_weight && <span className={styles.stockUnit}>g</span>}
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

export default function StockTable({
  rows,
  q,
  filtre,
}: {
  rows: StockRow[];
  q: string;
  filtre?: string;
}) {
  const chips: { key?: string; label: string }[] = [
    { key: undefined, label: "Tümü" },
    { key: "dusuk", label: "Düşük stok" },
    { key: "tukendi", label: "Tükendi" },
    { key: "takipsiz", label: "Takipsiz" },
  ];

  return (
    <>
      <div className={styles.toolbar}>
        {/* Arama — GET formu (sunucu filtreler) */}
        <form action="/admin/stok" className={styles.stockSearch}>
          {filtre && <input type="hidden" name="filtre" value={filtre} />}
          <Search size={15} aria-hidden />
          <input
            type="search"
            name="q"
            defaultValue={q}
            placeholder="Ürün ara…"
            className={styles.input}
            aria-label="Ürün ara"
          />
        </form>
        <div className={styles.quickChips}>
          {chips.map((c) => (
            <Link
              key={c.label}
              href={hrefFor(q, c.key)}
              className={`${styles.chip} ${
                (filtre ?? undefined) === c.key ? styles["chip--active"] : ""
              }`}
            >
              {c.label}
            </Link>
          ))}
        </div>
      </div>

      {rows.length === 0 ? (
        <div className={styles.empty}>
          Bu filtreyle eşleşen ürün yok.
        </div>
      ) : (
        <div className={styles.tableCard}>
          <div className={styles.tableScroll}>
            <table className={styles.table}>
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
                  const st = stateOf(r);
                  return (
                    <tr key={r.id} className={st === "tukendi" ? styles.rowInactive : ""}>
                      <td data-label="Ürün">
                        <div className={styles.prodText}>
                          <div className={styles.prodName}>
                            {r.name}
                            {r.sold_by_weight && (
                              <Scale
                                size={13}
                                aria-label="gram bazlı"
                                style={{ marginLeft: 6, verticalAlign: "-2px", opacity: 0.55 }}
                              />
                            )}
                          </div>
                          <div className={styles.prodMeta}>
                            {[r.brand, r.size_text].filter(Boolean).join(" · ") || "·"}
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
                            <PackageX size={13} aria-hidden /> Tükendi
                          </span>
                        )}
                        {st === "dusuk" && (
                          <span className={`${styles.pill} ${styles["pill--warn"]}`}>
                            <AlertTriangle size={13} aria-hidden /> Düşük
                            {r.stock_qty !== null &&
                              ` · ${r.sold_by_weight ? formatGrams(r.stock_qty) : r.stock_qty}`}
                          </span>
                        )}
                        {st === "ok" && (
                          <span className={`${styles.pill} ${styles["pill--ok"]}`}>
                            Stokta
                            {r.stock_qty !== null &&
                              ` · ${r.sold_by_weight ? formatGrams(r.stock_qty) : r.stock_qty}`}
                          </span>
                        )}
                        {st === "takipsiz" && (
                          <span className={styles.pill}>Takipsiz</span>
                        )}
                      </td>
                      <td data-label="Stok">
                        <StockCell row={r} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
      <p className={styles.subtitle} style={{ marginTop: 12, fontSize: 12.5 }}>
        Gram bazlı ürünlerde stok <b>gram</b> cinsindendir (ör. 5000 = 5 kg).
        En fazla 300 satır gösterilir; arama ile daraltın.
      </p>
    </>
  );
}
