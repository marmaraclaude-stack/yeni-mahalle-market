// Kategori listesinin ÇÖZÜMLENMİŞ hâli: koddaki SHOP_CATEGORIES + panelden
// eklenen özel kategoriler (shop_categories.custom = true). DB erişilemezse
// yalnız kod listesi döner; site patlamaz.

import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import { SHOP_CATEGORIES, type CategoryDef } from "@/lib/shop/categories";

interface Row {
  slug: string;
  name: string;
  tint: number;
  icon: string;
  sort: number;
}

/** Kod + özel kategorilerin birleşik listesi (istek başına önbellekli). */
export const getAllCategories = cache(async (): Promise<CategoryDef[]> => {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("shop_categories")
      .select("slug, name, tint, icon, sort")
      .eq("custom", true)
      .order("sort", { ascending: true });
    if (error || !data) return SHOP_CATEGORIES;
    const known = new Set(SHOP_CATEGORIES.map((c) => c.slug));
    const extra: CategoryDef[] = (data as Row[])
      .filter((r) => !known.has(r.slug) && r.name.trim() !== "")
      .map((r) => ({
        slug: r.slug,
        name: r.name,
        tint: Math.min(Math.max(r.tint, 0), 7),
        icon: r.icon || "shopping-basket",
        orderable: true,
      }));
    return extra.length ? [...SHOP_CATEGORIES, ...extra] : SHOP_CATEGORIES;
  } catch {
    return SHOP_CATEGORIES;
  }
});

/** Yalnız panelden eklenen özel kategoriler. */
export async function getCustomCategories(): Promise<CategoryDef[]> {
  const all = await getAllCategories();
  return all.slice(SHOP_CATEGORIES.length);
}
