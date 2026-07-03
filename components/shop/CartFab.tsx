"use client";

// Yüzen sepet butonu — sağ altta, WhatsApp butonunun (wa-fab) hemen ÜSTÜNDE.
// Sepet boşken görünmez; adet rozeti taşır, tıklayınca /sepet'e gider.

import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/components/shop/CartProvider";
import styles from "./CartFab.module.css";

export default function CartFab() {
  const { count } = useCart();

  if (count === 0) return null;

  return (
    <Link
      href="/sepet"
      className={styles.fab}
      aria-label={`Sepete git — sepette ${count} ürün var`}
    >
      <ShoppingCart aria-hidden="true" />
      <span className={styles.badge} aria-hidden="true">
        {count > 99 ? "99+" : count}
      </span>
    </Link>
  );
}
