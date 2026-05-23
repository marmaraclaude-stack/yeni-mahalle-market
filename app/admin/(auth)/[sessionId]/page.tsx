import { notFound } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import type { ChatMessage, ChatSession } from "@/lib/supabase/types";
import SessionDetail from "./SessionDetail";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ sessionId: string }>;
}

export const metadata = {
  title: "Sohbet",
  robots: { index: false, follow: false },
};

export default async function SessionPage({ params }: PageProps) {
  const { sessionId } = await params;

  const supabase = createAdminClient();

  const [{ data: session, error: sErr }, { data: messages, error: mErr }] =
    await Promise.all([
      supabase.from("chat_sessions").select("*").eq("id", sessionId).single(),
      supabase
        .from("chat_messages")
        .select("*")
        .eq("session_id", sessionId)
        .order("created_at", { ascending: true })
        .limit(500),
    ]);

  if (sErr || !session) {
    notFound();
  }
  if (mErr) {
    console.error("[admin] load messages failed", mErr);
  }

  return (
    <SessionDetail
      session={session as ChatSession}
      initialMessages={(messages ?? []) as ChatMessage[]}
    />
  );
}
