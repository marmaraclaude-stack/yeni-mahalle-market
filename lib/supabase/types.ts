// Manual types for the chat schema (Aşama 5).
// İleride `supabase gen types typescript` ile otomatik üretilebilir.

export type ChatSessionStatus = "open" | "closed";
export type ChatSender = "visitor" | "admin";

export interface ChatSession {
  id: string;
  visitor_name: string | null;
  visitor_phone: string | null;
  created_at: string;
  last_message_at: string;
  status: ChatSessionStatus;
  unread_admin: boolean;
}

export interface ChatMessage {
  id: string;
  session_id: string;
  sender: ChatSender;
  content: string;
  created_at: string;
  read_by_recipient: boolean;
}
