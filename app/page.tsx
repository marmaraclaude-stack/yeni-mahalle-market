import { BUSINESS } from "@/lib/business";
import { IMAGES } from "@/lib/images";

/* ============================================================
   SVG icons
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

function ChevronLeft() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ChevronRight() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
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

function BasketIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M3 7h18M6 7l1.2 12.2a2 2 0 002 1.8h5.6a2 2 0 002-1.8L18 7M9 7V5a3 3 0 016 0v2" />
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

/* ============================================================
   DATA
   ============================================================ */
const navLinks = [
  { label: "Anasayfa", href: "#top", active: true },
  { label: "Ürünler", href: "#urunler" },
  { label: "Galeri", href: "#galeri" },
  { label: "Nasıl Çalışır", href: "#nasil" },
  { label: "İletişim", href: "#iletisim" },
];

const packages = [
  { title: "Meyve & Sebze", meta: "Mevsiminde", photo: IMAGES.produce },
  { title: "Şarküteri", meta: "Tartı ile", photo: IMAGES.charcuterie },
  { title: "Fırın", meta: "Sabah taze", photo: IMAGES.bread },
  { title: "Eve Teslimat", meta: "Aynı gün", photo: IMAGES.delivery },
];

const steps = [
  { n: 1, title: "Ürünleri seç", body: "Hangi ürüne ihtiyacın olduğunu listele. Aklına geleni söyle, gerisi bizden.", active: true },
  { n: 2, title: "WhatsApp ya da telefon", body: "Sipariş listeni WhatsApp'tan yaz ya da telefondan ara. Aradan birkaç dakika geçer." },
  { n: 3, title: "Tezgâhtan toplayalım", body: "Hızla hazırlayıp paketleyelim. Gerekiyorsa eksikleri arayıp soralım." },
  { n: 4, title: "Kapına gelelim", body: "Mahalle içi ortalama beş dakika. Ücretsiz. Sıcak ekmekle birlikte gelir." },
];

