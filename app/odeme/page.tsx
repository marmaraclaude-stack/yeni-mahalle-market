// Ödeme (checkout) sayfası — server component:
// mağaza ayarları + kullanılabilir ödeme yöntemleri + (girişliyse) profil/adres
// ön-dolgusu okunur, client CheckoutForm'a geçirilir.

import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { isIyzicoConfigured } from "@/lib/shop/iyzico";
import { getShopSettings } from "@/lib/shop/settings";
import type { PaymentMethod } from "@/lib/shop/types";
import CheckoutForm, { type CheckoutDefaults } from "./CheckoutForm";

export const metadata: Metadata = {
  title: "Siparişi Tamamla",
  description: "Teslimat bilgilerinizi girin ve siparişinizi tamamlayın.",
};

export default async function OdemePage() {
  const settings = await getShopSettings();

  // Girişli kullanıcı: profil + ilk adres ile formu ön-doldur.
  const defaults: CheckoutDefaults = {
    name: "",
    phone: "",
    address: "",
    addressNote: "",
    loggedIn: false,
  };

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      defaults.loggedIn = true;
      const [{ data: profile }, { data: address }] = await Promise.all([
        supabase
          .from("customer_profiles")
          .select("full_name, phone")
          .eq("id", user.id)
          .maybeSingle(),
        supabase
          .from("customer_addresses")
          .select("line, district, note")
          .eq("user_id", user.id)
          .order("created_at", { ascending: true })
          .limit(1)
          .maybeSingle(),
      ]);

      const p = profile as { full_name: string; phone: string } | null;
      const a = address as { line: string; district: string; note: string } | null;

      defaults.name = p?.full_name ?? "";
      defaults.phone = p?.phone ?? "";
      if (a) {
        defaults.address = [a.line, a.district].filter(Boolean).join(", ");
        defaults.addressNote = a.note ?? "";
      }
    }
  } catch {
    // Auth/DB okunamazsa misafir formu boş açılır — sayfa patlamaz.
  }

  const methods: PaymentMethod[] = [];
  if (settings.cod_cash_enabled) methods.push("cod_cash");
  if (settings.cod_card_enabled) methods.push("cod_card");
  if (settings.iyzico_enabled && isIyzicoConfigured()) methods.push("iyzico");

  return (
    <CheckoutForm
      defaults={defaults}
      methods={methods}
      deliveryFee={settings.delivery_fee}
      freeDeliveryOver={settings.free_delivery_over}
      minOrderTotal={settings.min_order_total}
      orderingOpen={settings.ordering_open}
      closedMessage={settings.closed_message}
    />
  );
}
