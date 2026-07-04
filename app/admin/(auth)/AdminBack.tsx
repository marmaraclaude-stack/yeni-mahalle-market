// Admin detay sayfaları için tutarlı geri linki.
// ChevronLeft ikonu + etiket; tüm admin geri gezinmelerinde kullanılır.

import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import styles from "../admin.module.css";

export default function AdminBack({
  href,
  label,
}: {
  href: string;
  label: string;
}) {
  return (
    <Link href={href} className={styles.adminBack}>
      <ChevronLeft size={16} strokeWidth={2.2} aria-hidden />
      {label}
    </Link>
  );
}
