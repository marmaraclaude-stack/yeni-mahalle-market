// Hakkımızda (/hakkimizda): iyzico satıcı kriteri + tanıtım sayfası.
// Ana sayfanın tasarım diliyle kurulur: global hero + stat-card filigran
// kartları, Apple-tarzı features satırları (kart içi liste panelleriyle),
// işletme bilgileri ve yasal sayfa bağlantıları, kapanışta standart CTA.

import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Banknote,
  BedDouble,
  Bike,
  Building2,
  Check,
  Clock,
  ConciergeBell,
  CreditCard,
  FileText,
  MapPin,
  Phone,
  ShieldCheck,
  ShoppingBasket,
  Tent,
} from "lucide-react";
import { BUSINESS } from "@/lib/business";
import StatusIndicator from "@/components/StatusIndicator";
import SellerInfoBox from "../SellerInfoBox";
import styles from "./hakkimizda.module.css";

export const metadata: Metadata = {
  title: "Hakkımızda",
  description:
    "Yeni Mahalle Market: Sapanca Yeni Mahalle'nin bakkalı. Taze meyve sebze, şarküteri ve tüm market ihtiyaçları, kendi kuryemizle adrese teslim. Bizi tanıyın.",
  alternates: { canonical: "/hakkimizda" },
};

