"use client";

import { useEffect, useRef, useState } from "react";

type Msg = { from: "in" | "out"; text: string; time: string };

const MESSAGES: Msg[] = [
  { from: "in", text: "Merhaba, yarın sabaha ekmek, 2 yoğurt, domates ve bir bağ maydanoz alabilir miyim?", time: "18:42" },
  { from: "out", text: "Tabii efendim, sabaha hazır eder kapınıza getiririz. Başka ihtiyacınız var mı?", time: "18:42" },
  { from: "in", text: "Bir de yarım kilo zeytin ekleyelim lütfen.", time: "18:43" },
  { from: "out", text: "Not aldım. Yeşil mi siyah mı olsun?", time: "18:43" },
  { from: "in", text: "Yeşil olsun, çok teşekkür ederim.", time: "18:44" },
  { from: "out", text: "Rica ederiz 🙂 Sabah 07:35'te kapınızdayız.", time: "18:44" },
];

// Her mesaj ~3 sn ekranda kalır; karşı taraf yazarken typing gösterilir.
const STEP_MS = 3000;
const TYPING_MS = 1100;

function Checks() {
  return (
    <svg className="chat-bubble__checks" viewBox="0 0 18 12" fill="none" aria-hidden="true">
      <path d="M1 6.5 4 9.5 10 2.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M7.5 6.5 10.5 9.5 16.5 2.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

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
      // bir sonraki "out" mesajından önce typing göster
      if (MESSAGES[i].from === "out") {
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
        <span className="chat__avatar">Y</span>
        <span className="chat__who">
          <span className="chat__name">Yeni Mahalle Market</span>
          <span className="chat__status">çevrimiçi</span>
        </span>
      </div>
      <div className="chat__body" ref={bodyRef}>
        {shown.map((m, i) => (
          <div key={i} className={`chat-bubble chat-bubble--${m.from}`}>
            <span className="chat-bubble__text">{m.text}</span>
            <span className="chat-bubble__meta">
              {m.time}
              {m.from === "out" && <Checks />}
            </span>
          </div>
        ))}
        {typing && (
          <div className="chat-typing" key="typing">
            <span /><span /><span />
          </div>
        )}
      </div>
    </div>
  );
}
