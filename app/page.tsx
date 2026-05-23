import { BUSINESS } from "@/lib/business";
import { IMAGES } from "@/lib/images";
import {
  IconWhatsApp,
  IconInstagram,
  IconDirections,
  IconArrow,
} from "@/components/icons";

const sells = [
  {
    title: "Taze meyve ve sebze",
    body: "Her sabah seçilen mevsim meyveleri, sebzeleri ve yeşillikler. Sapanca'nın tazesi tezgâhımızda.",
  },
  {
    title: "Şarküteri ve kahvaltılık",
    body: "Peynir, zeytin, kaşar, sucuk, salam, tereyağı. Kahvaltını kuran her şey kasamızdan tartılır.",
  },
  {
    title: "Süt ve ekmek",
    body: "Sıcak ekmek, günlük süt, yoğurt, ayran. Sabah erken, akşam geç, her zaman taze.",
  },
  {
    title: "Günlük market ihtiyacı",
    body: "Deterjan, temizlik, atıştırmalık, içecek. Aklına gelen, kapımızda hazır.",
  },
  {
    title: "Adrese teslim",
    body: "Mahalle içinde ortalama beş dakika. Ücretsiz. Telefonla ya da WhatsApp'tan söyle, yeter.",
  },
  {
    title: "Geniş çalışma saatleri",
    body: "Haftanın yedi günü, sabah 07:30'dan itibaren açığız. Bayram dahil.",
  },
];

function IconClockMini() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}

function IconScooterMini() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="6" cy="18" r="3" />
      <circle cx="18" cy="18" r="3" />
      <path d="M9 18h6M6 18l3-9h4l3 9M13 9V5h3" />
    </svg>
  );
}

function IconLeafMini() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M19 4c-7 0-13 6-13 13a6 6 0 0 0 6 6c7 0 13-6 13-13V4h-6z" />
      <path d="M6 17c4-4 8-6 13-7" />
    </svg>
  );
}

