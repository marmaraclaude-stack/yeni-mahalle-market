// Vitrin — /urunler. Getir tarzı: "Tümü" görünümünde kategori bölümleri
// (başlık + Tümünü Gör + yatay kaydırılabilir ürün raili), kategori seçili
// veya arama varken grid. Tek sorguda tüm aktif ürünler çekilir, gruplama
// sunucuda yapılır. Next.js 16: searchParams bir Promise — await edilmeli.
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
import SearchBox from "@/components/shop/SearchBox";
import ProductGrid from "@/components/shop/ProductGrid";
import ProductCard, { iconFor } from "@/components/shop/ProductCard";
import styles from "./shop.module.css";

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

        {/* Sticky kategori pill barı (navbar altı) */}
        <CategoryRail active={category?.slug} q={q || undefined} />

        <div className={`container ${styles.content}`}>
          {dbError ? (
            <section className={styles.fallback} aria-live="polite">
              <span className={styles.fallbackIcon} aria-hidden="true">
                <ShoppingBasket size={26} strokeWidth={1.8} />
              </span>
              <h2>Katalog hazırlanıyor</h2>
              <p>
                Online ürün listemiz çok yakında burada. Şimdilik siparişini
                WhatsApp üzerinden verebilirsin, her zamanki gibi kapına
                getirelim.
              </p>
              <a
                href={BUSINESS.whatsapp.href}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn--whatsapp"
              >
                WhatsApp&apos;tan sipariş ver
              </a>
            </section>
          ) : q ? (
            /* Arama sonuçları: grid + "X sonuç" başlığı */
            <section className={styles.section}>
              <div className={styles.sectionHead}>
                <h2 className={styles.sectionTitle}>
                  &quot;{q}&quot; için {products.length} sonuç
                </h2>
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
            /* "Tümü": kategori bölümleri — başlık + Tümünü Gör + ürün raili */
            sections.map(({ cat, items }) => {
              const [bg, fg] = CATEGORY_TINTS[cat.tint] ?? CATEGORY_TINTS[0];
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
                  <div
                    className={styles.productRail}
                    role="region"
                    aria-label={`${cat.name} ürünleri`}
                  >
                    {items.map((p) => (
                      <ProductCard key={p.id} product={p} variant="rail" />
                    ))}
                  </div>
                </section>
              );
            })
          )}
        </div>
      </main>
    </>
  );
}
