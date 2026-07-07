// Admin urun yonetimi: SUNUCU TARAFLI sayfalama + filtreleme.
// searchParams: k (kategori), altk (alt kategori; yalniz k ile anlamli),
// q (arama), sayfa (1-tabanli), filtre ("indirimli" | "cok-satan" |
// "stokta-yok"), yeni (formu acik baslat).
// Sayfa boyutu 50; cip sayilari tum katalogdan (k/q kapsaminda) 3 ayri
// head:true count sorgusuyla gelir. Cipler ve sayfa numaralari GET linkidir.
// altk seciliyken: alt kategori DB kolonu olmadigindan kategori urunleri tek
// sorguyla cekilir, assignSubcategory ile bellekte filtrelenir; cip sayilari,
// hizli filtre ve 50'lik sayfalama bu filtrelenmis liste uzerinde uygulanir.

import { Search } from "lucide-react";
import { createAdminClient } from "@/lib/supabase/admin";
import { SHOP_CATEGORIES } from "@/lib/shop/categories";
import { assignSubcategory, subcatsFor } from "@/lib/shop/subcategories";
import type { Product } from "@/lib/shop/types";
import ProductsTable, {
  type ChipData,
  type PageItem,
  type PaginationData,
} from "./ProductsTable";
import styles from "../../admin.module.css";

export const dynamic = "force-dynamic";
export const metadata = { title: "Ürünler" };

const PAGE_SIZE = 50;

const FILTER_KEYS = ["indirimli", "cok-satan", "stokta-yok"] as const;
type CatalogFilter = (typeof FILTER_KEYS)[number];

const FILTER_LABELS: Record<CatalogFilter, string> = {
  indirimli: "İndirimli",
  "cok-satan": "Çok Satan",
  "stokta-yok": "Stokta Yok",
};

function parseFilter(value: string | undefined): CatalogFilter | null {
  return (FILTER_KEYS as readonly string[]).includes(value ?? "")
    ? (value as CatalogFilter)
    : null;
}

/** k/altk/q/filtre/sayfa parametrelerinden GET linki uret (bos olanlar
 *  atlanir; altk yalniz k ile birlikte anlamli oldugundan k yoksa dusulur). */
function buildHref(params: {
  k?: string;
  altk?: string | null;
  q?: string;
  filtre?: CatalogFilter | null;
  sayfa?: number;
}): string {
  const sp = new URLSearchParams();
  if (params.k) sp.set("k", params.k);
  if (params.k && params.altk) sp.set("altk", params.altk);
  if (params.q) sp.set("q", params.q);
  if (params.filtre) sp.set("filtre", params.filtre);
  if (params.sayfa && params.sayfa > 1) sp.set("sayfa", String(params.sayfa));
  const qs = sp.toString();
  return qs ? `/admin/urunler?${qs}` : "/admin/urunler";
}

/** Akilli kisaltmali sayfa listesi: 1 ... 5 6 7 ... 40 (tek sayfalik bosluk
 *  uc nokta yerine sayinin kendisiyle doldurulur). */
