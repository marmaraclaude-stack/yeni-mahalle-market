"use client";

import { useEffect, useRef, useState } from "react";

/* Ana sayfadaki statik canli destek onizlemesi.
   Gorunum, sitenin gercek ChatWidget'inin (components/ChatWidget) renk
   dilini birebir yansitir: koyu baslik cubugu, turuncu musteri balonu,
   beyaz magaza balonu, krem govde. Tamamen dekoratiftir. */

type Msg = { from: "customer" | "store"; text: string; time: string };

// Gerçek widget'ın karşılama mesajıyla açılır; devamı SSS içeriğinden
// (teslimat süresi, ödeme, çalışma saatleri) beslenir.
const MESSAGES: Msg[] = [
  { from: "store", text: "Merhaba 👋 Yeni Mahalle Market'e hoş geldiniz. Size nasıl yardımcı olabiliriz?", time: "14:02" },
  { from: "customer", text: "Merhaba! Teslimat ne kadar sürüyor?", time: "14:02" },
  { from: "store", text: "Sapanca içinde ortalama 30 dakikada kapınızdayız.", time: "14:03" },
  { from: "customer", text: "Ödemeyi kapıda yapabilir miyim?", time: "14:03" },
  { from: "store", text: "Tabii, kapıda nakit veya kart geçerli. Dilerseniz online kartla da ödeyebilirsiniz.", time: "14:04" },
  { from: "customer", text: "Harika, teşekkürler!", time: "14:04" },
  { from: "store", text: "Rica ederiz. Her gün 07:30 - 02:00 arası buradayız 👋", time: "14:05" },
];

// Her mesaj ~3 sn ekranda kalır; karşı taraf yazarken typing gösterilir.
const STEP_MS = 3000;
const TYPING_MS = 1100;

export default function ChatPreview() {
  const ref = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const [started, setStarted] = useState(false);
  const [count, setCount] = useState(0); // kaç mesaj görünür
  const [typing, setTyping] = useState(false);

  // Bölüm görünür olunca başlat
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setStarted(true);
            io.disconnect();
          }
        });
      },
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Sıralı oynatma döngüsü
  useEffect(() => {
    if (!started) return;
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setCount(MESSAGES.length);
      return;
    }

    const timers: ReturnType<typeof setTimeout>[] = [];
    let cancelled = false;

    const playFrom = (i: number) => {
      if (cancelled) return;
      if (i >= MESSAGES.length) {
        // tamamlandı: kısa bekleyip baştan
        timers.push(setTimeout(() => {
          if (cancelled) return;
          setCount(0);
          setTyping(false);
          timers.push(setTimeout(() => playFrom(0), 500));
        }, STEP_MS + 600));
        return;
      }
      // mağaza cevabından önce typing göster
      if (MESSAGES[i].from === "store") {
        setTyping(true);
        timers.push(setTimeout(() => {
          if (cancelled) return;
          setTyping(false);
          setCount(i + 1);
          timers.push(setTimeout(() => playFrom(i + 1), STEP_MS));
        }, TYPING_MS));
      } else {
        setCount(i + 1);
        timers.push(setTimeout(() => playFrom(i + 1), STEP_MS));
      }
    };

    timers.push(setTimeout(() => playFrom(0), 400));
    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
    };
  }, [started]);

  // Yeni mesajda en alta kaydır
  useEffect(() => {
    const b = bodyRef.current;
    if (b) b.scrollTop = b.scrollHeight;
  }, [count, typing]);

  const shown = MESSAGES.slice(0, count);

  return (
    <div ref={ref} className="chat" aria-hidden="true">
      <div className="chat__head">
        <span className="chat__avatar">
          <img src="/logo.png" alt="" />
        </span>
        <span className="chat__who">
          <span className="chat__name">Canlı Destek</span>
          <span className="chat__status">
            <span className="chat__dot" />
            Çevrimiçi · Yeni Mahalle Market
          </span>
        </span>
      </div>
      <div className="chat__body" ref={bodyRef}>
        {shown.map((m, i) => (
          <div key={i} className={`chat-bubble chat-bubble--${m.from}`}>
            <span className="chat-bubble__text">{m.text}</span>
            <span className="chat-bubble__meta">{m.time}</span>
          </div>
        ))}
        {typing && (
          <div className="chat-typing" key="typing">
            <span /><span /><span />
          </div>
        )}
      </div>
      {/* Dekoratif yazı çubuğu: gerçek widget'taki composer'ın önizlemesi */}
      <div className="chat__composer">
        <span className="chat__composer-input">Mesajını yaz...</span>
        <span className="chat__composer-send">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M4 12l16-8-6 16-2-7-8-1z" />
          </svg>
        </span>
      </div>
    </div>
  );
}
