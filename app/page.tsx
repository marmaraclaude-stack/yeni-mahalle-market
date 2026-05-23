import { BUSINESS } from "@/lib/business";
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
  Mark,
} from "@/components/icons";

const services = [
  {
    n: "01",
    title: "Taze Meyve & Sebze",
    body: "Her sabah seçilen mevsim meyveleri, sebzeleri ve yeşillikler. Sapanca'nın tazesi tezgâhımızda.",
    Icon: IconApple,
  },
  {
    n: "02",
    title: "Şarküteri & Kahvaltılık",
    body: "Peynir, zeytin, kaşar, sucuk, salam, tereyağı — kahvaltınızı kuran her şey kasamızdan tartılır.",
    Icon: IconBread,
  },
  {
    n: "03",
    title: "Günlük Market İhtiyacı",
    body: "Süt, ekmek, deterjan, temizlik, atıştırmalık. Aklınıza gelen, kapımızda hazır.",
    Icon: IconBasket,
  },
  {
    n: "04",
    title: "Adrese Teslim",
    body: "Telefonla ya da WhatsApp'tan söyleyin, mahallenin içinde siparişiniz kısa sürede kapınızda.",
    Icon: IconScooter,
  },
  {
    n: "05",
    title: "Telefonla Sipariş",
    body: "Listenizi okumanız yeter. 0532 596 37 55'ten arayın, gerisini biz hallediyoruz.",
    Icon: IconPhone,
  },
  {
    n: "06",
    title: "Geniş Çalışma Saatleri",
    body: "Haftanın 7 günü, sabah 07:30'dan itibaren açığız. Acele etmenize gerek yok — biz oradayız.",
    Icon: IconClock,
  },
];

