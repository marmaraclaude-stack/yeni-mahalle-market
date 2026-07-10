"use client";

// Giriş formu: Supabase browser client ile e-posta + parola girişi.
// Alan bazlı doğrulama, sol ikonlu input'lar, parola göster/gizle,
// loading durumu. Başarıda ?next= hedefine (varsayılan /hesap) yönlendirir.

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import styles from "./auth.module.css";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface FieldErrors {
  email?: string;
  password?: string;
}

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
  const [formError, setFormError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [pending, setPending] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const form = new FormData(e.currentTarget);
    const email = String(form.get("email") ?? "").trim();
    const password = String(form.get("password") ?? "");

    // Alan bazlı ön doğrulama
    const errors: FieldErrors = {};
    if (!EMAIL_RE.test(email)) {
      errors.email = "Geçerli bir e-posta adresi girin.";
    }
    if (password.length === 0) {
      errors.password = "Parolanızı girin.";
    }
    setFieldErrors(errors);
    setFormError(null);
    if (Object.keys(errors).length > 0) return;

    setPending(true);
    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setFormError(trAuthError(authError.message));
      setPending(false);
      return;
    }

    // Server component'ler yeni oturumu görsün.
    router.push(next);
    router.refresh();
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <div className={styles.field}>
        <label className={styles.fieldLabel} htmlFor="giris-email">
          E-posta
        </label>
        <div className={styles.inputWrap}>
          <span className={styles.inputIcon}>
            <Mail aria-hidden="true" />
          </span>
          <input
            id="giris-email"
            className={`${styles.input} ${fieldErrors.email ? styles.inputInvalid : ""}`}
            name="email"
            type="email"
            autoComplete="email"
            placeholder="ornek@eposta.com"
            aria-invalid={fieldErrors.email ? true : undefined}
            required
          />
        </div>
        {fieldErrors.email && (
          <p className={styles.fieldError} role="alert">
            {fieldErrors.email}
          </p>
        )}
      </div>

      <div className={styles.field}>
        <label className={styles.fieldLabel} htmlFor="giris-password">
          Parola
        </label>
        <div className={`${styles.inputWrap} ${styles.pwWrap}`}>
          <span className={styles.inputIcon}>
            <Lock aria-hidden="true" />
          </span>
          <input
            id="giris-password"
            className={`${styles.input} ${fieldErrors.password ? styles.inputInvalid : ""}`}
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            placeholder="••••••••"
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
        className={`btn btn--accent btn--lg ${styles.submit}`}
        disabled={pending}
      >
        {pending ? (
          <>
            <span className={styles.spinner} aria-hidden="true" />
            Giriş yapılıyor...
          </>
        ) : (
          "Giriş yap"
        )}
      </button>
    </form>
  );
}
