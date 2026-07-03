// Arama kutusu — düz GET formu: JS gerekmeden çalışır, sonuç SSR ile gelir.
// Aktif kategori (k) hidden input ile korunur.

import { Search } from "lucide-react";
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
      <button type="submit" className={styles.searchBtn}>
        Ara
      </button>
    </form>
  );
}
