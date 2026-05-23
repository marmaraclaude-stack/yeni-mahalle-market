import { BUSINESS } from "@/lib/business";
import { IMAGES } from "@/lib/images";
import { IconWhatsApp, IconInstagram } from "@/components/icons";

const navLinks = [
  { label: "Anasayfa", href: "#", active: true },
  { label: "Ürünler", href: "#urunler" },
  { label: "Galeri", href: "#galeri" },
  { label: "Nasıl Çalışır", href: "#nasil" },
  { label: "İletişim", href: "#iletisim" },
];

const heroCards = [
  { label: "Adrese teslim", sub: "Mahalle içi 5 dk", photo: IMAGES.delivery },
  { label: "Sıcak ekmek", sub: "Fırından çıkan", photo: IMAGES.bread },
  { label: "Şarküteri", sub: "Tartı ile", photo: IMAGES.charcuterie },
  { label: "Taze sebze", sub: "Mevsiminde", photo: IMAGES.produce },
];

const momentCards = [
  { src: IMAGES.gallery1, title: "", sub: "" },
  { src: IMAGES.produce, title: "", sub: "" },
  { src: IMAGES.charcuterie, title: "Şarküteri tezgâhı", sub: "Tartı ile, taze" },
  { src: IMAGES.delivery, title: "", sub: "" },
  { src: IMAGES.gallery2, title: "", sub: "" },
  { src: IMAGES.bread, title: "", sub: "" },
];

const packages = [
  { title: "Taze meyve sebze", meta: "Mevsiminde", photo: IMAGES.produce },
  { title: "Şarküteri, kahvaltı", meta: "Tartı ile", photo: IMAGES.charcuterie },
  { title: "Ekmek ve fırın", meta: "Sıcak, günlük", photo: IMAGES.bread },
  { title: "Adrese teslim", meta: "Mahalle içi", photo: IMAGES.delivery },
];

const steps = [
  {
    n: 1,
    title: "Ürünleri seç",
    body: "Hangi ürüne ihtiyacın olduğunu listele. Aklına geleni söyle, gerisi bizden.",
    active: true,
  },
  {
    n: 2,
    title: "WhatsApp ya da telefon",
    body: "Sipariş listeni WhatsApp'tan yaz ya da telefondan ara. Aradan birkaç dakika geçer.",
  },
  {
    n: 3,
    title: "Tezgâhtan toplayalım",
    body: "Hızla hazırlayıp paketleyelim. Gerekiyorsa eksikleri arayıp soralım.",
  },
  {
    n: 4,
    title: "Kapına gelelim",
    body: "Mahalle içi ortalama beş dakika. Ücretsiz. Sıcak ekmekle birlikte gelir.",
  },
];

function IconArrowSmall() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M7 17L17 7" />
      <path d="M9 7h8v8" />
    </svg>
  );
}

function IconChevronRight() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M9 6l6 6-6 6" />
    </svg>
  );
}

function IconChevronLeft() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M15 6l-6 6 6 6" />
    </svg>
  );
}

function IconMail() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 7l9 6 9-6" />
    </svg>
  );
}

