-- Blag GYM — core schema (Batch 2: booking + auth)
-- Run in the Supabase SQL editor for your project.

create table if not exists public.trainers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  specialty text not null,
  bio text,
  photo_url text,
  created_at timestamptz not null default now()
);

create table if not exists public.classes (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null, -- strength | hiit | boxing | recovery
  description text,
  trainer_id uuid references public.trainers(id) on delete set null,
  day_of_week smallint not null, -- 0=Sunday ... 6=Saturday
  start_time time not null,
  duration_minutes integer not null default 45,
  capacity integer not null default 20,
  created_at timestamptz not null default now()
);

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  phone text,
  membership_plan text not null default 'none', -- none | pay_as_you_go | monthly | annual
  membership_expires_at timestamptz,
  is_admin boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  class_id uuid not null references public.classes(id) on delete cascade,
  booking_date date not null,
  status text not null default 'confirmed', -- confirmed | cancelled | attended | no_show
  created_at timestamptz not null default now(),
  unique (user_id, class_id, booking_date)
);

alter table public.profiles enable row level security;
alter table public.bookings enable row level security;
alter table public.classes enable row level security;
alter table public.trainers enable row level security;

create policy "Classes are publicly readable" on public.classes for select using (true);
create policy "Trainers are publicly readable" on public.trainers for select using (true);

create policy "Users manage own profile" on public.profiles
  for all using (auth.uid() = id) with check (auth.uid() = id);

create policy "Users manage own bookings" on public.bookings
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Auto-create a profile row whenever a new auth user signs up.
create or replace function public.handle_new_user()
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
  for each row execute procedure public.handle_new_user();

-- ── Blags Kitchen — menu + ordering (Batch 4) ─────────────────────────

create table if not exists public.menu_items (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  category text not null, -- bowls | grills | smoothies | snacks | drinks
  price_naira integer not null,
  tag text, -- e.g. "High protein", "Vegan", "Post-workout"
  is_available boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.kitchen_orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  order_type text not null default 'pickup', -- pickup | dine_in
  table_number text,
  notes text,
  status text not null default 'received', -- received | preparing | ready | completed | cancelled
  total_naira integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.kitchen_order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.kitchen_orders(id) on delete cascade,
  menu_item_id uuid references public.menu_items(id) on delete set null,
  item_name text not null,
  unit_price_naira integer not null,
  quantity integer not null default 1
);

alter table public.menu_items enable row level security;
alter table public.kitchen_orders enable row level security;
alter table public.kitchen_order_items enable row level security;

create policy "Menu is publicly readable" on public.menu_items for select using (true);

create policy "Users manage own kitchen orders" on public.kitchen_orders
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Users manage own order items" on public.kitchen_order_items
  for all using (
    exists (select 1 from public.kitchen_orders o where o.id = order_id and o.user_id = auth.uid())
  )
  with check (
    exists (select 1 from public.kitchen_orders o where o.id = order_id and o.user_id = auth.uid())
  );

-- Admins (profiles.is_admin = true) can view and update every order,
-- e.g. to move it from "received" through to "completed".
create policy "Admins manage all kitchen orders" on public.kitchen_orders
  for all using (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_admin)
  )
  with check (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_admin)
  );

create policy "Admins manage all order items" on public.kitchen_order_items
  for all using (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_admin)
  )
  with check (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_admin)
  );

alter table public.kitchen_orders
  add column if not exists payment_status text not null default 'unpaid'; -- unpaid | paid

-- ── Payments (Batch 5) ─────────────────────────────────────────────────
-- One row per verified Paystack transaction, for either a membership
-- renewal or a Blags Kitchen order.

create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  reference text not null unique,
  purpose text not null, -- membership | kitchen_order
  amount_naira integer not null,
  status text not null default 'success', -- success | pending | failed
  created_at timestamptz not null default now()
);

alter table public.payments enable row level security;

