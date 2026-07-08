"use client";

// Sepet context'i - İKİ MODLU:
//  * Girişsiz (guest): localStorage "ym_cart_guest_v1" (eski "ym_cart_v1"
//    anahtarı bir kez okunup taşınır, canlıdaki sepetler kaybolmaz).
//  * Girişli (db): kaynak Supabase cart_items tablosu. Girişte guest sepet
//    DB'ye MERGE edilir (aynı ürün: adetler toplanır, max 99) ve guest
//    storage temizlenir. Mutasyonlar optimistic: önce local state, sonra
//    DB'ye upsert/delete; DB hatası sessizce yutulur (UI local doğru kalır).
//  * cart_items tablosu yoksa (migration atılmadıysa) hata yutulur ve
//    localStorage moduna düşülür.
// Hydration uyumu: sunucuda ve ilk client render'da sepet BOŞ kabul edilir;
// localStorage ve DB okumaları YALNIZ useEffect içinde yapılır.
// Fiyatlar burada sadece GÖSTERİM içindir - sipariş anında sunucu yeniden hesaplar.

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { createClient } from "@/lib/supabase/client";
import {
  clampGrams,
  computeLineTotal,
  WEIGHT_STEP_GRAMS,
  type CartLine,
  type Product,
} from "@/lib/shop/types";

const GUEST_STORAGE_KEY = "ym_cart_guest_v1";
const LEGACY_STORAGE_KEY = "ym_cart_v1"; // önceki sürümün anahtarı
const MAX_QTY = 99;

