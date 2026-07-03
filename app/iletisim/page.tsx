// İletişim — /iletisim. Telefon / Canlı Destek / Instagram kartları, adres +
// Google Maps embed, çalışma saatleri ve yol tarifi butonu. Tüm veriler
// lib/business.ts (BUSINESS) kaynağından gelir; sayfa tamamen statik.

import type { Metadata } from "next";
import { Clock, MapPin, MessageCircle, Navigation, Phone } from "lucide-react";
import { BUSINESS } from "@/lib/business";
import SiteNav from "@/components/SiteNav";
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

          {/* Hızlı iletişim kartları */}
          <div className={styles.cards}>
            <a href={BUSINESS.phone.href} className={styles.card}>
              <span className={styles.cardIcon} aria-hidden="true">
                <Phone size={20} strokeWidth={1.9} />
              </span>
              <span className={styles.cardText}>
                <span className={styles.cardLabel}>Telefon</span>
                <span className={styles.cardValue}>
                  {BUSINESS.phone.display}
                </span>
              </span>
            </a>

            <div className={styles.card}>
              <span
                className={`${styles.cardIcon} ${styles.cardIconGreen}`}
                aria-hidden="true"
              >
                <MessageCircle size={20} strokeWidth={1.9} />
              </span>
              <span className={styles.cardText}>
                <span className={styles.cardLabel}>Canlı Destek</span>
                <span className={styles.cardValue}>
                  Sağ alttaki baloncuğa tıkla, anında yazışalım
                </span>
              </span>
            </div>

            <a
              href={BUSINESS.instagram.href}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.card}
            >
              <span
                className={`${styles.cardIcon} ${styles.cardIconPink}`}
                aria-hidden="true"
              >
                <InstagramIcon />
              </span>
              <span className={styles.cardText}>
                <span className={styles.cardLabel}>Instagram</span>
                <span className={styles.cardValue}>
                  {BUSINESS.instagram.handle}
                </span>
              </span>
            </a>
          </div>

          {/* Harita + adres ve çalışma saatleri */}
          <div className={styles.mapGrid}>
            <div className={styles.mapCard}>
              <iframe
                src={BUSINESS.googleMapsEmbedUrl}
                title={`${BUSINESS.name} konumu`}
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>

            <div className={styles.infoCol}>
              <section className={styles.infoCard} aria-label="Adres">
                <h2 className={styles.infoHead}>
                  <span className={styles.infoIcon} aria-hidden="true">
                    <MapPin size={18} strokeWidth={1.9} />
                  </span>
                  Adres
                </h2>
                <p className={styles.infoText}>{BUSINESS.address.full}</p>
                <a
                  href={BUSINESS.googleMapsDirectionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`btn btn--accent ${styles.dirBtn}`}
                >
                  <Navigation size={15} strokeWidth={2} aria-hidden="true" />
                  Yol Tarifi Al
                </a>
              </section>

              <section
                className={styles.infoCard}
                aria-label="Çalışma saatleri"
              >
                <h2 className={styles.infoHead}>
                  <span className={styles.infoIcon} aria-hidden="true">
                    <Clock size={18} strokeWidth={1.9} />
                  </span>
                  Çalışma Saatleri
                </h2>
                <p className={styles.infoText}>{BUSINESS.hours.display}</p>
                <p className={styles.infoNote}>Bayram dahil her gün açık.</p>
              </section>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
