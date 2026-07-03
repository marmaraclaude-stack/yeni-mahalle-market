// Ürün detay sayfası — /urunler/[slug]. Server component.
// Next.js 16: params bir Promise — await edilmeli.
// Ürün anon client'la slug üzerinden çekilir (is_active=true);
// bulunamazsa (veya DB hazır değilse) notFound().
// Üstte gerçek site navbar'ı (SiteNav); breadcrumb yok — kategori adı
// başlığın üstünde tint renkli pill etiket olarak vitrindeki filtreye linkler.
// Altta "Benzer Ürünler": gerçek benzerlik skoruyla sıralanmış yatay rail.

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import type { Product } from "@/lib/shop/types";
import { formatTL } from "@/lib/shop/types";
import { CATEGORY_TINTS, categoryBySlug } from "@/lib/shop/categories";
import ProductCard, { iconFor } from "@/components/shop/ProductCard";
import SiteNav from "@/components/SiteNav";
import DetailActions from "./DetailActions";
import styles from "./urun.module.css";

type Params = Promise<{ slug: string }>;

/** Ürünü slug ile çek — generateMetadata + page aynı istekte tek sorgu (React cache). */
const getProduct = cache(async (slug: string): Promise<Product | null> => {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("slug", slug)
      .eq("is_active", true)
      .maybeSingle();
    if (error) return null;
    return (data as Product | null) ?? null;
  } catch {
    // DB hazır değilse detay sayfası 404'e düşer — site patlamaz.
    return null;
  }
});

// Benzerlik skorunda atılan anlamsız Türkçe kelimeler.
const NAME_STOPWORDS = new Set(["ve", "ile", "için", "li", "lu"]);

/**
 * Ürün adından anlamlı kelime kümesi çıkar:
 * Türkçe lowercase, 3 harften uzun, stopword değil,
 * rakamla başlayan (gramaj: "500", "1.5l" vb.) token'lar atılır.
 */
function nameTokens(name: string): Set<string> {
  const tokens = name
    .toLocaleLowerCase("tr-TR")
    .split(/[^0-9a-zçğıöşüâîû]+/)
    .filter(
      (t) => t.length > 3 && !NAME_STOPWORDS.has(t) && !/^\d/.test(t)
    );
  return new Set(tokens);
}

/**
 * Benzer ürünler — gerçek benzerlik: aynı kategoriden ~30 aday çekilir, skorlanır.
 * +4 aynı marka (boş olmayan, case-insensitive) · +2 her ortak anlamlı ad kelimesi
 * · +1 fiyat yakınlığı (fark < %30). Skor desc → is_featured → sort.
 * İlk 8 alınır; skor 0 olanlar sıralamaya girmez — 4'ten az kalırsa
 * kategori sırasından (is_featured, sort, name) tamamlanır.
 */
async function getSimilarProducts(product: Product): Promise<Product[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("is_active", true)
      .eq("category_slug", product.category_slug)
      .neq("id", product.id)
      .order("is_featured", { ascending: false })
      .order("sort", { ascending: true })
      .order("name", { ascending: true })
      .limit(30);
    if (error) return [];
    const candidates = (data ?? []) as Product[];
    if (candidates.length === 0) return [];

    const baseTokens = nameTokens(product.name);
    const baseBrand = product.brand.trim().toLocaleLowerCase("tr-TR");

    const scored = candidates.map((p, index) => {
      let score = 0;
      const brand = p.brand.trim().toLocaleLowerCase("tr-TR");
      if (baseBrand && brand && brand === baseBrand) score += 4;
      for (const token of nameTokens(p.name)) {
        if (baseTokens.has(token)) score += 2;
      }
      if (
        product.price > 0 &&
        Math.abs(p.price - product.price) / product.price < 0.3
      ) {
        score += 1;
      }
      return { p, score, index };
    });

    const ranked = scored
      .filter((s) => s.score > 0)
      .sort(
        (a, b) =>
          b.score - a.score ||
          Number(b.p.is_featured) - Number(a.p.is_featured) ||
          a.p.sort - b.p.sort ||
          a.index - b.index
      )
      .map((s) => s.p);

    const result = ranked.slice(0, 8);
    if (result.length < 4) {
      // Skorlu sonuç azsa kategori sırasından tamamla (doldurma, 8'e kadar).
      const picked = new Set(result.map((p) => p.id));
      for (const p of candidates) {
        if (result.length >= 8) break;
        if (!picked.has(p.id)) result.push(p);
      }
    }
    return result;
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) {
    return { title: "Ürün bulunamadı" };
  }
  return {
    // Kök layout şablonu "%s · Yeni Mahalle Market" ekler
    title: product.name,
    description:
      product.description ||
      `${product.name} ve yüzlerce market ürünü Yeni Mahalle Market'te. Seç, sepete ekle, Sapanca içinde adresine gelsin.`,
  };
}

