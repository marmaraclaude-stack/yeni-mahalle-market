"use client";

// Admin navigasyonu — aktif bağlantıyı mevcut yola göre vurgular.
// Masaüstünde dikey sidebar linkleri, mobilde yatay kaydırılabilir sekmeler
// (aynı markup; görünüm admin.module.css'teki medya sorgusuyla değişir).

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  MessageCircle,
  Package,
  Settings,
  ShoppingBag,
  Ticket,
  type LucideIcon,
} from "lucide-react";
import styles from "../admin.module.css";

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  isActive: (pathname: string) => boolean;
}

const SHOP_PREFIXES = [
  "/admin/siparisler",
  "/admin/urunler",
  "/admin/kuponlar",
  "/admin/ayarlar",
];

const ITEMS: NavItem[] = [
  {
    href: "/admin",
    label: "Panel",
    icon: LayoutDashboard,
    isActive: (p) => p === "/admin",
  },
  {
    href: "/admin/siparisler",
    label: "Siparişler",
    icon: ShoppingBag,
    isActive: (p) => p.startsWith("/admin/siparisler"),
  },
  {
    href: "/admin/urunler",
    label: "Ürünler",
    icon: Package,
    isActive: (p) => p.startsWith("/admin/urunler"),
  },
  {
    href: "/admin/kuponlar",
    label: "Kuponlar",
    icon: Ticket,
    isActive: (p) => p.startsWith("/admin/kuponlar"),
  },
  {
    href: "/admin/ayarlar",
    label: "Ayarlar",
    icon: Settings,
    isActive: (p) => p.startsWith("/admin/ayarlar"),
  },
  {
    // Sohbet listesi /admin/sohbetler; sohbet detayı /admin/[sessionId].
    href: "/admin/sohbetler",
    label: "Sohbetler",
    icon: MessageCircle,
    isActive: (p) =>
      p !== "/admin" &&
      p.startsWith("/admin/") &&
      !SHOP_PREFIXES.some((prefix) => p.startsWith(prefix)),
  },
];

export default function AdminNav() {
  const pathname = usePathname() ?? "";

  return (
    <nav className={styles.nav} aria-label="Admin bölümleri">
      {ITEMS.map((item) => {
        const Icon = item.icon;
        const active = item.isActive(pathname);
        return (
          <Link
            key={item.label}
            href={item.href}
            className={`${styles.navLink} ${active ? styles["navLink--active"] : ""}`}
            aria-current={active ? "page" : undefined}
          >
            <span className={styles.navIcon} aria-hidden>
              <Icon size={17} strokeWidth={2} />
            </span>
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
