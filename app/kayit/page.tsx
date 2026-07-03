// Kayıt sayfası: /kayit?next=/hedef
// Zaten oturum açıksa hedefe yönlendirir; değilse tam genişlik split düzende
// (sol marka paneli + sağ form alanı) KayitForm (client) gösterir. SiteNav üstte.
// E-posta onayı Supabase'de kapalı (autoconfirm): kayıt anında oturum açar,
// varsayılan hedef /urunler.

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
  return "/urunler";
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
        <h1 className={styles.title}>Hesap oluştur</h1>
        <p className={styles.sub}>
          Bir dakikadan kısa sürer, hemen sipariş vermeye başla.
        </p>

        <KayitForm next={next} />

        <p className={styles.switchLine}>
          <span>
            Zaten hesabın var mı?{" "}
            <Link href={`/giris?next=${encodeURIComponent(next)}`}>
              Giriş yap
            </Link>
          </span>
        </p>
      </AuthShell>
    </>
  );
}
