"use client";

// Sepet context'i — localStorage (ym_cart_v1) destekli.
// Hydration uyumu: sunucuda ve ilk client render'da sepet BOŞ kabul edilir,
// localStorage yalnızca useEffect içinde okunur (SSR/CSR uyuşmazlığı olmaz).
// Fiyatlar burada sadece GÖSTERİM içindir — sipariş anında sunucu yeniden hesaplar.

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { CartLine, Product } from "@/lib/shop/types";

const STORAGE_KEY = "ym_cart_v1";
const MAX_QTY = 99;

export interface CartContextValue {
  lines: CartLine[];
  /** Toplam adet (rozet için). */
  count: number;
  /** Ara toplam — gösterim amaçlı. */
  subtotal: number;
  add: (product: Product, qty?: number) => void;
  setQty: (productId: string, qty: number) => void;
  remove: (productId: string) => void;
  clear: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

function clampQty(qty: number): number {
  return Math.min(MAX_QTY, Math.max(1, Math.floor(qty)));
}

/** localStorage'daki sepeti güvenli biçimde oku (bozuk veri → boş sepet). */
function readStoredLines(): CartLine[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter(
        (l): l is CartLine =>
          typeof l === "object" &&
          l !== null &&
          typeof (l as CartLine).productId === "string" &&
          typeof (l as CartLine).name === "string" &&
          typeof (l as CartLine).price === "number" &&
          typeof (l as CartLine).qty === "number",
      )
      .map((l) => ({ ...l, qty: clampQty(l.qty) }));
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [hydrated, setHydrated] = useState(false);

  // İlk yüklemede localStorage'ı oku (yalnızca client'ta).
  useEffect(() => {
    setLines(readStoredLines());
    setHydrated(true);
  }, []);

  // Değişiklikleri kalıcılaştır — hydrate olmadan yazma (boş sepetle ezme riski).
  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    } catch {
      // storage dolu/kapalı olabilir — sepet yine bellek içinde çalışır
    }
  }, [lines, hydrated]);

  const add = useCallback((product: Product, qty = 1) => {
    setLines((prev) => {
      const existing = prev.find((l) => l.productId === product.id);
      if (existing) {
        return prev.map((l) =>
          l.productId === product.id ? { ...l, qty: clampQty(l.qty + qty) } : l,
        );
      }
      const line: CartLine = {
        productId: product.id,
        slug: product.slug,
        name: product.name,
        brand: product.brand,
        sizeText: product.size_text,
        price: product.price,
        imageUrl: product.image_url,
        categorySlug: product.category_slug,
        qty: clampQty(qty),
      };
      return [...prev, line];
    });
  }, []);

  const setQty = useCallback((productId: string, qty: number) => {
    setLines((prev) =>
      qty <= 0
        ? prev.filter((l) => l.productId !== productId)
        : prev.map((l) =>
            l.productId === productId ? { ...l, qty: clampQty(qty) } : l,
          ),
    );
  }, []);

  const remove = useCallback((productId: string) => {
    setLines((prev) => prev.filter((l) => l.productId !== productId));
  }, []);

  const clear = useCallback(() => {
    setLines([]);
  }, []);

  const value = useMemo<CartContextValue>(() => {
    const count = lines.reduce((sum, l) => sum + l.qty, 0);
    const subtotal =
      Math.round(lines.reduce((sum, l) => sum + l.price * l.qty, 0) * 100) / 100;
    return { lines, count, subtotal, add, setQty, remove, clear };
  }, [lines, add, setQty, remove, clear]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart, <CartProvider> içinde kullanılmalı.");
  }
  return ctx;
}
