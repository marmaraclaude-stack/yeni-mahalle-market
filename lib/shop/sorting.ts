// Vitrin sıralama yardımcıları — SUNUCU + istemci ortak modülü ("use client"
// YOK; server component'ten çağrılabilir). UI, SortSelect bileşenindedir.

import type { Product } from "@/lib/shop/types";

export type SortKey = "onerilen" | "fiyat-artan" | "fiyat-azalan" | "cok-satan";

export const SORT_OPTIONS: { key: SortKey; name: string }[] = [
  { key: "onerilen", name: "Önerilen" },
  { key: "cok-satan", name: "Çok Satanlar" },
  { key: "fiyat-artan", name: "Fiyat: Düşükten Yükseğe" },
  { key: "fiyat-azalan", name: "Fiyat: Yüksekten Düşüğe" },
];

/** Geçersiz/boş parametreyi "onerilen"e indirger. */
export function normalizeSort(v: string | undefined): SortKey {
  return SORT_OPTIONS.some((o) => o.key === v) ? (v as SortKey) : "onerilen";
}

/** Ürünleri seçilen anahtara göre diz (varsayılan sıra DB'den gelir).
    "cok-satan" kararlı sıralamadır: çok satanlar öne, kalanlar mevcut sırada. */
export function sortProducts(list: Product[], key: SortKey): Product[] {
  if (key === "fiyat-artan") return [...list].sort((a, b) => a.price - b.price);
  if (key === "fiyat-azalan") return [...list].sort((a, b) => b.price - a.price);
  if (key === "cok-satan") {
    return [...list].sort(
      (a, b) => Number(b.is_best_seller) - Number(a.is_best_seller),
    );
  }
  return list;
}
