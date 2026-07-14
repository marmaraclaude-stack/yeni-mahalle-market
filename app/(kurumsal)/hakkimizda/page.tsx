// Hakkımızda (/hakkimizda): iyzico satıcı kriteri + tanıtım sayfası.
// Yasal sayfalarla aynı sade dil: siyah başlıklar, tek kolon metin,
// görsel ve renkli kart yok. İşletme bilgileri SellerInfoBox ile ortak.

import type { Metadata } from "next";
import Link from "next/link";
import { BUSINESS } from "@/lib/business";
import SellerInfoBox from "../SellerInfoBox";
import styles from "../kurumsal.module.css";

export const metadata: Metadata = {
  title: "Hakkımızda",
  description:
    "Yeni Mahalle Market: Sapanca Yeni Mahalle'nin bakkalı. Taze meyve sebze, şarküteri ve tüm market ihtiyaçları, kendi kuryemizle adrese teslim. Bizi tanıyın.",
  alternates: { canonical: "/hakkimizda" },
};

export default function HakkimizdaPage() {
  return (
    <main className={styles.page}>
      <div className="container">
        <header className={styles.head}>
          <h1 className={styles.title}>Hakkımızda</h1>
          <p className={styles.sub}>
            Sapanca Yeni Mahalle&apos;de hizmet veren marketimizi yakından
            tanıyın.
          </p>
        </header>

        <div className={styles.body}>
          <h2>Biz kimiz?</h2>
          <p>
            <strong>{BUSINESS.name}</strong>, Sapanca&apos;nın Yeni
            Mahalle&apos;sinde hizmet veren bir mahalle marketidir. Taze meyve
            ve sebzeden şarküteriye, kahvaltılıktan temizlik ve kişisel bakıma
            kadar günlük tüm market ihtiyaçlarınızı tek çatı altında
            bulabilirsiniz. Meyve sebze tezgâhımız her gün yenilenir ve
            gramajlı satışla ihtiyacınız kadarını alırsınız.
          </p>
          <p>
            Sapanca, gölü ve doğasıyla her mevsim misafir ağırlayan bir tatil
            beldesidir. Bu yüzden yalnızca mahallelimize değil, çevredeki
            otel, apart, bungalov ve sitelerde konaklayan misafirlerimize de
            hizmet veriyoruz. Siparişinizi web sitemizden veya telefonla
            verin. Kendi kuryemiz siparişinizi kapınıza, resepsiyonunuza ya da
            bungalovunuza kadar getirir.
          </p>
          <p>
            Bir bakkal samimiyetiyle çalışırız. Telefonun ucunda her zaman
            gerçek bir komşunuz vardır. Siparişinize en tazesini elimizle
            seçer, beğenmediğiniz ürünü sormadan değiştiririz.
          </p>

          <h2>Neler sunuyoruz?</h2>
          <ul>
            <li>
              <strong>Taze meyve ve sebze:</strong> tezgâh her gün yenilenir,
              gramajlı satışla 250 gramdan dilediğiniz miktara kadar sipariş
              verebilirsiniz.
            </li>
            <li>
              <strong>2.500&apos;den fazla ürün:</strong> şarküteri,
              kahvaltılık, içecek, atıştırmalık, temizlik, kişisel bakım ve
              daha fazlası.
            </li>
            <li>
              <strong>Kendi kuryemizle aynı gün teslimat:</strong> siparişler
              kargoya verilmez, çoğu zaman 30-60 dakika içinde kapınızdadır.
            </li>
            <li>
              <strong>Konaklama tesislerine teslim:</strong> otel, apart,
              bungalov ve sitelere teslimat yapılır. Sipariş verirken
              tesisinizi seçmeniz yeterlidir.
            </li>
          </ul>

          <h2>Çalışma saatleri ve teslimat bölgesi</h2>
          <p>
            Haftanın 7 günü, bayramlar dahil <strong>07:30 - 02:00</strong>{" "}
            saatleri arasında açığız. Teslimat bölgemiz Yeni Mahalle başta
            olmak üzere Sapanca merkez, Kırkpınar, Mahmudiye, Kurtköy ve
            Maşukiye çevresidir. Teslimat ücreti ve koşulları için{" "}
            <Link href="/teslimat-ve-iade">Teslimat ve İade Şartları</Link>{" "}
            sayfamıza bakabilirsiniz.
          </p>

          <h2>Ödeme ve güvence</h2>
          <p>
            Siparişinizi kapıda nakit veya kartla, dilerseniz online olarak
            kredi/banka kartıyla ödeyebilirsiniz. Online ödemeler{" "}
            <strong>iyzico</strong> altyapısıyla, SSL şifrelemesi ve 3D Secure
            doğrulamasıyla alınır. Kart bilgileriniz sitemizde saklanmaz.
            Kişisel verilerinizin korunmasına dair ayrıntılar{" "}
            <Link href="/gizlilik-politikasi">Gizlilik ve KVKK</Link>{" "}
            sayfamızdadır.
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

          <h2>İşletme bilgileri</h2>
          <SellerInfoBox />

          <h2>Bize ulaşın</h2>
          <p>
            Sorularınız için bizi{" "}
            <a href={BUSINESS.phone.href}>{BUSINESS.phone.display}</a>{" "}
            numarasından arayabilir, <a href={BUSINESS.whatsapp.href}>
            WhatsApp&apos;tan</a> yazabilir veya{" "}
            <Link href="/iletisim">iletişim sayfamızı</Link>{" "}
            ziyaret edebilirsiniz.
          </p>
          <div className={styles.actions}>
            <Link href="/urunler" className="btn btn--accent btn--lg">
              Alışverişe Başla
            </Link>
            <Link href="/iletisim" className="btn btn--ghost btn--lg">
              İletişime Geç
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
