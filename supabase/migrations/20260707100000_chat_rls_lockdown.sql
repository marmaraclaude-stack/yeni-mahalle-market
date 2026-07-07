-- ============================================================
-- Chat RLS kilidi: MVP döneminin using(true) policy'leri kaldırılır.
-- RLS AÇIK kalır ve yeni policy EKLENMEZ; böylece anon/authenticated
-- roller chat_sessions/chat_messages'a hiç erişemez. Tüm erişim
-- service-role Server Action'lar üzerinden yapılır (service_role
-- RLS'i zaten bypass eder). Realtime aboneliği client'tan kaldırıldı,
-- taraflar polling ile güncellenir.
-- ============================================================

drop policy if exists "Anyone can create chat session" on public.chat_sessions;
drop policy if exists "Anyone can read sessions" on public.chat_sessions;
drop policy if exists "Anyone can update sessions" on public.chat_sessions;

drop policy if exists "Anyone can insert messages" on public.chat_messages;
drop policy if exists "Anyone can read messages" on public.chat_messages;
drop policy if exists "Anyone can update message read status" on public.chat_messages;
