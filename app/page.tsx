import { BUSINESS } from "@/lib/business";
import ReviewsRail from "@/components/ReviewsRail";
import StatusIndicator from "@/components/StatusIndicator";
import ChatPreview from "@/components/ChatPreview";
import SiteNav from "@/components/SiteNav";
import PromoBanners from "@/components/shop/PromoBanners";
import Carousel from "@/components/Carousel";
import CategoryGrid from "@/components/CategoryGrid";
import { Check, ShoppingBasket, Package, Bike } from "lucide-react";

/* ============================================================
   ICONS
   ============================================================ */
function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
    </svg>
  );
}
function MapPinIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path d="M12 21s-7-7.2-7-12a7 7 0 1 1 14 0c0 4.8-7 12-7 12Z" />
      <circle cx="12" cy="9" r="2.5" />
    </svg>
  );
}
function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.13 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.37 1.9.72 2.8a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.35 1.84.59 2.8.72A2 2 0 0 1 22 16.92Z" />
    </svg>
  );
}
function ScooterIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <circle cx="6" cy="18" r="3" />
      <circle cx="18" cy="18" r="3" />
      <path d="M9 18h6M6 18l3-9h4l3 9M13 9V5h3" strokeLinecap="round" />
    </svg>
  );
}
function ClockIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" strokeLinecap="round" />
    </svg>
  );
}
function CalendarIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <rect x="3" y="5" width="18" height="16" rx="2.5" />
      <path d="M3 10h18M8 3v4M16 3v4" strokeLinecap="round" />
      <circle cx="12" cy="15.5" r="1.4" fill="currentColor" stroke="none" />
    </svg>
  );
}
function CardIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <rect x="2.5" y="5" width="19" height="14" rx="2.5" />
      <path d="M2.5 9.5h19M6 15h4" strokeLinecap="round" />
    </svg>
  );
}

