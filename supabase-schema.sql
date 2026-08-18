-- Companies table
create table public.companies (
  id uuid references auth.users on delete cascade not null primary key,
  name text not null,
  slug text unique not null,
  logo_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Destinations table
create table public.destinations (
  id uuid default gen_random_uuid() primary key,
  company_id uuid references public.companies(id) on delete cascade not null,
  name text not null,
  type text not null check (type in ('Wildlife Park', 'Historical Site', 'Forest', 'Other')),
  description text,
  photos text[] default '{}',
  duration text not null,
  "order" integer not null default 0,
  status text not null default 'Upcoming' check (status in ('Upcoming', 'Completed')),
  completed_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.companies enable row level security;
alter table public.destinations enable row level security;

-- Policies for companies
create policy "Companies are viewable by everyone" on public.companies for select using (true);
create policy "Users can insert their own company" on public.companies for insert with check (auth.uid() = id);
create policy "Users can update own company" on public.companies for update using (auth.uid() = id);

-- Policies for destinations
create policy "Destinations are viewable by everyone" on public.destinations for select using (true);
create policy "Authenticated users can insert destinations for their company" on public.destinations for insert with check (exists (select 1 from public.companies where id = company_id and id = auth.uid()));
create policy "Authenticated users can update destinations for their company" on public.destinations for update using (exists (select 1 from public.companies where id = company_id and id = auth.uid()));
create policy "Authenticated users can delete destinations for their company" on public.destinations for delete using (exists (select 1 from public.companies where id = company_id and id = auth.uid()));

-- Function to update updated_at
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql security definer;

create trigger set_updated_at before update on public.destinations for each row execute procedure public.handle_updated_at();

-- Function to create company on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.companies (id, name, slug)
  values (new.id, new.raw_user_meta_data->>'name', new.raw_user_meta_data->>'slug');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created after insert on auth.users for each row execute procedure public.handle_new_user();
