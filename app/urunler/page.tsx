// Vitrin — /urunler. Server component: ürünler SSR ile anon Supabase
// client'tan çekilir. searchParams: k (kategori slug), q (arama, ilike).
// Next.js 16: searchParams bir Promise — await edilmeli.
// DB hazır değilse sayfa patlamaz: "Katalog hazırlanıyor" fallback'i.

import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft, ShoppingBasket } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import type { Product } from "@/lib/shop/types";
import { categoryBySlug } from "@/lib/shop/categories";
import { BUSINESS } from "@/lib/business";
import CategoryRail from "@/components/shop/CategoryRail";
import SearchBox from "@/components/shop/SearchBox";
import ProductGrid from "@/components/shop/ProductGrid";
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
    title: cat ? `${cat.name} — Ürünler` : "Ürünler",
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
    let query = supabase
      .from("products")
      .select("*")
      .eq("is_active", true);

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

  const emptyText = q
    ? `"${q}" aramasına uygun ürün bulunamadı.`
    : category
      ? "Bu kategoride henüz ürün yok."
      : "Henüz ürün eklenmedi.";

  return (
    <main className={styles.page}>
      <div className="container">
        <header className={styles.head}>
          <Link href="/" className={styles.back}>
            <ChevronLeft size={15} strokeWidth={2.2} aria-hidden="true" />
            Ana Sayfa
          </Link>
          <h1 className={styles.title}>
            {category ? category.name : "Market Ürünleri"}
          </h1>
          <p className={styles.sub}>
            Seç, sepete ekle — Sapanca içinde kapına gelsin.
          </p>
        </header>

        <div className={styles.toolbar}>
          <SearchBox q={q || undefined} k={category?.slug} />
          <CategoryRail active={category?.slug} q={q || undefined} />
        </div>

        {dbError ? (
          <section className={styles.fallback} aria-live="polite">
            <span className={styles.fallbackIcon} aria-hidden="true">
              <ShoppingBasket size={26} strokeWidth={1.8} />
            </span>
            <h2>Katalog hazırlanıyor</h2>
            <p>
              Online ürün listemiz çok yakında burada. Şimdilik siparişini
              WhatsApp üzerinden verebilirsin — her zamanki gibi kapına
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
        ) : (
          <>
            <p className={styles.count} role="status">
              {q
                ? `"${q}" için ${products.length} sonuç`
                : `${products.length} ürün`}
            </p>
            <ProductGrid products={products} emptyText={emptyText} />
          </>
        )}
      </div>
    </main>
  );
}