create policy "Users view own payments" on public.payments
  for select using (auth.uid() = user_id);

create policy "Users insert own payments" on public.payments
  for insert with check (auth.uid() = user_id);

create policy "Admins manage all payments" on public.payments
  for all using (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_admin)
  )
  with check (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_admin)
  );

-- ── Batch 6 — Production data architecture ──────────────────────────────
-- Admin read access on tables that only had owner-scoped policies before,
-- so the admin dashboard can query through the normal authenticated
-- client (RLS-enforced) instead of the service-role key wherever possible.

create policy "Admins view all profiles" on public.profiles
  for select using (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_admin)
  );

create policy "Admins view all bookings" on public.bookings
  for select using (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_admin)
  );

create policy "Admins manage classes" on public.classes
  for insert with check (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_admin)
  );
create policy "Admins update classes" on public.classes
  for update using (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_admin)
  );
create policy "Admins delete classes" on public.classes
  for delete using (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_admin)
  );

-- role, alongside is_admin, so RBAC (Batch 20) doesn't require a
-- destructive column rename later.
alter table public.profiles
  add column if not exists role text not null default 'member';
  -- member | super_admin | manager | front_desk | trainer | kitchen_manager | finance | content_manager

-- Memberships as first-class, database-driven records (Batch 8 groundwork).
create table if not exists public.membership_plans (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  price_naira integer not null,
  billing_interval text not null default 'monthly', -- monthly | annual | one_off
  features jsonb not null default '[]',
  gym_access boolean not null default true,
  class_access boolean not null default true,
  guest_passes integer not null default 0,
  personal_training_sessions integer not null default 0,
  kitchen_credit_naira integer not null default 0,
  status text not null default 'active', -- active | archived
  created_at timestamptz not null default now()
);

create table if not exists public.membership_subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  plan_id uuid not null references public.membership_plans(id),
  status text not null default 'active', -- active | cancelled | expired | frozen
  started_at timestamptz not null default now(),
  renews_at timestamptz,
  cancelled_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.membership_events (
  id uuid primary key default gen_random_uuid(),
  subscription_id uuid not null references public.membership_subscriptions(id) on delete cascade,
  event_type text not null, -- activated | renewed | upgraded | downgraded | cancelled | expired | frozen
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now()
);

alter table public.membership_plans enable row level security;
alter table public.membership_subscriptions enable row level security;
alter table public.membership_events enable row level security;

create policy "Plans are publicly readable" on public.membership_plans for select using (true);
create policy "Admins manage plans" on public.membership_plans for all
  using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_admin))
  with check (exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_admin));

create policy "Users view own subscriptions" on public.membership_subscriptions
  for select using (auth.uid() = user_id);
create policy "Admins manage all subscriptions" on public.membership_subscriptions
  for all
  using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_admin))
  with check (exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_admin));

create policy "Users view own membership events" on public.membership_events
  for select using (
    exists (select 1 from public.membership_subscriptions s where s.id = subscription_id and s.user_id = auth.uid())
  );
create policy "Admins manage membership events" on public.membership_events
  for all
  using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_admin))
  with check (exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_admin));

-- Fitness domain groundwork (Batches 12-13) — created now so later batches
-- are additive rather than requiring another migration pass.
create table if not exists public.exercises (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  muscle_group text,
  equipment text,
  instructions text,
  video_url text,
  difficulty text,
  created_at timestamptz not null default now()
);

create table if not exists public.workouts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  performed_at timestamptz not null default now(),
  duration_minutes integer,
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists public.workout_sets (
  id uuid primary key default gen_random_uuid(),
  workout_id uuid not null references public.workouts(id) on delete cascade,
  exercise_id uuid not null references public.exercises(id),
  set_number integer not null,
  reps integer,
  weight_kg numeric,
  created_at timestamptz not null default now()
);

