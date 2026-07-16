// Marka -> İşletmeci/Üretici eşlemesi. Ürün düzenleme formunda marka
// yazılınca üretici alanı otomatik doldurulur (alan her zaman elle
// düzenlenebilir kalır). Kaynak: katalogdaki mevcut ürün etiket verileri.
// Yeni marka eklemek için satır eklemek yeterli.

export const BRAND_PRODUCERS: Record<string, string> = {
  "aytaç": "Aytaç Gıda Yatırım San. ve Tic. A.Ş.",
  "banvit": "Banvit Bandırma Vitaminli Yem San. A.Ş.",
  "gedik": "Gedik Tavukçuluk ve Tarım Ürünleri Tic. San. A.Ş.",
  "keskinoğlu": "Keskinoğlu Tavukçuluk ve Damızlık İşl. San. Tic. A.Ş.",
  "lezita": "Abalıoğlu Lezita Gıda Sanayi A.Ş.",
  "maret": "Namet Gıda San. ve Tic. A.Ş.",
  "namet": "Namet Gıda San. ve Tic. A.Ş.",
  "pınar": "Pınar Entegre Et ve Un San. A.Ş.",
  "polonez": "Trakya Et ve Süt Ürünleri San. ve Tic. A.Ş. (Polonez)",
  "şahin": "Fazlıoğlu Et ve Et Ürünleri Gıda San. Tic. A.Ş. (Şahin Sucukları)",
  "torku": "Konya Şeker San. ve Tic. A.Ş.",
  "i̇kbal": "İkbal Gıda ve İhtiyaç Maddeleri İmalat San. İç ve Dış Tic. A.Ş.",
  "ikbal": "İkbal Gıda ve İhtiyaç Maddeleri İmalat San. İç ve Dış Tic. A.Ş.",
  "superfresh": "Kerevitaş Gıda San. ve Tic. A.Ş.",
  "kerevitaş": "Kerevitaş Gıda San. ve Tic. A.Ş.",
};

/** Markanın bilinen üreticisi; eşleşme yoksa null. (tr-TR küçük harfle arar) */
export function producerForBrand(brand: string): string | null {
  const key = brand.trim().toLocaleLowerCase("tr-TR");
  if (!key) return null;
  return BRAND_PRODUCERS[key] ?? null;
}
