import { createAdminClient } from "@/lib/supabase/admin";
import type { ChatSession } from "@/lib/supabase/types";
import SessionList from "./SessionList";

export const dynamic = "force-dynamic";
export const metadata = { title: "Sohbetler" };

export default async function AdminHome() {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("chat_sessions")
    .select("*")
    .order("last_message_at", { ascending: false })
    .limit(200);

  if (error) {
    return (
      <div>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: 32 }}>Hata</h1>
        <p style={{ color: "#a02020" }}>{error.message}</p>
      </div>
    );
  }

  return <SessionList initial={(data ?? []) as ChatSession[]} />;
}
