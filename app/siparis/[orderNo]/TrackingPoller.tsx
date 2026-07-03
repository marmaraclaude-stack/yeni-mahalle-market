"use client";

// Aktif siparişte 20 sn'de bir sunucu verisini tazeler (router.refresh).
// delivered/cancelled durumlarında polling yapılmaz.

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const POLL_MS = 20_000;

export default function TrackingPoller({ active }: { active: boolean }) {
  const router = useRouter();

  useEffect(() => {
    if (!active) return;
    const id = setInterval(() => router.refresh(), POLL_MS);
    return () => clearInterval(id);
  }, [active, router]);

  return null;
}