export default async function UrunDetayPage({ params }: { params: Params }) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) notFound();

  const similar = await getSimilarProducts(product);

  const cat = categoryBySlug(product.category_slug);
  const [tintBg, tintFg] = CATEGORY_TINTS[cat?.tint ?? 0] ?? CATEGORY_TINTS[0];
  const Icon = iconFor(cat?.icon ?? "shopping-basket");

  const compareAt = product.compare_at_price;
  const discounted = compareAt !== null && compareAt > product.price;
  const discountPct = discounted
    ? Math.round((1 - product.price / compareAt) * 100)
    : 0;

  return (
    <>
      <SiteNav />

      <main className={styles.page}>
        <div className="container">
          {/* Görsel + bilgi */}
          <section className={styles.hero}>
            <div
              className={styles.media}
              style={
                product.image_url
                  ? undefined
                  : { background: tintBg, color: tintFg }
              }
            >
              {product.image_url ? (
                <img
                  src={product.image_url}
                  alt={product.name}
                  loading="lazy"
                />
              ) : (
                <Icon size={96} strokeWidth={1.2} aria-hidden="true" />
              )}
              {discounted && product.in_stock && (
                <span className={styles.mediaBadge}>%{discountPct} indirim</span>
              )}
              {!product.in_stock && (
                <span className={styles.mediaOut}>Stokta yok</span>
              )}
            </div>

            <div className={styles.info}>
              {cat && (
                <Link
                  href={`/urunler?k=${cat.slug}`}
                  className={styles.catPill}
                  style={{ background: tintBg, color: tintFg }}
                >
                  <Icon size={13} strokeWidth={2} aria-hidden="true" />
                  {cat.name}
                </Link>
              )}

              {(product.brand || product.size_text) && (
                <p className={styles.meta}>
                  {product.brand}
                  {product.brand && product.size_text ? " · " : ""}
                  {product.size_text}
                </p>
              )}
              <h1 className={styles.title}>{product.name}</h1>

              <p className={styles.priceRow}>
                <span className={styles.price}>{formatTL(product.price)}</span>
                {discounted && (
                  <s className={styles.compare}>{formatTL(compareAt)}</s>
                )}
                {product.unit !== "adet" && (
                  <span className={styles.unit}>/ {product.unit}</span>
                )}
                {discounted && (
                  <span className={styles.discount}>%{discountPct} indirim</span>
                )}
              </p>

              <p
                className={`${styles.stock} ${
                  product.in_stock ? styles.stockIn : styles.stockOut
                }`}
                role="status"
              >
                <span className={styles.stockDot} aria-hidden="true" />
                {product.in_stock ? "Stokta var" : "Stokta yok"}
              </p>

              <DetailActions product={product} />

              {product.description && (
                <div className={styles.desc}>
                  <h2>Ürün Açıklaması</h2>
                  <p>{product.description}</p>
                </div>
              )}
            </div>
          </section>

          {/* Benzer ürünler — yatay kaydırılabilir rail */}
          {similar.length > 0 && (
            <section className={styles.similar} aria-labelledby="benzer-urunler">
              <h2 id="benzer-urunler" className={styles.similarHead}>
                Benzer Ürünler
              </h2>
              <div className={styles.rail} role="list">
                {similar.map((p) => (
                  <div key={p.id} className={styles.railItem} role="listitem">
                    <ProductCard product={p} />
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
    </>
  );
}