create table if not exists public.body_measurements (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  recorded_at timestamptz not null default now(),
  weight_kg numeric,
  body_fat_pct numeric,
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists public.fitness_goals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  goal_type text not null,
  target_value numeric,
  target_date date,
  status text not null default 'active', -- active | achieved | abandoned
  created_at timestamptz not null default now()
);

alter table public.exercises enable row level security;
alter table public.workouts enable row level security;
alter table public.workout_sets enable row level security;
alter table public.body_measurements enable row level security;
alter table public.fitness_goals enable row level security;

create policy "Exercises are publicly readable" on public.exercises for select using (true);
create policy "Admins manage exercises" on public.exercises for all
  using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_admin))
  with check (exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_admin));

create policy "Users manage own workouts" on public.workouts
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Users manage own workout sets" on public.workout_sets
  for all using (
    exists (select 1 from public.workouts w where w.id = workout_id and w.user_id = auth.uid())
  ) with check (
    exists (select 1 from public.workouts w where w.id = workout_id and w.user_id = auth.uid())
  );

create policy "Users manage own measurements" on public.body_measurements
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Users manage own goals" on public.fitness_goals
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Challenges, rewards, referrals, notifications, audit log — groundwork
-- for Batches 14/15/21/26, added now per the master blueprint's data
-- model so later batches don't need another migration pass.
create table if not exists public.challenges (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  created_at timestamptz not null default now()
);

create table if not exists public.challenge_entries (
  id uuid primary key default gen_random_uuid(),
  challenge_id uuid not null references public.challenges(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  score numeric not null default 0,
  created_at timestamptz not null default now(),
  unique (challenge_id, user_id)
);

create table if not exists public.reward_transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  points integer not null, -- positive = earned, negative = redeemed
  reason text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.referrals (
  id uuid primary key default gen_random_uuid(),
  referrer_id uuid not null references auth.users(id) on delete cascade,
  referred_email text not null,
  status text not null default 'pending', -- pending | verified | rewarded
  created_at timestamptz not null default now(),
  unique (referrer_id, referred_email)
);

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  type text not null,
  title text not null,
  body text,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.support_messages (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  message text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references auth.users(id) on delete set null,
  action text not null,
  target_table text,
  target_id uuid,
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now()
);

alter table public.challenges enable row level security;
alter table public.challenge_entries enable row level security;
alter table public.reward_transactions enable row level security;
alter table public.referrals enable row level security;
alter table public.notifications enable row level security;
alter table public.support_messages enable row level security;
alter table public.audit_logs enable row level security;

create policy "Challenges are publicly readable" on public.challenges for select using (true);
create policy "Admins manage challenges" on public.challenges for all
  using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_admin))
  with check (exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_admin));

create policy "Entries are publicly readable" on public.challenge_entries for select using (true);
create policy "Users manage own entries" on public.challenge_entries
  for insert with check (auth.uid() = user_id);
create policy "Users update own entries" on public.challenge_entries
  for update using (auth.uid() = user_id);

create policy "Users view own reward transactions" on public.reward_transactions
  for select using (auth.uid() = user_id);
create policy "Admins manage reward transactions" on public.reward_transactions
  for all
  using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_admin))
  with check (exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_admin));

create policy "Users manage own referrals" on public.referrals
  for all using (auth.uid() = referrer_id) with check (auth.uid() = referrer_id);

create policy "Users manage own notifications" on public.notifications
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Users manage own support messages" on public.support_messages
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Admins view audit logs" on public.audit_logs
  for select using (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_admin)
  );
-- Inserts into audit_logs happen from trusted server code using the
-- service-role client (lib/supabase/admin.ts), which bypasses RLS —
-- there is intentionally no insert policy for normal users here.

-- ── Batch 8 — Membership engine ──────────────────────────────────────
-- `code` matches the existing PlanId string literals ("pay_as_you_go",
-- "monthly", "annual") used throughout the app (profiles.membership_plan,
-- PaystackButton purpose, etc.) so this is additive, not a breaking
-- rename — membership_plans.id (uuid) is only used as the FK target for
-- membership_subscriptions / membership_events.
alter table public.membership_plans add column if not exists code text unique;

