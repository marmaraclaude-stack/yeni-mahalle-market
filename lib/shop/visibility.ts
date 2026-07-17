// Katalog görünürlüğü — admin panelinden pasifleştirilen kategoriler ve
// gizlenen alt kategoriler. Vitrin sayfaları bu yardımcıyla ürün/nav listesini
// süzer. Tablo/kolon yoksa (eski DB) boş kümelerle döner — site patlamaz.

import { createClient } from "@/lib/supabase/server";
import { assignSubcategory } from "@/lib/shop/subcategories";
import type { Product } from "@/lib/shop/types";

export interface CatalogVisibility {
  /** Pasif kategori slug'ları (vitrinde kategori + ürünleri gizli). */
  inactiveCats: Set<string>;
  /** Gizli alt kategoriler — "kategori/alt" anahtarıyla. */
  hiddenSubs: Set<string>;
}

export const EMPTY_VISIBILITY: CatalogVisibility = {
  inactiveCats: new Set(),
  hiddenSubs: new Set(),
};

export function subKey(categorySlug: string, subSlug: string): string {
  return `${categorySlug}/${subSlug}`;
}

export async function getCatalogVisibility(): Promise<CatalogVisibility> {
  try {
    const supabase = await createClient();
    const [cats, subs] = await Promise.all([
      supabase.from("shop_categories").select("slug").eq("is_active", false),
      supabase.from("shop_hidden_subcats").select("category_slug, subcategory_slug"),
    ]);
    const inactiveCats = new Set<string>(
      ((cats.data ?? []) as { slug: string }[]).map((r) => r.slug),
    );
    const hiddenSubs = new Set<string>(
      ((subs.data ?? []) as { category_slug: string; subcategory_slug: string }[]).map(
        (r) => subKey(r.category_slug, r.subcategory_slug),
      ),
    );
    return { inactiveCats, hiddenSubs };
  } catch {
    return EMPTY_VISIBILITY;
  }
}

/** Ürün vitrinde görünür mü? (kategorisi aktif VE alt kategorisi gizli değil)
    subsMap: getSubcatsMap() sonucu (DB + kod varsayılanları çözülmüş). */
export function isProductVisible(
  p: Product,
  v: CatalogVisibility,
  subsMap: Record<string, import("./subcategories").SubCategory[]>,
): boolean {
  if (v.inactiveCats.has(p.category_slug)) return false;
  if (v.hiddenSubs.size > 0) {
    const sub = assignSubcategory(
      subsMap[p.category_slug] ?? [],
      p.name,
      p.brand,
      p.subcategory_slug,
    );
    if (v.hiddenSubs.has(subKey(p.category_slug, sub))) return false;
  }
  return true;
}
