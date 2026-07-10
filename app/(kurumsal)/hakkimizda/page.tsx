// Hakkımızda (/hakkimizda) — iyzico satıcı kriteri + marka sayfası.
// Fotoğraflı hero (vitrin), istatistik şeridi, hikaye (iç mekan fotoğrafı),
// değer kartları, ödeme/güvence + resmi işletme bilgileri ve kapanış CTA'sı.
// İçerik lib/business.ts'ten; işletme bilgileri SellerInfoBox ile ortak.

import type { Metadata } from "next";
import Link from "next/link";
import {
  Bike,
  Leaf,
  Phone,
  ShieldCheck,
  ShoppingBasket,
  Store,
} from "lucide-react";
import { BUSINESS } from "@/lib/business";
import SellerInfoBox from "../SellerInfoBox";
import styles from "./hakkimizda.module.css";

export const metadata: Metadata = {
  title: "Hakkımızda",
  description:
    "Yeni Mahalle Market — Sapanca Yeni Mahalle'nin bakkalı. Taze meyve sebze, şarküteri ve tüm market ihtiyaçları; kendi kuryemizle adrese teslim. Bizi tanıyın.",
  alternates: { canonical: "/hakkimizda" },
};

const STATS = [
  { value: "7", accent: " gün", label: "Haftanın her günü, bayramlar dahil açığız" },
  { value: "07:30", accent: "–02:00", label: "Gün boyu kesintisiz hizmet saatleri" },
  { value: "30", accent: "–60 dk", label: "Kendi kuryemizle ortalama teslimat süresi" },
  { value: "2.500", accent: "+", label: "Market rafında ve sitede ürün çeşidi" },
];

