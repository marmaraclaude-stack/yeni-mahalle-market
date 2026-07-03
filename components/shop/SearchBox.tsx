// Arama kutusu — düz GET formu: JS gerekmeden çalışır, sonuç SSR ile gelir.
// Aktif kategori (k) hidden input ile korunur. Dolu aramada temizle (x)
// linki görünür: JS'siz çalışır, aktif kategoriyi korur.

import Link from "next/link";
import { Search, X } from "lucide-react";
import styles from "@/app/urunler/shop.module.css";

export default function SearchBox({ q, k }: { q?: string; k?: string }) {
  return (
    <form
      action="/urunler"
      method="get"
      role="search"
      className={styles.search}
    >
      {k ? <input type="hidden" name="k" value={k} /> : null}
      <Search
        size={17}
        strokeWidth={2}
        className={styles.searchIcon}
        aria-hidden="true"
      />
      <input
        // q değişince (client navigasyonu) input yeniden kurulsun
        key={q ?? ""}
        type="search"
        name="q"
        defaultValue={q}
        placeholder="Ürün veya marka ara…"
        aria-label="Ürün ara"
        className={styles.searchInput}
      />
      {q ? (
        <Link
          href={k ? `/urunler?k=${k}` : "/urunler"}
          className={styles.searchClear}
          aria-label="Aramayı temizle"
        >
          <X size={15} strokeWidth={2.2} aria-hidden="true" />
        </Link>
      ) : null}
      <button type="submit" className={styles.searchBtn}>
        Ara
      </button>
    </form>
  );
}
