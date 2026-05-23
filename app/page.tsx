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
    body: "Mahalle içinde ortalama 5 dakika. Ücretsiz. Telefonla ya da WhatsApp'tan söyle, yeter.",
  },
  {
    title: "Geniş çalışma saatleri",
    body: "Haftanın 7 günü, sabah 07:30'dan itibaren açığız. Bayram dahil.",
  },
];

export default function Home() {
  return (
    <>
      <div className="topbar" role="banner" aria-label="Durum">
        <div className="container topbar__inner">
          <span className="topbar__status">
            <span className="dot" aria-hidden />
            <span>Şu an açık · Sapanca / Yeni Mahalle</span>
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
        {/* Hero */}
        <section className="hero" aria-labelledby="hero-title">
          <div className="container">
            <div className="hero__inner">
              <h1 id="hero-title" className="hero__title reveal">
                Sapanca&apos;nın
                <br />
                <span className="hero__title-line2">bakkalı.</span>
              </h1>

              <div className="hero__bottom reveal">
                <div>
                  <p className="hero__lede">
                    Yeni Mahalle&apos;de taze meyve sebze, şarküteri ve günlük
                    market ihtiyaçların. Söyle, kapına getirelim.
                  </p>
                  <div className="hero__ctas">
                    <a
                      href={BUSINESS.whatsapp.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn--black btn--lg"
                    >
                      <IconWhatsApp className="btn__icon" />
                      <span>WhatsApp&apos;tan sipariş ver</span>
                    </a>
                    <a href="#iletisim" className="btn btn--outline btn--lg">
                      <span>İletişim</span>
                      <IconArrow className="btn__icon" />
                    </a>
                  </div>
                </div>

                <dl className="hero__sidefacts">
                  <div className="hero__fact">
                    <dt className="hero__fact-key">Saatler</dt>
                    <dd className="hero__fact-val">
                      07:30, <span style={{ color: "var(--gray-500)" }}>22:00</span>
                    </dd>
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
            </div>
          </div>
        </section>

        {/* Hero photo */}
        <section className="heroPhoto" aria-hidden>
          <div className="heroPhoto__frame">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={IMAGES.hero}
              alt=""
              loading="eager"
              decoding="async"
              fetchPriority="high"
            />
          </div>
        </section>

        {/* Statement */}
        <section className="statement" aria-label="Hakkında">
          <div className="container">
            <p className="statement__text">
              Mahallenin bakkalı. Taze, tanıdık, <strong>kapına kadar</strong>.
            </p>
          </div>
        </section>

        {/* What we sell */}
        <section className="sell" aria-labelledby="sell-title">
          <div className="container">
            <div className="sell__head">
              <h2 id="sell-title" className="section-title">
                Ne <span className="section-title__accent">satıyoruz</span>.
              </h2>
              <p className="sell__lede">
                Klasik bir mahalle bakkalının yapması gereken her şey, biraz daha
                özenle. Taze ürün, tanıdık yüz, kapına teslim.
              </p>
            </div>

            <div className="sell__grid">
              {sells.map((s) => (
                <article className="sell__item" key={s.title}>
                  <h3 className="sell__item-title">{s.title}</h3>
                  <p className="sell__item-body">{s.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Gallery */}
        <section className="gallery" aria-label="Galeri">
          <div className="container">
            <div className="gallery__head">
              <h2 className="section-title section-title--white">
                Tezgâhımızdan{" "}
                <span className="section-title__accent">kareler.</span>
              </h2>
              <p className="gallery__lede">
                Mevsim değiştikçe tezgâh da değişir. Yakın geçmişten birkaç
                kadraj.
              </p>
            </div>
            <div className="gallery__grid">
              {[
                IMAGES.gallery1,
                IMAGES.gallery2,
                IMAGES.gallery3,
                IMAGES.gallery4,
                IMAGES.gallery5,
              ].map((src, i) => (
                <figure className="gallery__item" key={i}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={src} alt="" loading="lazy" />
                </figure>
              ))}
            </div>
          </div>
        </section>

        {/* Order */}
        <section className="order" aria-labelledby="order-title">
          <div className="container">
            <div className="order__inner">
              <div>
                <h2 id="order-title" className="order__title">
                  Söyle,{" "}
                  <span className="order__title-emph">getirelim.</span>
                </h2>
                <p className="order__lede">
                  WhatsApp&apos;tan ya da telefondan siparişini bildir. Mahalle
                  içindeysen ortalama 5 dakikada elindeyiz.
                </p>
                <div className="order__ctas">
                  <a
                    href={BUSINESS.whatsapp.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn--black btn--lg"
                  >
                    <IconWhatsApp className="btn__icon" />
                    WhatsApp&apos;tan yaz
                  </a>
                  <a
                    href={BUSINESS.phone.href}
                    className="btn btn--outline-white btn--lg"
                  >
                    <span>{BUSINESS.phone.display}</span>
                  </a>
                </div>
              </div>

              <ol className="order__steps">
                <li className="order__step">
                  <span className="order__step-mark" aria-hidden />
                  <div>
                    <div className="order__step-title">Yaz veya ara</div>
                    <div className="order__step-sub">
                      WhatsApp ya da {BUSINESS.phone.display}.
                    </div>
                  </div>
                </li>
                <li className="order__step">
                  <span className="order__step-mark" aria-hidden />
                  <div>
                    <div className="order__step-title">Siparişini söyle</div>
                    <div className="order__step-sub">
                      İhtiyaçlarını listele, biz hazırlayalım.
                    </div>
                  </div>
                </li>
                <li className="order__step">
                  <span className="order__step-mark" aria-hidden />
                  <div>
                    <div className="order__step-title">Kapına gelelim</div>
                    <div className="order__step-sub">
                      Mahalle içi ücretsiz. Ortalama 5 dakika.
                    </div>
                  </div>
                </li>
              </ol>
            </div>
          </div>
        </section>

        {/* Story */}
        <section className="story" aria-labelledby="story-title">
          <div className="container">
            <div className="story__grid">
              <div className="story__photo">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={IMAGES.story}
                  alt="Yeni Mahalle Market"
                  loading="lazy"
                />
              </div>
              <div>
                <h2 id="story-title" className="story__title">
                  Birbirini bilen bir{" "}
                  <span className="story__title-accent">mahalle</span> için.
                </h2>
                <p className="story__body">
                  Yeni Mahalle Market, Sapanca&apos;nın Yeni Mahalle&apos;sinde
                  Kurtuluş Caddesi&apos;nde yıllardır hizmet veriyor. Taze meyve
                  sebzeden, kahvaltılık şarküteriye, günlük market ihtiyaçlarına
                  kadar her şey burada.
                </p>
                <p className="story__body">
                  Mahallene bir telefon kadar uzağız. Gel uğra, ya da biz
                  gelelim.
                </p>
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
              <p className="contact__lede">
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
                    className="btn btn--ghost"
                  >
                    <IconInstagram className="btn__icon" />
                    Instagram
                  </a>
                  <a
                    href={BUSINESS.googleMapsDirectionsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn--ghost"
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
          <div className="footer__brand-block">
            <div className="footer__wordmark">
              Yeni Mahalle
              <br />
              <span className="footer__wordmark-accent">Market.</span>
            </div>
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
                Instagram · {BUSINESS.instagram.handle}
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
            <span>Sapanca · Yeni Mahalle · Kurtuluş Caddesi</span>
          </div>
        </div>
      </footer>
    </>
  );
}
