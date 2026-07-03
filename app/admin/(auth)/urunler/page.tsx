// Admin — ürün yönetimi. Arama + kategori filtresi üst satırda tek GET formu
// (sunucuda filtrelenir); "Yeni Ürün" accent butonu ve collapse formu ile
// satır içi düzenleme client'taki ProductsTable'da. ?yeni=1 formu açık başlatır.

import { Search } from "lucide-react";
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
  searchParams: Promise<{ k?: string; q?: string; yeni?: string }>;
}) {
  const { k, q, yeni } = await searchParams;
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

  // Arama + kategori filtresi (GET formu — sunucuda filtrelenir).
  // ProductsTable'daki araç çubuğuna slot olarak geçilir.
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
      <button type="submit" className={styles.actionBtn}>
        Filtrele
      </button>
    </form>
  );

  return (
    <>
      <h1 className={styles.title}>Ürünler</h1>
      <p className={styles.subtitle}>
        {loadError ? "Katalog yüklenemedi." : `${products.length} ürün listeleniyor.`}
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
          filterSlot={filterSlot}
          openForm={yeni === "1"}
        />
      )}
    </>
  );
}
