"use client";

// Giriş formu — Supabase browser client ile e-posta + parola girişi.
// Başarıda ?next= hedefine (varsayılan /hesap) yönlendirir.

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import styles from "./auth.module.css";

/** Supabase hata mesajlarını Türkçeleştir. */
function trAuthError(message: string): string {
  if (message.includes("Invalid login credentials")) {
    return "E-posta veya parola hatalı.";
  }
  if (message.includes("Email not confirmed")) {
    return "E-posta adresiniz henüz onaylanmamış. Gelen kutunuzu kontrol edin.";
  }
  return "Giriş yapılamadı. Lütfen tekrar deneyin.";
}

export default function GirisForm({ next }: { next: string }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setPending(true);

    const form = new FormData(e.currentTarget);
    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithPassword({
      email: String(form.get("email") ?? "").trim(),
      password: String(form.get("password") ?? ""),
    });

    if (authError) {
      setError(trAuthError(authError.message));
      setPending(false);
      return;
    }

    // Server component'ler yeni oturumu görsün.
    router.push(next);
    router.refresh();
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <label className={styles.field}>
        <span className={styles.fieldLabel}>E-posta</span>
        <input
          className={styles.input}
          name="email"
          type="email"
          autoComplete="email"
          placeholder="ornek@eposta.com"
          required
        />
      </label>

      <label className={styles.field}>
        <span className={styles.fieldLabel}>Parola</span>
        <input
          className={styles.input}
          name="password"
          type="password"
          autoComplete="current-password"
          placeholder="••••••••"
          required
        />
      </label>

      {error && (
        <p className={styles.error} role="alert">
          {error}
        </p>
      )}

      <button type="submit" className="btn btn--accent" disabled={pending}>
        {pending ? "Giriş yapılıyor..." : "Giriş yap"}
      </button>
    </form>
  );
}
