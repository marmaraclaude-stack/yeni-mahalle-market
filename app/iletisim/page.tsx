// İletişim — /iletisim. Solda büyük harita kartı (adres + yol tarifi),
// sağda telefon / canlı destek / Instagram kanal kartları, altta çalışma
// saatleri şeridi (canlı açık/kapalı durumu) ve mini SSS. Tüm veriler
// lib/business.ts (BUSINESS) kaynağından gelir.

import type { Metadata } from "next";
import {
  ChevronDown,
  Clock,
  MapPin,
  MessageCircle,
  Navigation,
  Phone,
} from "lucide-react";
import { BUSINESS } from "@/lib/business";
import SiteNav from "@/components/SiteNav";
import StatusIndicator from "@/components/StatusIndicator";
import styles from "./iletisim.module.css";

export const metadata: Metadata = {
  title: "İletişim",
  description:
    "Yeni Mahalle Market iletişim: telefon, canlı destek, Instagram, adres ve çalışma saatleri. Sapanca Yeni Mahalle, Kurtuluş Caddesi.",
};

function InstagramIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="20"
      height="20"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
    </svg>
  );
}

/** Mini SSS içeriği — cevaplar mevcut iş kurallarıyla tutarlı tutulur. */
const FAQ = [
  {
    q: "Nerelere teslimat yapıyorsunuz?",
    a: "Sapanca içi tüm adreslere teslimat yapıyoruz. Siparişin genellikle 30 dakika içinde kapında.",
  },
  {
    q: "Teslimat ücreti ne kadar?",
    a: "1500 TL ve üzeri siparişlerde teslimat ücretsiz. Güncel teslimat ücretini sipariş tamamlanmadan önce sepette net olarak görürsün.",
  },
  {
    q: "Nasıl ödeme yapabilirim?",
    a: "Kapıda nakit veya kartla ödeyebilirsin. Online kartla ödeme de çok yakında geliyor.",
  },
] as const;

export default function IletisimPage() {
  return (
    <>
      <SiteNav />
      <main className={styles.page}>
        <div className="container">
          <header className={styles.head}>
            <h1 className={styles.title}>İletişim</h1>
            <p className={styles.sub}>
              Sorusu olan arasın, siparişi olan yazsın. Haftanın 7 günü
              buradayız.
            </p>
          </header>

          {/* --- Ana blok: solda harita kartı, sağda kanal kartları --- */}
          <div className={styles.mainGrid}>
            <section className={styles.mapCard} aria-label="Adres ve konum">
              <div className={styles.mapTop}>
                <span className={styles.mapPin} aria-hidden="true">
                  <MapPin size={19} strokeWidth={1.9} />
                </span>
                <div className={styles.mapAddr}>
                  <span className={styles.mapLabel}>Adres</span>
                  <p className={styles.mapText}>{BUSINESS.address.full}</p>
                </div>
                <a
                  href={BUSINESS.googleMapsDirectionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`btn btn--accent ${styles.dirBtn}`}
                >
                  <Navigation size={15} strokeWidth={2} aria-hidden="true" />
                  Yol Tarifi Al
                </a>
              </div>
              <iframe
                className={styles.mapFrame}
                src={BUSINESS.googleMapsEmbedUrl}
                title={`${BUSINESS.name} konumu`}
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
              />
            </section>

            <div className={styles.sideCol}>
              <a href={BUSINESS.phone.href} className={styles.channelCard}>
                <span className={styles.channelIcon} aria-hidden="true">
                  <Phone size={20} strokeWidth={1.9} />
                </span>
                <span className={styles.channelText}>
                  <span className={styles.channelLabel}>Telefon</span>
                  <span className={styles.phoneNumber}>
                    {BUSINESS.phone.display}
                  </span>
                  <span className={styles.channelNote}>
                    Haftanın 7 günü arayabilirsin.
                  </span>
                </span>
              </a>

              <div className={styles.channelCard}>
                <span
                  className={`${styles.channelIcon} ${styles.channelIconGreen}`}
                  aria-hidden="true"
                >
                  <MessageCircle size={20} strokeWidth={1.9} />
                </span>
                <span className={styles.channelText}>
                  <span className={styles.channelLabel}>Canlı Destek</span>
                  <span className={styles.channelValue}>
                    Sağ alttaki baloncuğa tıkla, anında yazışalım.
                  </span>
                  <span className={styles.channelNote}>
                    Çalışma saatleri içinde yanıtlıyoruz.
                  </span>
                </span>
              </div>

              <a
                href={BUSINESS.instagram.href}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.channelCard}
              >
                <span
                  className={`${styles.channelIcon} ${styles.channelIconPink}`}
                  aria-hidden="true"
                >
                  <InstagramIcon />
                </span>
                <span className={styles.channelText}>
                  <span className={styles.channelLabel}>Instagram</span>
                  <span className={styles.channelValue}>
                    {BUSINESS.instagram.handle}
                  </span>
                  <span className={styles.channelNote}>
                    Yenilikler ve kampanyalar burada.
                  </span>
                </span>
              </a>
            </div>
          </div>

          {/* --- Çalışma saatleri şeridi --- */}
          <section className={styles.hoursStrip} aria-label="Çalışma saatleri">
            <div className={styles.hoursLeft}>
              <span className={styles.hoursIcon} aria-hidden="true">
                <Clock size={19} strokeWidth={1.9} />
              </span>
              <div className={styles.hoursText}>
                <h2 className={styles.hoursTitle}>Çalışma Saatleri</h2>
                <p className={styles.hoursDetail}>
                  {BUSINESS.hours.display} · Bayram dahil her gün açık.
                </p>
              </div>
            </div>
            <StatusIndicator />
          </section>

          {/* --- Mini SSS --- */}
          <section className={styles.faq} aria-labelledby="sss-baslik">
            <h2 id="sss-baslik" className={styles.faqTitle}>
              Sıkça Sorulanlar
            </h2>
            <div className={styles.faqList}>
              {FAQ.map((item) => (
                <details key={item.q} className={styles.faqItem}>
                  <summary className={styles.faqQ}>
                    {item.q}
                    <ChevronDown
                      size={17}
                      strokeWidth={2}
                      className={styles.faqChevron}
                      aria-hidden="true"
                    />
                  </summary>
                  <p className={styles.faqA}>{item.a}</p>
                </details>
              ))}
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
