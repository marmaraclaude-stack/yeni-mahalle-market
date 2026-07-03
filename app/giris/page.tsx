// Giriş sayfası: /giris?next=/hedef
// Zaten oturum açıksa hedefe yönlendirir; değilse iki panelli auth kartında
// GirisForm (client) gösterir. SiteNav üstte.

import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import SiteNav from "@/components/SiteNav";
import AuthShell from "./AuthShell";
import GirisForm from "./GirisForm";
import styles from "./auth.module.css";

export const metadata: Metadata = {
  title: "Giriş Yap",
  robots: { index: false, follow: false },
};

/** Açık yönlendirme (open redirect) engeli: sadece site içi yollar. */
function safeNext(raw: string | undefined): string {
  if (raw && raw.startsWith("/") && !raw.startsWith("//")) return raw;
  return "/hesap";
}

export default async function GirisPage({
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
    <>
      <SiteNav />
      <AuthShell>
        <span className={styles.eyebrow}>Tekrar hoş geldin</span>
        <h1 className={styles.title}>Giriş yap</h1>
        <p className={styles.sub}>
          Siparişlerini görüntülemek ve daha hızlı sipariş vermek için hesabına
          giriş yap.
        </p>

        <GirisForm next={next} />

        <p className={styles.switchLine}>
          Hesabın yok mu?{" "}
          <Link href={`/kayit?next=${encodeURIComponent(next)}`}>
            Hemen kayıt ol
          </Link>
        </p>
      </AuthShell>
    </>
  );
}
