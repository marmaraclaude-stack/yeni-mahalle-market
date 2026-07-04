// Ortak site footer'ı — tüm içerik sayfalarında (ana sayfa, ürünler, fırsatlar,
// ürün detay, iletişim, hesap) aynı görünür. Global .footer sınıflarını kullanır
// (globals.css). Linkler rota tabanlı: her sayfadan doğru çalışır; ana sayfaya
// özel bölümler (#hizmetler, #yorumlar) /#... ile derin bağlanır.

import Link from "next/link";
import { BUSINESS } from "@/lib/business";

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
    </svg>
  );
}
function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.13 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.37 1.9.72 2.8a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.35 1.84.59 2.8.72A2 2 0 0 1 22 16.92Z" />
    </svg>
  );
}
function MapPinIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path d="M12 21s-7-7.2-7-12a7 7 0 1 1 14 0c0 4.8-7 12-7 12Z" />
      <circle cx="12" cy="9" r="2.5" />
    </svg>
  );
}

export default function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__grid">
          <div className="footer__brand-block">
            <Link href="/" className="brand brand--footer" aria-label={BUSINESS.name}>
              <img
                src="/logo.png"
                alt=""
                width={42}
                height={42}
                className="brand__logo"
              />
              <span className="brand__name">
                <span className="brand__sans">Yeni Mahalle</span>
                <span className="brand__serif">Market</span>
              </span>
            </Link>
            <p className="footer__desc">{BUSINESS.shortDescription}</p>
            <div className="footer__socials">
              <a
                href={BUSINESS.instagram.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Instagram ${BUSINESS.instagram.handle}`}
              >
                <InstagramIcon />
              </a>
              <a href={BUSINESS.phone.href} aria-label="Telefon">
                <PhoneIcon />
              </a>
              <a
                href={BUSINESS.googleMapsDirectionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Yol tarifi"
              >
                <MapPinIcon />
              </a>
            </div>
          </div>
          <div className="footer__col">
            <h4>Site</h4>
            <ul>
              <li><Link href="/urunler">Ürünler</Link></li>
              <li><Link href="/firsatlar">Fırsatlar</Link></li>
              <li><Link href="/iletisim">İletişim</Link></li>
              <li><Link href="/#hizmetler">Hizmetler</Link></li>
              <li><Link href="/#yorumlar">Yorumlar</Link></li>
            </ul>
          </div>
          <div className="footer__col">
            <h4>İletişim</h4>
            <ul>
              <li><p>{BUSINESS.address.full}</p></li>
              <li><a href={BUSINESS.phone.href}>{BUSINESS.phone.display}</a></li>
              <li>
                <a
                  href={BUSINESS.instagram.href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {BUSINESS.instagram.handle}
                </a>
              </li>
            </ul>
          </div>
          <div className="footer__col">
            <h4>Saatler</h4>
            <ul>
              <li><p>Pzt - Paz · 07:30 - 00:00</p></li>
              <li><p>Bayram dahil her gün açık</p></li>
            </ul>
          </div>
        </div>
        <div className="footer__bottom">
          <span>© {year} {BUSINESS.name}</span>
          <span>Sapanca · Sakarya · TR-54</span>
        </div>
      </div>
    </footer>
  );
}
