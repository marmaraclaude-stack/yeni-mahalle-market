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
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setVisible(true);
            io.disconnect();
          }
        });
      },
      { threshold: 0.3 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className={`chat${visible ? " is-visible" : ""}`} aria-hidden="true">
      <div className="chat__head">
        <span className="chat__avatar">Y</span>
        <span className="chat__who">
          <span className="chat__name">Yeni Mahalle Market</span>
          <span className="chat__status">çevrimiçi</span>
        </span>
      </div>
      <div className="chat__body">
        {MESSAGES.map((m, i) => (
          <div
            key={i}
            className={`chat-bubble chat-bubble--${m.from}`}
            style={{ transitionDelay: `${0.2 + i * 0.22}s` }}
          >
            <span className="chat-bubble__text">{m.text}</span>
            <span className="chat-bubble__meta">
              {m.time}
              {m.from === "out" && <Checks />}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
