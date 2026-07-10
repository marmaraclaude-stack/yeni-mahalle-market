// Mağaza ayarları — shop_settings tablosundaki tek satır (id=1).
// Anon server client ile okunur; tablo/satır yoksa makul default döner (site patlamaz).

import { createClient } from "@/lib/supabase/server";
import type { ShopSettings } from "@/lib/shop/types";

export const DEFAULT_SHOP_SETTINGS: ShopSettings = {
  id: 1,
  delivery_fee: 0,
  free_delivery_over: 0,
  delivery_per_km: 0,
  delivery_km_included: 0,
  min_order_total: 0,
  cod_cash_enabled: true,
  cod_card_enabled: true,
  iyzico_enabled: false,
  ordering_open: true,
  closed_message:
    "Şu an online sipariş alamıyoruz. Canlı destekten bize yazabilirsiniz.",
};

export async function getShopSettings(): Promise<ShopSettings> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("shop_settings")
      .select("*")
      .eq("id", 1)
      .maybeSingle();

    if (error || !data) return DEFAULT_SHOP_SETTINGS;

    const row = data as Partial<ShopSettings>;
    // numeric kolonlar string dönebilir — Number() ile normalize et.
    return {
      id: 1,
      delivery_fee: Number(row.delivery_fee ?? 0),
      free_delivery_over: Number(row.free_delivery_over ?? 0),
      delivery_per_km: Number(row.delivery_per_km ?? 0),
      delivery_km_included: Number(row.delivery_km_included ?? 0),
      min_order_total: Number(row.min_order_total ?? 0),
      cod_cash_enabled: row.cod_cash_enabled ?? true,
      cod_card_enabled: row.cod_card_enabled ?? true,
      iyzico_enabled: row.iyzico_enabled ?? false,
      ordering_open: row.ordering_open ?? true,
      closed_message: row.closed_message ?? DEFAULT_SHOP_SETTINGS.closed_message,
    };
  } catch {
    // DB henüz kurulmadıysa bile sepet/ödeme sayfaları çalışsın.
    return DEFAULT_SHOP_SETTINGS;
  }
}

/**
 * Teslimat ücretini hesapla.
 * free_delivery_over > 0 ise ve ara toplam eşiği geçtiyse ücretsiz.
 * 0 = ücretsiz teslimat eşiği YOK (delivery_fee her siparişe uygulanır).
 */
// Saf hesaplar client'ta da kullanılır — types.ts'te tanımlı, buradan
// geriye dönük uyum için re-export edilir.
export { calcDeliveryFee, haversineKm } from "@/lib/shop/types";
