// Admin — ürün yönetimi. Kategori filtresi + arama sunucuda (searchParams),
// satır içi düzenleme ve yeni ürün formu client'taki ProductsTable'da.

import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";
import { SHOP_CATEGORIES } from "@/lib/shop/categories";
import type { Product } from "@/lib/shop/types";
import ProductsTable from "./ProductsTable";
import styles from "../../admin.module.css";

export const dynamic = "force-dynamic";
export const metadata = { title: "Ürünler" };

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ k?: string; q?: string }>;
}) {
  const { k, q } = await searchParams;
  const category = k ?? "";
  const search = (q ?? "").trim();

  let products: Product[] = [];
  let loadError: string | null = null;

  try {
    const supabase = createAdminClient();
    let query = supabase
      .from("products")
      .select("*")
      .order("category_slug")
      .order("sort")
      .order("name")
      .limit(1000);
    if (category) query = query.eq("category_slug", category);
    if (search) query = query.ilike("name", `%${search}%`);
    const { data, error } = await query;
    if (error) {
      loadError = error.message;
    } else {
      products = (data ?? []) as Product[];
    }
  } catch (e) {
    loadError = e instanceof Error ? e.message : "Bilinmeyen hata";
  }

  const buildHref = (slug: string) => {
    const params = new URLSearchParams();
    if (slug) params.set("k", slug);
    if (search) params.set("q", search);
    const qs = params.toString();
    return qs ? `/admin/urunler?${qs}` : "/admin/urunler";
  };

  return (
    <>
      <h1 className={styles.title}>Ürünler</h1>
      <p className={styles.subtitle}>
        {loadError ? "Katalog yüklenemedi." : `${products.length} ürün listeleniyor.`}
      </p>

      {/* Arama (GET formu — sunucuda filtrelenir) */}
      <form method="get" action="/admin/urunler" className={styles.searchRow}>
        {category && <input type="hidden" name="k" value={category} />}
        <input
          type="search"
          name="q"
          defaultValue={search}
          placeholder="Ürün adında ara…"
          aria-label="Ürün ara"
          className={styles.input}
        />
        <button
          type="submit"
          className={`${styles.actionBtn} ${styles["actionBtn--primary"]}`}
        >
          Ara
        </button>
      </form>

      {/* Kategori filtresi */}
      <div className={styles.chips}>
        <Link
          href={buildHref("")}
          className={`${styles.chip} ${!category ? styles["chip--active"] : ""}`}
        >
          Tümü
        </Link>
        {SHOP_CATEGORIES.map((c) => (
          <Link
            key={c.slug}
            href={buildHref(c.slug)}
            className={`${styles.chip} ${category === c.slug ? styles["chip--active"] : ""}`}
          >
            {c.name}
          </Link>
        ))}
      </div>

      {loadError ? (
        <div className={styles.empty}>
          Ürünler yüklenemedi. Veritabanı kurulumu yapılmamış olabilir.
          <br />
          <small>{loadError}</small>
        </div>
      ) : (
        <ProductsTable products={products} />
      )}
    </>
  );
}
