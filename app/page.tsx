import { BUSINESS } from "@/lib/business";
import { REVIEWS } from "@/lib/reviews";

/* ============================================================
   ICONS
   ============================================================ */
function ArrowUR({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M5 19L19 5M19 5H8M19 5V16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function ArrowRight() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function StarIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2l2.95 6.55L22 9.55l-5 4.83 1.18 6.87L12 17.77l-6.18 3.48L7 14.38 2 9.55l7.05-1L12 2z" />
    </svg>
  );
}
function GoogleGIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#4285F4" d="M21.6 12.23c0-.8-.07-1.4-.2-2.04H12v3.7h5.5c-.1.93-.7 2.34-2.04 3.28l-.02.12 2.96 2.3.2.02c1.88-1.74 2.97-4.3 2.97-7.38z"/>
      <path fill="#34A853" d="M12 22c2.7 0 4.96-.9 6.6-2.42l-3.14-2.44c-.84.58-1.97.99-3.46.99-2.65 0-4.89-1.75-5.7-4.17l-.12.01-3.07 2.38-.04.11C4.7 19.62 8.07 22 12 22z"/>
      <path fill="#FBBC05" d="M6.3 13.96A6 6 0 015.97 12c0-.68.12-1.34.32-1.96L6.28 9.9 3.17 7.5l-.1.05C2.38 8.92 2 10.42 2 12s.38 3.08 1.07 4.45L6.3 13.96z"/>
      <path fill="#EA4335" d="M12 5.87c1.88 0 3.14.8 3.86 1.48l2.82-2.74C16.95 3.05 14.7 2 12 2 8.07 2 4.7 4.38 3.07 7.55L6.3 10.04C7.11 7.62 9.35 5.87 12 5.87z"/>
    </svg>
  );
}
function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
    </svg>
  );
}
function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20 12a8 8 0 1 1-3.2-6.4L20 4l-1.4 3.3A8 8 0 0 1 20 12Zm-5.2 2.1-1.3-.5a.7.7 0 0 0-.7.1l-.8.8a5.6 5.6 0 0 1-2.5-2.5l.8-.8a.7.7 0 0 0 .1-.7l-.5-1.3a.7.7 0 0 0-.8-.4l-1.2.3a.7.7 0 0 0-.5.8 6.7 6.7 0 0 0 6 6 .7.7 0 0 0 .8-.5l.3-1.2a.7.7 0 0 0-.4-.8Z" />
    </svg>
  );
}
function MapPinIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M12 21s-7-7.2-7-12a7 7 0 1 1 14 0c0 4.8-7 12-7 12Z" />
      <circle cx="12" cy="9" r="2.5" />
    </svg>
  );
}
function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.13 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.37 1.9.72 2.8a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.35 1.84.59 2.8.72A2 2 0 0 1 22 16.92Z" />
    </svg>
  );
}
function LeafIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M19 4c-7 0-13 6-13 13a6 6 0 0 0 6 6c7 0 13-6 13-13V4h-6z" />
      <path d="M6 17c4-4 8-6 13-7" strokeLinecap="round" />
    </svg>
  );
}
function ScooterIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <circle cx="6" cy="18" r="3" />
      <circle cx="18" cy="18" r="3" />
      <path d="M9 18h6M6 18l3-9h4l3 9M13 9V5h3" strokeLinecap="round" />
    </svg>
  );
}
function ClockIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" strokeLinecap="round" />
    </svg>
  );
}
function BreadIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M4 12c0-3 3-5 6-5h4c3 0 6 2 6 5 0 2-1.5 3-3 3H7c-1.5 0-3-1-3-3z" />
      <path d="M8 12l1-2M12 12l1-2M16 12l1-2" strokeLinecap="round" />
    </svg>
  );
}
function CheeseIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M3 12L12 4l9 8v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-6z" />
      <circle cx="9" cy="15" r="1" fill="currentColor" />
      <circle cx="15" cy="14" r="1" fill="currentColor" />
      <circle cx="13" cy="17" r="1" fill="currentColor" />
    </svg>
  );
}
function BasketIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M3 7h18M6 7l1.2 12.2a2 2 0 002 1.8h5.6a2 2 0 002-1.8L18 7M9 7V5a3 3 0 016 0v2" />
    </svg>
  );
}
function MilkIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M8 2h8v4l2 4v10a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V10l2-4V2z" />
      <path d="M8 10h8M10 14h4v4h-4z" strokeLinecap="round" />
    </svg>
  );
}
function SparkleIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M12 3l1.8 5.4L19 10l-5.2 1.6L12 17l-1.8-5.4L5 10l5.2-1.6L12 3z" />
    </svg>
  );
}

