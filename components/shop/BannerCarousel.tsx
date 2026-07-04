"use client";

// Banner carousel v3 (PromoBanners'ın client alt komponenti).
// Tam genişlik TEK kart düzeni: her görünümde tek kart kabın %100'ünü
// kaplar (peek YOK, komşu kartın hiçbir parçası görünmez). Ok butonları
// kartın DIŞINDA, sarmalayıcının yan boşluklarında dikey ortada
// (yalnız >=1024px), altta hap biçimli nokta göstergeleri. 6 sn'de bir otomatik kayar; hover/focus'ta
// durur; prefers-reduced-motion açıkken otomatik kayma tamamen kapalı.
// Dokunmatikte scroll-snap ile elle kaydırılır; aktif nokta scroll
// konumundan hesaplanır. Kart görseli: tint bazlı gradient zemin, sağda
// dekoratif daireler + başlığa göre seçilen büyük tematik lucide ikonu.

import type { CSSProperties } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Banner } from "@/lib/shop/types";
import { CATEGORY_TINTS } from "@/lib/shop/categories";
import { resolveBannerIcon } from "@/lib/shop/icons";
import styles from "@/components/shop/PromoBanners.module.css";

/** Otomatik kayma aralığı (ms). */
const AUTO_MS = 6000;

export default function BannerCarousel({
  banners,
  variant = "home",
}: {
  banners: Banner[];
  variant?: "home" | "catalog";
}) {
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

  // Bir slayt adımı: kart kabın %100'ü olduğundan adım = kap genişliği
  // (+ kartlar arası gap); offsetLeft farkı ikisini birden verir.
  const getStep = useCallback(() => {
    const track = trackRef.current;
    if (!track) return 0;
    const slides = track.children;
    if (slides.length >= 2) {
      return (
        (slides[1] as HTMLElement).offsetLeft -
        (slides[0] as HTMLElement).offsetLeft
      );
    }
    return track.clientWidth;
  }, []);

  const goTo = useCallback(
    (index: number, smooth: boolean) => {
      const track = trackRef.current;
      if (!track || banners.length === 0) return;
      const i = ((index % banners.length) + banners.length) % banners.length;
      track.scrollTo({
        left: i * getStep(),
        behavior: smooth ? "smooth" : "auto",
      });
    },
    [banners.length, getStep],
  );

  // Otomatik kayma — hover/focus'ta ve reduced-motion'da durur.
  useEffect(() => {
    if (reducedMotion || paused || banners.length < 2) return;
    const id = window.setInterval(() => {
      const track = trackRef.current;
      const step = getStep();
      if (!track || step === 0) return;
      const current = Math.round(track.scrollLeft / step);
      goTo(current + 1, true);
    }, AUTO_MS);
    return () => window.clearInterval(id);
  }, [reducedMotion, paused, banners.length, goTo, getStep]);

  // Elle kaydırmada da aktif nokta doğru kalsın.
  function handleScroll() {
    const track = trackRef.current;
    const step = getStep();
    if (!track || step === 0) return;
    const i = Math.round(track.scrollLeft / step);
    setActive(Math.max(0, Math.min(banners.length - 1, i)));
  }

  return (
    <div
      className={styles.carousel}
      data-variant={variant}
      role="region"
      aria-roledescription="carousel"
      aria-label="Kampanyalar"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div className={styles.viewport}>
        <div className={styles.track} ref={trackRef} onScroll={handleScroll}>
          {banners.map((b) => {
            const [bg, fg] = CATEGORY_TINTS[b.tint] ?? CATEGORY_TINTS[0];
            // cta_text (veya href) boşsa CTA butonu render edilmez.
            const hasCta = b.cta_text.trim() !== "" && b.cta_href.trim() !== "";
            // İkon: admin'de seçilen banner.icon, yoksa başlığa göre otomatik.
            const Icon = resolveBannerIcon(b.icon, b.title);
            return (
              <article
                key={b.id}
                className={styles.slide}
                style={{ "--bnr-bg": bg, "--bnr-fg": fg } as CSSProperties}
              >
                <div className={styles.slideCopy}>
                  <h3 className={styles.slideTitle}>{b.title}</h3>
                  {b.subtitle && <p className={styles.slideSub}>{b.subtitle}</p>}
                  {hasCta && (
                    <Link href={b.cta_href} className={styles.slideCta}>
                      {b.cta_text}
                    </Link>
                  )}
                </div>
                <div className={styles.slideArt} aria-hidden="true">
                  <span className={styles.circleLg} />
                  <span className={styles.circleMd} />
                  <span className={styles.circleSm} />
                  <span className={styles.iconWrap}>
                    <Icon className={styles.slideIcon} strokeWidth={1.5} />
                  </span>
                </div>
              </article>
            );
          })}
        </div>

        {banners.length > 1 && (
          <>
            <button
              type="button"
              className={`${styles.arrow} ${styles.arrowPrev}`}
              onClick={() => goTo(active - 1, !reducedMotion)}
              aria-label="Önceki kampanya"
            >
              <ChevronLeft size={20} strokeWidth={2} aria-hidden="true" />
            </button>
            <button
              type="button"
              className={`${styles.arrow} ${styles.arrowNext}`}
              onClick={() => goTo(active + 1, !reducedMotion)}
              aria-label="Sonraki kampanya"
            >
              <ChevronRight size={20} strokeWidth={2} aria-hidden="true" />
            </button>
          </>
        )}
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
