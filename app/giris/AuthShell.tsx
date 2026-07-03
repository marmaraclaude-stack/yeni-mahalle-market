// Giriş / Kayıt ortak kabuğu: >=960px iki panelli kart.
// Sol: koyu marka paneli (logo + değer önerileri), sağ: form (children).
// Mobilde yalnız form paneli görünür.

import type { ReactNode } from "react";
import { Leaf, ShieldCheck, Truck } from "lucide-react";
import styles from "./auth.module.css";

const VALUES = [
  { icon: Leaf, text: "Her gün taze ürünler" },
  { icon: Truck, text: "Mahallene hızlı teslimat" },
  { icon: ShieldCheck, text: "Güvenli ödeme seçenekleri" },
] as const;

export default function AuthShell({ children }: { children: ReactNode }) {
  return (
    <main className={styles.page}>
      <div className={styles.shell}>
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
            <p className={styles.brandTagline}>
              Mahallenin marketi artık online. Siparişini ver, kapına
              getirelim.
            </p>
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
          </aside>

          <div className={styles.formPanel}>{children}</div>
        </div>
      </div>
    </main>
  );
}
