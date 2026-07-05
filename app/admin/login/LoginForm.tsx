"use client";

import { useActionState, useState } from "react";
import { AlertCircle, Eye, EyeOff } from "lucide-react";
import { loginAction, type LoginState } from "../actions";
import styles from "./login.module.css";

const initial: LoginState = {};

export default function LoginForm() {
  const [state, formAction, pending] = useActionState(loginAction, initial);
  const [visible, setVisible] = useState(false);

  return (
    <form action={formAction} className={styles.form}>
      <div className={styles.field}>
        <label htmlFor="admin-password" className={styles.label}>
          Parola
        </label>
        <div className={styles.inputWrap}>
          <input
            id="admin-password"
            name="password"
            type={visible ? "text" : "password"}
            required
            autoFocus
            autoComplete="current-password"
            className={styles.input}
          />
          <button
            type="button"
            className={styles.toggle}
            onClick={() => setVisible((v) => !v)}
            aria-label={visible ? "Parolayı gizle" : "Parolayı göster"}
          >
            {visible ? (
              <EyeOff size={19} strokeWidth={1.8} />
            ) : (
              <Eye size={19} strokeWidth={1.8} />
            )}
          </button>
        </div>
      </div>

      {state.error && (
        <p className={styles.error} role="alert">
          <AlertCircle size={16} strokeWidth={2} className={styles.errorIcon} />
          <span>{state.error}</span>
        </p>
      )}

      <button type="submit" disabled={pending} className={styles.submit}>
        {pending ? "Giriş yapılıyor..." : "Giriş yap"}
      </button>
    </form>
  );
}