/* ============================================================
   DATA
   ============================================================ */
const navLinks = [
  { label: "Anasayfa", href: "#top", active: true },
  { label: "Hizmetler", href: "#hizmetler" },
  { label: "Süreç", href: "#surec" },
  { label: "Yorumlar", href: "#yorumlar" },
  { label: "İletişim", href: "#iletisim" },
];

export default function Home() {
  return (
    <>
      <div className="page" id="top">
        {/* ===== NAV ===== */}
        <header className="nav" aria-label="Üst menü">
          <div className="nav__brand-cell">
            <a href="#top" className="brand" aria-label={BUSINESS.name}>
              <span className="brand__mark" aria-hidden="true">Y</span>
              <span className="brand__name">{BUSINESS.name}</span>
            </a>
          </div>
          <nav className="nav__pill" aria-label="Ana menü">
            {navLinks.map((l) => (
              <a key={l.label} href={l.href} className={`nav__link${l.active ? " nav__link--active" : ""}`}>
                {l.label}
              </a>
            ))}
          </nav>
          <div className="nav__cta-cell">
            <a href={BUSINESS.whatsapp.href} target="_blank" rel="noopener noreferrer" className="btn-ghost-pill">
              Sipariş ver
            </a>
            <a href={BUSINESS.whatsapp.href} target="_blank" rel="noopener noreferrer" className="btn-circle-arrow" aria-label="Sipariş ver">
              <ArrowUR />
            </a>
          </div>
        </header>

        {/* ===== HERO — minimalist ===== */}
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero__frame">
            <div className="hero__inner">
              <span className="pill-light">
                <span className="dot" aria-hidden="true" />
                Sapanca · Yeni Mahalle · Şu an açık
              </span>

              <h1 id="hero-title" className="hero__title">
                <span>Mahallenin bakkalı,</span>
                <span className="accent">kapına kadar.</span>
              </h1>

              <p className="hero__sub">
                Taze meyve sebze, şarküteri ve günlük ihtiyaçların. WhatsApp&apos;tan söyle,
                mahallene ortalama beş dakikada gelelim.
              </p>

              <div className="hero__ctas">
                <a
                  href={BUSINESS.whatsapp.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary-pill"
                >
                  WhatsApp&apos;tan sipariş ver
                  <ArrowUR />
                </a>
                <a href="#hizmetler" className="btn-text">
                  Hizmetleri gör
                  <ArrowRight />
                </a>
              </div>

              <div className="hero__meta">
                <span className="hero__meta-item"><ClockIcon /> 07:30 — 22:00</span>
                <span className="hero__meta-divider" aria-hidden="true" />
                <span className="hero__meta-item"><SparkleIcon /> 7 gün açık</span>
                <span className="hero__meta-divider" aria-hidden="true" />
                <span className="hero__meta-item"><ScooterIcon /> Mahalle içi ücretsiz</span>
              </div>
            </div>
          </div>
        </section>
      </div>

      <main>
        {/* ===== STATS ===== */}
        <section className="stats" aria-label="Sayılar">
          <div className="stats__grid">
            <div className="stat">
              <span className="stat__num">07:30</span>
              <span className="stat__label">Sabah ilk açan. Mahallenin uyanışıyla aynı saatte tezgah hazır.</span>
            </div>
            <div className="stat">
              <span className="stat__num">7<em>/</em>7</span>
              <span className="stat__label">Haftanın yedi günü açığız. Bayram ve resmi tatil dahil.</span>
            </div>
            <div className="stat">
              <span className="stat__num">~5<em>dk</em></span>
              <span className="stat__label">Mahalle içi adrese teslim ortalama süresi. Ücretsiz.</span>
            </div>
          </div>
        </section>

        {/* ===== SERVICES ===== */}
        <section id="hizmetler" aria-labelledby="services-title">
          <div className="section__head">
            <span className="pill-light"><SparkleIcon /> Hizmetler</span>
            <h2 id="services-title" className="headline-display">
              Tek bir telefonda, <span className="mute">tezgâhın tamamı.</span>
            </h2>
            <p className="section-sub">
              Bir mahalle bakkalının yapması gereken her şey, biraz daha özenle.
              Taze ürün, tanıdık yüz, kapına teslim.
            </p>
          </div>

          <div className="services">
            <div className="services__grid">
              <a href={BUSINESS.whatsapp.href} target="_blank" rel="noopener noreferrer" className="service-card service-card--featured">
                <BasketIcon />
                <div>
                  <h3 className="service-card__title">Söyle, hazırlayalım. Beş dakikada kapına gelelim.</h3>
                  <p className="service-card__body">
                    Listeyi WhatsApp&apos;tan ya da telefondan bildir. Mahalle içi teslimat ücretsiz.
                  </p>
                </div>
                <span className="service-card__cta">WhatsApp&apos;tan başla <ArrowUR /></span>
              </a>
              <a href={BUSINESS.whatsapp.href} target="_blank" rel="noopener noreferrer" className="service-card service-card--orange">
                <LeafIcon />
                <div>
                  <h3 className="service-card__title">Meyve ve sebze</h3>
                  <p className="service-card__body">Her sabah halden. Mevsiminde olan, mevsiminde gelir.</p>
                </div>
                <span className="service-card__cta">Sor <ArrowUR /></span>
              </a>
              <a href={BUSINESS.whatsapp.href} target="_blank" rel="noopener noreferrer" className="service-card service-card--olive">
                <CheeseIcon />
                <div>
                  <h3 className="service-card__title">Şarküteri</h3>
                  <p className="service-card__body">Peynir, zeytin, sucuk, tereyağ. Kasamızdan tartı ile.</p>
                </div>
                <span className="service-card__cta">Sor <ArrowUR /></span>
              </a>
              <a href={BUSINESS.whatsapp.href} target="_blank" rel="noopener noreferrer" className="service-card service-card--peach">
                <BreadIcon />
                <div>
                  <h3 className="service-card__title">Ekmek, fırın</h3>
                  <p className="service-card__body">Sabah sıcak, akşam taze. Günde iki defa yenilenir.</p>
                </div>
                <span className="service-card__cta">Sor <ArrowUR /></span>
              </a>
              <a href={BUSINESS.whatsapp.href} target="_blank" rel="noopener noreferrer" className="service-card service-card--cream">
                <MilkIcon />
                <div>
                  <h3 className="service-card__title">Süt, yoğurt</h3>
                  <p className="service-card__body">Günlük süt, ayran, yoğurt. Soğuk zincir korunur.</p>
                </div>
                <span className="service-card__cta">Sor <ArrowUR /></span>
              </a>
              <a href={BUSINESS.whatsapp.href} target="_blank" rel="noopener noreferrer" className="service-card service-card--mint">
                <ClockIcon />
                <div>
                  <h3 className="service-card__title">07:30 — 22:00</h3>
                  <p className="service-card__body">Haftanın yedi günü açık. Bayram dahil hizmetinizdeyiz.</p>
                </div>
                <span className="service-card__cta">Saatler <ArrowUR /></span>
              </a>
            </div>
          </div>
        </section>

        {/* ===== HOW IT WORKS ===== */}
        <section className="howto" id="surec" aria-labelledby="howto-title">
          <div className="section__head">
            <span className="pill-light"><SparkleIcon /> Süreç</span>
            <h2 id="howto-title" className="headline-display">
              Dört adımda <span className="mute">sipariş.</span>
            </h2>
            <p className="section-sub">
              Telefon ya da WhatsApp. Karmaşa yok, randevu yok, uygulama indirmek yok.
            </p>
          </div>
          <div className="howto__steps">
            <div className="step-card">
              <span className="step-card__num">1</span>
              <h3 className="step-card__title">Ürünleri seç</h3>
              <p className="step-card__body">İhtiyaçlarını listele. Aklına geleni söyle, gerisi bizden.</p>
            </div>
            <div className="step-card">
              <span className="step-card__num">2</span>
              <h3 className="step-card__title">WhatsApp ya da ara</h3>
              <p className="step-card__body">{BUSINESS.phone.display} numaramızdan ya da WhatsApp&apos;tan ulaş.</p>
            </div>
            <div className="step-card">
              <span className="step-card__num">3</span>
              <h3 className="step-card__title">Tezgâhtan toplarız</h3>
              <p className="step-card__body">Hızlıca paketleriz. Eksik var ise arar, sorarız.</p>
            </div>
            <div className="step-card">
              <span className="step-card__num">4</span>
              <h3 className="step-card__title">Kapına gelelim</h3>
              <p className="step-card__body">Ortalama beş dakikada elinde. Mahalle içi ücretsiz.</p>
            </div>
          </div>
        </section>

        {/* ===== REVIEWS ===== */}
        <section className="reviews" id="yorumlar" aria-labelledby="reviews-title">
          <div className="section__head">
            <span className="pill-light"><GoogleGIcon /> Google Yorumları</span>
            <h2 id="reviews-title" className="headline-display">
              Mahallenin <span className="mute">sesi.</span>
            </h2>
            <p className="section-sub">
              Yeni Mahalle&apos;den müşterilerimizin Google Haritalar üzerinden bıraktığı yorumlar.
            </p>
          </div>
          <div className="reviews__rail" role="region" aria-label="Müşteri yorumları">
            {REVIEWS.map((r) => (
              <a key={r.name} className="review" href={BUSINESS.googleReviewsUrl} target="_blank" rel="noopener noreferrer">
                <div className="review__top">
                  <span className="review__avatar" aria-hidden="true">{r.initial}</span>
                  <div className="review__who">
                    <span className="review__name">{r.name}</span>
                    <span className="review__date">{r.date}</span>
                  </div>
                </div>
                <div className="review__stars" aria-label={`${r.rating} yıldız`}>
                  {Array.from({ length: r.rating }).map((_, i) => <StarIcon key={i} />)}
                </div>
                <p className="review__text">{r.text}</p>
                <div className="review__source">
                  <GoogleGIcon />
                  <span>Google&apos;dan</span>
                </div>
              </a>
            ))}
          </div>
          <div className="reviews__more">
            <a href={BUSINESS.googleReviewsUrl} target="_blank" rel="noopener noreferrer" className="btn-ghost-pill">
              Tüm yorumları Google&apos;da gör
            </a>
          </div>
        </section>

        {/* ===== CTA ===== */}
        <section className="cta" aria-labelledby="cta-title">
          <div className="cta__frame">
            <h2 id="cta-title" className="cta__title">
              <span>Bugün ne lazımsa,</span>
              <em>bir telefon kadar uzakta.</em>
            </h2>
            <p className="cta__sub">
              Mahalle içindeysen ortalama beş dakikada elindeyiz. Söyle, kapına getirelim.
            </p>
            <a href={BUSINESS.whatsapp.href} target="_blank" rel="noopener noreferrer" className="cta__btn">
              WhatsApp&apos;tan sipariş ver
              <span className="pill-cta__arrow" aria-hidden="true"><ArrowRight /></span>
            </a>
          </div>
        </section>
      </main>

      {/* ===== FOOTER ===== */}
      <footer className="footer" id="iletisim">
        <div className="footer__grid">
          <div className="footer__brand-block">
            <a href="#top" className="brand" aria-label={BUSINESS.name}>
              <span className="brand__mark" aria-hidden="true">Y</span>
              <span className="brand__name">{BUSINESS.name}</span>
            </a>
            <p className="footer__desc">{BUSINESS.shortDescription}</p>
          </div>
          <nav className="footer__col" aria-label="Bağlantılar">
            <h4>Bağlantılar</h4>
            <ul>
              <li><a href="#top">Anasayfa</a></li>
              <li><a href="#hizmetler">Hizmetler</a></li>
              <li><a href="#surec">Süreç</a></li>
              <li><a href="#yorumlar">Yorumlar</a></li>
            </ul>
          </nav>
          <div className="footer__col">
            <h4>İletişim</h4>
            <p>{BUSINESS.address.full}</p>
            <a href={BUSINESS.phone.href}>{BUSINESS.phone.display}</a>
            <a href={BUSINESS.whatsapp.href} target="_blank" rel="noopener noreferrer">WhatsApp</a>
          </div>
          <div className="footer__col">
            <h4>Hızlı sipariş</h4>
            <p className="footer__cta-text">Listeni gönder, kapına getirelim. Mahalle içi ortalama beş dakika.</p>
            <a href={BUSINESS.whatsapp.href} target="_blank" rel="noopener noreferrer" className="footer__cta-btn">
              WhatsApp&apos;tan sipariş ver
            </a>
            <div className="footer__socials">
              <a href={BUSINESS.instagram.href} target="_blank" rel="noopener noreferrer" aria-label={`Instagram ${BUSINESS.instagram.handle}`}>
                <InstagramIcon />
              </a>
              <a href={BUSINESS.whatsapp.href} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
                <WhatsAppIcon />
              </a>
              <a href={BUSINESS.phone.href} aria-label="Telefon">
                <PhoneIcon />
              </a>
              <a href={BUSINESS.googleMapsDirectionsUrl} target="_blank" rel="noopener noreferrer" aria-label="Yol tarifi">
                <MapPinIcon />
              </a>
            </div>
          </div>
        </div>
        <div className="footer__bottom">
          © {new Date().getFullYear()} {BUSINESS.name}. Tüm hakları saklıdır.
        </div>
      </footer>
    </>
  );
}
