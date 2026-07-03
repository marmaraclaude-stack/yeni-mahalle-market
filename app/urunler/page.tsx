// Vitrin — /urunler. Getir web düzeni: masaüstünde (≥1024px) --container
// içinde [sol kategori sidebar 240px sticky] + [orta ürün alanı] + [sağ
// "Sepetim" paneli 300px sticky]; mobilde yatay pill bar + 2-3 kolonlu grid.
// Orta alan: kategori seçili → grid (başlık + adet); "Tümü" → kategori
// bölümleri (her birinde ilk 6 ürün grid + "Tümünü Gör"); arama → grid +
// "N sonuç". Tek sorguda tüm aktif ürünler çekilir, gruplama sunucuda yapılır.
// Next.js 16: searchParams bir Promise — await edilmeli.
// DB hazır değilse sayfa patlamaz: "Katalog hazırlanıyor" fallback'i.

import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, ShoppingBasket } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import type { Product } from "@/lib/shop/types";
import {
  CATEGORY_TINTS,
  SHOP_CATEGORIES,
  categoryBySlug,
} from "@/lib/shop/categories";
import { BUSINESS } from "@/lib/business";
import SiteNav from "@/components/SiteNav";
import CategoryRail from "@/components/shop/CategoryRail";
import CategorySidebar from "@/components/shop/CategorySidebar";
import CartPanel from "@/components/shop/CartPanel";
import SearchBox from "@/components/shop/SearchBox";
import ProductGrid from "@/components/shop/ProductGrid";
import ProductCard, { iconFor } from "@/components/shop/ProductCard";
import styles from "./shop.module.css";

/** "Tümü" görünümünde her kategori bölümünde gösterilen ürün sayısı. */
const SECTION_LIMIT = 6;

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
  const cat = categoryBySlug(first(sp.k) ?? "");
  return {
    title: cat ? `${cat.name} · Ürünler` : "Ürünler",
    description:
      "Yeni Mahalle Market online katalog: market ürünlerini seç, sepetine ekle, Sapanca içinde adresine gelsin.",
  };
}

export default async function UrunlerPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const sp = await searchParams;
  const q = (first(sp.q) ?? "").trim();
  // Geçersiz kategori slug'ı sessizce yok sayılır (tüm ürünler listelenir)
  const category = categoryBySlug(first(sp.k) ?? "");

  let products: Product[] = [];
  let dbError = false;

  try {
    const supabase = await createClient();
    let query = supabase.from("products").select("*").eq("is_active", true);

    if (category) query = query.eq("category_slug", category.slug);

    if (q) {
      // ilike joker ve .or() ayırıcı karakterlerini temizle
      const safe = q.replace(/[%_,()]/g, " ").trim();
      if (safe) {
        query = query.or(`name.ilike.%${safe}%,brand.ilike.%${safe}%`);
      }
    }

    const { data, error } = await query
      .order("is_featured", { ascending: false })
      .order("sort", { ascending: true })
      .order("name", { ascending: true });

    if (error) throw error;
    products = (data ?? []) as Product[];
  } catch {
    // DB henüz kurulmamış olabilir — site patlamasın, zarif fallback göster.
    dbError = true;
  }

  // "Tümü" görünümü: ürünler sunucuda kategoriye göre gruplanır (tek sorgu)
  const showSections = !dbError && !q && !category;
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
                {category ? category.name : "Market Ürünleri"}
              </h1>
              <p className={styles.sub}>
                Seç, sepete ekle, Sapanca içinde kapına gelsin.
              </p>
            </div>
            <SearchBox q={q || undefined} k={category?.slug} />
          </header>
        </div>

        {/* Mobil/tablet: sticky kategori pill barı (masaüstünde gizli) */}
        <CategoryRail active={category?.slug} q={q || undefined} />

        <div className="container">
          <div className={styles.layout}>
            {/* Masaüstü: sol kategori sidebar'ı */}
            <CategorySidebar active={category?.slug} q={q || undefined} />

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
                  <a href={BUSINESS.phone.href} className="btn btn--accent">
                    Bizi ara: {BUSINESS.phone.display}
                  </a>
                </section>
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
                  <ProductGrid
                    products={products}
                    emptyText={`"${q}" aramasına uygun ürün bulunamadı.`}
                  />
                </section>
              ) : category ? (
                /* Kategori seçili: o kategorinin tüm ürünleri grid */
                (() => {
                  const [bg, fg] =
                    CATEGORY_TINTS[category.tint] ?? CATEGORY_TINTS[0];
                  const Icon = iconFor(category.icon);
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
                          {category.name}
                        </h2>
                        <span className={styles.sectionCount}>
                          {products.length} ürün
                        </span>
                      </div>
                      <ProductGrid
                        products={products}
                        emptyText="Bu kategoride henüz ürün yok."
                      />
                    </section>
                  );
                })()
              ) : sections.length === 0 ? (
                <ProductGrid products={[]} emptyText="Henüz ürün eklenmedi." />
              ) : (
                /* "Tümü": kategori bölümleri — ilk 6 ürün grid + Tümünü Gör */
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
                        <Link
                          href={`/urunler?k=${cat.slug}`}
                          className={styles.seeAll}
                          aria-label={`${cat.name}: tümünü gör`}
                        >
                          Tümünü Gör
                          <ChevronRight
                            size={15}
                            strokeWidth={2.2}
                            aria-hidden="true"
                          />
                        </Link>
                      </div>
                      <div className={styles.grid}>
                        {items.slice(0, SECTION_LIMIT).map((p) => (
                          <ProductCard key={p.id} product={p} />
                        ))}
                      </div>
                    </section>
                  );
                })
              )}
            </div>

            {/* Masaüstü: sağ "Sepetim" paneli */}
            <CartPanel />
          </div>
        </div>
      </main>
    </>
  );
}
