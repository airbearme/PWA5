create table if not exists client_error_reports(
 id bigserial primary key,
 created_at timestamptz default now(),
 hash text unique,
 message text,
 stack text
);
alter table client_error_reports enable row level security;
