// Metindeki Türk telefon numaralarını tek dokunuşla aranabilir
// <a href="tel:..."> linklerine çevirir. Kapalı mesajı gibi serbest metinlerde
// kullanılır; numara bulunmazsa metin olduğu gibi döner.

import type { ReactNode } from "react";

const PHONE_RE = /(0\s?[2-5]\d{2}[\s.]?\d{3}[\s.]?\d{2}[\s.]?\d{2})/g;

export function linkifyPhone(text: string): ReactNode {
  const parts = text.split(PHONE_RE);
  if (parts.length === 1) return text;
  return parts.map((part, i) => {
    if (i % 2 === 1) {
      // Eşleşen numara: "0532 596 37 55" → tel:+905325963755
      const digits = part.replace(/\D/g, "").replace(/^0/, "");
      return (
        <a key={i} href={`tel:+90${digits}`}>
          {part}
        </a>
      );
    }
    return part;
  });
}
