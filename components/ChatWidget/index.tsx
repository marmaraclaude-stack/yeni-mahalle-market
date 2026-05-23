"use client";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";

// SSR yok — widget tamamen client'ta yüklensin (performans + localStorage erişimi).
const ChatWidget = dynamic(() => import("./ChatWidget"), {
  ssr: false,
  loading: () => null,
});

export default function ChatWidgetMount() {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) return null;
  return <ChatWidget />;
}
