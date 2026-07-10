// Hakkımızda (/hakkimizda) — iyzico satıcı kriteri: işletmeyi tanıtan,
// iletişim ve adres bilgisi net bir kurumsal sayfa. İçerik lib/business.ts'ten.

import type { Metadata } from "next";
import Link from "next/link";
import {
  Clock,
  Leaf,
  MapPin,
  Phone,
  ShieldCheck,
  Truck,
} from "lucide-react";
import { BUSINESS } from "@/lib/business";
import styles from "../kurumsal.module.css";

export const metadata: Metadata = {
  title: "Hakkımızda",
  description:
    "Yeni Mahalle Market — Sapanca Yeni Mahalle'nin bakkalı. Taze meyve sebze, şarküteri ve tüm market ihtiyaçları; kendi kuryemizle adrese teslim. Bizi tanıyın.",
  alternates: { canonical: "/hakkimizda" },
};

export default function HakkimizdaPage() {
  return (
    <main className={styles.page}>
      <div className="container">
        <header className={styles.head}>
          <h1 className={styles.title}>
            Mahallenin marketi,{" "}
            <span className={styles.titleAccent}>kapınıza kadar.</span>
          </h1>
          <p className={styles.sub}>
            {BUSINESS.name}, Sapanca Yeni Mahalle&apos;de esnaf kültürüyle
            hizmet veren bir mahalle marketidir. Tanışalım.
          </p>
        </header>

        <div className={styles.body}>
          <h2>Biz kimiz?</h2>
          <p>
            <strong>{BUSINESS.name}</strong>, Sapanca&apos;nın Yeni
            Mahalle&apos;sinde, Kurtuluş Caddesi üzerinde hizmet veren bir
            mahalle marketidir. Taze meyve ve sebzeden şarküteriye, kahvaltılık
            ürünlerden temizlik ve kişisel bakıma kadar günlük tüm market
            ihtiyaçlarınızı tek çatı altında topluyoruz.
          </p>
          <p>
            Sapanca yalnızca bizim mahallemiz değil; gölü, bungalovları ve
            otelleriyle her mevsim misafir ağırlayan bir tatil beldesi. Bu
            yüzden yalnızca mahallelimize değil, çevredeki otel, apart,
            bungalov ve sitelerde konaklayan misafirlerimize de{" "}
            <strong>kendi kuryemizle adrese teslim</strong> hizmet veriyoruz.
            Siparişinizi web sitemizden veya telefonla verin; kapınıza,
            resepsiyonunuza ya da bungalovunuza kadar getirelim.
          </p>

          <div className={styles.cards}>
            <div className={styles.card}>
              <span className={styles.cardIcon}>
                <Leaf aria-hidden="true" />
              </span>
              <span className={styles.cardTitle}>Taze ve yerel</span>
              <p>
                Meyve sebzemiz her gün tazelenir; gramajlı satışla ihtiyacınız
                kadarını alırsınız.
              </p>
            </div>
            <div className={styles.card}>
              <span className={styles.cardIcon}>
                <Truck aria-hidden="true" />
              </span>
              <span className={styles.cardTitle}>Kendi kuryemizle teslim</span>
              <p>
                Siparişler kargoya verilmez; kendi kuryemizle aynı gün, çoğu
                zaman ~30 dakikada teslim edilir.
              </p>
            </div>
            <div className={styles.card}>
              <span className={styles.cardIcon}>
                <ShieldCheck aria-hidden="true" />
              </span>
              <span className={styles.cardTitle}>Güvenli alışveriş</span>
              <p>
                Kapıda nakit/kartla veya online kartla (iyzico güvencesiyle)
                ödeyebilirsiniz. Sitemiz SSL ile şifrelidir.
              </p>
            </div>
          </div>

          <h2>Çalışma saatlerimiz ve iletişim</h2>
          <div className={styles.infoBox}>
            <dl>
              <dt>
                <MapPin size={14} aria-hidden="true" /> Adres
              </dt>
              <dd>{BUSINESS.address.full}</dd>
              <dt>
                <Phone size={14} aria-hidden="true" /> Telefon
              </dt>
              <dd>
                <a href={BUSINESS.phone.href}>{BUSINESS.phone.display}</a>
              </dd>
              <dt>
                <Clock size={14} aria-hidden="true" /> Saatler
              </dt>
              <dd>{BUSINESS.hours.display} · Bayram dahil her gün açık</dd>
              <dt>Instagram</dt>
              <dd>
                <a
                  href={BUSINESS.instagram.href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {BUSINESS.instagram.handle}
                </a>
              </dd>
              <dt>Web</dt>
              <dd>{BUSINESS.domain}</dd>
              {BUSINESS.legal.ownerName && (
                <>
                  <dt>İşletme sahibi</dt>
                  <dd>{BUSINESS.legal.ownerName}</dd>
                </>
              )}
              {BUSINESS.legal.email && (
                <>
                  <dt>E-posta</dt>
                  <dd>
                    <a href={`mailto:${BUSINESS.legal.email}`}>
                      {BUSINESS.legal.email}
                    </a>
                  </dd>
                </>
              )}
              {BUSINESS.legal.taxOffice && BUSINESS.legal.taxNo && (
                <>
                  <dt>Vergi dairesi / no</dt>
                  <dd>
                    {BUSINESS.legal.taxOffice} / {BUSINESS.legal.taxNo}
                  </dd>
                </>
              )}
              {BUSINESS.legal.mersis && (
                <>
                  <dt>MERSİS</dt>
                  <dd>{BUSINESS.legal.mersis}</dd>
                </>
              )}
              {BUSINESS.legal.kep && (
                <>
                  <dt>KEP</dt>
                  <dd>{BUSINESS.legal.kep}</dd>
                </>
              )}
            </dl>
          </div>
          <p>
            Sorunuz mu var?{" "}
            <Link href="/iletisim">İletişim sayfamızdan</Link> bize
            ulaşabilir, <a href={BUSINESS.whatsapp.href}>WhatsApp&apos;tan</a>{" "}
            yazabilir veya doğrudan arayabilirsiniz.
          </p>

          <h2>Ödeme ve güvence</h2>
          <p>
            Online ödemeleriniz <strong>iyzico</strong> altyapısıyla, 256-bit
            SSL şifrelemesi ve 3D Secure doğrulamasıyla alınır. Kart
            bilgileriniz sitemizde saklanmaz. Dilerseniz siparişinizi kapıda
            nakit veya kartla da ödeyebilirsiniz. Teslimat ve iade koşulları
            için{" "}
            <Link href="/teslimat-ve-iade">Teslimat ve İade Şartları</Link>{" "}
            sayfamıza, kişisel verilerinizin korunmasına dair detaylar için{" "}
            <Link href="/gizlilik-politikasi">Gizlilik ve KVKK</Link>{" "}
            sayfamıza göz atabilirsiniz.
          </p>
          <div className={styles.payBand}>
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
    </main>
  );
}
