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
import { assignSubcategory } from "@/lib/shop/subcategories";
import { getSubcatsMap, subcatsMapToDTO } from "@/lib/shop/subcats-data";
import { getAllCategories } from "@/lib/shop/categories-data";
import type { Product } from "@/lib/shop/types";
import ProductsTable, {
  type ActiveFilter,
  type ChipData,
  type PageItem,
  type PaginationData,
} from "./ProductsTable";
import AdminSelect, { type AdminSelectOption } from "./AdminSelect";
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

// Siralama secenekleri (?sirala=). Bos = varsayilan sira (kategori/sort/ad).
const SORT_KEYS = ["isim", "fiyat-artan", "fiyat-azalan", "yeni"] as const;
type CatalogSort = (typeof SORT_KEYS)[number];

const SORT_LABELS: Record<CatalogSort, string> = {
  isim: "İsim (A-Z)",
  "fiyat-artan": "Fiyat (artan)",
  "fiyat-azalan": "Fiyat (azalan)",
  yeni: "Yeni eklenen",
};

// AdminSelect içindeki ICONS haritasının anahtarları (fonksiyon değil string
// taşınır — server -> client sınırında ikon bileşeni prop geçilemez).
const SORT_ICON_KEYS: Record<CatalogSort, string> = {
  isim: "az",
  "fiyat-artan": "up",
  "fiyat-azalan": "down",
  yeni: "clock",
};

function parseSort(value: string | undefined): CatalogSort | null {
  return (SORT_KEYS as readonly string[]).includes(value ?? "")
    ? (value as CatalogSort)
    : null;
}

/** k/altk/q/filtre/sayfa parametrelerinden GET linki uret (bos olanlar
 *  atlanir; altk yalniz k ile birlikte anlamli oldugundan k yoksa dusulur). */
