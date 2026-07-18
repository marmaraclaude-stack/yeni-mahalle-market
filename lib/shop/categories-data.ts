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
  custom: boolean;
}

/** Kod + özel kategorilerin birleşik listesi (istek başına önbellekli). */
export const getAllCategories = cache(async (): Promise<CategoryDef[]> => {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("shop_categories")
      .select("slug, name, tint, icon, sort, custom")
      .order("sort", { ascending: true });
    if (error || !data) return SHOP_CATEGORIES;
    const rows = data as Row[];
    // Kod kategorileri: adı DOLU satır panelden düzenlenmiş demektir; ad,
    // ikon ve renk DB'deki değerle geçersiz kılınır (slug/URL değişmez).
    const overrides = new Map(
      rows.filter((r) => !r.custom && r.name.trim() !== "").map((r) => [r.slug, r]),
    );
    const base: CategoryDef[] = SHOP_CATEGORIES.map((c) => {
      const o = overrides.get(c.slug);
      return o
        ? {
            ...c,
            name: o.name,
            tint: Math.min(Math.max(o.tint, 0), 7),
            icon: o.icon || c.icon,
          }
        : c;
    });
    const known = new Set(SHOP_CATEGORIES.map((c) => c.slug));
    const extra: CategoryDef[] = rows
      .filter((r) => r.custom && !known.has(r.slug) && r.name.trim() !== "")
      .map((r) => ({
        slug: r.slug,
        name: r.name,
        tint: Math.min(Math.max(r.tint, 0), 7),
        icon: r.icon || "shopping-basket",
        orderable: true,
      }));
    // Etkin sıra: düzenlenmiş (adı dolu) satır sort'u; yoksa kod sırası.
    const codeIdx = new Map(SHOP_CATEGORIES.map((c, i) => [c.slug, i * 10]));
    const sortOf = (slug: string): number => {
      const o = overrides.get(slug);
      if (o) return o.sort;
      const r = rows.find((x) => x.slug === slug && x.custom);
      if (r) return r.sort;
      return codeIdx.get(slug) ?? 100000;
    };
    const merged = extra.length ? [...base, ...extra] : base;
    return [...merged].sort((a, b) => sortOf(a.slug) - sortOf(b.slug));
  } catch {
    return SHOP_CATEGORIES;
  }
});

/** Yalnız panelden eklenen özel kategoriler. */
export async function getCustomCategories(): Promise<CategoryDef[]> {
  const all = await getAllCategories();
  return all.slice(SHOP_CATEGORIES.length);
}