export default function Home() {
  return (
    <>
      <div className="topbar" role="banner" aria-label="Durum">
        <div className="container topbar__inner">
          <span className="topbar__status">
            <span className="dot" aria-hidden />
            <span>Şu an açık. Sapanca, Yeni Mahalle.</span>
          </span>
          <a className="topbar__link" href={BUSINESS.phone.href}>
            <span aria-hidden>☎</span>
            <span>{BUSINESS.phone.display}</span>
          </a>
        </div>
      </div>

      <header className="header">
        <div className="container header__inner">
          <a className="brand" href="#" aria-label={`${BUSINESS.name} anasayfa`}>
            <span className="brand__mark" aria-hidden>
              Y
            </span>
            <span className="brand__name">Yeni Mahalle Market</span>
          </a>
          <div className="header__actions">
            <a
              href={BUSINESS.whatsapp.href}
              className="btn btn--whatsapp btn--sm"
              target="_blank"
              rel="noopener noreferrer"
            >
              <IconWhatsApp className="btn__icon" />
              <span>WhatsApp</span>
            </a>
            <a href={BUSINESS.phone.href} className="btn btn--black btn--sm">
              <span>Hemen Ara</span>
              <IconArrow className="btn__icon" />
            </a>
          </div>
        </div>
      </header>

      <main>
        {/* Hero — 2-column with prominent photo */}
        <section className="hero" aria-labelledby="hero-title">
          <div className="container">
            <div className="hero__grid">
              <div>
                <h1 id="hero-title" className="hero__title reveal">
                  Sapanca&apos;nın
                  <br />
                  <span className="hero__title-line2">bakkalı.</span>
                </h1>
                <p className="hero__lede reveal">
                  Yeni Mahalle&apos;de taze meyve sebze, şarküteri ve günlük
                  market ihtiyaçların. Söyle, kapına getirelim.
                </p>
                <div className="hero__ctas reveal">
                  <a
                    href={BUSINESS.whatsapp.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn--primary btn--lg"
                  >
                    <IconWhatsApp className="btn__icon" />
                    <span>WhatsApp&apos;tan sipariş ver</span>
                  </a>
                  <a href="#iletisim" className="btn btn--outline btn--lg">
                    <span>İletişim</span>
                    <IconArrow className="btn__icon" />
                  </a>
                </div>

                <dl className="hero__facts reveal">
                  <div className="hero__fact">
                    <dt className="hero__fact-key">Saatler</dt>
                    <dd className="hero__fact-val">07:30, 22:00</dd>
                  </div>
                  <div className="hero__fact">
                    <dt className="hero__fact-key">Günler</dt>
                    <dd className="hero__fact-val">Her gün</dd>
                  </div>
                  <div className="hero__fact">
                    <dt className="hero__fact-key">Teslimat</dt>
                    <dd className="hero__fact-val">Mahalle içi</dd>
                  </div>
                  <div className="hero__fact">
                    <dt className="hero__fact-key">Konum</dt>
                    <dd className="hero__fact-val">Kurtuluş Cd.</dd>
                  </div>
                </dl>
              </div>

              <div className="hero__photo reveal">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={IMAGES.hero}
                  alt="Yeni Mahalle Market tezgâhı"
                  loading="eager"
                  decoding="async"
                  fetchPriority="high"
                />
                <span className="hero__photo-badge">
                  <span className="dot" aria-hidden />
                  Şu an açık
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Values — 3 column trio */}
        <section className="values" aria-labelledby="values-title">
          <div className="container">
            <div className="values__head">
              <h2 id="values-title" className="section-title">
                Neden <span className="section-title__accent">buradayız</span>.
              </h2>
              <p className="section-lede">
                Mahallenin bakkalı olarak tek işimiz var, o da seni gözetmek.
                Taze ürün, tanıdık yüz, zamanında teslim.
              </p>
            </div>
            <div className="values__grid">
              <article className="value">
                <span className="value__icon"><IconLeafMini /></span>
                <h3 className="value__title">Her gün taze</h3>
                <p className="value__body">
                  Meyve sebze tezgâhımız her sabah yeniden kurulur. Mevsiminde
                  olan, mevsiminde gelir.
                </p>
              </article>
              <article className="value">
                <span className="value__icon"><IconScooterMini /></span>
                <h3 className="value__title">Kapına teslim</h3>
                <p className="value__body">
                  Mahalle içinde ortalama beş dakika. Telefon ya da WhatsApp ile
                  söyle, gerisi bizden.
                </p>
              </article>
              <article className="value">
                <span className="value__icon"><IconClockMini /></span>
                <h3 className="value__title">Geniş saatler</h3>
                <p className="value__body">
                  Haftanın yedi günü, sabah 07:30&apos;dan itibaren. Bayram
                  dahil hep açığız.
                </p>
              </article>
            </div>
          </div>
        </section>

        {/* What we sell */}
        <section className="sell" aria-labelledby="sell-title">
          <div className="container">
            <div className="values__head">
              <h2 id="sell-title" className="section-title">
                Ne <span className="section-title__accent">satıyoruz</span>.
              </h2>
              <p className="section-lede">
                Bir mahalle bakkalının yapması gereken her şey. Tartı, fatura,
                kapıya kadar.
              </p>
            </div>
            <div className="sell__list">
              {sells.map((s) => (
                <article className="sell__item" key={s.title}>
                  <h3 className="sell__item-title">{s.title}</h3>
                  <p className="sell__item-body">{s.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Order CTA — large card with photo */}
        <section className="order" aria-labelledby="order-title">
          <div className="container">
            <div className="order__card">
              <div className="order__text">
                <h2 id="order-title" className="order__title">
                  Söyle,{" "}
                  <span className="order__title-accent">getirelim.</span>
                </h2>
                <p className="order__lede">
                  WhatsApp&apos;tan ya da telefondan siparişini bildir. Mahalle
                  içindeysen ortalama beş dakikada elindeyiz.
                </p>
                <div className="order__ctas">
                  <a
                    href={BUSINESS.whatsapp.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn--primary btn--lg"
                  >
                    <IconWhatsApp className="btn__icon" />
                    WhatsApp&apos;tan yaz
                  </a>
                  <a
                    href={BUSINESS.phone.href}
                    className="btn btn--outline btn--lg"
                  >
                    {BUSINESS.phone.display}
                  </a>
                </div>
              </div>
              <div className="order__photo" aria-hidden>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={IMAGES.produce} alt="" loading="lazy" />
              </div>
            </div>
          </div>
        </section>

        {/* Contact */}
        <section
          className="contact"
          id="iletisim"
          aria-labelledby="contact-title"
        >
          <div className="container">
            <div className="contact__head">
              <h2 id="contact-title" className="contact__title">
                Gel,{" "}
                <span className="contact__title-accent">ya da</span> biz
                gelelim.
              </h2>
              <p className="section-lede">
                Telefon, WhatsApp, Instagram. Hangisi sana rahatsa, oradan
                yazışalım.
              </p>
            </div>
            <div className="contact__grid">
              <div>
                <dl className="contact__list">
                  <div className="contact__row">
                    <dt>Adres</dt>
                    <dd>{BUSINESS.address.full}</dd>
                  </div>
                  <div className="contact__row">
                    <dt>Telefon</dt>
                    <dd>
                      <a href={BUSINESS.phone.href}>
                        {BUSINESS.phone.display}
                      </a>
                    </dd>
                  </div>
                  <div className="contact__row">
                    <dt>Çalışma</dt>
                    <dd>
                      Her gün, {BUSINESS.hours.opens} {BUSINESS.hours.closes}
                    </dd>
                  </div>
                  <div className="contact__row">
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
                  </div>
                </dl>
                <div className="contact__social">
                  <a
                    href={BUSINESS.whatsapp.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn--primary"
                  >
                    <IconWhatsApp className="btn__icon" />
                    WhatsApp
                  </a>
                  <a
                    href={BUSINESS.instagram.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn--outline"
                  >
                    <IconInstagram className="btn__icon" />
                    Instagram
                  </a>
                  <a
                    href={BUSINESS.googleMapsDirectionsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn--outline"
                  >
                    <IconDirections className="btn__icon" />
                    Yol Tarifi
                  </a>
                </div>
              </div>
              <div className="contact__map" aria-label="Konum">
                <iframe
                  src={BUSINESS.googleMapsEmbedUrl}
                  title={`${BUSINESS.name} harita`}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                />
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="container">
          <div className="footer__wordmark">
            Yeni Mahalle
            <br />
            <span className="footer__wordmark-accent">Market.</span>
          </div>
          <div className="footer__grid">
            <div className="footer__col">
              <h4>Hakkında</h4>
              <p className="footer__desc">{BUSINESS.shortDescription}</p>
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
              <h4>Sosyal</h4>
              <a
                href={BUSINESS.instagram.href}
                target="_blank"
                rel="noopener noreferrer"
              >
                Instagram, {BUSINESS.instagram.handle}
              </a>
              <a
                href={BUSINESS.googleMapsDirectionsUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                Yol Tarifi
              </a>
              <a
                href={BUSINESS.googleMapsCidUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                Google İşletme Profili
              </a>
            </div>
          </div>
          <div className="footer__bottom">
            <span>
              © {new Date().getFullYear()} {BUSINESS.name}. Tüm hakları
              saklıdır.
            </span>
            <span>Sapanca, Yeni Mahalle, Kurtuluş Caddesi.</span>
          </div>
        </div>
      </footer>
    </>
  );
}
