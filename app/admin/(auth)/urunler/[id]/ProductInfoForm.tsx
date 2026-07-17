"use client";

// Admin ürün bilgi formu — istemci adası.
// "Gram bazlı sat" işaretlenince: Gramaj ve Birim alanları GİZLENİR
// (gramı müşteri seçer, birim otomatik "kg"), fiyat etiketi "kilogram fiyatı"
// olur. saveAction sunucudan prop olarak gelir; alan adları aynı kalır.

import Link from "next/link";
import { useRef, useState } from "react";
import { formatGrams, isWeightBased, type Product } from "@/lib/shop/types";
import styles from "../../../admin.module.css";

interface Props {
  saveAction: (formData: FormData) => void | Promise<void>;
  product: Product;
  categories: { slug: string; name: string }[];
  units: string[];
  /** Marka listesi (shop_brands) — /admin/markalar sayfasından yönetilir. */
  brands: { name: string; producer: string }[];
  /** Çözümlenmiş alt kategoriler (kategori slug -> {slug, name} listesi). */
  subcats: Record<string, { slug: string; name: string }[]>;
}

/** Gramı kg metnine çevir (250 → "0.25", 5000 → "5"). */
function gramsToKgText(grams: number): string {
  const kg = (Number(grams) || 0) / 1000;
  return String(kg);
}

/** Üretici karşılaştırması için normalize: tr küçük harf, tek boşluk,
    sondaki nokta(lar) yok. ("...A.Ş" ile "...A.Ş." aynı sayılır) */
function normProducer(s: string): string {
  return s
    .toLocaleLowerCase("tr-TR")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\.+$/, "");
}

/** Türkçe duyarsız karşılaştırma/arama için küçük harf. */
function trLower(s: string): string {
  return s.toLocaleLowerCase("tr-TR").trim();
}