export default function Home() {
  return (
    <>
      {/* ===== NAV ===== */}
      <SiteNav />

      <main id="top">
        {/* ===== HERO ===== */}
        <section className="hero" aria-labelledby="hero-title">
          <div className="container">
            <div className="hero__split">
              <div className="hero__copy">
                <StatusIndicator />

                <h1 id="hero-title" className="hero__title">
                  Mahallenin marketi,{" "}
                  <span className="hero__title-accent">kapına kadar teslimat.</span>
                </h1>

                <p className="hero__sub">
                  Taze meyve sebze, şarküteri ve günlük ihtiyaç. Online
                  siparişini oluştur, kapına getirelim.
                </p>

                {/* Tek, temiz birincil CTA */}
                <div className="hero__ctas">
                  <a href="/urunler" className="btn btn--accent btn--lg">
                    Alışverişe Başla
                  </a>
                </div>
              </div>

              <div className="hero__visual">
                <img
                  src="/Hero.png"
                  alt="Yeni Mahalle Market · Sapanca Kurtuluş Caddesi"
                  className="hero__photo"
                  width={1200}
                  height={900}
                />
              </div>
            </div>

            {/* Stats — ikonlu kartlar */}
            <div className="hero__stats" aria-label="Öne çıkan rakamlar">
              <div className="stat-card">
                <span className="stat-card__icon" aria-hidden="true"><ScooterIcon /></span>
                <div className="stat-card__num">
                  ~<em>30</em> dk
                </div>
                <div className="stat-card__label">Ortalama teslim süresi</div>
              </div>
              <div className="stat-card">
                <span className="stat-card__icon" aria-hidden="true"><ClockIcon /></span>
                <div className="stat-card__num">07:30 – 00:00</div>
                <div className="stat-card__label">Her gün açığız</div>
              </div>
              <div className="stat-card">
                <span className="stat-card__icon" aria-hidden="true"><CalendarIcon /></span>
                <div className="stat-card__num">
                  <em>7</em> gün
                </div>
                <div className="stat-card__label">Bayram dahil, kapanmadan</div>
              </div>
              <div className="stat-card">
                <span className="stat-card__icon" aria-hidden="true"><CardIcon /></span>
                <div className="stat-card__num">Kapıda</div>
                <div className="stat-card__label">Nakit &amp; kart ile ödeme</div>
              </div>
            </div>
          </div>
        </section>

        {/* ===== KAMPANYA BANNER'LARI — hero'nun hemen altında ===== */}
        <PromoBanners variant="home" />

        {/* ===== FEATURES — Apple-style split rows ===== */}
        <section className="section" aria-label="Hizmetler">
          <div className="container">
            <div id="konum" className="features__row features__row--map">
              <div className="features__copy">
                <h2 className="features__h">
                  Sapanca&apos;nın merkezinde, Kurtuluş Caddesi&apos;nde.
                </h2>
                <p className="features__p">
                  Yeni Mahalle, Şirin Mahalle ve çevre tatil siteleri için
                  en kısa rotadayız. Aşağıdan haritayı gez ya da direkt yol
                  tarifi al.
                </p>
                <div>
                  <a
                    href={BUSINESS.googleMapsDirectionsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn--primary"
                  >
                    Yol tarifi al
                  </a>
                </div>
              </div>
              <div className="features__visual features__visual--map">
                <iframe
                  src={BUSINESS.googleMapsEmbedUrl}
                  title="Yeni Mahalle Market konumu"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="map-frame"
                />
                <a
                  href={BUSINESS.googleMapsDirectionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="map-pin"
                  aria-label="Yol tarifi al"
                >
                  <span className="map-pin__dot" />
                  Kurtuluş Caddesi · Sapanca
                </a>
              </div>
            </div>

            <div id="hizmetler" className="features__row features__row--reverse">
              <div className="features__copy">
                <h2 className="features__h">
                  Sorun mu var? Canlı destek yanında.
                </h2>
                <p className="features__p">
                  Sağ alttaki baloncuğa tıkla, anında yazışalım. Stoktan teyit
                  eder, eksik olanı sorar, tezgâhtan özenle toplarız. Dilersen
                  telefonla da ulaşabilirsin.
                </p>
                <div>
                  <a href={BUSINESS.phone.href} className="btn-apple">
                    <span className="btn-apple__label">{BUSINESS.phone.display}</span>
                    <span className="btn-apple__icon" aria-hidden="true"><PhoneIcon /></span>
                  </a>
                </div>
              </div>
              <div className="features__visual features__visual--chat">
                <ChatPreview />
              </div>
            </div>

            <div className="features__row">
              <div className="features__copy">
                <h2 className="features__h">
                  Sipariş ver, hazırlayalım, kapına getirelim.
                </h2>
                <p className="features__p">
                  Mahalle içindeysen ortalama yarım saatte siparişin elinde
                  olur. Soğuk zincir korunur, hassas ürünler en sona
                  paketlenir.
                </p>
              </div>
              <div className="features__visual features__visual--track">
                <div className="track" aria-hidden="true">
                  <div className="track__head">
                    <span className="track__title">Siparişiniz hazırlanıyor</span>
                    <span className="track__eta">~30 dk</span>
                  </div>
                  <ol className="track__steps">
                    <li className="track__step track__step--done">
                      <span className="track__node"><Check size={15} strokeWidth={2.6} /></span>
                      <span className="track__body">
                        <span className="track__label">Sipariş alındı</span>
                        <span className="track__sub">Online mağazadan ulaştı</span>
                      </span>
                      <span className="track__time">18:42</span>
                    </li>
                    <li className="track__step track__step--done">
                      <span className="track__node"><ShoppingBasket size={15} strokeWidth={2.2} /></span>
                      <span className="track__body">
                        <span className="track__label">Tezgâhtan toplandı</span>
                        <span className="track__sub">Taze ürünler ayrıldı</span>
                      </span>
                      <span className="track__time">18:46</span>
                    </li>
                    <li className="track__step track__step--done">
                      <span className="track__node"><Package size={15} strokeWidth={2.2} /></span>
                      <span className="track__body">
                        <span className="track__label">Paketlendi</span>
                        <span className="track__sub">Soğuk zincir korundu</span>
                      </span>
                      <span className="track__time">18:51</span>
                    </li>
                    <li className="track__step track__step--active">
                      <span className="track__node"><Bike size={15} strokeWidth={2.2} /></span>
                      <span className="track__body">
                        <span className="track__label">Kapınıza geliyor</span>
                        <span className="track__sub">Kurye yola çıktı</span>
                      </span>
                      <span className="track__time">~18:55</span>
                    </li>
                  </ol>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===== PRODUCTS / CATEGORIES ===== */}
        <section id="urunler" className="section section--tight">
          <div className="container">
            <header className="section__head section__head--center">
              <h2 className="section__title section__title--nowrap">
                Bir mahalle marketinde olması gereken{" "}
                <span className="accent">her şey.</span>
              </h2>
              <p className="section__sub">
                Manavdan şarküteriye, mangal kömüründen şarj aletine. Aklına
                geleni yaz, kapına getirelim.
              </p>
            </header>

            <Carousel />

            <CategoryGrid />

            {/* Online mağaza CTA — tam katalog */}
            <div className="section__more">
              <a href="/urunler" className="btn btn--accent">
                Tüm ürünleri incele · Online sipariş
              </a>
              <p className="section__more-note">
                Fiyatları gör, sepetini oluştur, kapıda veya online öde.
              </p>
            </div>
          </div>
        </section>

        {/* ===== REVIEWS ===== */}
        <section id="yorumlar" className="section section--tight">
          <div className="container">
            <header className="section__head section__head--center">
              <h2 className="section__title">
                Müşterilerimizden gelen yorumlar.
              </h2>
              <p className="section__sub">
                Yeni Mahalle&apos;den müşterilerimizin Google Haritalar
                üzerinden bıraktığı yorumlar.
              </p>
            </header>

            <ReviewsRail />

            <div className="reviews__more">
              <a
                href={BUSINESS.googleReviewsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn--ghost"
              >
                Tüm yorumları Google&apos;da gör
              </a>
            </div>
          </div>
        </section>

        {/* ===== CTA — command center ===== */}
        <section className="cta">
          <div className="container">
            <div className="cta__head">
              <h2 className="cta__title">
                <span className="cta__title-wa">Bir mesaj</span> uzaktayız.
              </h2>
            </div>

            <div className="cta__grid">
              <a href="/urunler" className="cta-card">
                <span className="cta-card__icon"><ShoppingBasket strokeWidth={1.8} /></span>
                <span className="cta-card__eyebrow">Online Sipariş</span>
                <span className="cta-card__title">Alışverişe Başla</span>
                <span className="cta-card__detail">Sepetini oluştur, gerisi bizde</span>
              </a>
              <a href={BUSINESS.phone.href} className="cta-card">
                <span className="cta-card__icon"><PhoneIcon /></span>
                <span className="cta-card__eyebrow">Telefon</span>
                <span className="cta-card__title">{BUSINESS.phone.display}</span>
                <span className="cta-card__detail">Arayıp söyleyebilirsin</span>
              </a>
              <a
                href={BUSINESS.googleMapsDirectionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="cta-card"
              >
                <span className="cta-card__icon"><MapPinIcon /></span>
                <span className="cta-card__eyebrow">Yol tarifi</span>
                <span className="cta-card__title">Kurtuluş Cad.</span>
                <span className="cta-card__detail">Sapanca · Yeni Mahalle</span>
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* ===== FOOTER ===== */}
      <footer className="footer" id="iletisim">
        <div className="container">
          <div className="footer__grid">
            <div className="footer__brand-block">
              <a href="#top" className="brand brand--footer" aria-label={BUSINESS.name}>
                <img
                  src="/logo.png"
                  alt=""
                  width={42}
                  height={42}
                  className="brand__logo"
                />
                <span className="brand__name">
                  <span className="brand__sans">Yeni Mahalle</span>
                  <span className="brand__serif">Market</span>
                </span>
              </a>
              <p className="footer__desc">{BUSINESS.shortDescription}</p>
              <div className="footer__socials">
                <a
                  href={BUSINESS.instagram.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Instagram ${BUSINESS.instagram.handle}`}
                >
                  <InstagramIcon />
                </a>
                <a href={BUSINESS.phone.href} aria-label="Telefon">
                  <PhoneIcon />
                </a>
                <a
                  href={BUSINESS.googleMapsDirectionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Yol tarifi"
                >
                  <MapPinIcon />
                </a>
              </div>
            </div>
            <div className="footer__col">
              <h4>Site</h4>
              <ul>
                <li><a href="/urunler">Ürünler</a></li>
                <li><a href="/firsatlar">Fırsatlar</a></li>
                <li><a href="/iletisim">İletişim</a></li>
                <li><a href="#hizmetler">Hizmetler</a></li>
                <li><a href="#yorumlar">Yorumlar</a></li>
              </ul>
            </div>
            <div className="footer__col">
              <h4>İletişim</h4>
              <ul>
                <li><p>{BUSINESS.address.full}</p></li>
                <li><a href={BUSINESS.phone.href}>{BUSINESS.phone.display}</a></li>
                <li>
                  <a
                    href={BUSINESS.instagram.href}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {BUSINESS.instagram.handle}
                  </a>
                </li>
              </ul>
            </div>
            <div className="footer__col">
              <h4>Saatler</h4>
              <ul>
                <li><p>Pzt–Paz · 07:30–00:00</p></li>
                <li><p>Bayram dahil her gün açık</p></li>
              </ul>
            </div>
          </div>
          <div className="footer__bottom">
            <span>© {new Date().getFullYear()} {BUSINESS.name}</span>
            <span>Sapanca · Sakarya · TR-54</span>
          </div>
        </div>
      </footer>
    </>
  );
}