export default function HakkimizdaPage() {
  return (
    <main>
      {/* ===== HERO: ana sayfa dokusu, ortalı metin + stat kartları ===== */}
      <section className="hero" aria-labelledby="hakkimizda-title">
        <div className="container">
          <div className={styles.heroInner}>
            <StatusIndicator />
            <h1 id="hakkimizda-title" className="hero__title">
              Mahallenin bakkalı,{" "}
              <span className="hero__title-accent">esnaf samimiyeti.</span>
            </h1>
            <p className="hero__sub">
              {BUSINESS.name}, Sapanca Yeni Mahalle&apos;de hizmet veren bir
              mahalle marketidir. Tezgâhtan özenle toplar, kendi kuryemizle
              kapınıza getiririz.
            </p>
            <div className="hero__ctas">
              <Link href="/urunler" className="btn btn--accent btn--lg">
                Alışverişe Başla
              </Link>
              <a href={BUSINESS.phone.href} className="btn btn--ghost btn--lg">
                <Phone size={16} strokeWidth={2} aria-hidden="true" />
                {BUSINESS.phone.display}
              </a>
            </div>
          </div>

          <div className="hero__stats" aria-label="Rakamlarla marketimiz">
            <div className="stat-card" style={{ "--glyph": "#2f6fed" } as React.CSSProperties}>
              <span className="stat-card__glyph" aria-hidden="true">
                <Bike />
              </span>
              <div className="stat-card__num">30-60 dk</div>
              <div className="stat-card__label">Kendi kuryemizle teslim</div>
            </div>
            <div className="stat-card" style={{ "--glyph": "#0e93a8" } as React.CSSProperties}>
              <span className="stat-card__glyph" aria-hidden="true">
                <Clock />
              </span>
              <div className="stat-card__num">07:30 - 02:00</div>
              <div className="stat-card__label">Bayram dahil her gün açık</div>
            </div>
            <div className="stat-card" style={{ "--glyph": "#159b57" } as React.CSSProperties}>
              <span className="stat-card__glyph" aria-hidden="true">
                <ShoppingBasket />
              </span>
              <div className="stat-card__num">2.500+</div>
              <div className="stat-card__label">Ürün çeşidi</div>
            </div>
            <div className="stat-card" style={{ "--glyph": "#cf8910" } as React.CSSProperties}>
              <span className="stat-card__glyph" aria-hidden="true">
                <MapPin />
              </span>
              <div className="stat-card__num">5 bölge</div>
              <div className="stat-card__label">
                Sapanca, Kırkpınar, Maşukiye ve çevresi
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FEATURES: Apple-tarzı split satırlar ===== */}
      <section className="section" aria-label="Bizi tanıyın">
        <div className="container">
          {/* Satır 1: hikaye + neler sunuyoruz paneli */}
          <div className="features__row">
            <div className="features__copy">
              <h2 className="features__h">Tezgâhtan kapınıza, her gün taze.</h2>
              <p className="features__p">
                Meyve sebze tezgâhımız her gün yenilenir. Gramajlı satışla 250
                gramdan dilediğiniz miktara kadar sipariş verirsiniz. Telefonun
                ucunda her zaman gerçek bir komşunuz vardır. Siparişinize en
                tazesini elimizle seçer, beğenmediğiniz ürünü sormadan
                değiştiririz.
              </p>
              <p className="features__p">
                Şarküteriden kahvaltılığa, temizlikten kişisel bakıma günlük
                tüm market ihtiyaçlarınız tek çatı altında.
              </p>
            </div>
            <div className="features__visual">
              <div className={styles.panelWrap}>
                <span className={styles.panelTitle}>Neler sunuyoruz?</span>
                {[
                  ["Her gün yenilenen meyve sebze tezgâhı", "Gramajlı satışla ihtiyacınız kadar"],
                  ["Şarküteri, kahvaltılık ve günlük ürünler", "2.500'den fazla çeşit"],
                  ["Soğuk zincire uygun paketleme", "Hassas ürünler en sona paketlenir"],
                  ["Koşulsuz değişim", "Beğenmediğiniz ürünü sormadan değiştiririz"],
                ].map(([label, sub]) => (
                  <div key={label} className={styles.panelRow}>
                    <span className={styles.panelIcon} aria-hidden="true">
                      <Check size={19} strokeWidth={2.4} />
                    </span>
                    <span className={styles.panelText}>
                      <span className={styles.panelLabel}>{label}</span>
                      <span className={styles.panelSub}>{sub}</span>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Satır 2 (ters): tatilci teslimatı */}
          <div className="features__row features__row--reverse">
            <div className="features__copy">
              <h2 className="features__h">
                Tatilde misiniz? Siparişiniz tesisinize gelsin.
              </h2>
              <p className="features__p">
                Sapanca her mevsim misafir ağırlar. Çevredeki otel, apart,
                bungalov ve sitelerde konaklayan misafirlerimize de kendi
                kuryemizle teslimat yapıyoruz. Sipariş verirken tesisinizi
                listeden seçmeniz yeterli. Kuryemiz kapınıza ya da resepsiyona
                kadar gelir.
              </p>
              <div>
                <Link href="/urunler" className="btn btn--accent btn--lg">
                  Siparişini Oluştur
                </Link>
              </div>
            </div>
            <div className="features__visual">
              <div className={styles.panelWrap}>
                <span className={styles.panelTitle}>Nerelere teslim ediyoruz?</span>
                {[
                  [BedDouble, "Otel ve apartlar", "Oda kapınıza veya resepsiyona"],
                  [Tent, "Bungalovlar", "Göl ve orman çevresindeki tesisler"],
                  [Building2, "Siteler ve TOKİ konutları", "Site kapısında ya da dairenizde"],
                  [ConciergeBell, "Ev ve iş yerleri", "Yeni Mahalle ve çevre mahalleler"],
                ].map(([Icon, label, sub]) => {
                  const IconComp = Icon as typeof BedDouble;
                  return (
                    <div key={label as string} className={styles.panelRow}>
                      <span className={styles.panelIcon} aria-hidden="true">
                        <IconComp size={19} strokeWidth={2} />
                      </span>
                      <span className={styles.panelText}>
                        <span className={styles.panelLabel}>{label as string}</span>
                        <span className={styles.panelSub}>{sub as string}</span>
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Satır 3: güvenli ödeme */}
          <div className="features__row">
            <div className="features__copy">
              <h2 className="features__h">Ödemede güven, baştan sona.</h2>
              <p className="features__p">
                Siparişinizi kapıda nakit veya kartla, dilerseniz online
                olarak kredi/banka kartıyla ödersiniz. Online ödemeler iyzico
                altyapısıyla, SSL şifrelemesi ve 3D Secure doğrulamasıyla
                alınır. Kart bilgileriniz sitemizde saklanmaz.
              </p>
              <p className="features__p">
                Ayrıntılar için{" "}
                <Link href="/teslimat-ve-iade">Teslimat ve İade Şartları</Link>{" "}
                ile <Link href="/gizlilik-politikasi">Gizlilik ve KVKK</Link>{" "}
                sayfalarına göz atabilirsiniz.
              </p>
            </div>
            <div className="features__visual">
              <div className={styles.panelWrap}>
                <span className={styles.panelTitle}>Ödeme seçenekleri</span>
                {[
                  [Banknote, "Kapıda nakit", "Kuryeye teslimatta ödersiniz"],
                  [CreditCard, "Kapıda kart", "Taşınabilir POS ile temassız"],
                  [ShieldCheck, "Online kart (iyzico)", "SSL ve 3D Secure korumalı"],
                ].map(([Icon, label, sub]) => {
                  const IconComp = Icon as typeof Banknote;
                  return (
                    <div key={label as string} className={styles.panelRow}>
                      <span className={styles.panelIcon} aria-hidden="true">
                        <IconComp size={19} strokeWidth={2} />
                      </span>
                      <span className={styles.panelText}>
                        <span className={styles.panelLabel}>{label as string}</span>
                        <span className={styles.panelSub}>{sub as string}</span>
                      </span>
                    </div>
                  );
                })}
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
            </div>
          </div>
        </div>
      </section>

      {/* ===== İŞLETME BİLGİLERİ + YASAL SAYFALAR ===== */}
      <section className="section section--tight" aria-labelledby="isletme-title">
        <div className="container">
          <header className="section__head section__head--center">
            <h2 id="isletme-title" className="section__title">
              Kayıtlı ve şeffaf bir <span className="accent">işletmeyiz.</span>
            </h2>
            <p className="section__sub">
              Resmi işletme bilgilerimiz ve alışveriş koşullarımız her zaman
              açık. Sorunuz olursa aramanız yeterli.
            </p>
          </header>
          <div className={styles.infoGrid}>
            <div>
              <SellerInfoBox />
            </div>
            <nav className={styles.legalCard} aria-label="Yasal sayfalar">
              <span className={styles.legalCardTitle}>
                Sözleşmeler ve politikalar
              </span>
              {[
                ["/teslimat-ve-iade", "Teslimat ve İade Şartları"],
                ["/gizlilik-politikasi", "Gizlilik ve KVKK Aydınlatma Metni"],
                ["/mesafeli-satis-sozlesmesi", "Mesafeli Satış Sözleşmesi"],
                ["/on-bilgilendirme-formu", "Ön Bilgilendirme Formu"],
              ].map(([href, label]) => (
                <Link key={href} href={href} className={styles.legalLink}>
                  <FileText size={15} aria-hidden="true" />
                  {label}
                  <ArrowRight size={15} aria-hidden="true" />
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </section>

      {/* ===== KAPANIŞ CTA ===== */}
      <section className="section section--tight" aria-label="Sipariş çağrısı">
        <div className="container">
          <div className="section__more">
            <a href="/urunler" className="btn btn--accent btn--lg">
              Alışverişe Başla
            </a>
            <p className="section__more-note">
              Sorularınız için {BUSINESS.phone.display} numarasından bize
              ulaşabilirsiniz. Haftanın 7 günü buradayız.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
