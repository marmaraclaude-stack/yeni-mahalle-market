// Eski per-order kurye linki artık kullanılmıyor — kurye paneline yönlendirir.
// Kurye /kurye adresinden telefon + kod ile giriş yapıp TÜM siparişlerini görür.

import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function LegacyCourierRedirect() {
  redirect("/kurye");
}