function buildHref(params: {
  k?: string;
  altk?: string | null;
  q?: string;
  filtre?: CatalogFilter | null;
  sirala?: CatalogSort | null;
  sayfa?: number;
}): string {
  const sp = new URLSearchParams();
  if (params.k) sp.set("k", params.k);
  if (params.k && params.altk) sp.set("altk", params.altk);
  if (params.q) sp.set("q", params.q);
  if (params.filtre) sp.set("filtre", params.filtre);
  if (params.sirala) sp.set("sirala", params.sirala);
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
    sirala?: string;
  }>;
}) {
  const { k, altk: altkRaw, q, yeni, sayfa, filtre: filtreRaw, sirala: siralaRaw } =
    await searchParams;
  const category = k ?? "";
  const search = (q ?? "").trim();
  const filtre = parseFilter(filtreRaw);
  const sirala = parseSort(siralaRaw);
  // Alt kategori: yalniz k seciliyken ve o kategorinin tanimli alt slug'lari
  // arasindaysa gecerli; aksi halde sessizce yok sayilir (kategori degisince
  // formda kalan eski altk boylece temizlenir).
  const subcatsMap = await getSubcatsMap();
  // Kategori listesi DB'den çözülür (yeniden adlandırma + özel kategoriler).
  const cats = await getAllCategories();
  const subOptions = category ? (subcatsMap[category] ?? []) : [];
  const altk =
    altkRaw && subOptions.some((s) => s.slug === altkRaw) ? altkRaw : null;
  const parsedPage = Number.parseInt(sayfa ?? "1", 10);
  const requestedPage = Number.isFinite(parsedPage) && parsedPage >= 1 ? parsedPage : 1;

  // SIRALAMA MODU: tek kategori (alt kategori seçili olabilir) + varsayılan
  // sıra, arama/hızlı filtre yok. Alt kümede sıralama, kategori genelini
  // bozmadan kaydedilir (updateSubcatSortBulk). Pozisyonların listeyi tam
  // kapsaması için bu modda sayfalama kapatılır.
  const reorderMode = Boolean(category) && !search && !filtre && !sirala;

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

    if (category) {
      // KATEGORI YOLU: bir kategori seciliyken (alt kategori / arama / hizli
      // filtre / siralama olsun olmasin) o kategorinin TUM urunleri tek
      // sorguyla cekilir (1000'lik tek range yeterli) ve bellekte
      // filtrelenip siralanir. Kategori sinirli oldugundan SAYFALAMA YOK:
      // 50'lik kesme yalniz kategorisiz "Tumu" gorunumune ozeldir. Boylece
      // siralama secince liste "50'ye dusmez", yalnizca yeniden dizilir;
      // surukle-birak yalniz varsayilan sirada (reorderMode) aciktir.
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

      const inSub = altk
        ? ((data ?? []) as Product[]).filter(
            (p) =>
              assignSubcategory(
                subcatsMap[category] ?? [],
                p.name,
                p.brand,
                p.subcategory_slug,
              ) === altk,
          )
        : ((data ?? []) as Product[]); // sıralama modu: kategori tamamı

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

      // Siralama: DB yolundaki order ile ayni mantik, bellekte uygulanir.
      // Varsayilan (sirala null) inSub'un kategori/sort/ad sirasini korur.
      if (sirala === "isim") {
        filtered = [...filtered].sort((a, b) =>
          a.name.localeCompare(b.name, "tr"),
        );
      } else if (sirala === "fiyat-artan") {
        filtered = [...filtered].sort((a, b) => Number(a.price) - Number(b.price));
      } else if (sirala === "fiyat-azalan") {
        filtered = [...filtered].sort((a, b) => Number(b.price) - Number(a.price));
      } else if (sirala === "yeni") {
        filtered = [...filtered].sort((a, b) =>
          a.created_at < b.created_at ? 1 : a.created_at > b.created_at ? -1 : 0,
        );
      }

      // Kategori görünümünde her zaman TÜM ürünler gösterilir (sayfalama yok);
      // sıralama yalnız listeyi yeniden dizer, adedini düşürmez.
      total = filtered.length;
      totalPages = 1;
      page = 1;
      products = filtered;
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
        .select("*", { count: "exact" });
      if (category) dataQuery = dataQuery.eq("category_slug", category);
      if (search) dataQuery = dataQuery.ilike("name", `%${search}%`);
      if (filtre === "indirimli") {
        dataQuery = dataQuery.not("compare_at_price", "is", null);
      } else if (filtre === "cok-satan") {
        dataQuery = dataQuery.eq("is_best_seller", true);
      } else if (filtre === "stokta-yok") {
        dataQuery = dataQuery.eq("in_stock", false);
      }

      // Siralama secimini order'a yansit; varsayilan kategori/sort/ad sirasi.
      if (sirala === "isim") {
        dataQuery = dataQuery.order("name", { ascending: true }).order("id");
      } else if (sirala === "fiyat-artan") {
        dataQuery = dataQuery.order("price", { ascending: true }).order("id");
      } else if (sirala === "fiyat-azalan") {
        dataQuery = dataQuery.order("price", { ascending: false }).order("id");
      } else if (sirala === "yeni") {
        dataQuery = dataQuery.order("created_at", { ascending: false }).order("id");
      } else {
        dataQuery = dataQuery
          .order("category_slug")
          .order("sort")
          .order("name")
          .order("id");
      }

      dataQuery = dataQuery.range(from, from + PAGE_SIZE - 1);

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
      sirala,
    }),
    active: filtre === key,
  }));

  // Aktif filtre cipleri: tek tikla kaldirilabilir (link, filtreyi dusuren
  // href). Kategori kaldirilinca altk de duser (buildHref k yoksa altk atar).
  // Siralama filtre sayilmaz; kaldirma linklerinde korunur.
  const activeFilters: ActiveFilter[] = [];
  if (category) {
    const catName = cats.find((c) => c.slug === category)?.name ?? category;
    activeFilters.push({
      key: "k",
      label: `Kategori: ${catName}`,
      href: buildHref({ q: search, filtre, sirala }),
    });
  }
  if (altk) {
    const subName = subOptions.find((s) => s.slug === altk)?.name ?? altk;
    activeFilters.push({
      key: "altk",
      label: `Alt: ${subName}`,
      href: buildHref({ k: category, q: search, filtre, sirala }),
    });
  }
  if (search) {
    activeFilters.push({
      key: "q",
      label: `Arama: ${search}`,
      href: buildHref({ k: category, altk, filtre, sirala }),
    });
  }

  // "Hepsini temizle" / bos sonuc CTA: filtreleri dusurur, siralamayi korur.
  const clearAllHref = buildHref({ sirala });

  const hrefFor = (n: number) =>
    buildHref({ k: category, altk, q: search, filtre, sirala, sayfa: n });

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

  // Açılır menü seçenekleri — vitrindeki SortSelect diliyle (AdminSelect).
  // Her seçenek GET linki; seçilince anında gidilir (ayrı "Filtrele" yok).
  // Kategori değişince altk düşer; sıralama/kategori değişince sayfa 1'e döner.
  const catName = cats.find((c) => c.slug === category)?.name;
  const catOptions: AdminSelectOption[] = [
    {
      key: "",
      name: "Tüm kategoriler",
      href: buildHref({ q: search, filtre, sirala }),
      iconKey: "grid",
      active: !category,
    },
    ...cats.map((c) => ({
      key: c.slug,
      name: c.name,
      href: buildHref({ k: c.slug, q: search, filtre, sirala }),
      active: c.slug === category,
    })),
  ];
  const subName = altk
    ? (subOptions.find((s) => s.slug === altk)?.name ?? altk)
    : undefined;
  const subSelectOptions: AdminSelectOption[] = [
    {
      key: "",
      name: "Tüm alt kategoriler",
      href: buildHref({ k: category, q: search, filtre, sirala }),
      iconKey: "layers",
      active: !altk,
    },
    ...subOptions.map((s) => ({
      key: s.slug,
      name: s.name,
      href: buildHref({ k: category, altk: s.slug, q: search, filtre, sirala }),
      active: s.slug === altk,
    })),
  ];
  const sortSelectOptions: AdminSelectOption[] = [
    {
      key: "",
      name: "Varsayılan",
      href: buildHref({ k: category, altk, q: search, filtre }),
      iconKey: "filter",
      active: !sirala,
    },
    ...SORT_KEYS.map((key) => ({
      key,
      name: SORT_LABELS[key],
      href: buildHref({ k: category, altk, q: search, filtre, sirala: key }),
      iconKey: SORT_ICON_KEYS[key],
      active: key === sirala,
    })),
  ];

  // Arama kutusu tek başına küçük bir GET formu; gönderilince mevcut kategori/
  // alt kategori/hızlı filtre/sıralama gizli inputlarla korunur. Kategori, alt
  // kategori ve sıralama ise vitrin dilinde açılır menülerle anında değişir.
  const filterSlot = (
    <div className={styles.toolbarFilter}>
      <form method="get" action="/admin/urunler" className={styles.searchWrap}>
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
        {category && <input type="hidden" name="k" value={category} />}
        {altk && <input type="hidden" name="altk" value={altk} />}
        {filtre && <input type="hidden" name="filtre" value={filtre} />}
        {sirala && <input type="hidden" name="sirala" value={sirala} />}
      </form>
      <AdminSelect
        label="Kategori:"
        currentName={catName ?? "Tümü"}
        options={catOptions}
        ariaLabel="Kategori filtresi"
      />
      {category && subOptions.length > 0 && (
        <AdminSelect
          label="Alt kategori:"
          currentName={subName ?? "Tümü"}
          options={subSelectOptions}
          ariaLabel="Alt kategori filtresi"
        />
      )}
      <AdminSelect
        label="Sıralama:"
        currentName={sirala ? SORT_LABELS[sirala] : "Varsayılan"}
        options={sortSelectOptions}
        ariaLabel="Sıralama"
      />
    </div>
  );

  return (
    <>
      <h1 className={styles.title} style={{ marginBottom: 18 }}>
        Ürünler
      </h1>
      {loadError && <p className={styles.subtitle}>Katalog yüklenemedi.</p>}

      {loadError ? (
        <div className={styles.empty}>
          Ürünler yüklenemedi. Veritabanı kurulumu yapılmamış olabilir.
          <br />
          <small>{loadError}</small>
        </div>
      ) : (
        <ProductsTable
          products={products}
          cats={cats.map((c) => ({ slug: c.slug, name: c.name, tint: c.tint }))}
          subcats={subcatsMapToDTO(subcatsMap)}
          chips={chips}
          activeFilters={activeFilters}
          clearFilterHref={
            filtre ? buildHref({ k: category, altk, q: search, sirala }) : null
          }
          clearAllHref={clearAllHref}
          resetHref={clearAllHref}
          hasActiveFilters={hasActiveFilters}
          pagination={pagination}
          filterSlot={filterSlot}
          openForm={yeni === "1"}
          /* Sürükle-bırak sıralama: tek kategori (alt kategori dahil) +
             varsayılan sıra. Alt küme kaydı kategori genelini bozmaz. */
          reorderable={reorderMode}
          reorderCategorySlug={reorderMode ? category : undefined}
          /* Bir sıralama seçiliyken Sıra sütunu ham sort değeri yerine
             salt-okunur görünen pozisyon (1,2,3…) gösterir. */
          sortActive={Boolean(sirala)}
        />
      )}
    </>
  );
}
