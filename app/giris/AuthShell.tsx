// Giriş / Kayıt ortak kabuğu: nav altında EKRAN GENİŞLİĞİNCE full-bleed split.
// Sol yarı: koyu gradient marka paneli (değer cümlesi + 3 madde +
// Google sosyal kanıt satırı; logo nav'da zaten var), viewport yüksekliğini
// doldurur ve sticky kalır.
// Sağ yarı: beyaz form alanı; form içeriği ortalanmış, max 440px iç genişlik.
// Mobil: üstte ince koyu marka bandı (tek cümle), altta tam genişlik form.

import type { ReactNode } from "react";
import { Leaf, ShieldCheck, Star, Truck } from "lucide-react";
import { REVIEW_STATS } from "@/lib/reviews";
import styles from "./auth.module.css";

const VALUES = [
  { icon: Leaf, text: "Her gün taze ürünler" },
  { icon: Truck, text: "Mahallene hızlı teslimat" },
  { icon: ShieldCheck, text: "Güvenli ödeme seçenekleri" },
] as const;

export default function AuthShell({ children }: { children: ReactNode }) {
  return (
    <main className={styles.page}>
      <aside className={styles.brandPanel} aria-label="Yeni Mahalle Market">
        <div className={styles.brandCenter}>
          <p className={styles.brandValue}>
            Mahallenin marketi, kapına kadar.
          </p>
          <p className={styles.brandTagline}>
            Sapanca içi siparişin 30 dakika içinde kapında.
          </p>
        </div>

        <ul className={styles.valueList}>
          {VALUES.map(({ icon: Icon, text }) => (
            <li key={text} className={styles.valueItem}>
              <span className={styles.valueIcon}>
                <Icon aria-hidden="true" />
              </span>
              {text}
            </li>
          ))}
        </ul>

        <p className={styles.proofRow}>
          {/* 4,2 puan: 4 dolu + 1 soluk yıldız (5 dolu yıldız yanıltıcı olur) */}
          <span className={styles.proofStars} aria-hidden="true">
            {[0, 1, 2, 3, 4].map((i) => (
              <Star
                key={i}
                className={
                  i < Math.round(REVIEW_STATS.average)
                    ? undefined
                    : styles.proofStarDim
                }
              />
            ))}
          </span>
          Google&apos;da {REVIEW_STATS.average.toLocaleString("tr-TR")} ·{" "}
          {REVIEW_STATS.count} yorum
        </p>
      </aside>

      <div className={styles.formPanel}>
        <div className={styles.formInner}>{children}</div>
      </div>
    </main>
  );
}
