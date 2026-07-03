"use client";

// Banner carousel (PromoBanners'ın client alt komponenti).
// Getir/Trendyol davranışı: 5 sn'de bir otomatik kayar; hover/focus'ta
// durur; prefers-reduced-motion açıkken otomatik kayma tamamen kapalı.
// Dokunmatikte scroll-snap ile elle kaydırılır; altta nokta göstergeleri
// (tıklanınca ilgili slayta gider). Aktif nokta scroll konumundan hesaplanır.

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Banner } from "@/lib/shop/types";
import { CATEGORY_TINTS } from "@/lib/shop/categories";
import styles from "@/components/shop/PromoBanners.module.css";

/** Otomatik kayma aralığı (ms). */
const AUTO_MS = 5000;

export default function BannerCarousel({ banners }: { banners: Banner[] }) {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  // Kullanıcının hareket tercihi değişirse anında uygula.
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReducedMotion(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  const goTo = useCallback(
    (index: number, smooth: boolean) => {
      const track = trackRef.current;
      if (!track || banners.length === 0) return;
      const i = ((index % banners.length) + banners.length) % banners.length;
      track.scrollTo({
        left: i * track.clientWidth,
        behavior: smooth ? "smooth" : "auto",
      });
    },
    [banners.length],
  );

  // Otomatik kayma — hover/focus'ta ve reduced-motion'da durur.
  useEffect(() => {
    if (reducedMotion || paused || banners.length < 2) return;
    const id = window.setInterval(() => {
      const track = trackRef.current;
      if (!track) return;
      const current = Math.round(track.scrollLeft / track.clientWidth);
      goTo(current + 1, true);
    }, AUTO_MS);
    return () => window.clearInterval(id);
  }, [reducedMotion, paused, banners.length, goTo]);

  // Elle kaydırmada da aktif nokta doğru kalsın.
  function handleScroll() {
    const track = trackRef.current;
    if (!track) return;
    const i = Math.round(track.scrollLeft / track.clientWidth);
    setActive(Math.max(0, Math.min(banners.length - 1, i)));
  }

  return (
    <div
      className={styles.carousel}
      role="region"
      aria-roledescription="carousel"
      aria-label="Kampanyalar"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div className={styles.track} ref={trackRef} onScroll={handleScroll}>
        {banners.map((b) => {
          const [bg, fg] = CATEGORY_TINTS[b.tint] ?? CATEGORY_TINTS[0];
          const hasCta = b.cta_text.trim() !== "" && b.cta_href.trim() !== "";
          return (
            <article
              key={b.id}
              className={styles.slide}
              style={{ background: bg, color: fg }}
            >
              <div className={styles.slideCopy}>
                <h3 className={styles.slideTitle}>{b.title}</h3>
                {b.subtitle && <p className={styles.slideSub}>{b.subtitle}</p>}
                {hasCta && (
                  <Link href={b.cta_href} className={styles.slideCta}>
                    {b.cta_text}
                    <ArrowRight size={15} strokeWidth={2.2} aria-hidden="true" />
                  </Link>
                )}
              </div>
              <span className={styles.slideGlow} aria-hidden="true" />
            </article>
          );
        })}
      </div>

      {banners.length > 1 && (
        <div className={styles.dots} aria-label="Kampanya seçimi">
          {banners.map((b, i) => (
            <button
              key={b.id}
              type="button"
              className={`${styles.dot}${i === active ? ` ${styles.dotActive}` : ""}`}
              onClick={() => goTo(i, !reducedMotion)}
              aria-label={`Kampanya ${i + 1}: ${b.title}`}
              aria-current={i === active}
            />
          ))}
        </div>
      )}
    </div>
  );
}
