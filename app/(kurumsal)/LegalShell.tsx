// Yasal sayfa kabuğu: başlık şeridi + solda yapışkan "Bu sayfada" gezinmesi,
// sağda tam genişlik içerik. Dört sözleşme/politika sayfası bunu paylaşır;
// bölüm id'leri TOC linkleriyle eşleşmelidir (h2 id="...").

import Link from "next/link";
import { FileText } from "lucide-react";
import styles from "./kurumsal.module.css";

export interface TocItem {
  id: string;
  label: string;
}

/** Sayfalar arası çapraz linkler: aktif sayfa listeden gizlenir. */
const LEGAL_LINKS = [
  { href: "/teslimat-ve-iade", label: "Teslimat ve İade Şartları" },
  { href: "/gizlilik-politikasi", label: "Gizlilik ve KVKK" },
  { href: "/mesafeli-satis-sozlesmesi", label: "Mesafeli Satış Sözleşmesi" },
  { href: "/on-bilgilendirme-formu", label: "Ön Bilgilendirme Formu" },
];

export default function LegalShell({
  title,
  sub,
  updated,
  current,
  toc,
  children,
}: {
  title: string;
  sub: string;
  updated: string;
  /** Aktif sayfanın yolu: çapraz linklerden çıkarılır. */
  current: string;
  toc: TocItem[];
  children: React.ReactNode;
}) {
  return (
    <main className={styles.page}>
      <div className="container">
        <header className={styles.head}>
          <h1 className={styles.title}>{title}</h1>
          <p className={styles.sub}>{sub}</p>
          <span className={styles.updated}>Son güncelleme: {updated}</span>
        </header>

        <div className={styles.legalGrid}>
          <aside className={styles.toc} aria-label="Sayfa içi gezinme">
            <nav className={styles.tocCard}>
              <span className={styles.tocTitle}>Bu sayfada</span>
              <ul className={styles.tocList}>
                {toc.map((t) => (
                  <li key={t.id}>
                    <a href={`#${t.id}`}>{t.label}</a>
                  </li>
                ))}
              </ul>
            </nav>
            <nav className={styles.tocCard} aria-label="Diğer yasal sayfalar">
              <span className={styles.tocTitle}>Diğer sayfalar</span>
              <ul className={`${styles.tocList} ${styles.tocListLinks}`}>
                {LEGAL_LINKS.filter((l) => l.href !== current).map((l) => (
                  <li key={l.href}>
                    <Link href={l.href}>
                      <FileText size={13} aria-hidden="true" /> {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            <div className={styles.tocPay}>
              <img
                src="/odeme/logo-band-colored.svg"
                alt="iyzico ile Öde · Mastercard · Visa · American Express · Troy"
                width={429}
                height={32}
                loading="lazy"
              />
            </div>
          </aside>

          <div className={styles.body}>{children}</div>
        </div>
      </div>
    </main>
  );
}