export default function HakkimizdaPage() {
  return (
    <main className={styles.page}>
      <div className="container">
        {/* --- Hero --- */}
        <header className={styles.hero}>
          <div className={styles.heroMain}>
            <span className={styles.eyebrow}>
              <Store size={13} aria-hidden="true" /> Sapanca · Yeni Mahalle
            </span>
            <h1 className={styles.title}>
              Mahallenin marketi,{" "}
              <span className={styles.titleAccent}>kapınıza kadar.</span>
            </h1>
            <p className={styles.lead}>
              {BUSINESS.name}, Sapanca Yeni Mahalle&apos;de esnaf kültürüyle
              hizmet veren bir mahalle marketi. Taze meyve sebzeden şarküteriye
              günlük tüm ihtiyaçlarınızı hazırlar, kendi kuryemizle kapınıza
              getiririz.
            </p>
            <div className={styles.heroActions}>
              <Link href="/urunler" className="btn btn--accent btn--lg">
                <ShoppingBasket size={16} strokeWidth={2} aria-hidden="true" />
                Alışverişe Başla
              </Link>
              <a href={BUSINESS.phone.href} className="btn btn--ghost btn--lg">
                <Phone size={16} strokeWidth={2} aria-hidden="true" />
                {BUSINESS.phone.display}
              </a>
            </div>
          </div>
          <div className={styles.heroVisual}>
            <img
              src="/Hero.png"
              alt={`${BUSINESS.name} vitrini — Sapanca Yeni Mahalle`}
              width={1448}
              height={1086}
              className={styles.heroPhoto}
            />
            <div className={styles.heroBadge}>
              <span className={styles.heroBadgeIcon} aria-hidden="true">
                <Bike size={20} strokeWidth={1.9} />
              </span>
              <span className={styles.heroBadgeText}>
                <span className={styles.heroBadgeTitle}>Kendi kuryemizle</span>
                <span className={styles.heroBadgeSub}>
                  Genellikle 30–60 dakikada kapınızda
                </span>
              </span>
            </div>
          </div>
        </header>

        {/* --- Rakamlarla biz --- */}
        <section className={styles.stats} aria-label="Rakamlarla Yeni Mahalle Market">
          {STATS.map((s) => (
            <div key={s.label} className={styles.stat}>
              <span className={styles.statValue}>
                {s.value}
                <em>{s.accent}</em>
              </span>
              <span className={styles.statLabel}>{s.label}</span>
            </div>
          ))}
        </section>

        {/* --- Hikaye --- */}
        <section className={styles.story} aria-labelledby="hikaye-baslik">
          <div className={styles.storyBody}>
            <h2 id="hikaye-baslik">Biz kimiz?</h2>
            <p>
              <strong>{BUSINESS.name}</strong>, Sapanca&apos;nın Yeni
              Mahalle&apos;sinde hizmet veren bir mahalle marketidir. Taze
              meyve ve sebzeden şarküteriye, kahvaltılık ürünlerden temizlik ve
              kişisel bakıma kadar günlük tüm market ihtiyaçlarını tek çatı
              altında topluyoruz. Meyve sebzemiz her gün tazelenir; gramajlı
              satışla ihtiyacınız kadarını alırsınız.
            </p>
            <p>
              Sapanca yalnızca bizim mahallemiz değil; gölü, bungalovları ve
              otelleriyle her mevsim misafir ağırlayan bir tatil beldesi. Bu
              yüzden yalnızca mahallelimize değil, çevredeki otel, apart,
              bungalov ve sitelerde konaklayan misafirlerimize de{" "}
              <strong>kendi kuryemizle adrese teslim</strong> hizmet
              veriyoruz. Siparişinizi web sitemizden veya telefonla verin;
              kapınıza, resepsiyonunuza ya da bungalovunuza kadar getirelim.
            </p>
            <p>
              Bir bakkal samimiyetiyle çalışırız: telefonun ucunda gerçek bir
              komşunuz vardır, siparişinize elimizle en tazesini seçeriz,
              beğenmediğiniz ürünü sormadan değiştiririz.
            </p>
          </div>
          <img
            src="/carousel/carousel-1.png"
            alt="Market içinden raflar"
            width={1448}
            height={1086}
            loading="lazy"
            className={styles.storyPhoto}
          />
        </section>

        {/* --- Değerler --- */}
        <section className={styles.values} aria-label="Bizi biz yapanlar">
          <div className={styles.value}>
            <span className={styles.valueIcon} aria-hidden="true">
              <Leaf size={20} strokeWidth={1.9} />
            </span>
            <span className={styles.valueTitle}>Taze ve yerel</span>
            <p>
              Meyve sebze tezgâhımız her gün yenilenir. Gramajlı satışla 250
              gramdan kilolarcasına, ihtiyacınız kadarını sipariş edersiniz.
            </p>
          </div>
          <div className={styles.value}>
            <span className={styles.valueIcon} aria-hidden="true">
              <Bike size={20} strokeWidth={1.9} />
            </span>
            <span className={styles.valueTitle}>Kendi kuryemizle teslim</span>
            <p>
              Siparişler kargoya verilmez; kendi kuryemizle aynı gün, çoğu
              zaman 30–60 dakikada teslim edilir. Otel ve bungalovlara da
              gideriz.
            </p>
          </div>
          <div className={styles.value}>
            <span className={styles.valueIcon} aria-hidden="true">
              <ShieldCheck size={20} strokeWidth={1.9} />
            </span>
            <span className={styles.valueTitle}>Güvenli alışveriş</span>
            <p>
              Kapıda nakit/kartla veya online iyzico güvencesiyle ödersiniz.
              Sitemiz SSL ile şifrelidir; kart bilgileriniz bizde saklanmaz.
            </p>
          </div>
        </section>

        {/* --- Ödeme & güvence + resmi işletme bilgileri --- */}
        <section className={styles.trust} aria-labelledby="guvence-baslik">
          <div className={styles.trustBody}>
            <h2 id="guvence-baslik">Ödeme ve güvence</h2>
            <p>
              Online ödemeleriniz <strong>iyzico</strong> altyapısıyla,
              256-bit SSL şifrelemesi ve 3D Secure doğrulamasıyla alınır.
              Dilerseniz siparişinizi kapıda nakit veya kartla da
              ödeyebilirsiniz. Teslimat ve iade koşulları için{" "}
              <Link href="/teslimat-ve-iade">Teslimat ve İade Şartları</Link>,
              kişisel verileriniz için{" "}
              <Link href="/gizlilik-politikasi">Gizlilik ve KVKK</Link>{" "}
              sayfalarımıza göz atabilirsiniz.
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
          <div>
            <h2 className={styles.trustInfoTitle}>İşletme bilgileri</h2>
            <SellerInfoBox />
          </div>
        </section>

        {/* --- Kapanış CTA --- */}
        <section className={styles.cta} aria-label="Sipariş çağrısı">
          <h2>Sapanca&apos;daysanız, siparişiniz bizden sorulur.</h2>
          <p>
            İster mahalleli olun ister misafir — sepetinizi doldurun,
            gerisini kuryemize bırakın. Sorularınız için haftanın 7 günü
            telefonun ucundayız.
          </p>
          <div className={styles.ctaActions}>
            <Link href="/urunler" className="btn btn--accent btn--lg">
              <ShoppingBasket size={16} strokeWidth={2} aria-hidden="true" />
              Alışverişe Başla
            </Link>
            <Link href="/iletisim" className="btn btn--ghost btn--lg">
              İletişime Geç
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
