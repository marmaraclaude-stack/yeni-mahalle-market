"use client";

import { useActionState } from "react";
import { loginAction, type LoginState } from "../actions";
import styles from "../admin.module.css";

const initial: LoginState = {};

export default function LoginForm() {
  const [state, formAction, pending] = useActionState(loginAction, initial);

  return (
    <form action={formAction} className={styles.loginForm}>
      <label
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 6,
        }}
      >
        <span
          style={{
            fontSize: 10.5,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: "var(--muted)",
            fontWeight: 600,
          }}
        >
          Parola
        </span>
        <input
          name="password"
          type="password"
          required
          autoFocus
          autoComplete="current-password"
          style={{
            font: "inherit",
            padding: "11px 12px",
            border: "1px solid var(--ink)",
            background: "var(--bone-2)",
            borderRadius: 2,
            fontSize: 15,
          }}
        />
      </label>

      {state.error && <p className={styles.loginError}>{state.error}</p>}

      <button
        type="submit"
        disabled={pending}
        style={{
          marginTop: 6,
          padding: "13px 16px",
          background: pending ? "var(--bone-3)" : "var(--ink)",
          color: "var(--bone)",
          border: "1px solid var(--ink)",
          borderRadius: 2,
          fontWeight: 600,
          fontSize: 14,
          letterSpacing: "0.04em",
          cursor: pending ? "wait" : "pointer",
        }}
      >
        {pending ? "Giriş yapılıyor..." : "Giriş yap"}
      </button>
    </form>
  );
}
