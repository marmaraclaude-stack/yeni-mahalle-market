// Vitrin "özel görünümleri" — Keşfet grubu (?ozel=...).
// Kategori dışı, katalog genelinde çalışan iki liste: indirimli, çok satan.
// ("Tümü" görünümü artık tüm ürünleri kategori kategori gruplu gösterdiği için
// ayrı "Tüm Ürünler" özel görünümü kaldırıldı.) Sidebar, mobil pill barı ve
// /urunler sayfası ortak bu sabiti kullanır (etiket/başlık/tint tek yerde).

import { CATEGORY_TINTS } from "@/lib/shop/categories";

export type SpecialKey = "indirimli" | "cok-satan";

export interface SpecialDef {
  key: SpecialKey;
  label: string; // sidebar/pill kısa etiketi
  title: string; // sayfa başlığı
  tintBg: string;
  tintFg: string;
}

export const SHOP_SPECIALS: SpecialDef[] = [
  {
    key: "indirimli",
    label: "İndirimli",
    title: "İndirimli Ürünler",
    tintBg: CATEGORY_TINTS[1][0],
    tintFg: CATEGORY_TINTS[1][1],
  },
  {
    key: "cok-satan",
    label: "Çok Satan",
    title: "Çok Satan Ürünler",
    tintBg: CATEGORY_TINTS[2][0],
    tintFg: CATEGORY_TINTS[2][1],
  },
];

/** Geçerli özel görünüm anahtarını çöz (bilinmeyen → undefined). */
export function specialByKey(key: string | undefined): SpecialDef | undefined {
  if (!key) return undefined;
  return SHOP_SPECIALS.find((s) => s.key === key);
}
