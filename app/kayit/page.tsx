// Kayıt sayfası: /kayit?next=/hedef
// Zaten oturum açıksa hedefe yönlendirir; değilse iki panelli auth kartında
// KayitForm (client) gösterir. SiteNav üstte.

import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import SiteNav from "@/components/SiteNav";
import AuthShell from "../giris/AuthShell";
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
    <>
      <SiteNav />
      <AuthShell>
        <span className={styles.eyebrow}>Aramıza katıl</span>
        <h1 className={styles.title}>Kayıt ol</h1>
        <p className={styles.sub}>
          Sipariş verebilmek için hesap gerekli. Hesabını oluştur, siparişini
          saniyeler içinde ver.
        </p>

        <KayitForm next={next} />

        <p className={styles.switchLine}>
          Zaten hesabın var mı?{" "}
          <Link href={`/giris?next=${encodeURIComponent(next)}`}>
            Giriş yap
          </Link>
        </p>
      </AuthShell>
    </>
  );
}