export interface CartContextValue {
  lines: CartLine[];
  /** Toplam adet (rozet için). */
  count: number;
  /** Ara toplam - gösterim amaçlı. */
  subtotal: number;
  add: (product: Product, qty?: number) => void;
  setQty: (productId: string, qty: number) => void;
  remove: (productId: string) => void;
  clear: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

/** Adet/gram sınırlama: gram bazlıysa 250'şer adım [250, 10000], değilse [1, 99]. */
function clampQty(qty: number, soldByWeight = false): number {
  if (soldByWeight) return clampGrams(qty);
  return Math.min(MAX_QTY, Math.max(1, Math.floor(qty)));
}

function parseLines(raw: string | null): CartLine[] {
  try {
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
      .map((l) => {
        const byWeight = (l as CartLine).soldByWeight === true;
        return { ...l, soldByWeight: byWeight, qty: clampQty(l.qty, byWeight) };
      });
  } catch {
    return [];
  }
}

/** Guest sepetini güvenli oku (bozuk veri → boş). Eski anahtar varsa taşı. */
function readGuestLines(): CartLine[] {
  try {
    const current = parseLines(window.localStorage.getItem(GUEST_STORAGE_KEY));
    if (current.length > 0) return current;
    // Eski sürümden kalan sepeti bir defalık devral
    const legacy = parseLines(window.localStorage.getItem(LEGACY_STORAGE_KEY));
    window.localStorage.removeItem(LEGACY_STORAGE_KEY);
    return legacy;
  } catch {
    return [];
  }
}

function clearGuestStorage() {
  try {
    window.localStorage.removeItem(GUEST_STORAGE_KEY);
    window.localStorage.removeItem(LEGACY_STORAGE_KEY);
  } catch {
    // storage kapalı olabilir - önemsiz
  }
}

/** cart_items + products join satırının ham tipi. */
interface DbCartRow {
  product_id: string;
  qty: number;
  products: {
    id: string;
    slug: string;
    name: string;
    brand: string;
    size_text: string;
    price: number;
    sold_by_weight: boolean;
    image_url: string | null;
    category_slug: string;
  } | null;
}

function dbRowToLine(row: DbCartRow): CartLine | null {
  const p = row.products;
  if (!p) return null; // ürün silinmiş/erişilemez - satırı atla
  const byWeight = p.sold_by_weight === true;
  return {
    productId: p.id,
    slug: p.slug,
    name: p.name,
    brand: p.brand,
    sizeText: p.size_text,
    price: Number(p.price),
    imageUrl: p.image_url,
    categorySlug: p.category_slug,
    soldByWeight: byWeight,
    qty: clampQty(row.qty, byWeight),
  };
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  // "guest": localStorage kalıcılığı aktif; "db": Supabase kalıcılığı aktif.
  const [mode, setMode] = useState<"guest" | "db">("guest");
  const [hydrated, setHydrated] = useState(false);

  // Supabase browser client'ı YALNIZ ilk kullanımda oluştur — render sırasında
  // değil. Statik prerender'da (env yokken) createClient patlamasın; tüm
  // kullanımlar zaten effect/callback içinde (tarayıcıda) çalışıyor.
  const supabaseRef = useRef<ReturnType<typeof createClient> | null>(null);
  const getSupabase = useCallback(() => {
    if (!supabaseRef.current) supabaseRef.current = createClient();
    return supabaseRef.current;
  }, []);
  // Mutasyon anında güncel satırlara senkron erişim (optimistic + DB yazımı).
  // Tüm satır güncellemeleri applyLines üzerinden geçer, ref hep günceldir.
  const linesRef = useRef<CartLine[]>([]);
  const applyLines = useCallback(
    (updater: (prev: CartLine[]) => CartLine[]) => {
      const next = updater(linesRef.current);
      linesRef.current = next;
      setLines(next);
      return next;
    },
    [],
  );
  // Girişli kullanıcının id'si (DB moduna geçilmişse dolu).
  const userIdRef = useRef<string | null>(null);
  // Tablo yok / DB erişilemiyor → kalıcı olarak localStorage moduna düş.
  const dbDisabledRef = useRef(false);
  // Aynı kullanıcı için DB yüklemesini bir kez yap (TOKEN_REFRESHED vb. yinelemez).
  // undefined = henüz hiç yükleme yapılmadı (ilk mount).
  const loadedUserRef = useRef<string | null | undefined>(undefined);
  // Yarış koruması: yalnız en son başlatılan yüklemenin sonucu uygulanır.
  const loadSeqRef = useRef(0);

  /** Guest moda geç ve localStorage'daki sepeti yükle. */
  const enterGuestMode = useCallback((seq: number, empty: boolean) => {
    if (seq !== loadSeqRef.current) return;
    userIdRef.current = null;
    setMode("guest");
    applyLines(() => (empty ? [] : readGuestLines()));
    setHydrated(true);
  }, [applyLines]);

  /** Girişte DB sepetini yükle + guest sepeti DB'ye merge et. */
  const enterDbMode = useCallback(
    async (userId: string, seq: number) => {
      try {
        const { data, error } = await getSupabase()
          .from("cart_items")
          .select(
            "product_id, qty, products(id, slug, name, brand, size_text, price, sold_by_weight, image_url, category_slug)",
          )
          .eq("user_id", userId);
        if (seq !== loadSeqRef.current) return;
        if (error) {
          // Tablo kurulmamış olabilir - sessizce localStorage moduna düş.
          dbDisabledRef.current = true;
          enterGuestMode(seq, false);
          return;
        }

        const dbLines = ((data ?? []) as unknown as DbCartRow[])
          .map(dbRowToLine)
          .filter((l): l is CartLine => l !== null);

        // Guest sepeti varsa DB ile birleştir: aynı ürünün adetleri toplanır (max 99).
        const guestLines = readGuestLines();
        let merged = dbLines;
        if (guestLines.length > 0) {
          const byId = new Map(dbLines.map((l) => [l.productId, l]));
          for (const g of guestLines) {
            const existing = byId.get(g.productId);
            byId.set(
              g.productId,
              existing
                ? {
                    ...existing,
                    qty: clampQty(existing.qty + g.qty, existing.soldByWeight),
                  }
                : g,
            );
          }
          merged = Array.from(byId.values());

          const { error: upsertError } = await getSupabase().from("cart_items").upsert(
            merged
              .filter((l) => guestLines.some((g) => g.productId === l.productId))
              .map((l) => ({
                user_id: userId,
                product_id: l.productId,
                qty: l.qty,
              })),
            { onConflict: "user_id,product_id" },
          );
          // Guest storage yalnız merge DB'ye yazılabildiyse temizlenir;
          // hata olduysa sepet bir sonraki girişte yeniden merge edilir.
          if (!upsertError) clearGuestStorage();
        }

        if (seq !== loadSeqRef.current) return;
        userIdRef.current = userId;
        setMode("db");
        applyLines(() => merged);
        setHydrated(true);
      } catch {
        // Ağ/istemci hatası - localStorage moduna düş, UI çalışmaya devam etsin.
        dbDisabledRef.current = true;
        enterGuestMode(seq, false);
      }
    },
    [getSupabase, enterGuestMode, applyLines],
  );

  // Auth durumunu izle; giriş/çıkışta modu değiştir.
  useEffect(() => {
    const applyUser = (userId: string | null) => {
      if (userId && dbDisabledRef.current) userId = null; // DB devre dışıysa hep guest
      if (userId === loadedUserRef.current) return; // aynı oturum için tekrar yükleme
      const wasSignedIn = typeof loadedUserRef.current === "string";
      loadedUserRef.current = userId;
      const seq = ++loadSeqRef.current;
      if (userId) {
        void enterDbMode(userId, seq);
      } else {
        // Çıkışta sepet BOŞ başlar (hesabın sepeti hesapta kalır);
        // ilk yüklemede ise guest sepet localStorage'dan okunur.
        enterGuestMode(seq, wasSignedIn);
      }
    };

    // onAuthStateChange ilk oturumu da (INITIAL_SESSION) bildirir;
    // yine de getSession ile başlangıcı garantiye alıyoruz.
    getSupabase().auth
      .getSession()
      .then(({ data }) => applyUser(data.session?.user?.id ?? null))
      .catch(() => applyUser(null));

    const { data: sub } = getSupabase().auth.onAuthStateChange((_event, session) => {
      applyUser(session?.user?.id ?? null);
    });
    return () => {
      sub.subscription.unsubscribe();
    };
  }, [getSupabase, enterDbMode, enterGuestMode]);

  // Guest modda değişiklikleri localStorage'a yaz.
  // Hydrate olmadan yazma (boş sepetle ezme riski); DB modunda dokunma.
  useEffect(() => {
    if (!hydrated || mode !== "guest") return;
    try {
      window.localStorage.setItem(GUEST_STORAGE_KEY, JSON.stringify(lines));
    } catch {
      // storage dolu/kapalı olabilir - sepet yine bellek içinde çalışır
    }
  }, [lines, hydrated, mode]);

  /** DB modundaysa satırı upsert et (hata sessizce yutulur). */
  const dbUpsert = useCallback(
    (productId: string, qty: number) => {
      const userId = userIdRef.current;
      if (!userId || dbDisabledRef.current) return;
      void getSupabase()
        .from("cart_items")
        .upsert(
          { user_id: userId, product_id: productId, qty },
          { onConflict: "user_id,product_id" },
        )
        .then(
          () => undefined,
          () => undefined,
        );
    },
    [getSupabase],
  );

  /** DB modundaysa satırı sil (hata sessizce yutulur). */
  const dbDelete = useCallback(
    (productId: string | null) => {
      const userId = userIdRef.current;
      if (!userId || dbDisabledRef.current) return;
      let query = getSupabase().from("cart_items").delete().eq("user_id", userId);
      if (productId) query = query.eq("product_id", productId);
      void query.then(
        () => undefined,
        () => undefined,
      );
    },
    [getSupabase],
  );

  const add = useCallback(
    (product: Product, amount?: number) => {
      const byWeight = product.sold_by_weight === true;
      // Gram bazlıysa varsayılan ekleme 250 g adımı; adetliyse 1.
      const inc = amount ?? (byWeight ? WEIGHT_STEP_GRAMS : 1);
      const existing = linesRef.current.find((l) => l.productId === product.id);
      const nextQty = clampQty((existing?.qty ?? 0) + inc, byWeight);
      applyLines((prev) => {
        if (prev.some((l) => l.productId === product.id)) {
          return prev.map((l) =>
            l.productId === product.id ? { ...l, qty: nextQty } : l,
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
          soldByWeight: byWeight,
          qty: nextQty,
        };
        return [...prev, line];
      });
      dbUpsert(product.id, nextQty);
    },
    [applyLines, dbUpsert],
  );

  const setQty = useCallback(
    (productId: string, qty: number) => {
      if (qty <= 0) {
        applyLines((prev) => prev.filter((l) => l.productId !== productId));
        dbDelete(productId);
        return;
      }
      const byWeight =
        linesRef.current.find((l) => l.productId === productId)?.soldByWeight ??
        false;
      const clamped = clampQty(qty, byWeight);
      applyLines((prev) =>
        prev.map((l) => (l.productId === productId ? { ...l, qty: clamped } : l)),
      );
      dbUpsert(productId, clamped);
    },
    [applyLines, dbUpsert, dbDelete],
  );

  const remove = useCallback(
    (productId: string) => {
      applyLines((prev) => prev.filter((l) => l.productId !== productId));
      dbDelete(productId);
    },
    [applyLines, dbDelete],
  );

  const clear = useCallback(() => {
    applyLines(() => []);
    dbDelete(null); // kullanıcının tüm sepet satırları
  }, [applyLines, dbDelete]);

  const value = useMemo<CartContextValue>(() => {
    // Rozet sayısı: gram bazlı satır 1 ürün sayılır (gram toplamı anlamsız olur).
    const count = lines.reduce(
      (sum, l) => sum + (l.soldByWeight ? 1 : l.qty),
      0,
    );
    const subtotal =
      Math.round(
        lines.reduce(
          (sum, l) => sum + computeLineTotal(l.price, l.qty, l.soldByWeight),
          0,
        ) * 100,
      ) / 100;
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
