// Kategori görünürlüğü yönetimi — /admin/kategoriler.
// Her kategori bir kart: vitrinde aktif/pasif anahtarı + alt kategorilerinin
// tek tek gizle/göster anahtarları. Pasif kategori (ürünleriyle birlikte)
// ana sayfa, rail/sidebar, listeler ve aramadan kalkar; gizli alt kategori de
// menü ve ürünleriyle birlikte gizlenir. Kaynak listeler koddaki sabitlerdir
// (SHOP_CATEGORIES / CATEGORY_SUBS); durum DB'de tutulur.

import type { Metadata } from "next";
import { createAdminClient } from "@/lib/supabase/admin";
import { SHOP_CATEGORIES } from "@/lib/shop/categories";
import { subcatsFor } from "@/lib/shop/subcategories";
import styles from "../../admin.module.css";
import CategoriesManager from "./CategoriesManager";

export const metadata: Metadata = {
  title: "Kategoriler · Yönetim",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function KategorilerPage() {
  const supabase = createAdminClient();

  // Pasif kategoriler + gizli alt kategoriler (kolon/tablo yoksa boş kabul).
  let inactive: string[] = [];
  let hidden: string[] = [];
  try {
    const [cats, subs] = await Promise.all([
      supabase.from("shop_categories").select("slug").eq("is_active", false),
      supabase
        .from("shop_hidden_subcats")
        .select("category_slug, subcategory_slug"),
    ]);
    inactive = ((cats.data ?? []) as { slug: string }[]).map((r) => r.slug);
    hidden = (
      (subs.data ?? []) as { category_slug: string; subcategory_slug: string }[]
    ).map((r) => `${r.category_slug}/${r.subcategory_slug}`);
  } catch {
    /* boş varsayılanlarla devam */
  }

  const categories = SHOP_CATEGORIES.map((c) => ({
    slug: c.slug,
    name: c.name,
    tint: c.tint,
    icon: c.icon,
    subs: subcatsFor(c.slug).map((s) => ({ slug: s.slug, name: s.name })),
  }));

  return (
    <>
      <h1 className={styles.title}>Kategoriler</h1>
      <p className={styles.subtitle}>
        Kategori veya alt kategorileri vitrinden tek anahtarla kaldırın.
        Pasif kategori ürünleriyle birlikte ana sayfa, listeler ve aramada
        gizlenir; ürünler ve stok bilgileri silinmez.
      </p>
      <CategoriesManager
        categories={categories}
        initialInactive={inactive}
        initialHidden={hidden}
      />
    </>
  );
}
