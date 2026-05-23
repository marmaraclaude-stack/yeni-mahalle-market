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
          gap: 7,
        }}
      >
        <span
          style={{
            fontSize: 10.5,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "var(--gray-500)",
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
            padding: "13px 14px",
            border: "1px solid rgba(10, 10, 10, 0.12)",
            background: "var(--cream)",
            borderRadius: 10,
            fontSize: 15,
            color: "var(--black)",
            transition: "border-color 0.15s ease, box-shadow 0.15s ease",
          }}
        />
      </label>

      {state.error && <p className={styles.loginError}>{state.error}</p>}

      <button
        type="submit"
        disabled={pending}
        style={{
          marginTop: 8,
          padding: "14px 18px",
          background: pending ? "var(--gray-300)" : "var(--black)",
          color: "var(--white)",
          border: "none",
          borderRadius: 999,
          fontWeight: 600,
          fontSize: 14,
          cursor: pending ? "wait" : "pointer",
          transition: "background 0.15s ease",
        }}
      >
        {pending ? "Giriş yapılıyor..." : "Giriş yap"}
      </button>
    </form>
  );
}