export default function Home() {
  return (
    <>
      <div className="page" id="top">
        {/* NAV — 3 col: brand | floating pill | cta group */}
        <header className="nav" aria-label="Üst menü">
          <div className="nav__brand-cell">
            <a href="#top" className="brand" aria-label={BUSINESS.name}>
              <span className="brand__mark" aria-hidden="true">Y</span>
              <span className="brand__name">{BUSINESS.name}</span>
            </a>
          </div>

          <nav className="nav__pill" aria-label="Ana menü">
            {navLinks.map((l) => (
              <a
                key={l.label}
                href={l.href}
                className={`nav__link${l.active ? " nav__link--active" : ""}`}
              >
                {l.label}
              </a>
            ))}
          </nav>

          <div className="nav__cta-cell">
            <a
              href={BUSINESS.whatsapp.href}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost-pill"
            >
              Sipariş ver
            </a>
            <a
              href={BUSINESS.whatsapp.href}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-circle-arrow"
              aria-label="Sipariş ver"
            >
              <ArrowUR />
            </a>
          </div>
        </header>

        {/* HERO */}
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero__frame">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className="hero__bg"
              src={IMAGES.hero}
              alt=""
              loading="eager"
              decoding="async"
              fetchPriority="high"
            />

            <div className="hero__center">
              <span className="pill-glass">
                <span className="dot" aria-hidden="true" />
                Sapanca, Yeni Mahalle
              </span>
            </div>

            <h1 id="hero-title" className="hero__title">
              <span>Mahallenin bakkalı,</span>
              <span>kapına kadar.</span>
            </h1>

            <div className="hero__bottom">
              {/* Glass card */}
              <aside className="hero__glass">
                <div className="hero__glass-label">
                  <span className="avatars" aria-hidden="true">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img className="avatars__item" src={IMAGES.produce} alt="" />
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img className="avatars__item" src={IMAGES.bread} alt="" />
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img className="avatars__item" src={IMAGES.charcuterie} alt="" />
                    <span className="avatars__count">5dk</span>
                  </span>
                  <span>Mahalle içi teslim</span>
                </div>

                <p className="hero__glass-body">
                  Taze meyve, sebze, ekmek ve günlük ihtiyaçların WhatsApp&apos;tan
                  tek mesajla. Sapanca Yeni Mahalle içinde ortalama beş dakikada
                  kapında.
                </p>

                <a
                  href={BUSINESS.whatsapp.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="pill-cta"
                >
                  <span className="pill-cta__label">WhatsApp&apos;tan başla</span>
                  <span className="pill-cta__arrow" aria-hidden="true">
                    <ArrowUR />
                  </span>
                </a>
              </aside>

              {/* Photo cards */}
              <div className="hero__cards" role="list">
                <article className="hcard hcard--featured" role="listitem">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img className="hcard__photo" src={IMAGES.produce} alt="Taze sebze ve meyve" loading="lazy" />
                  <div className="hcard__caption">
                    <h3 className="hcard__cap-title">Günün tazeleri</h3>
                    <p className="hcard__cap-sub">
                      Sabah halden gelen meyve sebze, her gün taze raflarda.
                    </p>
                  </div>
                </article>
                <article className="hcard" role="listitem">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img className="hcard__photo" src={IMAGES.charcuterie} alt="Şarküteri" loading="lazy" />
                </article>
                <article className="hcard" role="listitem">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img className="hcard__photo" src={IMAGES.bread} alt="Fırın" loading="lazy" />
                </article>
                <article className="hcard" role="listitem">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img className="hcard__photo" src={IMAGES.delivery} alt="Teslimat" loading="lazy" />
                </article>
              </div>
            </div>
          </div>
        </section>
      </div>

      <main>
        {/* MOMENTS */}
        <section className="moments" id="galeri">
          <div className="moments__head">
            <span className="pill-light">
              <SparkleIcon />
              Tezgâhtan
            </span>
            <h2 className="headline-display">
              Unutulmaz <span className="mute">tatlar</span>
              <br />
              Yeni Mahalle&apos;de.
            </h2>
            <p className="section-sub">
              Her sabah seçilen meyveler, fırından gelen ekmek ve mahallenin
              kendi tarifleri. Küçük anlardan oluşan bir lezzet günlüğü.
            </p>
          </div>

          <div className="moments__rail" role="region" aria-label="Tezgâh anları">
            <article className="moment">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={IMAGES.produce} alt="Taze meyve ve sebze tezgâhı" loading="lazy" />
            </article>
            <article className="moment">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={IMAGES.bread} alt="Sıcak ekmek ve fırın ürünleri" loading="lazy" />
            </article>
            <article className="moment moment--overlay">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={IMAGES.charcuterie} alt="Şarküteri ve yerel peynirler" loading="lazy" />
              <div className="moment__cap">
                <div className="moment__cap-title">Şarküteri köşesi</div>
                <div className="moment__cap-sub">Ezine, Erzincan tulum, ev yapımı sucuk</div>
              </div>
            </article>
            <article className="moment">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={IMAGES.gallery1} alt="Mahalle tezgâhı detayı" loading="lazy" />
            </article>
            <article className="moment">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={IMAGES.delivery} alt="Mahalleye teslimat" loading="lazy" />
            </article>
            <article className="moment">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={IMAGES.gallery2} alt="Yeni Mahalle tezgâhı" loading="lazy" />
            </article>
          </div>

          <div className="rail-foot">
            <button className="rail-arrow" type="button" aria-label="Önceki">
              <ChevronLeft />
            </button>
            <div className="rail-bar" role="presentation" />
            <button className="rail-arrow" type="button" aria-label="Sonraki">
              <ChevronRight />
            </button>
          </div>
        </section>

        {/* PACKAGES */}
        <section className="packages" id="urunler">
          <div className="packages__head">
            <span className="pill-light">
              <BasketIcon />
              Ne satıyoruz
            </span>
            <h2 className="headline-display">
              Mahallene gerekenler
              <br />
              <span className="mute">hepsi</span> tek bir yerde.
            </h2>
            <p className="section-sub">
              Mevsiminde meyve sebze, günlük süt ürünleri, fırın ve şarküteri.
              Adres tarif eder, biz kapına bırakırız.
            </p>
          </div>

          <div className="packages__grid">
            <a
              className="pkg-hero"
              href={BUSINESS.whatsapp.href}
              target="_blank"
              rel="noopener noreferrer"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={IMAGES.hero} alt="Sapanca'dan günlük taze ürünler" loading="lazy" />
              <div className="pkg-hero__title">
                Sapanca&apos;dan
                <br />
                günlük taze.
              </div>
            </a>

            <div className="pkg-grid">
              {packages.map((p) => (
                <a
                  key={p.title}
                  className="pkg"
                  href={BUSINESS.whatsapp.href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.photo} alt={p.title} loading="lazy" />
                  <div className="pkg__body">
                    <div className="pkg__title">{p.title}</div>
                    <div className="pkg__row">
                      <span className="pkg__meta">{p.meta}</span>
                      <span className="pkg__link">
                        Sor <ArrowRight />
                      </span>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="howto" id="nasil">
          <header className="howto__head">
            <h2 className="howto__title">
              Nasıl sipariş <em>verirsin</em>
            </h2>
            <div className="howto__tags" aria-hidden="true">
              <span className="howto__tag">Telefon</span>
              <span className="howto__tag">WhatsApp</span>
              <span className="howto__tag">Hızlı teslim</span>
              <span className="howto__tag">Mahalle içi</span>
              <span className="howto__tag">Ücretsiz</span>
            </div>
          </header>

          <div className="howto__grid">
            <figure className="howto__photo">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={IMAGES.story} alt="Tezgâhtan taze ürünler" loading="lazy" />
              <figcaption className="howto__photo-cap">
                <p className="howto__photo-text">
                  Listeyi WhatsApp&apos;tan yaz, gerisini biz halledelim. Birkaç dakika içinde kapında.
                </p>
                <a
                  href={BUSINESS.whatsapp.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="pill-cta"
                  aria-label="WhatsApp'tan yaz"
                >
                  <span className="pill-cta__label">Yaz</span>
                  <span className="pill-cta__arrow" aria-hidden="true">
                    <ArrowRight />
                  </span>
                </a>
              </figcaption>
            </figure>

            <div className="howto__steps">
              <p className="howto__eyebrow">Sipariş süreci</p>
              <h3 className="howto__steps-title">Dört adımda sipariş</h3>
              {steps.map((s) => (
                <div key={s.n} className={`step${s.active ? " step--active" : ""}`}>
                  <span className="step__num">{s.n}</span>
                  <div>
                    <h4 className="step__title">{s.title}</h4>
                    <p className="step__body">{s.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="cta" aria-labelledby="cta-title">
          <div className="cta__frame">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={IMAGES.hero} alt="" loading="lazy" />
            <div className="cta__inner">
              <h2 id="cta-title" className="cta__title">
                <span>Bugün ne lazımsa,</span>
                <span>bir telefon kadar uzakta.</span>
              </h2>
              <p className="cta__sub">
                Mahalle içindeysen ortalama beş dakikada elindeyiz. Söyle, kapına getirelim.
              </p>
              <a
                href={BUSINESS.whatsapp.href}
                target="_blank"
                rel="noopener noreferrer"
                className="cta__btn"
              >
                WhatsApp&apos;tan sipariş ver
                <span className="pill-cta__arrow" aria-hidden="true">
                  <ArrowRight />
                </span>
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
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
              <li><a href="#urunler">Ürünler</a></li>
              <li><a href="#galeri">Galeri</a></li>
              <li><a href="#nasil">Nasıl Çalışır</a></li>
            </ul>
          </nav>

          <div className="footer__col">
            <h4>İletişim</h4>
            <p>{BUSINESS.address.full}</p>
            <a href={BUSINESS.phone.href}>{BUSINESS.phone.display}</a>
            <a href={BUSINESS.whatsapp.href} target="_blank" rel="noopener noreferrer">
              WhatsApp
            </a>
          </div>

          <div className="footer__col">
            <h4>Hızlı sipariş</h4>
            <p className="footer__cta-text">
              Listeni gönder, kapına getirelim. Mahalle içi ortalama beş dakika.
            </p>
            <a
              href={BUSINESS.whatsapp.href}
              target="_blank"
              rel="noopener noreferrer"
              className="footer__cta-btn"
            >
              WhatsApp&apos;tan sipariş ver
            </a>
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
        </div>

        <div className="footer__bottom">
          © {new Date().getFullYear()} {BUSINESS.name}. Tüm hakları saklıdır.
        </div>
      </footer>
    </>
  );
}