function buildPageItems(
  page: number,
  totalPages: number,
  hrefFor: (n: number) => string,
): PageItem[] {
  const wanted = new Set<number>([1, totalPages, page - 1, page, page + 1]);
  const nums = [...wanted]
    .filter((n) => n >= 1 && n <= totalPages)
    .sort((a, b) => a - b);

  const items: PageItem[] = [];
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

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<{
    k?: string;
    altk?: string;
    q?: string;
    yeni?: string;
    sayfa?: string;
    filtre?: string;
  }>;
}) {
  const { k, altk: altkRaw, q, yeni, sayfa, filtre: filtreRaw } = await searchParams;
  const category = k ?? "";
  const search = (q ?? "").trim();
  const filtre = parseFilter(filtreRaw);
  // Alt kategori: yalniz k seciliyken ve o kategorinin tanimli alt slug'lari
  // arasindaysa gecerli; aksi halde sessizce yok sayilir (kategori degisince
  // formda kalan eski altk boylece temizlenir).
  const subOptions = category ? subcatsFor(category) : [];
  const altk =
    altkRaw && subOptions.some((s) => s.slug === altkRaw) ? altkRaw : null;
  const parsedPage = Number.parseInt(sayfa ?? "1", 10);
  const requestedPage = Number.isFinite(parsedPage) && parsedPage >= 1 ? parsedPage : 1;

  let products: Product[] = [];
  let loadError: string | null = null;
  let page = 1;
  let totalPages = 1;
  let total = 0; // aktif k/q/filtre kapsaminda toplam sonuc
  let chipCounts: Record<CatalogFilter, number> = {
    indirimli: 0,
    "cok-satan": 0,
    "stokta-yok": 0,
  };

  try {
    const supabase = createAdminClient();

    if (altk) {
      // ALT KATEGORI YOLU: altk DB kolonu degil, kural tabanli. Kategorinin
      // tum urunleri tek sorguyla cekilir (kategori basina <100 urun; 1000'lik
      // tek range yeterli), assignSubcategory ile bellekte filtrelenir. Cip
      // sayilari, hizli filtre ve 50'lik sayfalama bellekte uygulanir.
      let subQuery = supabase
        .from("products")
        .select("*")
        .eq("category_slug", category)
        .order("category_slug")
        .order("sort")
        .order("name")
        .order("id")
        .range(0, 999);
      if (search) subQuery = subQuery.ilike("name", `%${search}%`);

      const { data, error } = await subQuery;
      if (error) throw new Error(error.message);

      const inSub = ((data ?? []) as Product[]).filter(
        (p) => assignSubcategory(category, p.name, p.brand) === altk,
      );

      // Cip sayilari filtrelenmis alt kategori listesinden.
      chipCounts = {
        indirimli: inSub.filter((p) => p.compare_at_price !== null).length,
        "cok-satan": inSub.filter((p) => p.is_best_seller).length,
        "stokta-yok": inSub.filter((p) => !p.in_stock).length,
      };

      let filtered = inSub;
      if (filtre === "indirimli") {
        filtered = inSub.filter((p) => p.compare_at_price !== null);
      } else if (filtre === "cok-satan") {
        filtered = inSub.filter((p) => p.is_best_seller);
      } else if (filtre === "stokta-yok") {
        filtered = inSub.filter((p) => !p.in_stock);
      }

      total = filtered.length;
      totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
      page = Math.min(requestedPage, totalPages);
      const from = (page - 1) * PAGE_SIZE;
      products = filtered.slice(from, from + PAGE_SIZE);
    } else {
      // MEVCUT DB SAYFALAMA YOLU (altk yokken aynen korunur).
      // Ortak k/q kosullu head:true count sorgusu.
      const countBase = () => {
        let query = supabase
          .from("products")
          .select("*", { count: "exact", head: true });
        if (category) query = query.eq("category_slug", category);
        if (search) query = query.ilike("name", `%${search}%`);
        return query;
      };

      // Cip sayilari TUM katalogdan (sayfadaki 50 satirdan degil): 3 ayri
      // count sorgusu + toplam count, paralel calisir.
      const [totalRes, discountedRes, bestRes, oosRes] = await Promise.all([
        countBase(),
        countBase().not("compare_at_price", "is", null),
        countBase().eq("is_best_seller", true),
        countBase().eq("in_stock", false),
      ]);

      const countError =
        totalRes.error ?? discountedRes.error ?? bestRes.error ?? oosRes.error;
      if (countError) throw new Error(countError.message);

      chipCounts = {
        indirimli: discountedRes.count ?? 0,
        "cok-satan": bestRes.count ?? 0,
        "stokta-yok": oosRes.count ?? 0,
      };
      const totalInScope = totalRes.count ?? 0;
      total = filtre ? chipCounts[filtre] : totalInScope;

      // Sayfa numarasini araliga sabitle (asiri sayfa istegi son sayfaya iner).
      totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
      page = Math.min(requestedPage, totalPages);
      const from = (page - 1) * PAGE_SIZE;

      let dataQuery = supabase
        .from("products")
        .select("*", { count: "exact" })
        .order("category_slug")
        .order("sort")
        .order("name")
        .order("id")
        .range(from, from + PAGE_SIZE - 1);
      if (category) dataQuery = dataQuery.eq("category_slug", category);
      if (search) dataQuery = dataQuery.ilike("name", `%${search}%`);
      if (filtre === "indirimli") {
        dataQuery = dataQuery.not("compare_at_price", "is", null);
      } else if (filtre === "cok-satan") {
        dataQuery = dataQuery.eq("is_best_seller", true);
      } else if (filtre === "stokta-yok") {
        dataQuery = dataQuery.eq("in_stock", false);
      }

      const { data, error, count } = await dataQuery;
      if (error) throw new Error(error.message);

      products = (data ?? []) as Product[];
      total = count ?? total;
      totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
    }
  } catch (e) {
    loadError = e instanceof Error ? e.message : "Bilinmeyen hata";
  }

  const hasActiveFilters = Boolean(category || altk || search || filtre);

  // Cipler: GET linki; aktif cipe tekrar tiklaninca filtre kalkar. k/altk/q
  // korunur, sayfa 1'e doner (buildHref sayfa parametresi almadiginda sayfa=1).
  const chips: ChipData[] = FILTER_KEYS.map((key) => ({
    key,
    label: FILTER_LABELS[key],
    count: chipCounts[key],
    href: buildHref({
      k: category,
      altk,
      q: search,
      filtre: filtre === key ? null : key,
    }),
    active: filtre === key,
  }));

  const hrefFor = (n: number) =>
    buildHref({ k: category, altk, q: search, filtre, sayfa: n });

  const rangeStart = total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const pagination: PaginationData = {
    page,
    totalPages,
    total,
    rangeStart,
    rangeEnd: (page - 1) * PAGE_SIZE + products.length,
    prevHref: page > 1 ? hrefFor(page - 1) : null,
    nextHref: page < totalPages ? hrefFor(page + 1) : null,
    items: buildPageItems(page, totalPages, hrefFor),
  };

  // Arama + kategori filtresi (GET formu, sunucuda filtrelenir). Gizli input
  // aktif hizli filtreyi tasir; sayfa parametresi tasinmaz, arama 1'den baslar.
  const filterSlot = (
    <form method="get" action="/admin/urunler" className={styles.toolbarFilter}>
      <div className={styles.searchWrap}>
        <span className={styles.searchIcon} aria-hidden>
          <Search size={15} />
        </span>
        <input
          type="search"
          name="q"
          defaultValue={search}
          placeholder="Ürün adında ara"
          aria-label="Ürün ara"
          className={styles.input}
        />
      </div>
      <select
        name="k"
        defaultValue={category}
        className={styles.select}
        aria-label="Kategori filtresi"
      >
        <option value="">Tüm kategoriler</option>
        {SHOP_CATEGORIES.map((c) => (
          <option key={c.slug} value={c.slug}>
            {c.name}
          </option>
        ))}
      </select>
      {/* Alt kategori: yalniz kategori seciliyken gorunur. Kategori degisirse
          formda kalan eski altk sunucuda gecersiz sayilip yok sayilir. */}
      {category && subOptions.length > 0 && (
        <select
          name="altk"
          defaultValue={altk ?? ""}
          className={styles.select}
          aria-label="Alt kategori filtresi"
        >
          <option value="">Tüm alt kategoriler</option>
          {subOptions.map((s) => (
            <option key={s.slug} value={s.slug}>
              {s.name}
            </option>
          ))}
        </select>
      )}
      {filtre && <input type="hidden" name="filtre" value={filtre} />}
      <button type="submit" className={styles.actionBtn}>
        Filtrele
      </button>
    </form>
  );

  return (
    <>
      <h1 className={styles.title}>Ürünler</h1>
      <p className={styles.subtitle}>
        {loadError
          ? "Katalog yüklenemedi."
          : hasActiveFilters
            ? `${total} ürün bulundu.`
            : `Toplam ${total} ürün.`}
      </p>

      {loadError ? (
        <div className={styles.empty}>
          Ürünler yüklenemedi. Veritabanı kurulumu yapılmamış olabilir.
          <br />
          <small>{loadError}</small>
        </div>
      ) : (
        <ProductsTable
          products={products}
          chips={chips}
          clearFilterHref={
            filtre ? buildHref({ k: category, altk, q: search }) : null
          }
          resetHref="/admin/urunler"
          hasActiveFilters={hasActiveFilters}
          pagination={pagination}
          filterSlot={filterSlot}
          openForm={yeni === "1"}
        />
      )}
    </>
  );
}
