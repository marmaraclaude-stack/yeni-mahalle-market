import { BUSINESS } from "@/lib/business";
import ReviewsRail from "@/components/ReviewsRail";
import StatusIndicator from "@/components/StatusIndicator";

/* ============================================================
   ICONS
   ============================================================ */
function ArrowUR() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
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
function LeafIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <path d="M19 4c-7 0-13 6-13 13a6 6 0 0 0 6 6c7 0 13-6 13-13V4h-6z" />
      <path d="M6 17c4-4 8-6 13-7" strokeLinecap="round" />
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
function BreadIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <path d="M4 12c0-3 3-5 6-5h4c3 0 6 2 6 5 0 2-1.5 3-3 3H7c-1.5 0-3-1-3-3z" />
      <path d="M8 12l1-2M12 12l1-2M16 12l1-2" strokeLinecap="round" />
    </svg>
  );
}
function CheeseIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <path d="M3 12L12 4l9 8v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-6z" />
      <circle cx="9" cy="15" r="0.9" fill="currentColor" />
      <circle cx="15" cy="14" r="0.9" fill="currentColor" />
      <circle cx="13" cy="17" r="0.9" fill="currentColor" />
    </svg>
  );
}
function BasketIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <path d="M3 7h18M6 7l1.2 12.2a2 2 0 002 1.8h5.6a2 2 0 002-1.8L18 7M9 7V5a3 3 0 016 0v2" />
    </svg>
  );
}
function MilkIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <path d="M8 2h8v4l2 4v10a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V10l2-4V2z" />
      <path d="M8 10h8M10 14h4v4h-4z" strokeLinecap="round" />
    </svg>
  );
}

/* ============================================================
   DATA
   ============================================================ */
const navLinks = [
  { label: "Hizmetler", href: "#hizmetler" },
  { label: "Yorumlar", href: "#yorumlar" },
  { label: "İletişim", href: "#iletisim" },
];

const services = [
  {
    icon: BasketIcon,
    title: "Adrese teslim",
    body: "Listeyi WhatsApp'tan ya da telefondan bildir. Mahalle içi teslimat ücretsiz, kapına getiririz.",
  },
  {
    icon: LeafIcon,
    title: "Meyve ve sebze",
    body: "Her sabah halden, mevsiminde gelen. Tezgâhımızda kalan günü görürsün.",
  },
  {
    icon: CheeseIcon,
    title: "Şarküteri",
    body: "Peynir, zeytin, sucuk, tereyağ. Kasamızdan tartı ile, istediğin gramajda.",
  },
  {
    icon: BreadIcon,
    title: "Ekmek ve fırın",
    body: "Sabah sıcak, akşam taze. Günde iki defa yenilenen ekmek ve unlu mamul.",
  },
  {
    icon: MilkIcon,
    title: "Süt ve yoğurt",
    body: "Günlük süt, ayran, yoğurt. Soğuk zincir korunarak kapına gelir.",
  },
  {
    icon: ClockIcon,
    title: "Açık · 7 gün",
    body: "07:30 ile 22:30 arası açığız. Bayram, resmi tatil dahil her gün hizmetinizdeyiz.",
  },
];

