// Vitrin — /urunler. Getir web düzeni: masaüstünde (≥1024px) --container
// içinde [sol kategori sidebar 240px sticky] + [orta ürün alanı] + [sağ
// "Sepetim" paneli 300px sticky]; mobilde yatay pill bar + 2-3 kolonlu grid.
// Orta alan: kategori seçili → grid (başlık + adet); "Tümü" → kategori
// bölümleri (her bölümde o kategorinin TÜM ürünleri grid, adet sınırı yok);
// arama → grid + "N sonuç". Tek sorguda tüm aktif ürünler çekilir, gruplama
// sunucuda yapılır.
// Next.js 16: searchParams bir Promise — await edilmeli.
// DB hazır değilse sayfa patlamaz: "Katalog hazırlanıyor" fallback'i.

import type { Metadata } from "next";
import type { ComponentType } from "react";
import {
  ShoppingBasket,
  BadgePercent,
  Flame,
  type LucideProps,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import type { Product } from "@/lib/shop/types";
import {
  CATEGORY_TINTS,
  SHOP_CATEGORIES,
  categoryBySlug,
} from "@/lib/shop/categories";
import {
  subcatsFor,
  assignSubcategory,
  OTHER_SUB_SLUG,
  OTHER_SUB_NAME,
} from "@/lib/shop/subcategories";
import { specialByKey, type SpecialKey } from "@/lib/shop/specials";
import { BUSINESS } from "@/lib/business";
import { getShopSettings } from "@/lib/shop/settings";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import PromoBanners from "@/components/shop/PromoBanners";
import CategoryRail from "@/components/shop/CategoryRail";
import SubcatSelect from "@/components/shop/SubcatSelect";
import SortSelect from "@/components/shop/SortSelect";
import { normalizeSort, sortProducts } from "@/lib/shop/sorting";
import {
  getCatalogVisibility,
  isProductVisible,
  subKey,
} from "@/lib/shop/visibility";
import CategorySidebar from "@/components/shop/CategorySidebar";
import CartPanel from "@/components/shop/CartPanel";
import SearchBox from "@/components/shop/SearchBox";
import ProductGrid from "@/components/shop/ProductGrid";
import LoadMoreGrid from "@/components/shop/LoadMoreGrid";
import ProductCard, { iconFor } from "@/components/shop/ProductCard";
import styles from "./shop.module.css";

/** Özel görünüm başlık ikonları (Keşfet grubu). */
const SPECIAL_ICONS: Record<SpecialKey, ComponentType<LucideProps>> = {
  indirimli: BadgePercent,
  "cok-satan": Flame,
};

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

/** string | string[] | undefined → ilk string değer. */
function first(v: string | string[] | undefined): string | undefined {
  return Array.isArray(v) ? v[0] : v;
}

export async function generateMetadata({
  searchParams,
}: {
  searchParams: SearchParams;
}): Promise<Metadata> {
  const sp = await searchParams;
  const special = specialByKey(first(sp.ozel));
  const cat = categoryBySlug(first(sp.k) ?? "");
  return {
    title: special
      ? `${special.title} · Ürünler`
      : cat
        ? `${cat.name} · Ürünler`
        : "Ürünler",
    description:
      "Yeni Mahalle Market online katalog: market ürünlerini seç, sepetine ekle, Sapanca içinde adresine gelsin.",
    alternates: { canonical: "/urunler" },
  };
}

export default async function UrunlerPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const sp = await searchParams;
  const q = (first(sp.q) ?? "").trim();
  // Özel görünüm (Keşfet grubu): indirimli | cok-satan. Geçersiz → yok.
  // Arama (q) özel görünümden önceliklidir; özel görünüm katalog genelinde
  // çalışır, bu yüzden kategori (k) ile birlikteyken kategori yok sayılır.
  const special = !q ? specialByKey(first(sp.ozel)) : undefined;

  // Sıralama (?sirala=) — geçersiz değer sessizce "onerilen"e döner.
  const sirala = normalizeSort(first(sp.sirala));

  // Teslimat ayarları + katalog görünürlüğü (admin'den pasifleştirilen
  // kategori/alt kategoriler) — paralel çekilir; hata durumunda makul default.
  const [settings, visibility] = await Promise.all([
    getShopSettings(),
    getCatalogVisibility(),
  ]);
  const hiddenCatList = [...visibility.inactiveCats];
  const hiddenSubList = [...visibility.hiddenSubs];

  // Geçersiz YA DA pasifleştirilmiş kategori slug'ı sessizce yok sayılır.
  const rawCategory = special ? undefined : categoryBySlug(first(sp.k) ?? "");
  const category =
    rawCategory && !visibility.inactiveCats.has(rawCategory.slug)
      ? rawCategory
      : undefined;

  // Alt kategori (?alt=...) — yalnız kategori görünümünde (q ve ozel yokken)
  // anlamlı; geçersiz/eşleşmeyen YA DA gizlenen slug sessizce yok sayılır.
  const subs = (category && !q ? subcatsFor(category.slug) : []).filter(
    (s) => category && !visibility.hiddenSubs.has(subKey(category.slug, s.slug)),
  );
  const altRaw = (first(sp.alt) ?? "").trim();
  const altDef = subs.find((s) => s.slug === altRaw);
  const altSlug =
    subs.length > 0 && (altDef || altRaw === OTHER_SUB_SLUG)
      ? altRaw
      : undefined;
  const altName = altSlug ? (altDef?.name ?? OTHER_SUB_NAME) : undefined;

  let products: Product[] = [];
  let dbError = false;

  try {
    const supabase = await createClient();
    // ilike joker ve .or() ayırıcı karakterlerini temizle (varsa arama)
    const safe = q ? q.replace(/[%_,()]/g, " ").trim() : "";

    // PostgREST yanıt başına en çok ~1000 satır döndürür (server max-rows).
    // Katalog 1000'i aştığı için "Tümü" görünümü sayfalayarak (range) TÜM aktif
    // ürünleri çeker; id son sıralama anahtarı sayfalar arası kararlılık verir.
    const PAGE = 1000;
    const all: Product[] = [];
    for (let from = 0; ; from += PAGE) {
      let query = supabase
        .from("products")
        .select("*")
        .eq("is_active", true);
      if (category) query = query.eq("category_slug", category.slug);
      if (safe) query = query.or(`name.ilike.%${safe}%,brand.ilike.%${safe}%`);
      const { data, error } = await query
        .order("is_featured", { ascending: false })
        .order("sort", { ascending: true })
        .order("name", { ascending: true })
        .order("id", { ascending: true })
        .range(from, from + PAGE - 1);
      if (error) throw error;
      const batch = (data ?? []) as Product[];
      all.push(...batch);
      if (batch.length < PAGE) break; // son sayfa
    }
    products = all;
  } catch {
    // DB henüz kurulmamış olabilir — site patlamasın, zarif fallback göster.
    dbError = true;
  }

  // Özel görünüm filtresi (tek sorguda çekilen tüm aktif ürünler üzerinden):
  //  - indirimli → compare_at_price > price
  //  - cok-satan → is_best_seller
  if (special) {
    if (special.key === "indirimli") {
      products = products.filter(
        (p) => p.compare_at_price !== null && p.compare_at_price > p.price,
      );
    } else if (special.key === "cok-satan") {
      products = products.filter((p) => p.is_best_seller);
    }
  }

  // Görünürlük süzgeci: pasif kategorilerin ve gizlenen alt kategorilerin
  // ürünleri hiçbir görünümde (Tümü/arama/özel/kategori) listelenmez.
  if (visibility.inactiveCats.size > 0 || visibility.hiddenSubs.size > 0) {
    products = products.filter((p) => isProductVisible(p, visibility));
  }

  // Kullanıcı sıralaması — tüm görünümlere uygulanır ("Tümü"de bölüm içi sıra).
  products = sortProducts(products, sirala);

  // "Tümü" görünümü: ürünler sunucuda kategoriye göre gruplanır (tek sorgu)
  const showSections = !dbError && !q && !category && !special;
  const byCategory = new Map<string, Product[]>();
  if (showSections) {
    for (const p of products) {
      const list = byCategory.get(p.category_slug);
      if (list) list.push(p);
      else byCategory.set(p.category_slug, [p]);
    }
  }
  const sections = showSections
    ? SHOP_CATEGORIES.map((cat) => ({
        cat,
        items: byCategory.get(cat.slug) ?? [],
      })).filter((s) => s.items.length > 0)
    : [];

  return (
    <>
      <SiteNav />
      <main className={styles.page}>
        <div className="container">
          <header className={styles.head}>
            <div className={styles.headText}>
              <h1 className={styles.title}>
                {special
                  ? special.title
                  : category
                    ? category.name
                    : "Market Ürünleri"}
              </h1>
              <p className={styles.sub}>
                Seç, sepete ekle, Sapanca içinde kapına gelsin.
              </p>
            </div>
            <SearchBox q={q || undefined} k={category?.slug} />
          </header>

          {/* Kampanya banner'ları — başlık ile katalog düzeni arasında */}
          <PromoBanners />
        </div>

        {/* Mobil/tablet: sticky kategori pill barı (masaüstünde gizli) */}
        <CategoryRail
          active={category?.slug}
          q={q || undefined}
          ozel={special?.key}
          hiddenCats={hiddenCatList}
        />

        <div className="container">
          <div className={styles.layout}>
            {/* Masaüstü: sol kategori sidebar'ı */}
            <CategorySidebar
              active={category?.slug}
              q={q || undefined}
              ozel={special?.key}
              alt={altSlug}
              hiddenCats={hiddenCatList}
              hiddenSubs={hiddenSubList}
            />

            <div className={styles.main}>
              {dbError ? (
                <section className={styles.fallback} aria-live="polite">
                  <span className={styles.fallbackIcon} aria-hidden="true">
                    <ShoppingBasket size={26} strokeWidth={1.8} />
                  </span>
                  <h2>Katalog hazırlanıyor</h2>
                  <p>
                    Online ürün listemiz çok yakında burada. Şimdilik sağ
                    alttaki baloncuktan canlı desteğe yazabilir ya da bizi
                    arayabilirsin, her zamanki gibi kapına getirelim.
                  </p>
                  <a href={BUSINESS.phone.href} className="btn btn--accent btn--lg">
                    Bizi ara: {BUSINESS.phone.display}
                  </a>
                </section>
              ) : special ? (
                /* Özel görünüm: tek grid + kademeli "Daha Fazla Yükle" */
                (() => {
                  const Icon = SPECIAL_ICONS[special.key];
                  const emptyText =
                    special.key === "indirimli"
                      ? "Şu an indirimli ürün yok."
                      : "Henüz çok satan ürün işaretlenmedi.";
                  return (
                    <section className={styles.section}>
                      <div className={styles.sectionHead}>
                        <h2 className={styles.sectionTitle}>
                          <span
                            className={styles.sectionIcon}
                            style={{
                              background: special.tintBg,
                              color: special.tintFg,
                            }}
                            aria-hidden="true"
                          >
                            <Icon size={18} strokeWidth={1.9} />
                          </span>
                          {special.title}
                        </h2>
                        <span className={styles.sectionCount}>
                          {products.length} ürün
                        </span>
                      </div>
                      <div className={styles.toolbar}>
                        <SortSelect current={sirala} params={{ ozel: special.key }} />
                      </div>
                      <LoadMoreGrid products={products} emptyText={emptyText} />
                    </section>
                  );
                })()
              ) : q ? (
                /* Arama sonuçları: grid + "N sonuç" başlığı */
                <section className={styles.section}>
                  <div className={styles.sectionHead}>
                    <h2 className={styles.sectionTitle}>
                      &quot;{q}&quot; için sonuçlar
                    </h2>
                    <span className={styles.sectionCount}>
                      {products.length} sonuç
                    </span>
                  </div>
                  <div className={styles.toolbar}>
                    <SortSelect current={sirala} params={{ q }} />
                  </div>
                  <ProductGrid
                    products={products}
                    emptyText={`"${q}" aramasına uygun ürün bulunamadı.`}
                  />
                </section>
              ) : category ? (
                /* Kategori seçili: sticky alt kategori sekme barı (SubcatTabs)
                   + Getir tarzı bölümlenmiş görünüm (alt tanımı varsa) ya da
                   düz grid. Bölümlenmiş modda sekmeler bölüme anchor scroll
                   yapar; ?alt= ile gelindiyse yalnız o altın ürünleri
                   (sunucu filtreli tek grid). */
                (() => {
                  const [bg, fg] =
                    CATEGORY_TINTS[category.tint] ?? CATEGORY_TINTS[0];
                  const Icon = iconFor(category.icon);

                  // Ürünleri alt kategorilere grupla — assignSubcategory
                  // ürün başına yalnız 1 kez çağrılır.
                  const bySub = new Map<string, Product[]>();
                  if (subs.length > 0) {
                    for (const p of products) {
                      const slug = assignSubcategory(
                        category.slug,
                        p.name,
                        p.brand,
                        p.subcategory_slug,
                      );
                      const list = bySub.get(slug);
                      if (list) list.push(p);
                      else bySub.set(slug, [p]);
                    }
                  }
                  const countOf = (slug: string) =>
                    bySub.get(slug)?.length ?? 0;
                  const shown = altSlug
                    ? (bySub.get(altSlug) ?? [])
                    : products;

                  // Sekme barı öğeleri: tanım sırası + en sonda "Diğer";
                  // yalnız ürünü olanlar (aktif alt boş olsa da kalır).
                  const tabItems = [
                    ...subs.map((s) => ({ slug: s.slug, name: s.name })),
                    { slug: OTHER_SUB_SLUG, name: OTHER_SUB_NAME },
                  ]
                    .map((s) => ({ ...s, count: countOf(s.slug) }))
                    .filter((s) => s.count > 0 || s.slug === altSlug);

                  return (
                    <section className={styles.section}>
                      <div className={styles.sectionHead}>
                        <h2 className={styles.sectionTitle}>
                          <span
                            className={styles.sectionIcon}
                            style={{ background: bg, color: fg }}
                            aria-hidden="true"
                          >
                            <Icon size={18} strokeWidth={1.9} />
                          </span>
                          {altName ?? category.name}
                        </h2>
                        <span className={styles.sectionCount}>
                          {shown.length} ürün
                        </span>
                      </div>

                      {/* Filtre araç çubuğu: alt kategori + sıralama açılır
                         menüleri. Yatay kaydırma/ok/sticky yok → titremez. */}
                      <div className={styles.toolbar}>
                        {subs.length > 0 && tabItems.length > 0 && (
                          <SubcatSelect
                            catSlug={category.slug}
                            tabs={tabItems}
                            totalCount={products.length}
                            activeAlt={altSlug}
                            sirala={sirala}
                          />
                        )}
                        <SortSelect
                          current={sirala}
                          params={{ k: category.slug, alt: altSlug }}
                        />
                      </div>

                      <ProductGrid
                        products={shown}
                        emptyText={
                          altSlug
                            ? "Bu alt kategoride henüz ürün yok."
                            : "Bu kategoride henüz ürün yok."
                        }
                      />
                    </section>
                  );
                })()
              ) : sections.length === 0 ? (
                <ProductGrid products={[]} emptyText="Henüz ürün eklenmedi." />
              ) : (
                /* "Tümü": kategori bölümleri — her bölümde o kategorinin TÜM
                   ürünleri (adet sınırı yok, tam liste kategorileriyle) */
                sections.map(({ cat, items }) => {
                  const [bg, fg] =
                    CATEGORY_TINTS[cat.tint] ?? CATEGORY_TINTS[0];
                  const Icon = iconFor(cat.icon);
                  return (
                    <section
                      key={cat.slug}
                      className={styles.section}
                      aria-label={cat.name}
                    >
                      <div className={styles.sectionHead}>
                        <h2 className={styles.sectionTitle}>
                          <span
                            className={styles.sectionIcon}
                            style={{ background: bg, color: fg }}
                            aria-hidden="true"
                          >
                            <Icon size={18} strokeWidth={1.9} />
                          </span>
                          {cat.name}
                        </h2>
                        <span className={styles.sectionCount}>
                          {items.length} ürün
                        </span>
                      </div>
                      <div className={styles.grid}>
                        {items.map((p) => (
                          <ProductCard key={p.id} product={p} />
                        ))}
                      </div>
                    </section>
                  );
                })
              )}
            </div>

            {/* Masaüstü: sağ "Sepetim" paneli */}
            <CartPanel
              deliveryFee={settings.delivery_fee}
              freeDeliveryOver={settings.free_delivery_over}
            />
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
