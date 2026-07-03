"use client";

// Kayıt formu: Supabase browser client ile e-posta + parola kaydı.
// Alan bazlı doğrulama, parola göster/gizle, loading durumu, güven notu.
// options.data içindeki full_name / phone, DB trigger'ı ile
// customer_profiles satırına işlenir. Session dönmezse e-posta onayı
// beklendiği için bilgi mesajı gösterilir.

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, MailCheck, ShieldCheck } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import styles from "../giris/auth.module.css";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface FieldErrors {
  full_name?: string;
  phone?: string;
  email?: string;
  password?: string;
}

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
  const [formError, setFormError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [pending, setPending] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [awaitingConfirm, setAwaitingConfirm] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const form = new FormData(e.currentTarget);
    const fullName = String(form.get("full_name") ?? "").trim();
    const phone = String(form.get("phone") ?? "").trim();
    const email = String(form.get("email") ?? "").trim();
    const password = String(form.get("password") ?? "");

    // Alan bazlı ön doğrulama
    const errors: FieldErrors = {};
    if (fullName.length < 3) {
      errors.full_name = "Adınızı ve soyadınızı girin.";
    }
    if (phone.replace(/\D/g, "").length < 10) {
      errors.phone = "Geçerli bir telefon numarası girin (örn. 05XX XXX XX XX).";
    }
    if (!EMAIL_RE.test(email)) {
      errors.email = "Geçerli bir e-posta adresi girin.";
    }
    if (password.length < 6) {
      errors.password = "Parola en az 6 karakter olmalı.";
    }
    setFieldErrors(errors);
    setFormError(null);
    if (Object.keys(errors).length > 0) return;

    setPending(true);
    const supabase = createClient();
    const { data, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          phone,
        },
      },
    });

    if (authError) {
      setFormError(trAuthError(authError.message));
      setPending(false);
      return;
    }

    if (data.session) {
      // E-posta onayı kapalı: direkt oturum açıldı.
      router.push(next);
      router.refresh();
      return;
    }

    // E-posta onayı açık: kullanıcıya bilgi ver.
    setAwaitingConfirm(true);
    setPending(false);
  }

  if (awaitingConfirm) {
    return (
      <div className={styles.confirmBox} role="status">
        <MailCheck aria-hidden="true" />
        <div>
          <strong>Neredeyse hazır, e-postanı onayla</strong>
          <p>
            Gelen kutuna bir onay bağlantısı gönderdik. Bağlantıya tıkladıktan
            sonra <Link href="/giris">giriş yapabilirsin</Link>.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        <div className={styles.field}>
          <label className={styles.fieldLabel} htmlFor="kayit-name">
            Ad Soyad
          </label>
          <input
            id="kayit-name"
            className={`${styles.input} ${fieldErrors.full_name ? styles.inputInvalid : ""}`}
            name="full_name"
            type="text"
            autoComplete="name"
            placeholder="Adınız Soyadınız"
            aria-invalid={fieldErrors.full_name ? true : undefined}
            required
          />
          {fieldErrors.full_name && (
            <p className={styles.fieldError} role="alert">
              {fieldErrors.full_name}
            </p>
          )}
        </div>

        <div className={styles.field}>
          <label className={styles.fieldLabel} htmlFor="kayit-phone">
            Telefon
          </label>
          <input
            id="kayit-phone"
            className={`${styles.input} ${fieldErrors.phone ? styles.inputInvalid : ""}`}
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="05XX XXX XX XX"
            aria-invalid={fieldErrors.phone ? true : undefined}
            required
          />
          {fieldErrors.phone ? (
            <p className={styles.fieldError} role="alert">
              {fieldErrors.phone}
            </p>
          ) : (
            <p className={styles.hint}>
              Siparişlerinizde size ulaşmak için kullanılır.
            </p>
          )}
        </div>

        <div className={styles.field}>
          <label className={styles.fieldLabel} htmlFor="kayit-email">
            E-posta
          </label>
          <input
            id="kayit-email"
            className={`${styles.input} ${fieldErrors.email ? styles.inputInvalid : ""}`}
            name="email"
            type="email"
            autoComplete="email"
            placeholder="ornek@eposta.com"
            aria-invalid={fieldErrors.email ? true : undefined}
            required
          />
          {fieldErrors.email && (
            <p className={styles.fieldError} role="alert">
              {fieldErrors.email}
            </p>
          )}
        </div>

        <div className={styles.field}>
          <label className={styles.fieldLabel} htmlFor="kayit-password">
            Parola
          </label>
          <div className={styles.inputWrap}>
            <input
              id="kayit-password"
              className={`${styles.input} ${fieldErrors.password ? styles.inputInvalid : ""}`}
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              placeholder="En az 6 karakter"
              minLength={6}
              aria-invalid={fieldErrors.password ? true : undefined}
              required
            />
            <button
              type="button"
              className={styles.pwToggle}
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? "Parolayı gizle" : "Parolayı göster"}
            >
              {showPassword ? (
                <EyeOff aria-hidden="true" />
              ) : (
                <Eye aria-hidden="true" />
              )}
            </button>
          </div>
          {fieldErrors.password && (
            <p className={styles.fieldError} role="alert">
              {fieldErrors.password}
            </p>
          )}
        </div>

        {formError && (
          <p className={styles.error} role="alert">
            {formError}
          </p>
        )}

        <button
          type="submit"
          className={`btn btn--accent ${styles.submit}`}
          disabled={pending}
        >
          {pending ? (
            <>
              <span className={styles.spinner} aria-hidden="true" />
              Kayıt yapılıyor...
            </>
          ) : (
            "Kayıt ol"
          )}
        </button>
      </form>

      <p className={styles.trustNote}>
        <ShieldCheck aria-hidden="true" />
        Bilgilerin yalnızca siparişlerin için kullanılır.
      </p>
    </>
  );
}