insert into public.membership_plans (code, name, description, price_naira, billing_interval, features, guest_passes, personal_training_sessions, kitchen_credit_naira)
values
  ('pay_as_you_go', 'Pay As You Train', 'Drop in for any single class, no commitment.', 6000, 'one_off',
   '["Any single class", "Guest pass friendly", "No commitment"]', 1, 0, 0),
  ('monthly', 'Monthly Unlimited', 'Unlimited classes, every month.', 45000, 'monthly',
   '["Unlimited classes", "10% off Blags Kitchen", "Free locker"]', 2, 0, 0),
  ('annual', 'Annual Elite', 'Unlimited classes and a PT session, every month, for a year.', 420000, 'annual',
   '["Unlimited classes", "1 PT session/month", "20% off Blags Kitchen"]', 4, 12, 0)
on conflict (code) do update set
  name = excluded.name,
  description = excluded.description,
  price_naira = excluded.price_naira,
  billing_interval = excluded.billing_interval,
  features = excluded.features,
  guest_passes = excluded.guest_passes,
  personal_training_sessions = excluded.personal_training_sessions,
  kitchen_credit_naira = excluded.kitchen_credit_naira;

-- ── Batch 9 — Class scheduling & booking engine ─────────────────────
-- The booking API already re-checks these server-side (never trust the
-- client), but a DB-level trigger is defense-in-depth: it protects the
-- data even against a future code path (a script, another service, a
-- bug) that inserts into `bookings` directly.

-- Freeze support for Batch 8 membership management (cancel already
-- existed; freeze/resume was still missing).
alter table public.membership_subscriptions
  add column if not exists frozen_at timestamptz;
alter table public.profiles
  add column if not exists membership_frozen boolean not null default false;

create or replace function public.enforce_class_capacity()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_capacity integer;
  v_booked integer;
begin
  if new.status = 'cancelled' or new.status = 'waitlisted' then
    return new;
  end if;

  select capacity into v_capacity from public.classes where id = new.class_id;

  if v_capacity is null then
    raise exception 'Class % does not exist', new.class_id;
  end if;

  select count(*) into v_booked
  from public.bookings
  where class_id = new.class_id
    and booking_date = new.booking_date
    and status <> 'cancelled'
    and id is distinct from new.id;

  if v_booked >= v_capacity then
    raise exception 'Class is fully booked for %', new.booking_date
      using errcode = '23514'; -- check_violation, mapped to a friendly 409 in the API route
  end if;

  return new;
end;
$$;

drop trigger if exists trg_enforce_class_capacity on public.bookings;
create trigger trg_enforce_class_capacity
  before insert or update on public.bookings
  for each row execute function public.enforce_class_capacity();

-- Waitlist: when a confirmed booking is cancelled, promote the
-- longest-waiting 'waitlisted' row for the same class/date to
-- 'confirmed'. Runs as the same trusted definer as the capacity check;
-- the API also does this so the member gets an immediate response, but
-- this covers any cancellation path (admin tools, future code) too.
create or replace function public.promote_next_waitlisted()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_next_id uuid;
begin
  if new.status = 'cancelled' and old.status <> 'cancelled' then
    select id into v_next_id
    from public.bookings
    where class_id = new.class_id
      and booking_date = new.booking_date
      and status = 'waitlisted'
    order by created_at asc
    limit 1;

    if v_next_id is not null then
      update public.bookings set status = 'confirmed' where id = v_next_id;
    end if;
  end if;

  return new;
end;
$$;

drop trigger if exists trg_promote_next_waitlisted on public.bookings;
create trigger trg_promote_next_waitlisted
  after update on public.bookings
  for each row execute function public.promote_next_waitlisted();
