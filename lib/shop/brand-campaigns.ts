// Marka kampanya pilleri — shop_brands.campaign metni, o markadaki tüm
// ürünlerin kartlarında görsel üstü pil olarak gösterilir (ProductCard
// product.brand_campaign okur). Kampanyalar istek başına tek sorguyla
// çekilir; DB erişilemezse boş harita döner, site patlamaz.

import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import type { Product } from "@/lib/shop/types";

function normBrand(name: string): string {
  return name.trim().toLocaleLowerCase("tr-TR");
}

/** Marka adı (tr-lower) -> kampanya metni. Yalnız dolu kampanyalar. */
export const getBrandCampaigns = cache(
  async (): Promise<Map<string, string>> => {
    try {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from("shop_brands")
        .select("name, campaign")
        .neq("campaign", "");
      if (error || !data) return new Map();
      const map = new Map<string, string>();
      for (const r of data as { name: string; campaign: string | null }[]) {
        const c = (r.campaign ?? "").trim();
        if (c) map.set(normBrand(r.name), c);
      }
      return map;
    } catch {
      return new Map();
    }
  },
);

/** Ürün listesine brand_campaign alanını işler (kampanyası olan markalar). */
export function annotateBrandCampaigns(
  products: Product[],
  campaigns: Map<string, string>,
): Product[] {
  if (campaigns.size === 0) return products;
  return products.map((p) => {
    const c = p.brand ? campaigns.get(normBrand(p.brand)) : undefined;
    return c ? { ...p, brand_campaign: c } : p;
  });
}
