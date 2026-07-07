// Getir tarzı ALT KATEGORİLER. DB şeması değişmeden çalışır: ürün, adı +
// markası üzerinde kurallı (RegExp) eşlemeyle bir alt kategoriye atanır.
// /urunler'de kategori seçiliyken çip barı ve bölümlenmiş görünüm üretir.
// SIRA ÖNEMLİ: ilk eşleşen kural kazanır. Eşleşmeyen ürün "diger"e düşer.
// NOT: Bu dosyanın tam içeriği ajan tarafından, seed'lerdeki gerçek ürün
// adlarına göre doldurulur; buradaki örnek sözleşmeyi gösterir.

export interface SubCategory {
  slug: string;
  name: string;
  /** `${name} ${brand}` tr-TR lowercase metni üzerinde test edilir. */
  match: RegExp;
}

export const OTHER_SUB_SLUG = "diger";
export const OTHER_SUB_NAME = "Diğer";

export const CATEGORY_SUBS: Record<string, SubCategory[]> = {
  "icecek-su": [
    { slug: "su", name: "Su", match: /maden suyu|soda|\bsu\b/ },
    { slug: "kola-gazoz", name: "Kola & Gazoz", match: /kola|gazoz|cola|pepsi|fanta|sprite|yedig[uü]n/ },
    { slug: "soguk-cay", name: "Soğuk Çay", match: /ice tea|soğuk çay|fuse tea|lipton ice/ },
    { slug: "meyve-suyu", name: "Meyve Suyu", match: /meyve suyu|nektar|cappy|tamek|dimes|juss/ },
  ],
};

/** Kategorinin alt kategori tanımları; yoksa boş dizi. */
export function subcatsFor(categorySlug: string): SubCategory[] {
  return CATEGORY_SUBS[categorySlug] ?? [];
}

/** Ürünü alt kategoriye ata: ilk eşleşen kural, yoksa "diger". */
export function assignSubcategory(
  categorySlug: string,
  name: string,
  brand: string,
): string {
  const subs = CATEGORY_SUBS[categorySlug];
  if (!subs || subs.length === 0) return OTHER_SUB_SLUG;
  const hay = `${name} ${brand}`.toLocaleLowerCase("tr-TR");
  for (const s of subs) {
    if (s.match.test(hay)) return s.slug;
  }
  return OTHER_SUB_SLUG;
}