export default function Home() {
  return (
    <>
      {/* Floating pill nav */}
      <nav className="nav" aria-label="Ana navigasyon">
        <div className="container nav__inner">
          <a className="brand" href="#" aria-label={`${BUSINESS.name} anasayfa`}>
            <span className="brand__mark" aria-hidden="true">Y</span>
            <span className="brand__name">Yeni Mahalle</span>
          </a>

          <div className="nav__pill">
            {navLinks.map((l) => (
              <a
                key={l.label}
                href={l.href}
                className={`nav__link${l.active ? " nav__link--active" : ""}`}
              >
                {l.label}
              </a>
            ))}
          </div>

          <a
            href={BUSINESS.whatsapp.href}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn--ghost"
          >
            <span>Sipariş ver</span>
            <span className="btn__arrow"><IconArrowSmall /></span>
          </a>
        </div>
      </nav>

      <main>
        {/* HERO */}
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero__frame">
            <div className="hero__bg" aria-hidden="true">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={IMAGES.hero}
                alt=""
                loading="eager"
                decoding="async"
                fetchPriority="high"
              />
            </div>

            <div className="hero__center">
              <span className="pill">
                <span className="dot" aria-hidden="true" />
                Sapanca, Yeni Mahalle
              </span>
              <h1 id="hero-title" className="hero__title">
                Mahallenin bakkalı,
                <br />
                kapına kadar.
              </h1>
            </div>

            <div className="hero__bottom">
              <div className="hero__glass">
                <div className="hero__glass-top">
                  <span className="avatars" aria-hidden="true">
                    <span className="avatars__item">Y</span>
                    <span className="avatars__item">M</span>
                    <span className="avatars__item">B</span>
                    <span className="avatars__count">5dk</span>
                  </span>
                  <span className="hero__glass-label">Mahalle içi teslim</span>
                </div>
                <p className="hero__glass-body">
                  Yeni Mahalle&apos;de taze meyve sebze, şarküteri ve günlük
                  market ihtiyaçların. Söyle, kapına getirelim.
                </p>
                <a
                  href={BUSINESS.whatsapp.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn--white hero__glass-cta"
                >
                  <span>WhatsApp&apos;tan başla</span>
                  <span className="btn__arrow"><IconArrowSmall /></span>
                </a>
              </div>

              <div className="hero__cards" aria-label="Tezgâhtan kareler">
                {heroCards.map((c) => (
                  <div className="hcard" key={c.label}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={c.photo} alt="" loading="lazy" />
                    <div className="hcard__label">
                      {c.label}
                      <span className="hcard__sub">{c.sub}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* MOMENTS - photo rail */}
        <section className="moments" id="galeri" aria-labelledby="moments-title">
          <div className="container">
            <span className="pill pill--light moments__pill">
              <span className="dot" aria-hidden="true" />
              Tezgâhtan
            </span>
            <h2 id="moments-title" className="moments__title">
              Unutulmaz tatlar{" "}
              <span className="moments__title-mute">Yeni Mahalle&apos;de.</span>
            </h2>
            <p className="moments__sub">
              Mevsim değiştikçe tezgâh da değişir. Taze ürün, tanıdık yüz,
              günlük seçim. Yakın geçmişten birkaç kadraj.
            </p>
          </div>

          <div className="moments__rail">
            {momentCards.map((m, i) => (
              <figure
                className={`moment${m.title ? " moment--overlay" : ""}`}
                key={i}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={m.src} alt="" loading="lazy" />
                {m.title && (
                  <figcaption className="moment__cap">
                    <span className="moment__cap-title">{m.title}</span>
                    <span className="moment__cap-sub">{m.sub}</span>
                  </figcaption>
                )}
              </figure>
            ))}
          </div>

          <div className="container">
            <div className="rail-foot">
              <button className="btn btn--ghost btn--sm" aria-label="Önceki">
                <IconChevronLeft />
              </button>
              <span className="rail-bar"><span /></span>
              <button className="btn btn--ghost btn--sm" aria-label="Sonraki">
                <IconChevronRight />
              </button>
            </div>
          </div>
        </section>

        {/* PACKAGES - tall left + 2x2 right */}
        <section className="packages" id="urunler" aria-labelledby="packages-title">
          <div className="container">
            <div className="packages__head">
              <span className="pill pill--light moments__pill">
                <span className="dot" aria-hidden="true" />
                Ne satıyoruz
              </span>
              <h2 id="packages-title" className="packages__title">
                Mahallene gerekenler{" "}
                <span className="packages__title-mute">hepsi tek bir yerde.</span>
              </h2>
              <p className="packages__sub">
                Bir mahalle bakkalının yapması gereken her şey, biraz daha
                özenle. Hepsi bir telefonda.
              </p>
            </div>

            <div className="packages__grid">
              <article className="pkg-hero">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={IMAGES.gallery1} alt="" loading="lazy" />
                <h3 className="pkg-hero__title">
                  Sapanca&apos;dan günlük taze.
                </h3>
              </article>

              <div className="pkg-grid">
                {packages.map((p) => (
                  <a
                    key={p.title}
                    href={BUSINESS.whatsapp.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="pkg"
                    aria-label={`${p.title} için WhatsApp'tan yaz`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={p.photo} alt="" loading="lazy" />
                    <div className="pkg__body">
                      <div className="pkg__title">{p.title}</div>
                      <div className="pkg__row">
                        <span className="pkg__meta">{p.meta}</span>
                        <span className="pkg__link">
                          Sor <IconArrowSmall />
                        </span>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="howto" id="nasil" aria-labelledby="howto-title">
          <div className="container">
            <div className="howto__head">
              <h2 id="howto-title" className="howto__title">
                Nasıl sipariş verirsin
              </h2>
              <div className="howto__tags">
                <span className="howto__tag">Telefon</span>
                <span className="howto__tag">WhatsApp</span>
                <span className="howto__tag">Hızlı teslim</span>
                <span className="howto__tag">Mahalle içi</span>
                <span className="howto__tag">Ücretsiz</span>
              </div>
            </div>

            <div className="howto__grid">
              <div className="howto__photo">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={IMAGES.story} alt="" loading="lazy" />
                <div className="howto__photo-cap">
                  <p className="howto__photo-text">
                    Mahallenin bakkalına bir telefon, kapına ulaşan sipariş.
                  </p>
                  <a
                    href={BUSINESS.whatsapp.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn--white btn--sm"
                  >
                    <span>Yaz</span>
                    <span className="btn__arrow"><IconArrowSmall /></span>
                  </a>
                </div>
              </div>

              <div className="howto__steps">
                <span className="howto__eyebrow">Sipariş süreci</span>
                <h3 className="howto__steps-title">Dört adımda sipariş</h3>
                {steps.map((s) => (
                  <div
                    key={s.n}
                    className={`step${s.active ? " step--active" : ""}`}
                  >
                    <span className="step__num">{s.n}</span>
                    <div>
                      <div className="step__title">{s.title}</div>
                      <p className="step__body">{s.body}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA full-bleed */}
        <section className="cta" aria-labelledby="cta-title">
          <div className="cta__frame">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={IMAGES.hero} alt="" loading="lazy" />
            <div className="cta__inner">
              <h2 id="cta-title" className="cta__title">
                Bugün ne lazımsa,
                <br />
                bir telefon kadar uzakta.
              </h2>
              <p className="cta__sub">
                Mahalle içindeysen ortalama beş dakikada elindeyiz. Söyle,
                kapına getirelim.
              </p>
              <a
                href={BUSINESS.whatsapp.href}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn--white cta__btn"
              >
                <span>WhatsApp&apos;tan sipariş ver</span>
                <span className="btn__arrow"><IconArrowSmall /></span>
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="footer" id="iletisim">
        <div className="container">
          <div className="footer__grid">
            <div className="footer__brand-block">
              <a className="brand" href="#">
                <span className="brand__mark" aria-hidden="true">Y</span>
                <span className="brand__name">Yeni Mahalle</span>
              </a>
              <p className="footer__desc">
                Sapanca Yeni Mahalle&apos;nin bakkalı. Taze meyve sebze,
                şarküteri ve günlük market ihtiyaçların, kapına teslim.
              </p>
            </div>

            <div className="footer__col">
              <h4>Bağlantılar</h4>
              <a href="#">Anasayfa</a>
              <a href="#urunler">Ürünler</a>
              <a href="#galeri">Galeri</a>
              <a href="#nasil">Nasıl Çalışır</a>
            </div>

            <div className="footer__col">
              <h4>İletişim</h4>
              <p>{BUSINESS.address.full}</p>
              <a href={BUSINESS.phone.href}>{BUSINESS.phone.display}</a>
              <a
                href={BUSINESS.whatsapp.href}
                target="_blank"
                rel="noopener noreferrer"
              >
                WhatsApp&apos;tan yaz
              </a>
            </div>

            <div className="footer__col">
              <h4>İletişimde kal</h4>
              <p>Güncellemeler ve mahalle haberleri için.</p>
              <form
                className="subscribe"
                action={BUSINESS.whatsapp.href}
                target="_blank"
                rel="noopener noreferrer"
              >
                <input
                  type="email"
                  placeholder="E-postanı yaz"
                  aria-label="E-posta"
                />
                <button type="submit">Abone ol</button>
              </form>
              <div className="footer__socials">
                <a
                  href={BUSINESS.instagram.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                >
                  <IconInstagram />
                </a>
                <a
                  href={BUSINESS.whatsapp.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="WhatsApp"
                >
                  <IconWhatsApp />
                </a>
                <a
                  href={`mailto:`}
                  aria-label="E-posta"
                >
                  <IconMail />
                </a>
              </div>
            </div>
          </div>

          <div className="footer__bottom">
            © {new Date().getFullYear()} {BUSINESS.name}. Tüm hakları saklıdır.
          </div>
        </div>
      </footer>
    </>
  );
}
