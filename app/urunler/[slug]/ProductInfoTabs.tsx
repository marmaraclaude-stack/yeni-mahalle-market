"use client";

// Ürün bilgi sekmeleri — Migros sanal market yapısında: "Ürün Bilgileri"
// (İçindekiler, Net Miktar, Saklama Koşulları, Menşei, Üretici + künye) ve
// varsa "Besin Değerleri" (100 g/ml tablosu). details boş alanları gizler;
// hiç detay yoksa yalnız künye satırları gösterilir (tek sekme).

import { useState } from "react";
import type { ProductDetails, ProductNutrition } from "@/lib/shop/types";
import styles from "./urun.module.css";

interface Spec {
  label: string;
  value: string;
}

const NUTRITION_ROWS: { key: keyof ProductNutrition; label: string }[] = [
  { key: "enerji_kcal", label: "Enerji (kcal)" },
  { key: "enerji_kj", label: "Enerji (kJ)" },
  { key: "yag_g", label: "Yağ (g)" },
  { key: "doymus_yag_g", label: "Doymuş yağ (g)" },
  { key: "karbonhidrat_g", label: "Karbonhidrat (g)" },
  { key: "seker_g", label: "Şeker (g)" },
  { key: "protein_g", label: "Protein (g)" },
  { key: "tuz_g", label: "Tuz (g)" },
];

/** Sayıyı Türkçe biçimde yaz (440 → "440", 0.5 → "0,5"). */
function num(v: number): string {
  return v.toLocaleString("tr-TR", { maximumFractionDigits: 2 });
}

export default function ProductInfoTabs({
  description,
  details,
  specs,
  per100Label = "100 g / ml",
}: {
  description: string;
  details: ProductDetails | null;
  specs: Spec[];
  /** Besin tablosu birim başlığı: içecekte "100 ml", gıdada "100 g". */
  per100Label?: string;
}) {
  // Etiket alanları: [başlık, değer] — boşlar atlanır.
  const labelRows: Spec[] = [];
  if (details?.icindekiler)
    labelRows.push({ label: "İçindekiler", value: details.icindekiler });
  if (details?.net_miktar)
    labelRows.push({ label: "Net Miktar (g/ml)", value: details.net_miktar });
  if (details?.saklama)
    labelRows.push({ label: "Saklama Koşulları", value: details.saklama });
  if (details?.mensei)
    labelRows.push({ label: "Menşei", value: details.mensei });
  if (details?.uretici)
    labelRows.push({
      label: "İşletmeci / Üretici / İthalatçı / Dağıtıcı",
      value: details.uretici,
    });

  const besin = details?.besin100 ?? null;
  const nutritionRows = besin
    ? NUTRITION_ROWS.filter(
        (r) => besin[r.key] !== null && besin[r.key] !== undefined,
      )
    : [];
  const hasNutrition = nutritionRows.length > 0;

  const TABS = [
    { id: "bilgi", label: "Ürün Bilgileri" },
    ...(hasNutrition ? [{ id: "besin", label: "Besin Değerleri" }] : []),
  ];
  const [tab, setTab] = useState(TABS[0].id);

  return (
    <section className={styles.descCard} aria-label="Ürün hakkında">
      {TABS.length > 1 ? (
        <div className={styles.tabBar} role="tablist" aria-label="Ürün bilgisi sekmeleri">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={tab === t.id}
              className={`${styles.tabBtn}${tab === t.id ? ` ${styles.tabBtnActive}` : ""}`}
              onClick={() => setTab(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>
      ) : (
        <h2 className={styles.descHead}>Ürün Bilgileri</h2>
      )}

      {tab === "bilgi" && (
        <div role="tabpanel" aria-label="Ürün bilgileri">
          {description && <p className={styles.descText}>{description}</p>}

          {labelRows.length > 0 && (
            <dl className={styles.labelList}>
              {labelRows.map((row) => (
                <div key={row.label} className={styles.labelRow}>
                  <dt className={styles.labelKey}>{row.label}</dt>
                  <dd className={styles.labelVal}>{row.value}</dd>
                </div>
              ))}
            </dl>
          )}

          {specs.length > 0 && (
            <dl className={styles.specs}>
              {specs.map((spec) => (
                <div key={spec.label} className={styles.specRow}>
                  <dt className={styles.specLabel}>{spec.label}</dt>
                  <dd className={styles.specValue}>{spec.value}</dd>
                </div>
              ))}
            </dl>
          )}
        </div>
      )}

      {tab === "besin" && besin && (
        <div role="tabpanel" aria-label="Besin değerleri">
          <table className={styles.nutriTable}>
            <thead>
              <tr>
                <th scope="col">Besin Değeri</th>
                <th scope="col">{per100Label}</th>
              </tr>
            </thead>
            <tbody>
              {nutritionRows.map((r) => (
                <tr key={r.key}>
                  <td>{r.label}</td>
                  <td>{num(besin[r.key] as number)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className={styles.nutriNote}>
            Etiket bilgileri üretici beyanına dayanır; güncel bilgi için ürün
            ambalajını kontrol ediniz.
          </p>
        </div>
      )}
    </section>
  );
}
