// Admin — mağaza ayarları (shop_settings, tek satır id=1).
// Server component + form action; kayıt sonrası ?kaydedildi=1 ile geri döner.

import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { updateSettings } from "@/lib/shop/admin-actions";
import type { ShopSettings } from "@/lib/shop/types";
import styles from "../../admin.module.css";

export const dynamic = "force-dynamic";
export const metadata = { title: "Ayarlar" };

const DEFAULT_SETTINGS: ShopSettings = {
  id: 1,
  delivery_fee: 0,
  free_delivery_over: 0,
  min_order_total: 0,
  cod_cash_enabled: true,
  cod_card_enabled: true,
  iyzico_enabled: false,
  ordering_open: true,
  closed_message:
    "Şu an online sipariş alamıyoruz. WhatsApp üzerinden yazabilirsiniz.",
};

async function saveSettingsAction(formData: FormData) {
  "use server";
  const num = (name: string): number => {
    const n = Number.parseFloat(String(formData.get(name) ?? "0").replace(",", "."));
    return Number.isFinite(n) && n >= 0 ? n : 0;
  };
  const bool = (name: string): boolean => formData.get(name) === "on";

  await updateSettings({
    delivery_fee: num("delivery_fee"),
    free_delivery_over: num("free_delivery_over"),
    min_order_total: num("min_order_total"),
    cod_cash_enabled: bool("cod_cash_enabled"),
    cod_card_enabled: bool("cod_card_enabled"),
    iyzico_enabled: bool("iyzico_enabled"),
    ordering_open: bool("ordering_open"),
    closed_message: String(formData.get("closed_message") ?? "").slice(0, 500),
  });
  redirect("/admin/ayarlar?kaydedildi=1");
}

export default async function AdminSettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ kaydedildi?: string }>;
}) {
  const { kaydedildi } = await searchParams;

  let settings = DEFAULT_SETTINGS;
  let loadError: string | null = null;
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("shop_settings")
      .select("*")
      .eq("id", 1)
      .maybeSingle();
    if (error) {
      loadError = error.message;
    } else if (data) {
      settings = data as ShopSettings;
    }
  } catch (e) {
    loadError = e instanceof Error ? e.message : "Bilinmeyen hata";
  }

  return (
    <>
      <h1 className={styles.title}>Ayarlar</h1>
      <p className={styles.subtitle}>
        Teslimat, minimum sepet ve ödeme yöntemi ayarları.
      </p>

      {kaydedildi === "1" && (
        <p className={styles.msgOk} role="status">
          Ayarlar kaydedildi.
        </p>
      )}

      {loadError ? (
        <div className={styles.empty}>
          Ayarlar yüklenemedi. Veritabanı kurulumu yapılmamış olabilir.
          <br />
          <small>{loadError}</small>
        </div>
      ) : (
        <form action={saveSettingsAction} className={styles.settingsForm}>
          <section className={styles.panel}>
            <h2 className={styles.panelTitle}>Teslimat &amp; Sepet</h2>
            <div className={styles.fieldGrid}>
              <div className={styles.field}>
                <label className={styles.label} htmlFor="delivery_fee">
                  Teslimat ücreti (TL)
                </label>
                <input
                  id="delivery_fee"
                  name="delivery_fee"
                  inputMode="decimal"
                  defaultValue={String(settings.delivery_fee)}
                  className={styles.input}
                />
              </div>
              <div className={styles.field}>
                <label className={styles.label} htmlFor="free_delivery_over">
                  Ücretsiz teslimat limiti (TL, 0 = hepsi ücretsiz)
                </label>
                <input
                  id="free_delivery_over"
                  name="free_delivery_over"
                  inputMode="decimal"
                  defaultValue={String(settings.free_delivery_over)}
                  className={styles.input}
                />
              </div>
              <div className={styles.field}>
                <label className={styles.label} htmlFor="min_order_total">
                  Minimum sepet tutarı (TL)
                </label>
                <input
                  id="min_order_total"
                  name="min_order_total"
                  inputMode="decimal"
                  defaultValue={String(settings.min_order_total)}
                  className={styles.input}
                />
              </div>
            </div>
          </section>

          <section className={styles.panel}>
            <h2 className={styles.panelTitle}>Ödeme Yöntemleri</h2>
            <div className={styles.checkList}>
              <label className={styles.checkLabel}>
                <input
                  type="checkbox"
                  name="cod_cash_enabled"
                  defaultChecked={settings.cod_cash_enabled}
                />
                Kapıda nakit
              </label>
              <label className={styles.checkLabel}>
                <input
                  type="checkbox"
                  name="cod_card_enabled"
                  defaultChecked={settings.cod_card_enabled}
                />
                Kapıda kart
              </label>
              <label className={styles.checkLabel}>
                <input
                  type="checkbox"
                  name="iyzico_enabled"
                  defaultChecked={settings.iyzico_enabled}
                />
                Online kart (iyzico) — API anahtarları da tanımlı olmalı
              </label>
            </div>
          </section>

          <section className={styles.panel}>
            <h2 className={styles.panelTitle}>Sipariş Alımı</h2>
            <div className={styles.checkList}>
              <label className={styles.checkLabel}>
                <input
                  type="checkbox"
                  name="ordering_open"
                  defaultChecked={settings.ordering_open}
                />
                Online sipariş alımı AÇIK
              </label>
            </div>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="closed_message">
                Kapalıyken gösterilecek mesaj
              </label>
              <textarea
                id="closed_message"
                name="closed_message"
                rows={3}
                defaultValue={settings.closed_message}
                className={styles.textarea}
              />
            </div>
          </section>

          <div>
            <button
              type="submit"
              className={`${styles.actionBtn} ${styles["actionBtn--primary"]}`}
            >
              Ayarları Kaydet
            </button>
          </div>
        </form>
      )}
    </>
  );
}
