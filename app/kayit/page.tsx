// Kayıt sayfası — /kayit?next=/hedef
// Zaten oturum açıksa hedefe yönlendirir; değilse KayitForm (client) gösterir.

import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import KayitForm from "./KayitForm";
import styles from "../giris/auth.module.css";

export const metadata: Metadata = {
  title: "Kayıt Ol",
  robots: { index: false, follow: false },
};

/** Açık yönlendirme (open redirect) engeli: sadece site içi yollar. */
function safeNext(raw: string | undefined): string {
  if (raw && raw.startsWith("/") && !raw.startsWith("//")) return raw;
  return "/hesap";
}

export default async function KayitPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const sp = await searchParams;
  const next = safeNext(typeof sp.next === "string" ? sp.next : undefined);

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) {
    redirect(next);
  }

  return (
    <main className={styles.page}>
      <header className={styles.topbar}>
        <Link href="/" className={styles.brand}>
          Yeni Mahalle Market
        </Link>
        <nav className={styles.topLinks} aria-label="Sayfa bağlantıları">
          <Link href="/urunler">Ürünler</Link>
          <Link href="/giris">Giriş Yap</Link>
        </nav>
      </header>

      <div className={styles.shell}>
        <div className={styles.card}>
          <span className={styles.eyebrow}>Yeni Mahalle Market</span>
          <h1 className={styles.title}>Kayıt ol</h1>
          <p className={styles.sub}>
            Sipariş verebilmek için hesap gerekli. Hesap oluştur; adres ve
            telefon bilgilerinle siparişini saniyeler içinde ver.
          </p>

          <KayitForm next={next} />

          <p className={styles.switchLine}>
            Zaten hesabın var mı?{" "}
            <Link href={`/giris?next=${encodeURIComponent(next)}`}>
              Giriş yap
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
