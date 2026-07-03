// Ürün detay sayfası — /urunler/[slug]. Server component.
// Next.js 16: params bir Promise — await edilmeli.
// Ürün anon client'la slug üzerinden çekilir (is_active=true);
// bulunamazsa (veya DB hazır değilse) notFound().
// Altta aynı kategoriden 8 benzer ürün listelenir.

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cache } from "react";
import { ChevronRight } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import type { Product } from "@/lib/shop/types";
import { formatTL } from "@/lib/shop/types";
import { CATEGORY_TINTS, categoryBySlug } from "@/lib/shop/categories";
import ProductCard, { iconFor } from "@/components/shop/ProductCard";
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

/** Aynı kategoriden benzer ürünler (kendisi hariç, en fazla 8). */
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
      .limit(8);
    if (error) return [];
    return (data ?? []) as Product[];
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
    <main className={styles.page}>
      <div className="container">
        {/* Breadcrumb */}
        <nav className={styles.crumbs} aria-label="Sayfa yolu">
          <Link href="/">Ana Sayfa</Link>
          <ChevronRight size={13} strokeWidth={2.2} aria-hidden="true" />
          <Link href="/urunler">Ürünler</Link>
          {cat && (
            <>
              <ChevronRight size={13} strokeWidth={2.2} aria-hidden="true" />
              <Link href={`/urunler?k=${cat.slug}`}>{cat.name}</Link>
            </>
          )}
          <ChevronRight size={13} strokeWidth={2.2} aria-hidden="true" />
          <span className={styles.crumbCurrent} aria-current="page">
            {product.name}
          </span>
        </nav>

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

        {/* Benzer ürünler */}
        {similar.length > 0 && (
          <section className={styles.similar} aria-labelledby="benzer-urunler">
            <h2 id="benzer-urunler" className={styles.similarHead}>
              Benzer Ürünler
            </h2>
            <div className={styles.similarGrid}>
              {similar.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
