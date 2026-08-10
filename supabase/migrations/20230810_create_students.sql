create table public.students (
  id            uuid    primary key default gen_random_uuid(),
  first_name    text    not null,
  last_name     text    not null,
  student_number text   not null,
  score         numeric not null,
  grade         text    not null
);

-- Enable Row Level Security
alter table public.students enable row level security;

-- Policies (allow all for simplicity)
create policy "Allow select" on public.students for select using (true);
create policy "Allow insert" on public.students for insert with check (true);
create policy "Allow update" on public.students for update using (true) with check (true);
create policy "Allow delete" on public.students for delete using (true);
