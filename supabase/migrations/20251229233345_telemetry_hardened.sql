create table if not exists public.client_error_reports (
  id bigserial primary key,
  created_at timestamptz not null default now(),
  hash text not null,
  url text not null default '',
  message text not null default '',
  stack text not null default '',
  user_agent text not null default '',
  severity text not null default 'error',
  app_version text not null default '',
  git_sha text not null default '',
  meta jsonb
);
create unique index if not exists client_error_reports_hash_uq on public.client_error_reports(hash);
create index if not exists client_error_reports_created_at_idx on public.client_error_reports(created_at desc);

create table if not exists public.user_suggestions (
  id bigserial primary key,
  created_at timestamptz not null default now(),
  hash text not null,
  page text not null default '',
  text text not null
);
create unique index if not exists user_suggestions_hash_uq on public.user_suggestions(hash);
create index if not exists user_suggestions_created_at_idx on public.user_suggestions(created_at desc);

alter table public.client_error_reports enable row level security;
alter table public.user_suggestions enable row level security;

-- No client policies: service_role writes only (server-side).
