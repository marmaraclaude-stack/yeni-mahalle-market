import { BUSINESS } from "@/lib/business";
import { IMAGES } from "@/lib/images";
import {
  IconApple,
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

const marqueeItems = [
  "Adrese teslim",
  "Taze her gün",
  "07:30'dan itibaren",
  "Sapanca · Yeni Mahalle",
  "Şarküteri · Manav",
  "Telefonla sipariş",
  "Haftanın 7 günü",
  "Kurtuluş Caddesi",
];

const stats = [
  { num: "07:30", label: "Sabah saatinde açığız, mahallemizin ilk durağıyız" },
  { num: "7/24", label: "Haftanın her günü hizmet — bayram dahil" },
  { num: "5 dk", label: "Mahalle içi adrese teslim — ortalama süre" },
];

const galleryCaptions = [
  "Taze tezgâh",
  "Sebze",
  "Meyve",
  "Domates",
  "Şarküteri",
];

export default function Home() {
  return (
    <>
      {/* ============================================================
          Top bar
          ============================================================ */}
      <div className="topbar" role="banner" aria-label="Durum">
        <div className="container topbar__inner">
          <span className="topbar__status">
            <span className="dot" aria-hidden />
            <span>ŞU AN AÇIK · Adrese teslim aktif · Sapanca / Yeni Mahalle</span>
          </span>
          <a className="topbar__link" href={BUSINESS.phone.href}>
            <span aria-hidden>☎</span>
            <span>{BUSINESS.phone.display}</span>
          </a>
        </div>
      </div>

      {/* ============================================================
          Header
          ============================================================ */}
      <header className="header">
        <div className="container header__inner">
          <a className="brand" href="#" aria-label={`${BUSINESS.name} — anasayfa`}>
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
        {/* ============================================================
            Hero
            ============================================================ */}
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero__media" aria-hidden>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={IMAGES.hero}
              alt=""
              loading="eager"
              decoding="async"
              fetchPriority="high"
            />
          </div>
          <div className="hero__container">
            <div className="hero__topline reveal">
              <span>Est. Sapanca · Yeni Mahalle</span>
              <span className="hero__topline-rule" aria-hidden />
              <span>No. <span className="num">001</span></span>
            </div>

            <h1 id="hero-title" className="hero__title reveal">
              Yeni<br />
              Mahalle<br />
              <span className="hero__title-accent">
                Market
                <span className="hero__title-dot">.</span>
              </span>
            </h1>

            <div className="hero__bottom reveal">
              <div>
                <p className="hero__lede">
                  Sapanca Yeni Mahalle'de taze meyve-sebze, şarküteri ve günlük
                  market ihtiyaçlarınız için buradayız. Söyleyin —
                  sıcak ekmekle birlikte kapınıza getirelim.
                </p>
                <div className="hero__ctas">
                  <a
                    href={BUSINESS.whatsapp.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn--primary btn--lg"
                  >
                    <IconWhatsApp className="btn__icon" />
                    <span>WhatsApp'tan sipariş ver</span>
                  </a>
                  <a href="#iletisim" className="btn btn--outline-white btn--lg">
                    <span>İletişim & Yol Tarifi</span>
                    <IconArrow className="btn__icon" />
                  </a>
                </div>
              </div>

              <dl className="hero__meta">
                <div className="hero__meta-cell">
                  <span className="hero__meta-label">Saatler</span>
                  <span className="hero__meta-value">07:30 — 22:00</span>
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
          </div>
        </section>

        {/* ============================================================
            Marquee
            ============================================================ */}
        <div className="marquee" aria-hidden>
          <div className="marquee__track">
            {[...marqueeItems, ...marqueeItems].map((item, i) => (
              <span className="marquee__item" key={i}>
                {item}
                <span className="marquee__star">
                  <Star />
                </span>
              </span>
            ))}
          </div>
        </div>

        {/* ============================================================
            Stats — black
            ============================================================ */}
        <section className="stats" aria-label="Sayılar">
          <div className="container">
            <div className="stats__head">
              <h2 className="stats__title">
                Mahallenin <span className="stats__title-accent">bakkalı.</span>
                <br />
                Kapıya kadar.
              </h2>
              <p className="stats__lede">
                Sıfırdan kurulmuş, hâlâ tanıdık. Sapanca Yeni Mahalle'nin
                gündelik market durağı — taze ürün, hızlı servis, samimi yüz.
              </p>
            </div>

            <div className="stats__grid">
              {stats.map((s) => (
                <div className="stats__cell" key={s.num}>
                  <span className="stats__num">{s.num}</span>
                  <span className="stats__label">{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ============================================================
            Bento — services
            ============================================================ */}
        <section className="bento" id="hizmetler" aria-labelledby="bento-title">
          <div className="container">
            <div className="bento__head">
              <h2 id="bento-title" className="section-title">
                Ne <span className="section-title__accent">satıyoruz</span>,
                <br />
                ne <span className="section-title__accent">yapıyoruz</span>.
              </h2>
              <p className="bento__lede">
                Klasik bir mahalle bakkalının yapması gereken her şey — biraz daha
                özenle. Taze ürün, tanıdık yüz, kapına teslim.
              </p>
            </div>

            <div className="bento__grid">
              {/* Card 1: Taze — TALL with photo */}
              <article className="bento__card bento__card--tall">
                <div className="bento__photo">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={IMAGES.produce} alt="Taze meyve ve sebze" loading="lazy" />
                </div>
                <div className="bento__body">
                  <span className="bento__num">01 / 06</span>
                  <h3 className="bento__card-title">Taze meyve & sebze</h3>
                  <p className="bento__card-body">
                    Her sabah seçilen mevsim meyveleri, sebzeleri ve yeşillikler.
                    Sapanca'nın tazesi tezgâhımızda.
                  </p>
                </div>
              </article>

              {/* Card 2: Şarküteri */}
              <article className="bento__card bento__card--dark">
                <div className="bento__body">
                  <span className="bento__num">02 / 06</span>
                  <IconBread className="bento__icon" />
                  <h3 className="bento__card-title">Şarküteri & kahvaltılık</h3>
                  <p className="bento__card-body">
                    Peynir, zeytin, kaşar, sucuk, salam, tereyağı — kahvaltınızı
                    kuran her şey kasamızdan tartılır.
                  </p>
                </div>
              </article>

              {/* Card 3: Adrese teslim — WIDE orange */}
              <article className="bento__card bento__card--wide bento__card--orange">
                <div className="bento__body">
                  <span className="bento__num">03 / 06</span>
                  <IconScooter className="bento__icon" />
                  <h3 className="bento__card-title">
                    Adrese teslim.<br />
                    Mahallene 5 dakikada.
                  </h3>
                  <p className="bento__card-body">
                    Telefonla ya da WhatsApp'tan söyleyin — siparişiniz mahalle
                    içinde kısa sürede kapınızda. Ücretsiz.
                  </p>
                  <a
                    href={BUSINESS.whatsapp.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bento__cta"
                  >
                    WhatsApp'tan başla →
                  </a>
                </div>
              </article>

              {/* Card 4: Market ihtiyacı */}
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

              {/* Card 5: Photo only */}
              <article className="bento__card bento__card--photo">
                <div className="bento__photo" style={{ aspectRatio: "16/10" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={IMAGES.bread} alt="Ekmek ve fırın ürünleri" loading="lazy" />
                </div>
              </article>

              {/* Card 6: Telefon */}
              <article className="bento__card">
                <div className="bento__body">
                  <span className="bento__num">05 / 06</span>
                  <IconPhone className="bento__icon" />
                  <h3 className="bento__card-title">Telefonla sipariş</h3>
                  <p className="bento__card-body">
                    Listenizi okumanız yeter. {BUSINESS.phone.display}'ten arayın,
                    gerisini biz hallediyoruz.
                  </p>
                </div>
              </article>

              {/* Card 7: Saatler */}
              <article className="bento__card">
                <div className="bento__body">
                  <span className="bento__num">06 / 06</span>
                  <IconClock className="bento__icon" />
                  <h3 className="bento__card-title">Geniş çalışma saatleri</h3>
                  <p className="bento__card-body">
                    Haftanın 7 günü, sabah 07:30'dan itibaren açığız. Acele
                    etmenize gerek yok — biz oradayız.
                  </p>
                </div>
              </article>
            </div>
          </div>
        </section>

        {/* ============================================================
            Photo gallery
            ============================================================ */}
        <section className="gallery" aria-label="Galeri">
          <div className="container">
            <div className="gallery__head">
              <h2 className="gallery__title">
                Tezgâhımızdan <span className="gallery__title-accent">kareler.</span>
              </h2>
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

        {/* ============================================================
            Delivery CTA — orange
            ============================================================ */}
        <section className="delivery" aria-labelledby="delivery-title">
          <div className="container">
            <div className="delivery__inner">
              <div>
                <h2 id="delivery-title" className="delivery__title">
                  Söyle, <em>getirelim.</em>
                </h2>
                <p className="delivery__lede">
                  WhatsApp'tan ya da telefondan siparişini bildir. Mahalle
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
                    WhatsApp'tan yaz
                  </a>
                  <a href={BUSINESS.phone.href} className="btn btn--outline-white btn--lg">
                    <span>{BUSINESS.phone.display}</span>
                  </a>
                </div>
              </div>

              <ol className="delivery__bullets">
                <li className="delivery__bullet">
                  <span className="delivery__bullet-num">01</span>
                  <div>
                    <div className="delivery__bullet-text">Yaz veya ara</div>
                    <div className="delivery__bullet-sub">WhatsApp ya da {BUSINESS.phone.display}</div>
                  </div>
                </li>
                <li className="delivery__bullet">
                  <span className="delivery__bullet-num">02</span>
                  <div>
                    <div className="delivery__bullet-text">Siparişini söyle</div>
                    <div className="delivery__bullet-sub">İhtiyaçlarını listele — biz hazırlayalım</div>
                  </div>
                </li>
                <li className="delivery__bullet">
                  <span className="delivery__bullet-num">03</span>
                  <div>
                    <div className="delivery__bullet-text">Kapına gelelim</div>
                    <div className="delivery__bullet-sub">Mahalle içi ücretsiz · ortalama 5 dk</div>
                  </div>
                </li>
              </ol>
            </div>
          </div>
        </section>

        {/* ============================================================
            Story — sahip / dükkan
            ============================================================ */}
        <section className="story" aria-labelledby="story-title">
          <div className="container">
            <div className="story__grid">
              <div className="story__photo">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={IMAGES.story} alt="Yeni Mahalle Market — tezgâh" loading="lazy" />
                <span className="story__photo-tag">Sapanca · 54600</span>
              </div>
              <div>
                <span className="eyebrow">Mahalleli</span>
                <h2 id="story-title" className="story__title" style={{ marginTop: 12 }}>
                  Birbirini bilen bir <span className="story__title-accent">mahalle</span> için.
                </h2>
                <p className="story__body">
                  Yeni Mahalle Market, Sapanca'nın Yeni Mahalle'sinde Kurtuluş
                  Caddesi'nde yıllardır hizmet veriyor. Taze meyve-sebzeden,
                  kahvaltılık şarküteriye, günlük market ihtiyaçlarına kadar her
                  şey burada.
                </p>
                <p className="story__body">
                  Mahallene bir telefon kadar uzağız — gel uğra, ya da biz gelelim.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================
            Contact
            ============================================================ */}
        <section className="contact" id="iletisim" aria-labelledby="contact-title">
          <div className="container">
            <div className="contact__head">
              <span className="eyebrow">Bize ulaşın</span>
              <h2
                id="contact-title"
                className="contact__title"
                style={{ marginTop: 14 }}
              >
                Gel, <span style={{ color: "var(--orange)" }}>ya da</span> biz gelelim.
              </h2>
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
                      <a href={BUSINESS.phone.href}>{BUSINESS.phone.display}</a>
                    </dd>
                    <span className="contact__row-meta">7/24</span>
                  </div>
                  <div className="contact__row">
                    <dt>Çalışma</dt>
                    <dd>{BUSINESS.hours.daysDisplay}</dd>
                    <span className="contact__row-meta">
                      {BUSINESS.hours.opens} — {BUSINESS.hours.closes}
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

              <div className="contact__map" aria-label="Yeni Mahalle Market konumu">
                <iframe
                  src={BUSINESS.googleMapsEmbedUrl}
                  title={`${BUSINESS.name} — harita`}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                />
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ============================================================
          Footer
          ============================================================ */}
      <footer className="footer">
        <div className="container">
          <div className="footer__brand-block">
            <div className="footer__wordmark">
              Yeni Mahalle<br />
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
                WhatsApp'tan yaz
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
            <span>© {new Date().getFullYear()} {BUSINESS.name}. Tüm hakları saklıdır.</span>
            <span>Sapanca · Yeni Mahalle · Kurtuluş Caddesi</span>
          </div>
        </div>
      </footer>
    </>
  );
}

function Star() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 1l2.6 6.5L21 8.2l-4.9 4.4L17.5 19 12 15.7 6.5 19l1.4-6.4L3 8.2l6.4-.7L12 1z" />
    </svg>
  );
}
