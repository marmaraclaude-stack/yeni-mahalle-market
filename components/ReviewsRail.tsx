"use client";

import { useRef, useState, useEffect } from "react";
import { REVIEWS } from "@/lib/reviews";

/** Yorumu kelime sınırında temiz kes; ortada saçma kesilmesin. */
function clip(text: string, max = 150) {
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  const lastSpace = cut.lastIndexOf(" ");
  return cut.slice(0, lastSpace > 0 ? lastSpace : max).replace(/[.,;:!?\s]+$/, "") + "…";
}

function StarIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2l2.95 6.55L22 9.55l-5 4.83 1.18 6.87L12 17.77l-6.18 3.48L7 14.38 2 9.55l7.05-1L12 2z" />
    </svg>
  );
}
function GoogleGIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#4285F4" d="M21.6 12.23c0-.8-.07-1.4-.2-2.04H12v3.7h5.5c-.1.93-.7 2.34-2.04 3.28l-.02.12 2.96 2.3.2.02c1.88-1.74 2.97-4.3 2.97-7.38z"/>
      <path fill="#34A853" d="M12 22c2.7 0 4.96-.9 6.6-2.42l-3.14-2.44c-.84.58-1.97.99-3.46.99-2.65 0-4.89-1.75-5.7-4.17l-.12.01-3.07 2.38-.04.11C4.7 19.62 8.07 22 12 22z"/>
      <path fill="#FBBC05" d="M6.3 13.96A6 6 0 015.97 12c0-.68.12-1.34.32-1.96L6.28 9.9 3.17 7.5l-.1.05C2.38 8.92 2 10.42 2 12s.38 3.08 1.07 4.45L6.3 13.96z"/>
      <path fill="#EA4335" d="M12 5.87c1.88 0 3.14.8 3.86 1.48l2.82-2.74C16.95 3.05 14.7 2 12 2 8.07 2 4.7 4.38 3.07 7.55L6.3 10.04C7.11 7.62 9.35 5.87 12 5.87z"/>
    </svg>
  );
}
function ChevronLeft() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function ChevronRight() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function ReviewsRail() {
  const railRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  const scrollByCards = (dir: 1 | -1) => {
    const el = railRef.current;
    if (!el) return;
    const card = el.querySelector(".review");
    const cardWidth = card ? card.clientWidth : 348;
    el.scrollBy({ left: dir * (cardWidth + 16), behavior: "smooth" });
  };

  useEffect(() => {
    const el = railRef.current;
    if (!el) return;
    const update = () => {
      const max = el.scrollWidth - el.clientWidth;
      const p = max > 0 ? el.scrollLeft / max : 0;
      setProgress(p);
      setCanPrev(el.scrollLeft > 4);
      setCanNext(el.scrollLeft < max - 4);
    };
    update();
    el.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      el.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <>
      <div ref={railRef} className="reviews__rail" role="region" aria-label="Müşteri yorumları">
        {REVIEWS.map((r) => (
          <article key={r.name} className="review">
            <div className="review__top">
              <span className="review__avatar" aria-hidden="true">{r.initial}</span>
              <div className="review__who">
                <span className="review__name">{r.name}</span>
                <span className="review__date">{r.date}</span>
              </div>
            </div>
            <div className="review__stars" aria-label={`${r.rating} yıldız`}>
              {Array.from({ length: r.rating }).map((_, i) => <StarIcon key={i} />)}
            </div>
            <p className="review__text">{clip(r.text)}</p>
            <div className="review__source">
              <GoogleGIcon />
              <span>Google&apos;dan</span>
            </div>
          </article>
        ))}
      </div>

      <div className="rail-foot">
        <button
          type="button"
          className="rail-arrow"
          aria-label="Önceki"
          onClick={() => scrollByCards(-1)}
          disabled={!canPrev}
        >
          <ChevronLeft />
        </button>
        <div className="rail-bar" role="presentation">
          <span style={{ width: `${Math.max(8, progress * 100)}%` }} />
        </div>
        <button
          type="button"
          className="rail-arrow"
          aria-label="Sonraki"
          onClick={() => scrollByCards(1)}
          disabled={!canNext}
        >
          <ChevronRight />
        </button>
      </div>
    </>
  );
}