export default function Home() {
  return (
    <>
      {/* ===== NAV ===== */}
      <div className="nav-shell">
        <div className="container">
          <header className="nav" aria-label="Üst menü">
            <a href="#top" className="brand" aria-label={BUSINESS.name}>
              <span className="brand__mono">
                yenimahalle<em>.market</em>
                <span className="slash">/</span>
                sapanca
              </span>
            </a>
            <nav className="nav__links" aria-label="Ana menü">
              {navLinks.map((l) => (
                <a key={l.label} href={l.href} className="nav__link">
                  {l.label}
                </a>
              ))}
            </nav>
            <div className="nav__cta">
              <a
                href={BUSINESS.whatsapp.href}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn--primary"
              >
                Sipariş ver <ArrowUR />
              </a>
            </div>
          </header>
        </div>
      </div>

      <main id="top">
        {/* ===== HERO ===== */}
        <section className="hero" aria-labelledby="hero-title">
          <div className="container">
            <div className="hero__inner">
              <StatusIndicator />

              <h1 id="hero-title" className="hero__title">
                Mahallenin bakkalı,{" "}
                <span className="hero__title-accent">kapına kadar.</span>
              </h1>

              <p className="hero__sub">
                Taze meyve sebze, şarküteri ve günlük ihtiyaç. WhatsApp&apos;tan
                listeyi gönder, kapına getirelim.
              </p>

              <div className="hero__ctas">
                <a
                  href={BUSINESS.whatsapp.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn--primary"
                >
                  WhatsApp&apos;tan sipariş ver <ArrowUR />
                </a>
                <a href="#hizmetler" className="btn btn--ghost">
                  Hizmetleri gör <ArrowRight />
                </a>
              </div>
            </div>

            {/* Stats strip */}
            <div className="hero__stats" aria-label="Öne çıkan rakamlar">
              <div className="hero__stat">
                <div className="hero__stat-num">
                  ~<em>30</em> dk
                </div>
                <div className="hero__stat-label">Ortalama teslim süresi</div>
              </div>
              <div className="hero__stat">
                <div className="hero__stat-num">07:30 – 22:30</div>
                <div className="hero__stat-label">Her gün açığız</div>
              </div>
              <div className="hero__stat">
                <div className="hero__stat-num">
                  <em>7</em> gün
                </div>
                <div className="hero__stat-label">Bayram dahil, kapanmadan</div>
              </div>
            </div>
          </div>
        </section>

        {/* ===== FEATURES — Apple-style split rows ===== */}
        <section className="section" aria-label="Öne çıkanlar">
          <div className="container">
            <div className="features__row">
              <div className="features__copy">
                <h3 className="features__h">
                  Sapanca&apos;nın merkezinde, Kurtuluş Caddesi&apos;nde.
                </h3>
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
                    className="btn btn--link"
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

            <div className="features__row features__row--reverse">
              <div className="features__copy">
                <h3 className="features__h">
                  Listeyi yaz, gerisi bize.
                </h3>
                <p className="features__p">
                  WhatsApp&apos;tan ya da telefondan ulaş. Stoktan teyit eder,
                  eksik olanı sorar, tezgâhtan özenle toplarız.
                </p>
                <div>
                  <a
                    href={BUSINESS.whatsapp.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn--link"
                  >
                    WhatsApp&apos;tan başla
                  </a>
                </div>
              </div>
              <div className="features__visual">
                <div className="viz-chat" aria-hidden="true">
                  <div className="viz-chat__msg viz-chat__msg--in viz-chat__anim-1">
                    Selam, yarın sabah için ekmek, 2 yoğurt, domates ve bir
                    bağ maydanoz lazım.
                    <span className="viz-chat__msg-meta">18:42</span>
                  </div>
                  <div className="viz-chat__typing viz-chat__anim-2">
                    <span /><span /><span />
                  </div>
                  <div className="viz-chat__msg viz-chat__msg--mine viz-chat__anim-3">
                    Tabii, sabah hazır olur. Başka ihtiyacın var mı?
                    <span className="viz-chat__msg-meta">18:43</span>
                  </div>
                  <div className="viz-chat__msg viz-chat__msg--in viz-chat__anim-4">
                    Bir de yarım kilo zeytin ekleyelim. Teşekkürler!
                    <span className="viz-chat__msg-meta">18:43</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="features__row">
              <div className="features__copy">
                <h3 className="features__h">
                  Söyle, hazırlayalım, kapına getirelim.
                </h3>
                <p className="features__p">
                  Mahalle içindeysen ortalama yarım saatte siparişin elinde
                  olur. Soğuk zincir korunur, hassas ürünler en sona
                  paketlenir.
                </p>
              </div>
              <div className="features__visual">
                <div className="viz-timeline" aria-hidden="true">
                  <div className="viz-timeline__row">
                    <span className="viz-timeline__label">Mesajın elimize ulaşır</span>
                    <span className="viz-timeline__badge">Alındı</span>
                  </div>
                  <div className="viz-timeline__row">
                    <span className="viz-timeline__label">Tezgâhtan toplarız</span>
                    <span className="viz-timeline__badge">Toplanıyor</span>
                  </div>
                  <div className="viz-timeline__row">
                    <span className="viz-timeline__label">Paketleriz, kuryeye veririz</span>
                    <span className="viz-timeline__badge">Hazır</span>
                  </div>
                  <div className="viz-timeline__row viz-timeline__row--active">
                    <span className="viz-timeline__label">Kapına geliriz</span>
                    <span className="viz-timeline__badge">~30 dk</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===== SERVICES ===== */}
        <section id="hizmetler" className="section section--tight">
          <div className="container">
            <header className="section__head section__head--center">
              <h2 className="section__title">
                Bir mahalle bakkalında olması gereken,{" "}
                <span className="mute">biraz daha özenle.</span>
              </h2>
            </header>

            <div className="services">
              {services.map((s) => (
                <a
                  key={s.title}
                  href={BUSINESS.whatsapp.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="service"
                >
                  <div className="service__icon">
                    <s.icon />
                  </div>
                  <h3 className="service__title">{s.title}</h3>
                  <p className="service__body">{s.body}</p>
                  <span className="service__cta">
                    Sipariş ver <ArrowRight />
                  </span>
                </a>
              ))}
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
                üzerinden bıraktığı yorumlar. Her biri gerçek.
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
                Tüm yorumları Google&apos;da gör <ArrowUR />
              </a>
            </div>
          </div>
        </section>

        {/* ===== CTA — command center ===== */}
        <section className="cta">
          <div className="container">
            <div className="cta__head">
              <h2 className="cta__title">
                Bir mesaj <em>uzaktayız.</em>
              </h2>
              <p className="cta__sub">
                Listeyi yaz, kapına gelelim. Mahalle içi teslimat ücretsiz.
              </p>
            </div>

            <div className="cta__grid">
              <a
                href={BUSINESS.whatsapp.href}
                target="_blank"
                rel="noopener noreferrer"
                className="cta-card cta-card--primary"
              >
                <span className="cta-card__icon"><WhatsAppIcon /></span>
                <span className="cta-card__eyebrow">WhatsApp</span>
                <span className="cta-card__title">Sipariş ver</span>
                <span className="cta-card__detail">Mesajla, gerisi bize</span>
                <span className="cta-card__arrow" aria-hidden="true"><ArrowUR /></span>
              </a>
              <a href={BUSINESS.phone.href} className="cta-card">
                <span className="cta-card__icon"><PhoneIcon /></span>
                <span className="cta-card__eyebrow">Telefon</span>
                <span className="cta-card__title">{BUSINESS.phone.display}</span>
                <span className="cta-card__detail">Arayıp söyleyebilirsin</span>
                <span className="cta-card__arrow" aria-hidden="true"><ArrowUR /></span>
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
                <span className="cta-card__arrow" aria-hidden="true"><ArrowUR /></span>
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
              <a href="#top" className="brand" aria-label={BUSINESS.name}>
                <span className="brand__mono">
                  yenimahalle<em>.market</em>
                  <span className="slash">/</span>
                  sapanca
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
                <a
                  href={BUSINESS.whatsapp.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="WhatsApp"
                >
                  <WhatsAppIcon />
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
                <li><a href="#top">Anasayfa</a></li>
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
                    href={BUSINESS.whatsapp.href}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    WhatsApp
                  </a>
                </li>
              </ul>
            </div>
            <div className="footer__col">
              <h4>Saatler</h4>
              <ul>
                <li><p>Pzt–Paz · 07:30–22:30</p></li>
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
