-- ============================================================
-- Yeni Mahalle Market — canlı destek (chat) şeması
-- Aşama 5 / MVP
-- ============================================================

-- Sohbet oturumları: her ziyaretçi için bir session
create table public.chat_sessions (
  id uuid primary key default gen_random_uuid(),
  visitor_name text,
  visitor_phone text,
  created_at timestamptz not null default now(),
  last_message_at timestamptz not null default now(),
  status text not null default 'open' check (status in ('open', 'closed')),
  unread_admin boolean not null default true
);

-- Mesajlar
create table public.chat_messages (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.chat_sessions(id) on delete cascade,
  sender text not null check (sender in ('visitor', 'admin')),
  content text not null,
  created_at timestamptz not null default now(),
  read_by_recipient boolean not null default false
);

-- İndeksler
create index idx_messages_session on public.chat_messages(session_id, created_at);
create index idx_sessions_status on public.chat_sessions(status, last_message_at desc);

-- Yeni mesaj geldiğinde session.last_message_at + unread_admin'i otomatik güncelle
create or replace function public.touch_session_on_message()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.chat_sessions
     set last_message_at = new.created_at,
         unread_admin   = case when new.sender = 'visitor' then true else unread_admin end
   where id = new.session_id;
  return new;
end;
$$;

create trigger trg_chat_messages_touch_session
after insert on public.chat_messages
for each row execute function public.touch_session_on_message();

-- Realtime publication'a tabloları ekle
alter publication supabase_realtime add table public.chat_messages;
alter publication supabase_realtime add table public.chat_sessions;

-- ============================================================
-- RLS — MVP: anon herkes kendi sohbetini kullanabilsin diye
--           geniş policy'ler. Sonraki sürümde kısıtlanacak
--           (örn. session_id cookie eşleşmesi, admin auth, vs.)
-- ============================================================
alter table public.chat_sessions enable row level security;
alter table public.chat_messages enable row level security;

create policy "Anyone can create chat session"
  on public.chat_sessions for insert
  with check (true);

create policy "Anyone can read sessions"
  on public.chat_sessions for select
  using (true);

create policy "Anyone can update sessions"
  on public.chat_sessions for update
  using (true) with check (true);

create policy "Anyone can insert messages"
  on public.chat_messages for insert
  with check (true);

create policy "Anyone can read messages"
  on public.chat_messages for select
  using (true);

create policy "Anyone can update message read status"
  on public.chat_messages for update
  using (true) with check (true);