export default function Home() {
  return (
    <>
      {/* ============================================================
          Top status bar
          ============================================================ */}
      <div className="topbar" role="banner" aria-label="İletişim şeridi">
        <div className="container topbar__inner">
          <span className="topbar__status">
            <span className="dot" aria-hidden />
            <span>
              ŞU AN AÇIK · Adrese teslim aktif · Sapanca / Yeni Mahalle
            </span>
          </span>
          <a className="topbar__phone" href={BUSINESS.phone.href}>
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
            <span className="brand__primary">Yeni Mahalle</span>
            <span className="brand__secondary">
              Market <span className="brand__city">· Sapanca / Sakarya</span>
            </span>
          </a>
          <div className="header__actions">
            <a
              href={BUSINESS.whatsapp.href}
              className="btn btn--whatsapp btn--sm"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp ile yaz"
            >
              <IconWhatsApp className="btn__icon" />
              <span>WhatsApp</span>
            </a>
            <a href={BUSINESS.phone.href} className="btn btn--dark btn--sm">
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
        <section className="hero">
          <Mark className="hero__mark" />
          <div className="container">
            <div className="hero__grid">
              <div>
                <div className="hero__eyebrow-row reveal">
                  <span className="eyebrow">Est. Sapanca · Yeni Mahalle</span>
                  <span className="hero__rule" aria-hidden />
                  <span className="eyebrow eyebrow--muted">
                    No. <span className="num">001</span>
                  </span>
                </div>

                <h1 className="hero__title reveal">
                  Mahallenin
                  <em>
                    bakkalı<span className="hero__amp">,</span>
                  </em>
                  <em>kapına&nbsp;kadar.</em>
                </h1>

                <p className="hero__lede reveal">
                  Sapanca Yeni Mahalle'de taze meyve-sebze, şarküteri ve günlük
                  market ihtiyaçlarınız için buradayız. Siparişinizi söyleyin —
                  sıcak ekmekle birlikte kapınıza getirelim.
                </p>

                <div className="hero__ctas reveal">
                  <a
                    href={BUSINESS.whatsapp.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn--primary btn--lg"
                  >
                    <IconWhatsApp className="btn__icon" />
                    <span>WhatsApp'tan sipariş ver</span>
                  </a>
                  <a href="#iletisim" className="btn btn--outline btn--lg">
                    <span>İletişim & Yol Tarifi</span>
                    <IconArrow className="btn__icon" />
                  </a>
                </div>
              </div>

              <aside className="hero__aside reveal" aria-label="Bugünün özeti">
                <div className="hero__aside-head">
                  <h3>Bugün</h3>
                  <span className="eyebrow eyebrow--muted">No. 01 / Taze</span>
                </div>
                <dl style={{ display: "flex", flexDirection: "column", gap: 10, margin: 0 }}>
                  <div className="hero__aside-row">
                    <dt>Durum</dt>
                    <dd>AÇIK</dd>
                  </div>
                  <div className="hero__aside-row">
                    <dt>Saatler</dt>
                    <dd>07:30 — 22:00</dd>
                  </div>
                  <div className="hero__aside-row">
                    <dt>Adrese teslim</dt>
                    <dd>EVET</dd>
                  </div>
                  <div className="hero__aside-row">
                    <dt>Sipariş hattı</dt>
                    <dd>{BUSINESS.phone.display}</dd>
                  </div>
                </dl>
                <div className="hero__aside-foot">
                  <span>Yeni Mahalle</span>
                  <span>Sapanca · Sakarya</span>
                </div>
              </aside>
            </div>
          </div>
        </section>

        {/* ============================================================
            Info strip
            ============================================================ */}
        <section className="infostrip" aria-label="Hızlı bilgiler">
          <div className="container">
            <div className="infostrip__inner">
              <div className="infostrip__cell">
                <span className="infostrip__label">01 · Saatler</span>
                <span className="infostrip__value">07:30'dan itibaren</span>
                <span className="infostrip__sub">Pazartesi — Pazar</span>
              </div>
              <div className="infostrip__cell">
                <span className="infostrip__label">02 · Günler</span>
                <span className="infostrip__value">Haftanın 7 günü</span>
                <span className="infostrip__sub">Bayram dahil hizmetinizdeyiz</span>
              </div>
              <div className="infostrip__cell">
                <span className="infostrip__label">03 · Hizmet</span>
                <span className="infostrip__value">Adrese teslim</span>
                <span className="infostrip__sub">Mahalle içi · ücretsiz</span>
              </div>
              <div className="infostrip__cell">
                <span className="infostrip__label">04 · Konum</span>
                <span className="infostrip__value">Yeni Mahalle</span>
                <span className="infostrip__sub">Kurtuluş Caddesi · Sapanca</span>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================
            Services
            ============================================================ */}
        <section className="services" id="hizmetler" aria-labelledby="hizmetler-title">
          <div className="container">
            <div className="services__head">
              <h2 id="hizmetler-title" className="section-title">
                Ne <em>satıyoruz</em>,<br />
                ne <em>yapıyoruz</em>.
              </h2>
              <p className="services__intro">
                Klasik bir mahalle bakkalının yapması gereken her şey — biraz daha
                özenle. Taze ürün, tanıdık yüz, kapına teslim.
              </p>
            </div>

            <div className="services__grid">
              {services.map(({ n, title, body, Icon }) => (
                <article className="service" key={n}>
                  <span className="service__num">{n} / 06</span>
                  <Icon className="service__icon" />
                  <h3 className="service__title">{title}</h3>
                  <p className="service__body">{body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ============================================================
            Contact
            ============================================================ */}
        <section className="contact" id="iletisim" aria-labelledby="iletisim-title">
          <div className="container">
            <div className="contact__grid">
              <div>
                <span className="eyebrow">Bize ulaşın</span>
                <h2 id="iletisim-title" className="contact__title">
                  <em>Gel,</em> ya da<br />biz gelelim.
                </h2>
                <p style={{ maxWidth: "44ch", color: "var(--ink-2)" }}>
                  {BUSINESS.address.full}. Kapı kapı tanıdığınız bir bakkal —
                  arayın, yazın, ya da uğrayın.
                </p>

                <dl className="contact__schedule">
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
                    className="btn btn--whatsapp"
                  >
                    <IconWhatsApp className="btn__icon" />
                    <span>WhatsApp</span>
                  </a>
                  <a
                    href={BUSINESS.instagram.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn--ghost"
                  >
                    <IconInstagram className="btn__icon" />
                    <span>Instagram</span>
                  </a>
                  <a
                    href={BUSINESS.googleMapsDirectionsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn--ghost"
                  >
                    <IconDirections className="btn__icon" />
                    <span>Yol Tarifi</span>
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
          <div className="footer__grid">
            <div>
              <div className="footer__brand">Yeni Mahalle Market</div>
              <span className="footer__tag">Sapanca · Sakarya · Est. Mahalle</span>
              <p className="footer__desc" style={{ marginTop: 20 }}>
                {BUSINESS.shortDescription}
              </p>
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
              <a href={BUSINESS.googleMapsCidUrl} target="_blank" rel="noopener noreferrer">
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
