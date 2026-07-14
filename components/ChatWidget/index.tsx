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
  // Admin panelinde ve zaten sohbet sayfasında (/destek) FAB gösterilmez.
  if (pathname?.startsWith("/admin") || pathname === "/destek") return null;
  return <ChatWidget />;
}
