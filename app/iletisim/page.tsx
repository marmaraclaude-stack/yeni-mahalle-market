// İletişim (/iletisim). Davetkar hero, iletişim kanalları kart grid'i
// (telefon / canlı destek / Instagram / konum), tam genişlik harita kartı,
// çalışma saatleri şeridi (canlı açık/kapalı) ve genişletilmiş SSS accordion'ı.
// Tüm veriler lib/business.ts (BUSINESS) kaynağından gelir.

import type { Metadata } from "next";
import Link from "next/link";
import {
  Clock,
  MapPin,
  MessageCircle,
  Navigation,
  Phone,
  ShoppingBasket,
} from "lucide-react";
import { BUSINESS } from "@/lib/business";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import StatusIndicator from "@/components/StatusIndicator";
import Faq from "./Faq";
import styles from "./iletisim.module.css";

export const metadata: Metadata = {
  title: "İletişim",
  description:
    "Yeni Mahalle Market iletişim: telefon, canlı destek, Instagram, adres ve çalışma saatleri. Sapanca Yeni Mahalle, Kurtuluş Caddesi. Sipariş verin, kapınıza gelsin.",
};

function InstagramIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="24"
      height="24"
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
          {/* --- Hero --- */}
          <header className={styles.hero}>
            <div className={styles.heroMain}>
              <span className={styles.eyebrow}>İletişim</span>
              <h1 className={styles.title}>
                Sepetine ekle,{" "}
                <span className={styles.titleAccent}>kapına gelsin.</span>
              </h1>
              <p className={styles.sub}>
                Sapanca Yeni Mahalle&apos;nin marketi bir tık uzağında. Sipariş,
                öneri ya da soruların için haftanın 7 günü buradayız.
              </p>
              <div className={styles.heroActions}>
                <a href={BUSINESS.phone.href} className="btn btn--accent btn--lg">
                  <Phone size={16} strokeWidth={2} aria-hidden="true" />
                  Hemen Ara
                </a>
                <Link href="/urunler" className="btn btn--ghost btn--lg">
                  <ShoppingBasket size={16} strokeWidth={2} aria-hidden="true" />
                  Alışverişe Başla
                </Link>
              </div>
            </div>

            <aside className={styles.heroPanel} aria-label="Hızlı iletişim">
              <StatusIndicator />
              <div className={styles.heroPanelRows}>
                <a href={BUSINESS.phone.href} className={styles.heroPanelRow}>
                  <span className={styles.heroPanelIcon} aria-hidden="true">
                    <Phone size={18} strokeWidth={1.9} />
                  </span>
                  <span className={styles.heroPanelText}>
                    <span className={styles.heroPanelLabel}>Telefon</span>
                    <span className={styles.heroPanelValue}>
                      {BUSINESS.phone.display}
                    </span>
                  </span>
                </a>
                <div className={styles.heroPanelRow}>
                  <span className={styles.heroPanelIcon} aria-hidden="true">
                    <Clock size={18} strokeWidth={1.9} />
                  </span>
                  <span className={styles.heroPanelText}>
                    <span className={styles.heroPanelLabel}>Çalışma Saatleri</span>
                    <span className={styles.heroPanelValue}>
                      {BUSINESS.hours.display}
                    </span>
                  </span>
                </div>
                <a
                  href={BUSINESS.googleMapsDirectionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.heroPanelRow}
                >
                  <span className={styles.heroPanelIcon} aria-hidden="true">
                    <MapPin size={18} strokeWidth={1.9} />
                  </span>
                  <span className={styles.heroPanelText}>
                    <span className={styles.heroPanelLabel}>Adres</span>
                    <span className={styles.heroPanelValue}>
                      Yeni Mah., Kurtuluş Caddesi · Sapanca
                    </span>
                  </span>
                </a>
              </div>
            </aside>
          </header>

          {/* --- İletişim kanalları kart grid'i --- */}
          <section className={styles.channels} aria-label="İletişim kanalları">
            <a href={BUSINESS.phone.href} className={styles.channelCard}>
              <span className={styles.channelIcon} aria-hidden="true">
                <Phone size={22} strokeWidth={1.9} />
              </span>
              <span className={styles.channelText}>
                <span className={styles.channelLabel}>Telefon</span>
                <span className={styles.channelValueLg}>
                  {BUSINESS.phone.display}
                </span>
                <span className={styles.channelNote}>
                  Sipariş ve sorular için ara.
                </span>
              </span>
            </a>

            <div className={styles.channelCard}>
              <span
                className={`${styles.channelIcon} ${styles.channelIconGreen}`}
                aria-hidden="true"
              >
                <MessageCircle size={22} strokeWidth={1.9} />
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

            <a
              href={BUSINESS.googleMapsDirectionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.channelCard}
            >
              <span
                className={`${styles.channelIcon} ${styles.channelIconBlue}`}
                aria-hidden="true"
              >
                <MapPin size={22} strokeWidth={1.9} />
              </span>
              <span className={styles.channelText}>
                <span className={styles.channelLabel}>Konum</span>
                <span className={styles.channelValue}>
                  Yeni Mah., Kurtuluş Caddesi
                </span>
                <span className={styles.channelNote}>Sapanca / Sakarya</span>
              </span>
            </a>
          </section>

          {/* --- Harita kartı --- */}
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

          {/* --- SSS --- */}
          <section className={styles.faqSection} aria-labelledby="sss-baslik">
            <div className={styles.faqHead}>
              <h2 id="sss-baslik" className={styles.faqTitle}>
                Sıkça Sorulan Sorular
              </h2>
              <p className={styles.faqSub}>
                Aradığını bulamadın mı? {BUSINESS.phone.display} numarasından
                bize ulaş.
              </p>
            </div>
            <Faq />
          </section>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
