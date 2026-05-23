-- Organizations table
create table if not exists organizations (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  plan text default 'basic',
  created_at timestamptz default now()
);

-- Profiles table linked to auth.users
create table if not exists profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  org_id uuid references organizations(id) on delete cascade,
  full_name text,
  role text default 'admin',
  created_at timestamptz default now()
);

-- Auto-create profile on signup
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- RLS
alter table organizations enable row level security;
alter table profiles enable row level security;

create policy "Users can view own profile"
  on profiles for select using (auth.uid() = id);

create policy "Users can update own profile"
  on profiles for update using (auth.uid() = id);

create policy "Users can view own org"
  on organizations for select using (
    id = (select org_id from profiles where id = auth.uid())
  );
