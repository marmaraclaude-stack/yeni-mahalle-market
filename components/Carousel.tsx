"use client";

import Image from "next/image";
import { useState, useEffect, useCallback, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const SLIDES = [1, 2, 3, 4, 5, 6, 7].map((n) => `/carousel/carousel-${n}.png`);
const INTERVAL = 4500;

export default function Carousel() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchX = useRef<number | null>(null);

  const go = useCallback(
    (n: number) => setIndex((p) => (n + SLIDES.length) % SLIDES.length),
    [],
  );

  useEffect(() => {
    if (paused) return;
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    const id = setInterval(() => setIndex((p) => (p + 1) % SLIDES.length), INTERVAL);
    return () => clearInterval(id);
  }, [paused]);

  const onTouchStart = (e: React.TouchEvent) => {
    touchX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchX.current;
    if (Math.abs(dx) > 40) go(index + (dx < 0 ? 1 : -1));
    touchX.current = null;
  };

  return (
    <div
      className="carousel"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <div className="carousel__viewport">
        <div
          className="carousel__track"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {SLIDES.map((src, idx) => (
            <div className="carousel__slide" key={src}>
              <Image
                src={src}
                alt={`Yeni Mahalle Market mağaza görseli ${idx + 1}`}
                fill
                sizes="(max-width: 1480px) 100vw, 1440px"
                className="carousel__img"
                priority={idx === 0}
              />
            </div>
          ))}
        </div>
      </div>

      <button
        type="button"
        className="carousel__arrow carousel__arrow--prev"
        onClick={() => go(index - 1)}
        aria-label="Önceki görsel"
      >
        <ChevronLeft size={20} strokeWidth={2.2} />
      </button>
      <button
        type="button"
        className="carousel__arrow carousel__arrow--next"
        onClick={() => go(index + 1)}
        aria-label="Sonraki görsel"
      >
        <ChevronRight size={20} strokeWidth={2.2} />
      </button>

      <div className="carousel__dots" role="tablist" aria-label="Görsel seç">
        {SLIDES.map((_, idx) => (
          <button
            type="button"
            key={idx}
            className={`carousel__dot${idx === index ? " is-active" : ""}`}
            onClick={() => setIndex(idx)}
            aria-label={`${idx + 1}. görsel`}
            aria-selected={idx === index}
            role="tab"
          />
        ))}
      </div>
    </div>
  );
}
