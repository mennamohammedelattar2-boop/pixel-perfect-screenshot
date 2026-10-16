-- Roles
create type public.app_role as enum ('system_admin','head_hr','vice_head_hr','hr_member','committee_leader','member');
create type public.member_status as enum ('active','inactive','on_leave','alumni');

-- Profiles (one per sign-in account)
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  full_name_ar text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select, update on public.profiles to authenticated;
grant all on public.profiles to service_role;
alter table public.profiles enable row level security;

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.app_role not null,
  created_at timestamptz not null default now(),
  granted_by uuid,
  unique (user_id, role)
);
grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;

create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role = _role)
$$;

create or replace function public.is_head_hr(_user_id uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role in ('head_hr','vice_head_hr'))
$$;

-- Committees
create table public.committees (
  id uuid primary key default gen_random_uuid(),
  sort_order int not null unique,
  name_en text not null,
  name_ar text,
  name_pending boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select, update on public.committees to authenticated;
grant all on public.committees to service_role;
alter table public.committees enable row level security;

create table public.committee_leaders (
  committee_id uuid not null references public.committees(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (committee_id, user_id)
);
grant select, insert, delete on public.committee_leaders to authenticated;
grant all on public.committee_leaders to service_role;
alter table public.committee_leaders enable row level security;

create or replace function public.leads_committee(_user_id uuid, _committee_id uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.committee_leaders where user_id = _user_id and committee_id = _committee_id)
    and public.has_role(_user_id, 'committee_leader')
$$;

-- Members (organizational records; may or may not have a sign-in account)
create table public.members (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  full_name_ar text,
  email text,
  phone text,
  committee_id uuid references public.committees(id) on delete set null,
  assigned_hr_id uuid references public.profiles(id) on delete set null,
  account_id uuid references public.profiles(id) on delete set null,
  status public.member_status not null default 'active',
  joined_on date,
  is_demo boolean not null default false,
  created_by uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index on public.members (committee_id);
create index on public.members (assigned_hr_id);
grant select, insert, update, delete on public.members to authenticated;
grant all on public.members to service_role;
alter table public.members enable row level security;

create or replace function public.is_assigned_hr(_user_id uuid, _member_id uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.members m where m.id = _member_id and m.assigned_hr_id = _user_id)
    and public.has_role(_user_id, 'hr_member')
$$;

-- Follow-ups
create table public.follow_ups (
  id uuid primary key default gen_random_uuid(),
  member_id uuid not null references public.members(id) on delete cascade,
  author_id uuid not null references public.profiles(id),
  happened_on date not null default current_date,
  summary text not null,
  next_follow_up_on date,
  created_at timestamptz not null default now()
);
grant select, insert, update, delete on public.follow_ups to authenticated;
grant all on public.follow_ups to service_role;
alter table public.follow_ups enable row level security;

-- Confidential HR notes + explicit grants
create table public.confidential_notes (
  id uuid primary key default gen_random_uuid(),
  member_id uuid not null references public.members(id) on delete cascade,
  author_id uuid not null references public.profiles(id),
  body text not null,
  created_at timestamptz not null default now()
);
grant select, insert, delete on public.confidential_notes to authenticated;
grant all on public.confidential_notes to service_role;
alter table public.confidential_notes enable row level security;

create table public.confidential_note_access (
  member_id uuid not null references public.members(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  granted_by uuid,
  created_at timestamptz not null default now(),
  primary key (member_id, user_id)
);
grant select, insert, delete on public.confidential_note_access to authenticated;
grant all on public.confidential_note_access to service_role;
alter table public.confidential_note_access enable row level security;

create or replace function public.can_read_confidential(_user_id uuid, _member_id uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select public.is_head_hr(_user_id)
    or exists (select 1 from public.confidential_note_access a where a.member_id = _member_id and a.user_id = _user_id)
$$;

-- ===== Policies =====
-- profiles
create policy "own profile read" on public.profiles for select to authenticated using (id = auth.uid());
create policy "hr and admin read profiles" on public.profiles for select to authenticated
  using (public.is_head_hr(auth.uid()) or public.has_role(auth.uid(),'system_admin'));
create policy "own profile update" on public.profiles for update to authenticated using (id = auth.uid()) with check (id = auth.uid());

-- user_roles: read own; admin / head HR read all. No direct writes (only via assign_role / revoke_role).
create policy "read own roles" on public.user_roles for select to authenticated using (user_id = auth.uid());
create policy "admin and head hr read roles" on public.user_roles for select to authenticated
  using (public.has_role(auth.uid(),'system_admin') or public.is_head_hr(auth.uid()));

-- committees
create policy "signed-in read committees" on public.committees for select to authenticated using (true);
create policy "admin or head hr edit committees" on public.committees for update to authenticated
  using (public.has_role(auth.uid(),'system_admin') or public.is_head_hr(auth.uid()))
  with check (public.has_role(auth.uid(),'system_admin') or public.is_head_hr(auth.uid()));

-- committee_leaders
create policy "signed-in read leaders" on public.committee_leaders for select to authenticated using (true);
create policy "admin or head hr assign leaders" on public.committee_leaders for insert to authenticated
  with check (public.has_role(auth.uid(),'system_admin') or public.is_head_hr(auth.uid()));
create policy "admin or head hr remove leaders" on public.committee_leaders for delete to authenticated
  using (public.has_role(auth.uid(),'system_admin') or public.is_head_hr(auth.uid()));

-- members
create policy "head hr reads all members" on public.members for select to authenticated using (public.is_head_hr(auth.uid()));
create policy "hr member reads assigned" on public.members for select to authenticated
  using (assigned_hr_id = auth.uid() and public.has_role(auth.uid(),'hr_member'));
create policy "leader reads own committee" on public.members for select to authenticated
  using (committee_id is not null and public.leads_committee(auth.uid(), committee_id));
create policy "member reads own record" on public.members for select to authenticated using (account_id = auth.uid());
create policy "head hr inserts members" on public.members for insert to authenticated with check (public.is_head_hr(auth.uid()));
create policy "head hr updates members" on public.members for update to authenticated
  using (public.is_head_hr(auth.uid())) with check (public.is_head_hr(auth.uid()));
create policy "head hr deletes members" on public.members for delete to authenticated using (public.is_head_hr(auth.uid()));

-- follow_ups
create policy "head hr or assigned hr read follow-ups" on public.follow_ups for select to authenticated
  using (public.is_head_hr(auth.uid()) or public.is_assigned_hr(auth.uid(), member_id));
create policy "head hr or assigned hr add follow-ups" on public.follow_ups for insert to authenticated
  with check (author_id = auth.uid() and (public.is_head_hr(auth.uid()) or public.is_assigned_hr(auth.uid(), member_id)));
create policy "author edits own follow-up" on public.follow_ups for update to authenticated
  using (author_id = auth.uid()) with check (author_id = auth.uid());
create policy "head hr deletes follow-ups" on public.follow_ups for delete to authenticated using (public.is_head_hr(auth.uid()));

-- confidential notes
create policy "authorized read confidential" on public.confidential_notes for select to authenticated
  using (public.can_read_confidential(auth.uid(), member_id));
create policy "authorized write confidential" on public.confidential_notes for insert to authenticated
  with check (author_id = auth.uid() and public.can_read_confidential(auth.uid(), member_id));
create policy "head hr deletes confidential" on public.confidential_notes for delete to authenticated using (public.is_head_hr(auth.uid()));

create policy "head hr reads grants" on public.confidential_note_access for select to authenticated
  using (public.is_head_hr(auth.uid()) or user_id = auth.uid());
create policy "head hr grants" on public.confidential_note_access for insert to authenticated with check (public.is_head_hr(auth.uid()));
create policy "head hr revokes" on public.confidential_note_access for delete to authenticated using (public.is_head_hr(auth.uid()));

-- ===== Trusted role management =====
create or replace function public.assign_role(_target uuid, _role public.app_role)
returns void language plpgsql security definer set search_path = public as $$
declare caller uuid := auth.uid();
begin
  if caller is null then raise exception 'Not signed in'; end if;
  if public.has_role(caller,'system_admin') then
    null; -- admins may assign any role
  elsif public.is_head_hr(caller) and _role in ('hr_member','committee_leader','member') then
    null;
  else
    raise exception 'Not allowed to assign this role';
  end if;
  insert into public.user_roles(user_id, role, granted_by) values (_target, _role, caller)
  on conflict (user_id, role) do nothing;
end $$;

create or replace function public.revoke_role(_target uuid, _role public.app_role)
returns void language plpgsql security definer set search_path = public as $$
declare caller uuid := auth.uid();
begin
  if caller is null then raise exception 'Not signed in'; end if;
  if _role = 'system_admin' and _target = caller then raise exception 'You cannot remove your own admin role'; end if;
  if public.has_role(caller,'system_admin') then null;
  elsif public.is_head_hr(caller) and _role in ('hr_member','committee_leader','member') then null;
  else raise exception 'Not allowed to remove this role'; end if;
  delete from public.user_roles where user_id = _target and role = _role;
end $$;

-- One-time bootstrap: the first invited account can become System Administrator only while none exists.
create or replace function public.claim_initial_admin()
returns boolean language plpgsql security definer set search_path = public as $$
begin
  if auth.uid() is null then raise exception 'Not signed in'; end if;
  if exists (select 1 from public.user_roles where role = 'system_admin') then return false; end if;
  insert into public.user_roles(user_id, role, granted_by) values (auth.uid(), 'system_admin', auth.uid());
  return true;
end $$;

create or replace function public.admin_setup_needed()
returns boolean language sql stable security definer set search_path = public as $$
  select not exists (select 1 from public.user_roles where role = 'system_admin')
$$;

revoke execute on function public.assign_role, public.revoke_role, public.claim_initial_admin, public.admin_setup_needed from public, anon;
grant execute on function public.assign_role, public.revoke_role, public.claim_initial_admin, public.admin_setup_needed to authenticated;

-- Profile + default 'member' role on account creation
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles(id, email, full_name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email,'@',1)))
  on conflict (id) do nothing;
  insert into public.user_roles(user_id, role) values (new.id, 'member') on conflict do nothing;
  return new;
end $$;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();

-- updated_at
create or replace function public.touch_updated_at() returns trigger language plpgsql set search_path = public as $$
begin new.updated_at = now(); return new; end $$;
create trigger t_profiles before update on public.profiles for each row execute function public.touch_updated_at();
create trigger t_committees before update on public.committees for each row execute function public.touch_updated_at();
create trigger t_members before update on public.members for each row execute function public.touch_updated_at();

-- Seed the eight committees exactly once (official names pending)
insert into public.committees (sort_order, name_en, name_pending)
select g, 'Committee ' || g, true from generate_series(1,8) g
on conflict (sort_order) do nothing;