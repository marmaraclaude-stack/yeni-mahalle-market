// Hakkımızda (/hakkimizda): iyzico satıcı kriteri + tanıtım sayfası.
// Bento grid düzeni: editorial başlık, eşit yükseklikli fotoğraf/bilgi
// karoları, hikaye bölümü ve koyu işletme paneli (resmi bilgiler +
// sözleşme linkleri + beyaz logo bandı). Tipografi ve butonlar global.

import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowUpRight,
  BedDouble,
  Bike,
  Clock,
  Leaf,
  Package,
  Phone,
  ShieldCheck,
  ShoppingBasket,
} from "lucide-react";
import { BUSINESS } from "@/lib/business";
import styles from "./hakkimizda.module.css";

export const metadata: Metadata = {
  title: "Hakkımızda",
  description:
    "Yeni Mahalle Market: Sapanca'nın mahalle marketi. Taze meyve sebze, şarküteri ve tüm market ihtiyaçları, kendi kuryemizle adrese teslim. Bizi tanıyın.",
  alternates: { canonical: "/hakkimizda" },
};

const LEGAL_PAGES = [
  ["/teslimat-ve-iade", "Teslimat ve İade Şartları"],
  ["/gizlilik-politikasi", "Gizlilik ve KVKK"],
  ["/mesafeli-satis-sozlesmesi", "Mesafeli Satış Sözleşmesi"],
  ["/on-bilgilendirme-formu", "Ön Bilgilendirme Formu"],
] as const;

