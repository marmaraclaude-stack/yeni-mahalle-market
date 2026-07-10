// Admin — Stok: Ürünler sayfasıyla aynı yapı — sunucu taraflı sayfalama
// (50/sayfa), araç çubuğu (arama + kategori + Filtrele), sayılı hızlı filtre
// çipleri, üst/alt sayfa kontrolü, thumb'lı tablo. Satır içi stok düzenleme.

import { Search } from "lucide-react";
import { listStock, type StockFilter } from "@/lib/shop/admin-actions";
import { SHOP_CATEGORIES } from "@/lib/shop/categories";
import StockTable, { type StockPageItem } from "./StockTable";
import styles from "../../admin.module.css";

export const dynamic = "force-dynamic";
export const metadata = { title: "Stok" };

const PAGE_SIZE = 50;
const FILTERS: StockFilter[] = ["dusuk", "tukendi", "takipsiz"];
const FILTER_LABELS: Record<StockFilter, string> = {
  dusuk: "Düşük Stok",
  tukendi: "Tükendi",
  takipsiz: "Takipsiz",
};

function buildHref(params: {
  k?: string;
  q?: string;
  filtre?: StockFilter | null;
  sayfa?: number;
}): string {
  const sp = new URLSearchParams();
  if (params.k) sp.set("k", params.k);
  if (params.q) sp.set("q", params.q);
  if (params.filtre) sp.set("filtre", params.filtre);
  if (params.sayfa && params.sayfa > 1) sp.set("sayfa", String(params.sayfa));
  const qs = sp.toString();
  return qs ? `/admin/stok?${qs}` : "/admin/stok";
}

/** Ürünler sayfasındaki akıllı kısaltmalı sayfa listesiyle aynı mantık. */
function buildPageItems(
  page: number,
  totalPages: number,
  hrefFor: (n: number) => string,
): StockPageItem[] {
  const wanted = new Set<number>([1, totalPages, page - 1, page, page + 1]);
  const nums = [...wanted]
    .filter((n) => n >= 1 && n <= totalPages)
    .sort((a, b) => a - b);
  const items: StockPageItem[] = [];
  let prev = 0;
  for (const n of nums) {
    if (prev > 0 && n - prev === 2) {
      items.push({ type: "page", number: prev + 1, href: hrefFor(prev + 1), current: false });
    } else if (prev > 0 && n - prev > 2) {
      items.push({ type: "gap" });
    }
    items.push({ type: "page", number: n, href: hrefFor(n), current: n === page });
    prev = n;
  }
  return items;
}

export default async function StockPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; k?: string; filtre?: string; sayfa?: string }>;
}) {
  const sp = await searchParams;
  const q = typeof sp.q === "string" ? sp.q.trim() : "";
  const k = SHOP_CATEGORIES.some((c) => c.slug === sp.k) ? sp.k! : "";
  const filtre = FILTERS.includes(sp.filtre as StockFilter)
    ? (sp.filtre as StockFilter)
    : undefined;
  const parsedPage = Number.parseInt(sp.sayfa ?? "1", 10);
  const requestedPage =
    Number.isFinite(parsedPage) && parsedPage >= 1 ? parsedPage : 1;

  const { rows, total, counts } = await listStock({
    q,
    category: k || undefined,
    filter: filtre,
    page: requestedPage,
  });

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const page = Math.min(requestedPage, totalPages);
  const rangeStart = total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const rangeEnd = Math.min(total, page * PAGE_SIZE);

  const hrefFor = (n: number) => buildHref({ k, q, filtre, sayfa: n });
  const pagination = {
    page,
    totalPages,
    total,
    rangeStart,
    rangeEnd,
    prevHref: page > 1 ? hrefFor(page - 1) : null,
    nextHref: page < totalPages ? hrefFor(page + 1) : null,
    items: buildPageItems(page, totalPages, hrefFor),
  };

  const chips = FILTERS.map((key) => ({
    key,
    label: FILTER_LABELS[key],
    count: counts[key],
    href:
      filtre === key
        ? buildHref({ k, q })
        : buildHref({ k, q, filtre: key }),
    active: filtre === key,
  }));

  // Araç çubuğu — Ürünler'dekiyle aynı dil: arama + kategori + Filtrele (GET).
  const filterSlot = (
    <form method="get" action="/admin/stok" className={styles.toolbarFilter}>
      <div className={styles.searchWrap}>
        <span className={styles.searchIcon} aria-hidden>
          <Search size={15} />
        </span>
        <input
          type="search"
          name="q"
          defaultValue={q}
          placeholder="Ürün adında ara"
          className={styles.input}
          aria-label="Ürün adında ara"
        />
      </div>
      <select
        name="k"
        defaultValue={k}
        className={styles.select}
        aria-label="Kategori"
      >
        <option value="">Tüm kategoriler</option>
        {SHOP_CATEGORIES.map((c) => (
          <option key={c.slug} value={c.slug}>
            {c.name}
          </option>
        ))}
      </select>
      {filtre && <input type="hidden" name="filtre" value={filtre} />}
      <button
        type="submit"
        className={`${styles.actionBtn} ${styles["actionBtn--primary"]}`}
      >
        Filtrele
      </button>
    </form>
  );

  return (
    <>
      <h1 className={styles.title}>Stok</h1>
      <p className={styles.subtitle} style={{ marginBottom: 18 }}>
        {total} ürün · sayfa {page}/{totalPages} — adet girin; sipariş geldikçe
        otomatik düşer, 0&apos;a inince ürün &quot;tükendi&quot; olur.
      </p>
      <StockTable
        rows={rows}
        chips={chips}
        pagination={pagination}
        filterSlot={filterSlot}
      />
    </>
  );
}
