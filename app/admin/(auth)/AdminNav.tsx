"use client";

// Admin sekme navigasyonu — aktif sekmeyi mevcut yola göre vurgular.

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "../admin.module.css";

interface Tab {
  href: string;
  label: string;
  isActive: (pathname: string) => boolean;
}

const SHOP_PREFIXES = ["/admin/siparisler", "/admin/urunler", "/admin/ayarlar"];

const TABS: Tab[] = [
  { href: "/admin", label: "Panel", isActive: (p) => p === "/admin" },
  {
    href: "/admin/siparisler",
    label: "Siparişler",
    isActive: (p) => p.startsWith("/admin/siparisler"),
  },
  {
    href: "/admin/urunler",
    label: "Ürünler",
    isActive: (p) => p.startsWith("/admin/urunler"),
  },
  {
    href: "/admin/ayarlar",
    label: "Ayarlar",
    isActive: (p) => p.startsWith("/admin/ayarlar"),
  },
  {
    // Chat listesi panel sayfasında (SessionList); sohbet detayı /admin/[sessionId].
    href: "/admin#sohbetler",
    label: "Chat",
    isActive: (p) =>
      p !== "/admin" &&
      p.startsWith("/admin/") &&
      !SHOP_PREFIXES.some((prefix) => p.startsWith(prefix)),
  },
];

export default function AdminNav() {
  const pathname = usePathname() ?? "";

  return (
    <nav className={styles.tabs} aria-label="Admin bölümleri">
      {TABS.map((tab) => (
        <Link
          key={tab.label}
          href={tab.href}
          className={`${styles.tab} ${tab.isActive(pathname) ? styles["tab--active"] : ""}`}
        >
          {tab.label}
        </Link>
      ))}
    </nav>
  );
}