export default function HakkimizdaPage() {
  const legal = BUSINESS.legal;
  return (
    <main className={styles.page}>
      <div className="container">
        {/* ===== Editorial başlık ===== */}
        <header className={styles.head}>
          <h1 className={styles.title}>
            Sapanca&apos;nın mahalle marketi
          </h1>
          <p className={styles.lead}>
            {BUSINESS.name}, Yeni Mahalle&apos;de hizmet veren bir mahalle
            marketidir. Tezgâhtan özenle toplar, kendi kuryemizle kapınıza
            getiririz.
          </p>
        </header>

        {/* ===== Bento grid ===== */}
        <section className={styles.bento} aria-label="Marketimizden kareler ve rakamlar">
          {/* Büyük fotoğraf: manav */}
          <div className={`${styles.tile} ${styles.tilePhoto} ${styles.tileTall}`}>
            <img
              src="/carousel/carousel-4.png"
              alt="Manav reyonu: çilek, kavun ve taze sebzeler"
              width={1448}
              height={1086}
            />
            <span className={styles.photoTag}>
              <Leaf size={14} aria-hidden="true" /> Taze meyve &amp; sebze
            </span>
          </div>

          {/* Fotoğraf: bisküvi/atıştırmalık duvarı */}
          <div className={`${styles.tile} ${styles.tilePhoto}`}>
            <img
              src="/carousel/carousel-6.png"
              alt="Atıştırmalık ve bisküvi rafları"
              width={1448}
              height={1086}
              loading="lazy"
            />
            <span className={styles.photoTag}>
              <ShoppingBasket size={14} aria-hidden="true" /> Geniş ürün çeşidi
            </span>
          </div>

          <div className={styles.tile} style={{ "--glyph": "#2f6fed" } as React.CSSProperties}>
            <span className={styles.tileGlyph} aria-hidden="true">
              <Bike />
            </span>
            <span className={styles.tileNum}>30-60 dk</span>
            <span className={styles.tileSub}>
              Kendi kuryemizle kapınızda, kargo yok
            </span>
          </div>

          <div className={styles.tile} style={{ "--glyph": "#0e93a8" } as React.CSSProperties}>
            <span className={styles.tileGlyph} aria-hidden="true">
              <Clock />
            </span>
            <span className={styles.tileNum}>07:30-02:00</span>
            <span className={styles.tileSub}>
              Haftanın 7 günü, bayramlar dahil açığız
            </span>
          </div>

          {/* Fotoğraf: kuruyemiş */}
          <div className={`${styles.tile} ${styles.tilePhoto}`}>
            <img
              src="/carousel/carousel-2.png"
              alt="Kuruyemiş reyonu"
              width={1434}
              height={1086}
              loading="lazy"
            />
            <span className={styles.photoTag}>
              <ShoppingBasket size={14} aria-hidden="true" /> Dolu raflar
            </span>
          </div>

          <div
            className={`${styles.tile} ${styles.tileWide}`}
            style={{ "--glyph": "#159b57" } as React.CSSProperties}
          >
            <span className={styles.tileGlyph} aria-hidden="true">
              <BedDouble />
            </span>
            <span className={styles.tileLabel}>
              Otel, bungalov ve sitelere teslimat
            </span>
            <span className={styles.tileSub}>
              Tatildeyseniz tesisinizi listeden seçin. Kuryemiz kapınıza ya da
              resepsiyona kadar gelir.
            </span>
          </div>

          {/* Fotoğraf: plaj/sezonluk reyonu */}
          <div className={`${styles.tile} ${styles.tilePhoto}`}>
            <img
              src="/carousel/carousel-3.png"
              alt="Plaj ürünleri, şarj aletleri ve sezonluk ihtiyaç reyonu"
              width={1448}
              height={1086}
              loading="lazy"
            />
            <span className={styles.photoTag}>
              <Package size={14} aria-hidden="true" /> Tüm ihtiyaçlarınız
            </span>
          </div>

          <div className={styles.tile} style={{ "--glyph": "#cf8910" } as React.CSSProperties}>
            <span className={styles.tileGlyph} aria-hidden="true">
              <ShieldCheck />
            </span>
            <span className={styles.tileLabel}>Güvenli ödeme</span>
            <span className={styles.tileSub}>
              Kapıda veya online, iyzico ve 3D Secure korumalı
            </span>
          </div>
        </section>

        {/* ===== Hikaye ===== */}
        <section className={styles.story} aria-labelledby="hikaye-baslik">
          <div className={styles.storyPhoto}>
            <img
              src="/carousel/carousel-1.png"
              alt="Market içi: atıştırmalık ve temel gıda rafları"
              width={1448}
              height={1086}
              loading="lazy"
            />
          </div>
          <div className={styles.storyBody}>
            <h2 id="hikaye-baslik">
              Mahalle esnafı samimiyetiyle çalışıyoruz
            </h2>
            <p>
              <strong>{BUSINESS.name}</strong>, Sapanca&apos;nın Yeni
              Mahalle&apos;sinde günlük tüm market ihtiyaçlarını tek çatı
              altında toplar. Meyve sebze tezgâhımız her gün yenilenir.
              Şarküteriden kahvaltılığa, temizlikten kişisel bakıma aradığınız
              her şey raflarımızdadır.
            </p>
            <p>
              Sapanca her mevsim misafir ağırlayan bir tatil beldesi. Bu
              yüzden yalnızca mahallelimize değil, çevredeki otel, apart,
              bungalov ve sitelerde konaklayan misafirlerimize de kendi
              kuryemizle hizmet veriyoruz.
            </p>
            <p>
              Telefonun ucunda her zaman <strong>gerçek bir komşunuz</strong>{" "}
              vardır. Siparişinize en tazesini elimizle seçer, soğuk zinciri
              koruyarak paketler, kapınıza kadar getiririz.
            </p>
          </div>
        </section>

        {/* ===== Koyu işletme paneli ===== */}
        <section className={styles.panel} aria-labelledby="isletme-baslik">
          <div className={styles.panelIntro}>
            <h2 id="isletme-baslik">Şeffaf bir işletmeyiz</h2>
            <p>
              Resmi bilgilerimiz ve alışveriş koşullarımız her zaman açık.
              Online ödemeler iyzico altyapısıyla, SSL ve 3D Secure
              korumasıyla alınır. Kart bilgileriniz sitemizde saklanmaz.
            </p>
            <div className={styles.panelCtas}>
              <Link href="/urunler" className="btn btn--accent btn--lg">
                Alışverişe Başla
              </Link>
              <a href={BUSINESS.phone.href} className="btn btn--ghost btn--lg">
                <Phone size={16} strokeWidth={2} aria-hidden="true" />
                {BUSINESS.phone.display}
              </a>
            </div>
            <div className={styles.panelBand}>
              <img
                src="/odeme/logo-band-colored.svg"
                alt="iyzico ile Öde · Mastercard · Visa · American Express · Troy"
                width={429}
                height={32}
                loading="lazy"
              />
            </div>
          </div>

          <div className={styles.panelInfo}>
            <span className={styles.panelColTitle}>İşletme bilgileri</span>
            <dl>
              <div>
                <dt>Unvan / İşletme sahibi</dt>
                <dd>
                  {BUSINESS.legalName}
                  {legal.ownerName ? ` · ${legal.ownerName}` : ""}
                </dd>
              </div>
              <div>
                <dt>Merkez adresi</dt>
                <dd>{legal.address || BUSINESS.address.full}</dd>
              </div>
              <div>
                <dt>Telefon / E-posta</dt>
                <dd>
                  <a href={BUSINESS.phone.href}>{BUSINESS.phone.display}</a>
                  {legal.email ? (
                    <>
                      {" · "}
                      <a href={`mailto:${legal.email}`}>{legal.email}</a>
                    </>
                  ) : null}
                </dd>
              </div>
              {legal.taxOffice && legal.taxNo ? (
                <div>
                  <dt>Vergi dairesi / no</dt>
                  <dd>
                    {legal.taxOffice} / {legal.taxNo}
                  </dd>
                </div>
              ) : null}
            </dl>
          </div>

          <nav className={styles.panelLinks} aria-label="Sözleşmeler ve politikalar">
            <span className={styles.panelColTitle}>
              Sözleşmeler ve politikalar
            </span>
            {LEGAL_PAGES.map(([href, label]) => (
              <Link key={href} href={href} className={styles.panelLink}>
                <ArrowUpRight size={15} aria-hidden="true" />
                {label}
              </Link>
            ))}
          </nav>
        </section>
      </div>
    </main>
  );
}
