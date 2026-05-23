-- Jobs table
create table if not exists jobs (
  id uuid default gen_random_uuid() primary key,
  org_id uuid not null references organizations(id) on delete cascade,
  title text not null,
  department text,
  description text,
  status text default 'Open',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Candidates table
create table if not exists candidates (
  id uuid default gen_random_uuid() primary key,
  job_id uuid references jobs(id) on delete cascade,
  org_id uuid not null references organizations(id) on delete cascade,
  full_name text not null,
  email text,
  phone text,
  location text,
  years_experience integer default 0,
  seniority text default 'Mid',
  score integer default 0,
  status text default 'New',
  ai_summary text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Enable RLS
alter table jobs enable row level security;
alter table candidates enable row level security;

-- RLS policies for jobs
create policy "Users see own org jobs"
  on jobs for select
  using (org_id = (select org_id from profiles where id = auth.uid()));

create policy "Users create jobs for own org"
  on jobs for insert
  with check (org_id = (select org_id from profiles where id = auth.uid()));

create policy "Users update own org jobs"
  on jobs for update
  using (org_id = (select org_id from profiles where id = auth.uid()));

-- RLS policies for candidates
create policy "Users see own org candidates"
  on candidates for select
  using (org_id = (select org_id from profiles where id = auth.uid()));

create policy "Users create candidates for own org"
  on candidates for insert
  with check (org_id = (select org_id from profiles where id = auth.uid()));

create policy "Users update own org candidates"
  on candidates for update
  using (org_id = (select org_id from profiles where id = auth.uid()));

-- Indexes for performance
create index if not exists jobs_org_id_idx on jobs(org_id);
create index if not exists jobs_status_idx on jobs(status);
create index if not exists candidates_job_id_idx on candidates(job_id);
create index if not exists candidates_org_id_idx on candidates(org_id);
create index if not exists candidates_score_idx on candidates(score);