export default function ProductInfoForm({
  saveAction,
  product,
  categories,
  units,
  brands,
  subcats,
}: Props) {
  const [byWeight, setByWeight] = useState(product.sold_by_weight);
  const [brand, setBrand] = useState(product.brand ?? "");
  // Marka arama kutusu (combobox): yazarak süz, listeden seç.
  const [brandQuery, setBrandQuery] = useState(product.brand ?? "");
  const [brandOpen, setBrandOpen] = useState(false);
  const [brandIdx, setBrandIdx] = useState(-1);
  const brandBoxRef = useRef<HTMLDivElement>(null);
  // Odaklanınca tümünü seç; ilk tıklamanın bu seçimi bozmasını engelle
  // (yazılan metin eskisinin ÜZERİNE gelsin, yanına eklenmesin).
  const brandJustFocused = useRef(false);
  // Üretici/işletmeci: marka seçilince shop_brands'teki değerle otomatik
  // dolar; elle düzenlenirse otomatik doldurma o üründe devre dışı kalır.
  const [uretici, setUretici] = useState(product.details?.uretici ?? "");
  const [ureticiAuto, setUreticiAuto] = useState(false);

  // Süzme: kutudaki metin seçili markanın adıyla aynıysa (henüz yazılmadıysa)
  // TÜM liste gösterilir; yazılmaya başlanınca içeren eşleşmeler süzülür.
  const brandFilter = trLower(brandQuery) === trLower(brand) ? "" : trLower(brandQuery);
  const brandMatches = brandFilter
    ? brands.filter((b) => trLower(b.name).includes(brandFilter))
    : brands;

  /* Markayı uygula + üretici alanını akıllıca güncelle. Alan boşsa, bu
     oturumda otomatik dolduysa YA DA mevcut değer bilinen bir markanın
     üreticisi/adıysa (eski markadan kalan otomatik değer) üzerine yazılır;
     yeni markanın üreticisi yoksa eski markanın değeri temizlenir. Elle
     girilmiş ÖZEL değer korunur. */
  function applyBrand(v: string) {
    setBrand(v);
    setBrandQuery(v);
    setBrandOpen(false);
    setBrandIdx(-1);
    const newProducer = brands.find((b) => b.name === v)?.producer ?? "";
    const cur = normProducer(uretici);
    const knownValue =
      cur !== "" &&
      brands.some(
        (b) =>
          (b.producer !== "" && normProducer(b.producer) === cur) ||
          normProducer(b.name) === cur,
      );
    if (!(cur === "" || ureticiAuto || knownValue)) return;
    if (newProducer) {
      setUretici(newProducer);
      setUreticiAuto(true);
    } else if (cur !== "") {
      setUretici(""); // eski markanın üreticisi yeni markada kalmasın
      setUreticiAuto(true);
    }
  }

  /* Kutudan çıkarken: metin bir markayla birebir eşleşiyorsa onu seç;
     boşsa Markasız; eşleşmiyorsa son geçerli seçime geri dön. */
  function commitBrandQuery() {
    const q = brandQuery.trim();
    if (q === "") {
      if (brand !== "") applyBrand("");
      else setBrandQuery("");
      return;
    }
    const hit = brands.find((b) => trLower(b.name) === trLower(q));
    if (hit && hit.name !== brand) applyBrand(hit.name);
    else setBrandQuery(brand);
  }
  const [category, setCategory] = useState(product.category_slug);
  const [subcategory, setSubcategory] = useState(
    product.subcategory_slug ?? "",
  );
  const [unit, setUnit] = useState(product.unit || "adet");
  const subOptions = subcats[category] ?? [];

  // Fiyat + en az miktar birbirine bağlı: kg fiyatı canonical (name="price"),
  // en az miktar fiyatı = kg fiyatı × en az miktar. Yönetici ikisinden birini
  // yazar, diğeri otomatik güncellenir. "125 g fiyatı nedir / kg fiyatı nedir".
  const r2 = (n: number) => Math.round(n * 100) / 100;
  const parseNum = (s: string) => {
    const n = Number.parseFloat(s.replace(",", "."));
    return Number.isFinite(n) ? n : NaN;
  };
  const [kgPrice, setKgPrice] = useState(String(product.price));
  const [minKg, setMinKg] = useState(gramsToKgText(product.weight_min_grams));
  const [packPrice, setPackPrice] = useState(() => {
    const p = (Number(product.price) || 0) * (product.weight_min_grams / 1000);
    return String(r2(p));
  });

  function onKgChange(v: string) {
    setKgPrice(v);
    const kg = parseNum(v);
    const m = parseNum(minKg);
    if (Number.isFinite(kg) && Number.isFinite(m) && m > 0)
      setPackPrice(String(r2(kg * m)));
  }
  function onMinChange(v: string) {
    setMinKg(v);
    const kg = parseNum(kgPrice);
    const m = parseNum(v);
    if (Number.isFinite(kg) && Number.isFinite(m) && m > 0)
      setPackPrice(String(r2(kg * m)));
  }
  function onPackChange(v: string) {
    setPackPrice(v);
    const p = parseNum(v);
    const m = parseNum(minKg);
    if (Number.isFinite(p) && Number.isFinite(m) && m > 0)
      setKgPrice(String(r2(p / m)));
  }

  // Etkin gram bazlı mı? (açık işaret VEYA meyve-sebze + kg/gram). Ölçek ve
  // ikili fiyat alanları yalnız bu durumda görünür.
  const effectiveWeight = isWeightBased({
    sold_by_weight: byWeight,
    unit: byWeight ? "kg" : unit,
    category_slug: category,
  });

  return (
    <form action={saveAction}>
      <div className={styles.editFormGrid}>
        <div className={`${styles.field} ${styles.fieldFull}`}>
          <label className={styles.label} htmlFor="p-name">
            Ürün adı *
          </label>
          <input
            id="p-name"
            name="name"
            required
            defaultValue={product.name}
            className={styles.input}
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="p-brand">
            Marka
          </label>
          {/* Form her zaman SEÇİLİ markayı gönderir (yazılan metni değil) */}
          <input type="hidden" name="brand" value={brand} />
          <div
            className={styles.comboWrap}
            ref={brandBoxRef}
            onBlur={(e) => {
              // Menü içine tıklamalar mousedown'da engellendiği için buraya
              // yalnız kutunun tamamen terk edilmesi düşer.
              if (
                brandBoxRef.current &&
                e.relatedTarget &&
                brandBoxRef.current.contains(e.relatedTarget as Node)
              ) {
                return;
              }
              commitBrandQuery();
              setBrandOpen(false);
              setBrandIdx(-1);
            }}
          >
            <input
              id="p-brand"
              type="text"
              value={brandQuery}
              className={styles.input}
              placeholder="Marka ara (örn. Banvit)"
              role="combobox"
              aria-expanded={brandOpen}
              aria-autocomplete="list"
              aria-controls="p-brand-list"
              autoComplete="off"
              onFocus={(e) => {
                setBrandOpen(true);
                brandJustFocused.current = true;
                e.target.select();
              }}
              onMouseUp={(e) => {
                if (brandJustFocused.current) {
                  e.preventDefault(); // odak seçimini ilk tıklama bozmasın
                  brandJustFocused.current = false;
                }
              }}
              onClick={(e) => {
                setBrandOpen(true);
                // Alan el değmemiş hâldeyse (metin = seçili marka) tıklama
                // tümünü seçer; yazılan yeni metin eskisinin yerine geçer.
                if (brandQuery === brand) {
                  (e.target as HTMLInputElement).select();
                }
              }}
              onChange={(e) => {
                setBrandQuery(e.target.value);
                setBrandOpen(true);
                setBrandIdx(-1);
              }}
              onKeyDown={(e) => {
                // 0 = Markasız, 1..n = süzülen markalar
                const total = brandMatches.length + 1;
                if (e.key === "ArrowDown") {
                  e.preventDefault();
                  setBrandOpen(true);
                  setBrandIdx((i) => (i + 1) % total);
                } else if (e.key === "ArrowUp") {
                  e.preventDefault();
                  setBrandOpen(true);
                  setBrandIdx((i) => (i - 1 + total) % total);
                } else if (e.key === "Enter") {
                  e.preventDefault(); // form gönderimini engelle
                  if (brandOpen && brandIdx >= 0) {
                    applyBrand(brandIdx === 0 ? "" : brandMatches[brandIdx - 1].name);
                  } else if (brandOpen && brandFilter && brandMatches.length === 1) {
                    applyBrand(brandMatches[0].name); // tek eşleşme: direkt seç
                  } else {
                    commitBrandQuery();
                    setBrandOpen(false);
                  }
                } else if (e.key === "Escape") {
                  setBrandQuery(brand);
                  setBrandOpen(false);
                  setBrandIdx(-1);
                }
              }}
            />
            {brandOpen && (
              <div className={styles.comboMenu} id="p-brand-list" role="listbox">
                <button
                  type="button"
                  role="option"
                  aria-selected={brand === ""}
                  className={`${styles.comboItem}${brandIdx === 0 ? ` ${styles.comboItemActive}` : ""}`}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => applyBrand("")}
                >
                  Markasız
                </button>
                {brandMatches.map((b, i) => (
                  <button
                    key={b.name}
                    type="button"
                    role="option"
                    aria-selected={b.name === brand}
                    className={`${styles.comboItem}${brandIdx === i + 1 ? ` ${styles.comboItemActive}` : ""}`}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => applyBrand(b.name)}
                  >
                    <span>{b.name}</span>
                    {b.producer !== "" && (
                      <span className={styles.comboItemSub}>{b.producer}</span>
                    )}
                  </button>
                ))}
                {brandMatches.length === 0 && (
                  <p className={styles.comboEmpty}>
                    Eşleşen marka yok. Yeni marka için Markalar sayfasını kullan.
                  </p>
                )}
              </div>
            )}
          </div>
          <p className={styles.fieldHint}>
            Yazarak ara, listeden seç; üretici alanı otomatik dolar. Yeni marka
            eklemek için <Link href="/admin/markalar">Markalar</Link> sayfasını
            kullan.
          </p>
        </div>

        {/* Gram bazlı satışta gramaj anlamsız — gizlenir. */}
        {!byWeight && (
          <div className={styles.field}>
            <label className={styles.label} htmlFor="p-size">
              Gramaj (örn. 1 L, 350 g)
            </label>
            <input
              id="p-size"
              name="size_text"
              defaultValue={product.size_text}
              className={styles.input}
            />
          </div>
        )}

        <div className={styles.field}>
          <label className={styles.label} htmlFor="p-category">
            Kategori
          </label>
          <select
            id="p-category"
            name="category_slug"
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              setSubcategory(""); // kategori değişince alt kategori sıfırlanır
            }}
            className={styles.select}
          >
            {categories.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {subOptions.length > 0 && (
          <div className={styles.field}>
            <label className={styles.label} htmlFor="p-subcategory">
              Alt kategori
            </label>
            <select
              id="p-subcategory"
              name="subcategory_slug"
              value={subcategory}
              onChange={(e) => setSubcategory(e.target.value)}
              className={styles.select}
            >
              <option value="">Otomatik (ürün adına göre)</option>
              {subOptions.map((s) => (
                <option key={s.slug} value={s.slug}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Gram bazlıysa birim otomatik "kg" — seçime gerek yok. */}
        {!byWeight && (
          <div className={styles.field}>
            <label className={styles.label} htmlFor="p-unit">
              Birim
            </label>
            <select
              id="p-unit"
              name="unit"
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              className={styles.select}
            >
              {units.map((u) => (
                <option key={u} value={u}>
                  {u}
                </option>
              ))}
            </select>
          </div>
        )}

        {effectiveWeight ? (
          <>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="p-price">
                Kilogram fiyatı (₺/kg) *
              </label>
              <input
                id="p-price"
                name="price"
                required
                inputMode="decimal"
                value={kgPrice}
                onChange={(e) => onKgChange(e.target.value)}
                className={styles.input}
              />
            </div>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="p-packprice">
                {formatGrams(Math.round((parseNum(minKg) || 0) * 1000) || 0)} (en
                az) fiyatı (₺)
              </label>
              <input
                id="p-packprice"
                inputMode="decimal"
                value={packPrice}
                onChange={(e) => onPackChange(e.target.value)}
                className={styles.input}
              />
            </div>
          </>
        ) : (
          <div className={styles.field}>
            <label className={styles.label} htmlFor="p-price">
              Fiyat (TL) *
            </label>
            <input
              id="p-price"
              name="price"
              required
              inputMode="decimal"
              defaultValue={String(product.price)}
              className={styles.input}
            />
          </div>
        )}

        {/* Gram bazlı satış seçeneği yalnız Meyve & Sebze akışında (veya ürün
            hâlihazırda gram bazlıysa) gösterilir; şarküteri vb. paketli
            ürünlerin formu sadeleşir. */}
        {(category === "meyve-sebze" || byWeight) && (
          <div className={`${styles.field} ${styles.fieldFull}`}>
            <label className={styles.checkLabel}>
              <input
                type="checkbox"
                name="sold_by_weight"
                checked={byWeight}
                onChange={(e) => setByWeight(e.target.checked)}
              />
              Gram bazlı sat (kilogram fiyatı): müşteri kaç gram istediğini
              seçer, fiyat kg üzerinden hesaplanır. Not: Meyve &amp; Sebze
              kategorisindeki birimi &quot;kg&quot; olan ürünler zaten otomatik
              gram bazlıdır.
            </label>
          </div>
        )}

        {/* Gram satış ölçeği — yalnız gram bazlı ürünlerde. Karpuz/kavun gibi
            iri ürünlerde en az 5 kg, 1 kg adım gibi seçim sağlar. */}
        {effectiveWeight && (
          <div className={`${styles.fieldFull} ${styles.editFormGrid}`}>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="p-wmin">
                En az miktar (kg)
              </label>
              <input
                id="p-wmin"
                name="weight_min_kg"
                inputMode="decimal"
                value={minKg}
                onChange={(e) => onMinChange(e.target.value)}
                className={styles.input}
              />
            </div>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="p-wstep">
                Adım (kg)
              </label>
              <input
                id="p-wstep"
                name="weight_step_kg"
                inputMode="decimal"
                defaultValue={gramsToKgText(product.weight_step_grams)}
                className={styles.input}
              />
            </div>
            <p
              className={styles.fieldFull}
              style={{ margin: 0, fontSize: 12.5, color: "var(--gray-600,#555)" }}
            >
              Müşteri hazır seçenekleri: en az miktardan başlayıp adım kadar artan
              4 değer. Fiyat <b>kilogram</b> başınadır. Örnekler: karpuz için en az{" "}
              <b>5</b> / adım <b>1</b> → 5, 6, 7, 8 kg · ahududu için <b>0.125</b> /{" "}
              <b>0.125</b> → 125, 250, 375, 500 g · normal meyve-sebze <b>0.25</b> /{" "}
              <b>0.25</b>.
            </p>
          </div>
        )}

        <div className={styles.field}>
          <label className={styles.label} htmlFor="p-compare">
            Eski fiyat (indirim için, boş bırakılabilir)
          </label>
          <input
            id="p-compare"
            name="compare_at_price"
            inputMode="decimal"
            defaultValue={
              product.compare_at_price !== null
                ? String(product.compare_at_price)
                : ""
            }
            className={styles.input}
          />
        </div>

        <div className={`${styles.field} ${styles.fieldFull}`}>
          <label className={styles.label} htmlFor="p-desc">
            Açıklama
          </label>
          <textarea
            id="p-desc"
            name="description"
            rows={3}
            defaultValue={product.description}
            className={styles.textarea}
          />
        </div>

        {/* Etiket bilgileri — meyve-sebze DIŞINDAKİ kategorilerde (şarküteri
            vb. paketli ürünler). Ürün detayında "Ürün Bilgileri / Besin
            Değerleri" sekmelerini besler; boş bırakılan alan gösterilmez. */}
        {category !== "meyve-sebze" && (
          <div className={`${styles.fieldFull} ${styles.editFormGrid}`}>
            <input type="hidden" name="details_present" value="1" />
            <div className={styles.fieldFull}>
              <label className={styles.label}>
                Etiket bilgileri (ürün sayfasında &quot;Ürün Bilgileri&quot;
                sekmesi)
              </label>
            </div>
            <div className={`${styles.field} ${styles.fieldFull}`}>
              <label className={styles.label} htmlFor="p-det-icindekiler">
                İçindekiler
              </label>
              <textarea
                id="p-det-icindekiler"
                name="det_icindekiler"
                rows={2}
                defaultValue={product.details?.icindekiler ?? ""}
                className={styles.textarea}
                placeholder="Dana eti ve yağı, baharat karışımı, tuz, sarımsak..."
              />
            </div>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="p-det-net">
                Net miktar (g/ml)
              </label>
              <input
                id="p-det-net"
                name="det_net_miktar"
                defaultValue={product.details?.net_miktar ?? ""}
                className={styles.input}
                placeholder="250 g"
              />
            </div>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="p-det-saklama">
                Saklama koşulları
              </label>
              <input
                id="p-det-saklama"
                name="det_saklama"
                defaultValue={product.details?.saklama ?? ""}
                className={styles.input}
                placeholder="0-4 °C'de muhafaza ediniz"
              />
            </div>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="p-det-mensei">
                Menşei
              </label>
              <input
                id="p-det-mensei"
                name="det_mensei"
                defaultValue={product.details?.mensei ?? ""}
                className={styles.input}
                placeholder="Türkiye"
              />
            </div>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="p-det-uretici">
                Üretici / işletmeci
              </label>
              <input
                id="p-det-uretici"
                name="det_uretici"
                value={uretici}
                onChange={(e) => {
                  setUretici(e.target.value);
                  setUreticiAuto(false); // elle düzenlendi; artık otomatik ezilmez
                }}
                className={styles.input}
                placeholder="Marka seçilince otomatik dolar; elle de düzenlenebilir"
              />
            </div>
            <div className={styles.fieldFull}>
              <label className={styles.label}>
                Besin değerleri (100 g/ml için; boş bırakılan satır müşteriye
                gösterilmez)
              </label>
            </div>
            {(
              [
                ["det_kcal", "Enerji (kcal)", product.details?.besin100?.enerji_kcal],
                ["det_kj", "Enerji (kJ)", product.details?.besin100?.enerji_kj],
                ["det_yag", "Yağ (g)", product.details?.besin100?.yag_g],
                ["det_doymus", "Doymuş yağ (g)", product.details?.besin100?.doymus_yag_g],
                ["det_karb", "Karbonhidrat (g)", product.details?.besin100?.karbonhidrat_g],
                ["det_seker", "Şeker (g)", product.details?.besin100?.seker_g],
                ["det_protein", "Protein (g)", product.details?.besin100?.protein_g],
                ["det_tuz", "Tuz (g)", product.details?.besin100?.tuz_g],
              ] as const
            ).map(([name, label, value]) => (
              <div className={styles.field} key={name}>
                <label className={styles.label} htmlFor={`p-${name}`}>
                  {label}
                </label>
                <input
                  id={`p-${name}`}
                  name={name}
                  inputMode="decimal"
                  defaultValue={value !== null && value !== undefined ? String(value) : ""}
                  className={styles.input}
                />
              </div>
            ))}
          </div>
        )}

        <div className={`${styles.fieldFull} ${styles.checksRow}`}>
          <label className={styles.checkLabel}>
            <input
              type="checkbox"
              name="in_stock"
              defaultChecked={product.in_stock}
            />
            Stokta
          </label>
          <label className={styles.checkLabel}>
            <input
              type="checkbox"
              name="is_active"
              defaultChecked={product.is_active}
            />
            Aktif (vitrinde görünür)
          </label>
          <label className={styles.checkLabel}>
            <input
              type="checkbox"
              name="is_featured"
              defaultChecked={product.is_featured}
            />
            Öne çıkan
          </label>
        </div>
      </div>

      <div className={styles.formFoot}>
        <button
          type="submit"
          className={`${styles.actionBtn} ${styles["actionBtn--primary"]}`}
        >
          Kaydet
        </button>
        <Link href="/admin/urunler" className={styles.actionBtn}>
          Vazgeç
        </Link>
      </div>
    </form>
  );
}
