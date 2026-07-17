// Alt kategori tanımlarının ÇÖZÜMLENMİŞ hâli: shop_subcats tablosunda satırı
// olan kategori için DB satırları geçerlidir (admin panelinden düzenlenmiş);
// satırı olmayan kategori koddaki varsayılanları (CATEGORY_SUBS) kullanır.
// Tablo yoksa / erişilemezse tamamen varsayılanlara düşülür — site patlamaz.

import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import {
  CATEGORY_SUBS,
  dtoToSub,
  subToDTO,
  type SubCategory,
  type SubcatDTO,
} from "@/lib/shop/subcategories";

export type SubcatsMap = Record<string, SubCategory[]>;

interface Row {
  category_slug: string;
  slug: string;
  name: string;
  pattern: string;
}

/** Tüm kategorilerin etkin alt kategori listeleri (istek başına önbellekli). */
export const getSubcatsMap = cache(async (): Promise<SubcatsMap> => {
  const map: SubcatsMap = { ...CATEGORY_SUBS };
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("shop_subcats")
      .select("category_slug, slug, name, pattern")
      .order("sort", { ascending: true });
    if (error || !data) return map;
    const byCat = new Map<string, SubCategory[]>();
    for (const r of data as Row[]) {
      const list = byCat.get(r.category_slug) ?? [];
      list.push(dtoToSub({ slug: r.slug, name: r.name, pattern: r.pattern }));
      byCat.set(r.category_slug, list);
    }
    for (const [cat, list] of byCat) map[cat] = list;
    return map;
  } catch {
    return map;
  }
});

/** İstemci bileşenlerine prop olarak geçirilebilir DTO haritası. */
export function subcatsMapToDTO(map: SubcatsMap): Record<string, SubcatDTO[]> {
  const out: Record<string, SubcatDTO[]> = {};
  for (const [cat, list] of Object.entries(map)) out[cat] = list.map(subToDTO);
  return out;
}
