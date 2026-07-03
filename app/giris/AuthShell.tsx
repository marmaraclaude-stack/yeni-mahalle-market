// Giriş / Kayıt ortak kabuğu: >=960px iki panelli kart.
// Sol: gradient marka paneli (logo + büyük değer cümlesi + 3 madde +
// Google sosyal kanıt satırı), sağ: form (children).
// Mobilde marka paneli üstte KISA bant olarak kalır (logo + tek cümle).

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
      <div className={`container ${styles.shell}`}>
        <div className={styles.authCard}>
          <aside className={styles.brandPanel} aria-label="Yeni Mahalle Market">
            <div className={styles.brandHead}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/logo.png"
                alt=""
                width={44}
                height={44}
                className={styles.brandLogo}
              />
              <span className={styles.brandName}>Yeni Mahalle Market</span>
            </div>

            <div className={styles.brandCenter}>
              <p className={styles.brandValue}>
                Mahallenin marketi, kapına kadar.
              </p>
              <p className={styles.brandTagline}>
                Siparişini ver, taze ürünler aynı gün kapında olsun.
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
              <span className={styles.proofStars} aria-hidden="true">
                {[0, 1, 2, 3, 4].map((i) => (
                  <Star key={i} />
                ))}
              </span>
              Google&apos;da {REVIEW_STATS.average.toLocaleString("tr-TR")} ·{" "}
              {REVIEW_STATS.count} yorum
            </p>
          </aside>

          <div className={styles.formPanel}>{children}</div>
        </div>
      </div>
    </main>
  );
}
