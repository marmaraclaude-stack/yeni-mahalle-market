// Giriş / Kayıt ortak kabuğu: nav altında EKRAN GENİŞLİĞİNCE full-bleed split.
// Sol yarı: koyu gradient marka paneli (değer cümlesi + 2x2 glass istatistik
// kartları + dekoratif kategori çipleri + Google sosyal kanıt satırı;
// logo nav'da zaten var), viewport yüksekliğini doldurur ve sticky kalır.
// Sağ yarı: beyaz form alanı; form içeriği ortalanmış, max 440px iç genişlik.
// Mobil: üstte ince koyu marka bandı (tek cümle), altta tam genişlik form.

import type { ReactNode } from "react";
import {
  Banknote,
  Beef,
  Bike,
  Candy,
  Carrot,
  Cookie,
  Croissant,
  CupSoda,
  Droplets,
  Milk,
  ShoppingBasket,
  Star,
} from "lucide-react";
import { CATEGORY_TINTS, SHOP_CATEGORIES } from "@/lib/shop/categories";
import { REVIEW_STATS } from "@/lib/reviews";
import styles from "./auth.module.css";

// 2x2 mini glass kart grid'i (değer önerileri; sayılar gerçek veriden)
const STATS = [
  { icon: Bike, text: "30 dk'da kapında" },
  { icon: ShoppingBasket, text: "280+ ürün" },
  { icon: Banknote, text: "Kapıda ödeme" },
  { icon: Star, text: "4,2 Google puanı" },
] as const;

// Dekoratif kategori çipleri: SHOP_CATEGORIES'ten 8 kategori (tüm tint'ler
// birer kez); lucide bileşenleri elle eşlendi (icon alanı kebab-case string).
const CHIP_ICONS: Record<string, typeof Carrot> = {
  "meyve-sebze": Carrot,
  "sarkuteri-et": Beef,
  "ekmek-firin": Croissant,
  "sut-kahvaltilik": Milk,
  "icecek-su": CupSoda,
  "atistirmalik": Cookie,
  "cikolata-sekerleme": Candy,
  "yag-sos-baharat": Droplets,
};
const CHIP_CATEGORIES = SHOP_CATEGORIES.filter((c) => c.slug in CHIP_ICONS);

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

        <ul className={styles.statGrid}>
          {STATS.map(({ icon: Icon, text }) => (
            <li key={text} className={styles.statCard}>
              <span className={styles.statIcon}>
                <Icon aria-hidden="true" />
              </span>
              {text}
            </li>
          ))}
        </ul>

        {/* Dekoratif kategori şeridi: ürün çeşitliliğini sezdirir */}
        <div className={styles.chipStrip} aria-hidden="true">
          {CHIP_CATEGORIES.map((cat) => {
            const Icon = CHIP_ICONS[cat.slug];
            const [bg, fg] = CATEGORY_TINTS[cat.tint];
            return (
              <span
                key={cat.slug}
                className={styles.chip}
                style={{ background: bg, color: fg }}
                title={cat.name}
              >
                <Icon />
              </span>
            );
          })}
        </div>

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
