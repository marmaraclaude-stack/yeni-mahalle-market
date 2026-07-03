"use client";

// Kayıt formu — Supabase browser client ile e-posta + parola kaydı.
// options.data içindeki full_name / phone, DB trigger'ı ile
// customer_profiles satırına işlenir. Session dönmezse e-posta onayı
// beklendiği için bilgi mesajı gösterilir.

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MailCheck } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import styles from "../giris/auth.module.css";

/** Supabase hata mesajlarını Türkçeleştir. */
function trAuthError(message: string): string {
  if (message.includes("already registered")) {
    return "Bu e-posta ile zaten bir hesap var. Giriş yapmayı deneyin.";
  }
  if (message.toLowerCase().includes("password")) {
    return "Parola en az 6 karakter olmalı.";
  }
  if (message.toLowerCase().includes("email")) {
    return "Geçerli bir e-posta adresi girin.";
  }
  return "Kayıt tamamlanamadı. Lütfen tekrar deneyin.";
}

export default function KayitForm({ next }: { next: string }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [awaitingConfirm, setAwaitingConfirm] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setPending(true);

    const form = new FormData(e.currentTarget);
    const supabase = createClient();
    const { data, error: authError } = await supabase.auth.signUp({
      email: String(form.get("email") ?? "").trim(),
      password: String(form.get("password") ?? ""),
      options: {
        data: {
          full_name: String(form.get("full_name") ?? "").trim(),
          phone: String(form.get("phone") ?? "").trim(),
        },
      },
    });

    if (authError) {
      setError(trAuthError(authError.message));
      setPending(false);
      return;
    }

    if (data.session) {
      // E-posta onayı kapalı — direkt oturum açıldı.
      router.push(next);
      router.refresh();
      return;
    }

    // E-posta onayı açık — kullanıcıya bilgi ver.
    setAwaitingConfirm(true);
    setPending(false);
  }

  if (awaitingConfirm) {
    return (
      <div className={styles.confirmBox} role="status">
        <MailCheck aria-hidden="true" />
        <div>
          <strong>Neredeyse hazır — e-postanı onayla</strong>
          <p>
            Gelen kutuna bir onay bağlantısı gönderdik. Bağlantıya tıkladıktan
            sonra <Link href="/giris">giriş yapabilirsin</Link>.
          </p>
        </div>
      </div>
    );
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <label className={styles.field}>
        <span className={styles.fieldLabel}>Ad Soyad</span>
        <input
          className={styles.input}
          name="full_name"
          type="text"
          autoComplete="name"
          placeholder="Adınız Soyadınız"
          required
        />
      </label>

      <label className={styles.field}>
        <span className={styles.fieldLabel}>Telefon</span>
        <input
          className={styles.input}
          name="phone"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          placeholder="05XX XXX XX XX"
          required
        />
      </label>
      <p className={styles.hint}>
        Siparişlerinizde size ulaşmak için kullanılır.
      </p>

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
          autoComplete="new-password"
          placeholder="En az 6 karakter"
          minLength={6}
          required
        />
      </label>

      {error && (
        <p className={styles.error} role="alert">
          {error}
        </p>
      )}

      <button type="submit" className="btn btn--accent" disabled={pending}>
        {pending ? "Kayıt yapılıyor..." : "Kayıt ol"}
      </button>
    </form>
  );
}
