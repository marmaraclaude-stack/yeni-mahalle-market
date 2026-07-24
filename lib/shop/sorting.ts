// Vitrin sıralama yardımcıları — SUNUCU + istemci ortak modülü ("use client"
// YOK; server component'ten çağrılabilir). UI, SortSelect bileşenindedir.

import type { Product } from "@/lib/shop/types";

export type SortKey = "onerilen" | "fiyat-artan" | "fiyat-azalan" | "cok-satan";

/** name: menüdeki tam etiket · short: tetik butonundaki kompakt etiket
    (dar/mobil hapta taşmaz). */
export const SORT_OPTIONS: { key: SortKey; name: string; short: string }[] = [
  { key: "onerilen", name: "Önerilen", short: "Önerilen" },
  { key: "cok-satan", name: "Çok Satanlar", short: "Çok Satanlar" },
  { key: "fiyat-artan", name: "Fiyat: Düşükten Yükseğe", short: "Fiyat: Artan" },
  { key: "fiyat-azalan", name: "Fiyat: Yüksekten Düşüğe", short: "Fiyat: Azalan" },
];

/** Geçersiz/boş parametreyi "onerilen"e indirger. */
export function normalizeSort(v: string | undefined): SortKey {
  return SORT_OPTIONS.some((o) => o.key === v) ? (v as SortKey) : "onerilen";
}

/* ==========================  "Önerilen" akışı  ==========================
   Varsayılan vitrin sırası dört katmanlıdır:
     1) Öne çıkanlar (is_featured) en önde, ardından çok satanlar.
     2) Meyve & Sebze'de içinde bulunulan mevsimin ürünleri öne alınır.
     3) Kalanlar ürün "ailesine" göre kümelenir: marka ve gramaj ayıklanmış
        ada göre Türkçe alfabetik — elmalar dörtlü yan yana, limonun yanında
        lime durur; 4 kolonlu grid satırları böylece tutarlı görünür.
     4) Aynı aile içinde yöneticinin verdiği sıra (sort) belirleyicidir. */

// Gramaj/birim kelimeleri — aile anahtarından atılır ("Süt 1 L" ve
// "Süt 200 ml" aynı ailededir).
const UNIT_WORDS = new Set([
  "g", "gr", "kg", "ml", "cl", "l", "lt", "litre", "cc",
  "adet", "paket", "x",
]);

/** Ürün ailesi anahtarı: tr-lower ad; baştaki marka, rakamlı token'lar ve
    birim kelimeleri atılır. Boş kalırsa adın kendisi kullanılır. */
function familyKey(p: Product): string {
  let name = p.name.toLocaleLowerCase("tr-TR");
  const brand = p.brand.trim().toLocaleLowerCase("tr-TR");
  if (brand && name.startsWith(`${brand} `)) name = name.slice(brand.length + 1);
  const tokens = name
    .split(/[^0-9a-zçğıöşüâîû]+/)
    .filter((t) => t !== "" && !UNIT_WORDS.has(t) && !/\d/.test(t));
  return tokens.join(" ") || name;
}

// Mevsim ürünleri (Meyve & Sebze) — ada göre eşleşen ürünler kendi
// mevsiminde öne alınır. Aylar: 0 = Ocak.
const KIS = ["portakal", "mandalina", "greyfurt", "ayva", "nar", "pırasa",
  "lahana", "karnabahar", "kereviz", "ıspanak", "brokoli", "havuç"];
const ILKBAHAR = ["çilek", "marul", "roka", "tere", "taze soğan",
  "yeşil soğan", "bezelye", "enginar", "semizotu", "kiraz"];
const YAZ = ["karpuz", "kavun", "şeftali", "kayısı", "kiraz", "vişne", "erik",
  "üzüm", "incir", "domates", "salatalık", "biber", "patlıcan", "kabak",
  "barbunya", "mısır", "taze fasulye"];
const SONBAHAR = ["üzüm", "incir", "nar", "ayva", "kestane", "balkabağı",
  "pırasa", "karnabahar", "mandalina", "portakal"];
const SEASON_BY_MONTH = [
  KIS, KIS, ILKBAHAR, ILKBAHAR, ILKBAHAR, YAZ,
  YAZ, YAZ, SONBAHAR, SONBAHAR, SONBAHAR, KIS,
];

function isSeasonal(p: Product, month: number): boolean {
  if (p.category_slug !== "meyve-sebze") return false;
  const n = p.name.toLocaleLowerCase("tr-TR");
  return SEASON_BY_MONTH[month].some((k) => n.includes(k));
}

/** Önerilen katmanı: 0 öne çıkan · 1 çok satan · 2 mevsim ürünü · 3 kalan. */
function tierOf(p: Product, month: number): number {
  if (p.is_featured) return 0;
  if (p.is_best_seller) return 1;
  if (isSeasonal(p, month)) return 2;
  return 3;
}

function sortRecommended(list: Product[]): Product[] {
  const month = new Date().getMonth();
  const info = new Map(
    list.map((p) => [p.id, { tier: tierOf(p, month), fam: familyKey(p) }]),
  );
  return [...list].sort((a, b) => {
    const ia = info.get(a.id)!;
    const ib = info.get(b.id)!;
    return (
      ia.tier - ib.tier ||
      ia.fam.localeCompare(ib.fam, "tr") ||
      a.sort - b.sort ||
      a.price - b.price
    );
  });
}

/** Ürünleri seçilen anahtara göre diz.
    "onerilen" küratörlü akıştır (öne çıkan → çok satan → mevsim → aile
    kümeleri); "cok-satan" kararlı sıralamadır: çok satanlar öne, kalanlar
    mevcut sırada. */
export function sortProducts(list: Product[], key: SortKey): Product[] {
  if (key === "fiyat-artan") return [...list].sort((a, b) => a.price - b.price);
  if (key === "fiyat-azalan") return [...list].sort((a, b) => b.price - a.price);
  if (key === "cok-satan") {
    return [...list].sort(
      (a, b) => Number(b.is_best_seller) - Number(a.is_best_seller),
    );
  }
  return sortRecommended(list);
}
