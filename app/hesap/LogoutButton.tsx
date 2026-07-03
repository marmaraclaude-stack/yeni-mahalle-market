"use client";

// Çıkış butonu — browser client ile signOut, ardından ana sayfaya dön.

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import styles from "./hesap.module.css";

export default function LogoutButton() {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function handleLogout() {
    setPending(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <button
      type="button"
      className={styles.logoutBtn}
      onClick={handleLogout}
      disabled={pending}
      aria-label="Hesaptan çıkış yap"
    >
      <LogOut aria-hidden="true" />
      {pending ? "Çıkış yapılıyor..." : "Çıkış yap"}
    </button>
  );
}
