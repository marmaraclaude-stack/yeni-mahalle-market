import { BUSINESS } from "@/lib/business";
import { IMAGES } from "@/lib/images";
import {
  IconBread,
  IconBasket,
  IconScooter,
  IconPhone,
  IconClock,
  IconWhatsApp,
  IconInstagram,
  IconDirections,
  IconArrow,
} from "@/components/icons";

const galleryCaptions = [
  "Tezgâh",
  "Sebze",
  "Meyve",
  "Domates",
  "Şarküteri",
];

export default function Home() {
  return (
    <>
      {/* Top bar */}
      <div className="topbar" role="banner" aria-label="Durum">
        <div className="container topbar__inner">
          <span className="topbar__status">
            <span className="dot" aria-hidden />
            <span>Şu an açık · Adrese teslim aktif · Sapanca / Yeni Mahalle</span>
          </span>
          <a className="topbar__link" href={BUSINESS.phone.href}>
            <span aria-hidden>☎</span>
            <span>{BUSINESS.phone.display}</span>
          </a>
        </div>
      </div>

      {/* Header */}
      <header className="header">
        <div className="container header__inner">
          <a className="brand" href="#" aria-label={`${BUSINESS.name} anasayfa`}>
            <span className="brand__mark" aria-hidden>
              Y
            </span>
            <span className="brand__text">
              <span className="brand__primary">Yeni Mahalle Market</span>
              <span className="brand__secondary">Sapanca · Sakarya</span>
            </span>
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
            <div className="hero__grid">
              <div className="hero__text">
                <div className="hero__eyebrow-row reveal">
                  <span>Est. Sapanca · Yeni Mahalle</span>
                  <span className="hero__rule" aria-hidden />
                  <span>
                    No. <span className="num">001</span>
                  </span>
                </div>

                <h1 id="hero-title" className="hero__title reveal">
                  Mahallenin
                  <br />
                  bakkalı
                  <span className="hero__title-dot">.</span>
                  <br />
                  <span className="hero__title-accent">Kapına&nbsp;kadar.</span>
                </h1>

                <p className="hero__lede reveal">
                  Sapanca Yeni Mahalle&apos;de taze meyve sebze, şarküteri ve
                  günlük market ihtiyaçlarınız için buradayız. Söyleyin, sıcak
                  ekmekle birlikte kapınıza getirelim.
                </p>

                <div className="hero__ctas reveal">
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

                <dl className="hero__meta">
                  <div className="hero__meta-cell">
                    <span className="hero__meta-label">Saatler</span>
                    <span className="hero__meta-value">07:30 · 22:00</span>
                  </div>
                  <div className="hero__meta-cell">
                    <span className="hero__meta-label">Günler</span>
                    <span className="hero__meta-value">7/7</span>
                  </div>
                  <div className="hero__meta-cell">
                    <span className="hero__meta-label">Teslimat</span>
                    <span className="hero__meta-value">Mahalle içi</span>
                  </div>
                  <div className="hero__meta-cell">
                    <span className="hero__meta-label">Konum</span>
                    <span className="hero__meta-value">Kurtuluş Cd.</span>
                  </div>
                </dl>
              </div>

              <div className="hero__media reveal" aria-hidden>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={IMAGES.hero}
                  alt=""
                  loading="eager"
                  decoding="async"
                  fetchPriority="high"
                />
                <span className="hero__media-tag">
                  <span className="dot" aria-hidden />
                  Sapanca, taze
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Info strip */}
        <section className="infostrip" aria-label="Hızlı bilgiler">
          <div className="container">
            <div className="infostrip__inner">
              <div className="infostrip__cell">
                <div className="infostrip__label">01 · Saatler</div>
                <div className="infostrip__value">07:30&apos;dan itibaren</div>
                <div className="infostrip__sub">
                  Pazartesi&apos;den Pazar&apos;a, her gün açığız.
                </div>
              </div>
              <div className="infostrip__cell">
                <div className="infostrip__label">02 · Teslimat</div>
                <div className="infostrip__value">Adrese teslim</div>
                <div className="infostrip__sub">
                  Mahalle içi, ücretsiz. Ortalama 5 dakika.
                </div>
              </div>
              <div className="infostrip__cell">
                <div className="infostrip__label">03 · Konum</div>
                <div className="infostrip__value">Kurtuluş Caddesi</div>
                <div className="infostrip__sub">
                  Yeni Mah., 54600 Sapanca / Sakarya.
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Bento services */}
        <section className="bento" id="hizmetler" aria-labelledby="bento-title">
          <div className="container">
            <div className="bento__head">
              <h2 id="bento-title" className="section-title">
                Ne <span className="section-title__accent">satıyoruz</span>,
                <br />
                ne <span className="section-title__accent">yapıyoruz</span>.
              </h2>
              <p className="bento__lede">
                Klasik bir mahalle bakkalının yapması gereken her şey, biraz daha
                özenle. Taze ürün, tanıdık yüz, kapına teslim.
              </p>
            </div>

            <div className="bento__grid">
              {/* 1: Tall photo card */}
              <article className="bento__card bento__card--tall">
                <div className="bento__photo">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={IMAGES.produce}
                    alt="Taze meyve ve sebze tezgâhı"
                    loading="lazy"
                  />
                </div>
                <div className="bento__body">
                  <span className="bento__num">01 / 06</span>
                  <h3 className="bento__card-title">Taze meyve ve sebze</h3>
                  <p className="bento__card-body">
                    Her sabah seçilen mevsim meyveleri, sebzeleri ve yeşillikler.
                    Sapanca&apos;nın tazesi tezgâhımızda.
                  </p>
                </div>
              </article>

              {/* 2: Şarküteri (dark) */}
              <article className="bento__card bento__card--dark">
                <div className="bento__body">
                  <span className="bento__num">02 / 06</span>
                  <IconBread className="bento__icon" />
                  <h3 className="bento__card-title">Şarküteri, kahvaltılık</h3>
                  <p className="bento__card-body">
                    Peynir, zeytin, kaşar, sucuk, salam, tereyağı. Kahvaltınızı
                    kuran her şey kasamızdan tartılır.
                  </p>
                </div>
              </article>

              {/* 3: Adrese teslim (orange wide) */}
              <article className="bento__card bento__card--wide bento__card--orange">
                <div className="bento__body">
                  <span className="bento__num">03 / 06</span>
                  <IconScooter className="bento__icon" />
                  <h3 className="bento__card-title">
                    Adrese teslim.
                    <br />
                    Mahallene 5 dakikada.
                  </h3>
                  <p className="bento__card-body">
                    Telefonla ya da WhatsApp&apos;tan söyle, mahalle içinde kısa
                    sürede kapıdayız. Üstelik ücretsiz.
                  </p>
                  <a
                    href={BUSINESS.whatsapp.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bento__cta"
                  >
                    WhatsApp&apos;tan başla
                    <span className="bento__cta-arrow" aria-hidden>
                      →
                    </span>
                  </a>
                </div>
              </article>

              {/* 4: Market ihtiyacı */}
              <article className="bento__card">
                <div className="bento__body">
                  <span className="bento__num">04 / 06</span>
                  <IconBasket className="bento__icon" />
                  <h3 className="bento__card-title">Günlük market ihtiyacı</h3>
                  <p className="bento__card-body">
                    Süt, ekmek, deterjan, temizlik, atıştırmalık. Aklınıza gelen,
                    kapımızda hazır.
                  </p>
                </div>
              </article>

              {/* 5: Photo only (wide) */}
              <article className="bento__card bento__card--photo-wide">
                <div
                  className="bento__photo"
                  style={{ aspectRatio: "16/10", minHeight: 240 }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={IMAGES.bread}
                    alt="Sıcak ekmek ve fırın ürünleri"
                    loading="lazy"
                  />
                </div>
              </article>

              {/* 6: Telefon */}
              <article className="bento__card">
                <div className="bento__body">
                  <span className="bento__num">05 / 06</span>
                  <IconPhone className="bento__icon" />
                  <h3 className="bento__card-title">Telefonla sipariş</h3>
                  <p className="bento__card-body">
                    Listenizi okumanız yeter. {BUSINESS.phone.display}&apos;ten
                    arayın, gerisini biz hallediyoruz.
                  </p>
                </div>
              </article>

              {/* 7: Saatler */}
              <article className="bento__card">
                <div className="bento__body">
                  <span className="bento__num">06 / 06</span>
                  <IconClock className="bento__icon" />
                  <h3 className="bento__card-title">Geniş çalışma saatleri</h3>
                  <p className="bento__card-body">
                    Haftanın 7 günü, sabah 07:30&apos;dan itibaren açığız. Acele
                    etmenize gerek yok, biz oradayız.
                  </p>
                </div>
              </article>
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
                  <img src={src} alt={galleryCaptions[i] ?? ""} loading="lazy" />
                  <figcaption className="gallery__caption">
                    {galleryCaptions[i] ?? ""}
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>

        {/* Delivery CTA */}
        <section className="delivery" aria-labelledby="delivery-title">
          <div className="container">
            <div className="delivery__inner">
              <div>
                <h2 id="delivery-title" className="delivery__title">
                  Söyle,{" "}
                  <span className="delivery__title-mark">getirelim.</span>
                </h2>
                <p className="delivery__lede">
                  WhatsApp&apos;tan ya da telefondan siparişini bildir. Mahalle
                  içindeysen ortalama 5 dakikada elindeyiz.
                </p>
                <div className="delivery__ctas">
                  <a
                    href={BUSINESS.whatsapp.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn--black btn--lg"
                  >
                    <IconWhatsApp className="btn__icon" />
                    WhatsApp
                  </a>
                  <a
                    href={BUSINESS.phone.href}
                    className="btn btn--outline-white btn--lg"
                  >
                    <span>{BUSINESS.phone.display}</span>
                  </a>
                </div>
              </div>

              <ol className="delivery__steps">
                <li className="delivery__step">
                  <span className="delivery__step-num">01</span>
                  <div>
                    <div className="delivery__step-title">Yaz veya ara</div>
                    <div className="delivery__step-sub">
                      WhatsApp ya da {BUSINESS.phone.display}
                    </div>
                  </div>
                </li>
                <li className="delivery__step">
                  <span className="delivery__step-num">02</span>
                  <div>
                    <div className="delivery__step-title">Siparişini söyle</div>
                    <div className="delivery__step-sub">
                      İhtiyaçlarını listele, biz hazırlayalım.
                    </div>
                  </div>
                </li>
                <li className="delivery__step">
                  <span className="delivery__step-num">03</span>
                  <div>
                    <div className="delivery__step-title">Kapına gelelim</div>
                    <div className="delivery__step-sub">
                      Mahalle içi ücretsiz · ortalama 5 dakika.
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
                  alt="Yeni Mahalle Market dış görünümü"
                  loading="lazy"
                />
                <span className="story__photo-tag">Sapanca · 54600</span>
              </div>
              <div>
                <span className="eyebrow">Mahalleli</span>
                <h2
                  id="story-title"
                  className="story__title"
                  style={{ marginTop: 14 }}
                >
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
              <div>
                <span className="eyebrow">Bize ulaşın</span>
                <h2
                  id="contact-title"
                  className="contact__title"
                  style={{ marginTop: 14 }}
                >
                  Gel,{" "}
                  <span className="contact__title-accent">ya da</span> biz
                  gelelim.
                </h2>
              </div>
              <p className="contact__lede">
                Telefon, WhatsApp, Instagram. Hangisi seninle rahatsa, oradan
                yazışalım.
              </p>
            </div>

            <div className="contact__grid">
              <div>
                <dl className="contact__list">
                  <div className="contact__row">
                    <dt>Adres</dt>
                    <dd>{BUSINESS.address.full}</dd>
                    <span className="contact__row-meta">TR-54</span>
                  </div>
                  <div className="contact__row">
                    <dt>Telefon</dt>
                    <dd>
                      <a href={BUSINESS.phone.href}>
                        {BUSINESS.phone.display}
                      </a>
                    </dd>
                    <span className="contact__row-meta">7/24</span>
                  </div>
                  <div className="contact__row">
                    <dt>Çalışma</dt>
                    <dd>{BUSINESS.hours.daysDisplay}</dd>
                    <span className="contact__row-meta">
                      {BUSINESS.hours.opens} · {BUSINESS.hours.closes}
                    </span>
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
                    <span className="contact__row-meta">Sosyal</span>
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

      {/* Footer */}
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
                Google Maps · Yol Tarifi
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
