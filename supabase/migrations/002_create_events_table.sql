-- ============================================================
-- Migration: 002_create_events_table.sql
-- Creates the events table, storage bucket, and RLS policies.
-- ============================================================

-- 1. Create the events table
create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  tag text not null default 'workshop',
  event_date timestamptz not null,
  time_string text,
  location text,
  registration_link text,
  cover_image_url text,
  cover_image_key text,
  document_url text,
  document_key text,
  status text not null default 'pending' check (status in ('pending', 'published', 'rejected')),
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 2. Enable Row Level Security
alter table public.events enable row level security;

-- 3. RLS Policies

-- Anyone can read published events
create policy "Public can view published events"
  on public.events for select
  using (status = 'published');

-- Authenticated members can insert events (status defaults to 'pending')
create policy "Authenticated users can insert events"
  on public.events for insert
  to authenticated
  with check (auth.uid() = created_by);

-- Authenticated users can view their own pending events
create policy "Users can view own events"
  on public.events for select
  to authenticated
  using (auth.uid() = created_by);

-- Admins can do everything
create policy "Admins can manage all events"
  on public.events for all
  to authenticated
  using (
    exists (
      select 1 from public.members
      where members.id = auth.uid() and members.role = 'admin'
    )
  );

-- 4. Auto-update the updated_at timestamp
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger on_events_updated
  before update on public.events
  for each row execute procedure public.handle_updated_at();

-- 5. Create storage bucket for event assets
insert into storage.buckets (id, name, public)
values ('event_assets', 'event_assets', true)
on conflict (id) do nothing;

-- Storage policies: authenticated users can upload
create policy "Authenticated users can upload event assets"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'event_assets');

-- Anyone can read public event assets
create policy "Public can read event assets"
  on storage.objects for select
  using (bucket_id = 'event_assets');

-- Admins can delete event assets
create policy "Admins can delete event assets"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'event_assets' and
    exists (
      select 1 from public.members
      where members.id = auth.uid() and members.role = 'admin'
    )
  );
