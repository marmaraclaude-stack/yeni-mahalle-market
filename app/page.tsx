import { BUSINESS } from "@/lib/business";
import ReviewsRail from "@/components/ReviewsRail";
import StatusIndicator from "@/components/StatusIndicator";
import ChatPreview from "@/components/ChatPreview";
import LiveSupportCta from "@/components/LiveSupportCta";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import PromoBanners from "@/components/shop/PromoBanners";
import Carousel from "@/components/Carousel";
import CategoryGrid from "@/components/CategoryGrid";
import { getCustomCategories } from "@/lib/shop/categories-data";
import { getCatalogVisibility } from "@/lib/shop/visibility";
import { Check, Phone, ShoppingBasket, Package, Bike } from "lucide-react";

/* ============================================================
   ICONS
   ============================================================ */
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

export default async function Home() {
  // Pasif kategoriler ana sayfa ızgarasında da gizlenir (admin kontrolü).
  const visibility = await getCatalogVisibility();
  const hiddenCats = [...visibility.inactiveCats];
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

            {/* Stats — filigran ikonlu derin kartlar. Filigran renkleri
                banner mantığıyla içerikle eşleşir (CATEGORY_TINTS fg):
                teslimat mavi, saat camgöbeği, takvim yeşil, ödeme amber. */}
            <div className="hero__stats" aria-label="Öne çıkan rakamlar">
              <div className="stat-card" style={{ "--glyph": "#2f6fed" } as React.CSSProperties}>
                <span className="stat-card__glyph" aria-hidden="true"><ScooterIcon /></span>
                <div className="stat-card__num">30 dk</div>
                <div className="stat-card__label">Ortalama teslim süresi</div>
              </div>
              <div className="stat-card" style={{ "--glyph": "#0e93a8" } as React.CSSProperties}>
                <span className="stat-card__glyph" aria-hidden="true"><ClockIcon /></span>
                <div className="stat-card__num">07:30 - 02:00</div>
                <div className="stat-card__label">Her gün açığız</div>
              </div>
              <div className="stat-card" style={{ "--glyph": "#159b57" } as React.CSSProperties}>
                <span className="stat-card__glyph" aria-hidden="true"><CalendarIcon /></span>
                <div className="stat-card__num">7 gün</div>
                <div className="stat-card__label">Bayramlar dahil</div>
              </div>
              <div className="stat-card" style={{ "--glyph": "#cf8910" } as React.CSSProperties}>
                <span className="stat-card__glyph" aria-hidden="true"><CardIcon /></span>
                <div className="stat-card__num">Kapıda</div>
                <div className="stat-card__label">Nakit &amp; kart ile ödeme</div>
              </div>
            </div>
          </div>
        </section>

        {/* ===== PRODUCTS / CATEGORIES — hero'nun hemen altında ===== */}
        <section id="urunler" className="section section--tight">
          <div className="container">
            <header className="section__head section__head--center">
              <h2 className="section__title section__title--nowrap">
                Bir mahalle marketinde olması gereken{" "}
                <span className="accent">her şey.</span>
              </h2>
              <p className="section__sub">
                Manavdan şarküteriye, mangal kömüründen şarj aletine. Sepetine
                ekle, kapına getirelim.
              </p>
            </header>

            <Carousel />

            <CategoryGrid hiddenSlugs={hiddenCats} extra={await getCustomCategories()} />

            {/* Online mağaza CTA — tam katalog */}
            <div className="section__more">
              <a href="/urunler" className="btn btn--accent btn--lg">
                Tüm ürünleri incele · Online sipariş
              </a>
              <p className="section__more-note">
                Fiyatları gör, sepetini oluştur, kapıda veya online öde.
              </p>
            </div>
          </div>
        </section>

        {/* ===== KAMPANYA BANNER'LARI ===== */}
        <PromoBanners variant="home" />

        {/* ===== FEATURES — Apple-style split rows ===== */}
        <section className="section" aria-label="Hizmetler">
          <div className="container">
            {/* Satır sırası: canlı destek -> harita -> sipariş akışı.
                Üçü aynı bölümde: satırlar arası dikey boşluk eşit kalır. */}
            <div id="hizmetler" className="features__row features__row--reverse">
              <div className="features__copy">
                <h2 className="features__h">
                  Sorun mu var? Canlı destek yanında.
                </h2>
                <p className="features__p">
                  Baloncuğa tıkla, anında yazışalım. Teslimat süresi, ödeme
                  seçenekleri ya da stok durumu; aklına takılanı sor. Dilersen
                  telefonla da ulaşabilirsin.
                </p>
                <LiveSupportCta />
              </div>
              <div className="features__visual features__visual--chat">
                <ChatPreview />
              </div>
            </div>

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
                    className="btn btn--accent btn--lg"
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
                <h2 className="features__h">
                  Sipariş ver, hazırlayalım, kapına getirelim.
                </h2>
                <p className="features__p">
                  Mahalle içindeysen ortalama 30 dakikada siparişin kapında.
                  Soğuk zincir korunur, hassas ürünler en sona paketlenir.
                </p>
              </div>
              <div className="features__visual features__visual--track">
                <div className="track" aria-hidden="true">
                  <div className="track__head">
                    <span className="track__title">Siparişiniz hazırlanıyor</span>
                    <span className="track__eta">30 dk</span>
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
                      <span className="track__time">18:55</span>
                    </li>
                  </ol>
                </div>
              </div>
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

        {/* ===== KAPANIS CTA: aydınlık panel + mini sepet önizlemesi ===== */}
        <section className="cta" aria-labelledby="cta-title">
          <div className="container">
            <div className="cta__panel">
              <div className="cta__copy">
                <h2 id="cta-title" className="cta__title">
                  Bugün ne lazımsa <span className="accent">kapına gelsin.</span>
                </h2>
                <p className="cta__sub">
                  2000&apos;i aşkın ürün ve güncel market fiyatları. Sepetini
                  doldur, tezgâhtan özenle toplayıp Sapanca içinde ortalama 30
                  dakikada teslim edelim.
                </p>
                <div className="cta__actions">
                  <a href="/urunler" className="btn btn--accent btn--lg">
                    Alışverişe Başla
                  </a>
                  <a href="/firsatlar" className="btn btn--ghost btn--lg">
                    Fırsatları Gör
                  </a>
                  <a href={BUSINESS.phone.href} className="btn btn--ghost btn--lg">
                    <Phone size={16} strokeWidth={2} aria-hidden="true" />
                    {BUSINESS.phone.display}
                  </a>
                </div>
              </div>

              {/* Dekoratif mini sepet: sitedeki alışveriş deneyiminin önizlemesi */}
              <div className="cta__visual" aria-hidden="true">
                <div className="cta-basket">
                  <div className="cta-basket__head">
                    <span className="cta-basket__title">
                      <ShoppingBasket size={16} strokeWidth={2.1} />
                      Sepetin
                    </span>
                    <span className="cta-basket__count">3 ürün</span>
                  </div>
                  <ul className="cta-basket__rows">
                    <li>
                      <span>Günlük Süt · 1 L</span>
                      <span>₺32,50</span>
                    </li>
                    <li>
                      <span>Köy Ekmeği · 500 g</span>
                      <span>₺25,00</span>
                    </li>
                    <li>
                      <span>Anamur Muz · 1 kg</span>
                      <span>₺49,90</span>
                    </li>
                  </ul>
                  <div className="cta-basket__total">
                    <span>Toplam</span>
                    <span>₺107,40</span>
                  </div>
                  <span className="cta-basket__btn">Siparişi Tamamla</span>
                </div>
                <div className="cta-float">
                  <span className="cta-float__icon">
                    <Bike size={15} strokeWidth={2.2} />
                  </span>
                  <span className="cta-float__text">
                    <span className="cta-float__title">Kurye yola çıktı</span>
                    <span className="cta-float__sub">Tahmini varış 30 dk</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ===== FOOTER ===== */}
      <SiteFooter />
    </>
  );
}
