# Blag GYM — Website & Booking Platform

Built on the same stack as your AVSPro project: **Next.js 14 (App Router) + Tailwind CSS v4 + Framer Motion + Supabase**.

## This delivery: Batch 1 — Design system & homepage
- Full design token system (`app/globals.css`) — Blag GYM (crimson) + Blags Kitchen (brass) brand colors
- Responsive Navbar + Footer
- Hero section with cursor-driven 3D tilt/parallax card stack (Framer Motion)
- Programs section, Blags Kitchen teaser, Membership pricing
- Floating AI Chat widget (UI complete, backend wiring comes in Batch 5)

## Run it
```bash
npm install
npm run dev
```
Then open http://localhost:3000

> Note: `next/font/google` needs internet access to fetch Inter & Oswald at build time — this works automatically on Vercel/any normal host.

## Roadmap (next batches)
- **Batch 2:** Class & personal-training booking flow, Supabase auth (sign up/login), schedule calendar
- **Batch 3:** Member dashboard (bookings, plan, payment history) + Admin dashboard (classes, trainers, members, revenue)
- **Batch 4:** Blags Kitchen full menu, cart, order-ahead + table reservations
- **Batch 5:** Payments/subscriptions (card + local NG payment rails) and live AI chat backend (booking-aware assistant)

## Structure
```
app/            routes (App Router)
components/     Navbar, Footer, Hero, Programs, KitchenTeaser, MembershipCTA, AIChatWidget, LaneDivider
app/globals.css design tokens (colors, fonts, motion)
```

## Batch 2 — Auth & Booking (added)
- Supabase auth: `/signup`, `/login`, session-aware `middleware.ts`
- `supabase/schema.sql` — run this in your Supabase SQL editor (trainers, classes, profiles, bookings + RLS policies + auto-profile trigger)
- `/schedule` — filterable class list with a booking modal (`components/BookingModal.tsx`)
- `POST /api/bookings` — creates a booking for the signed-in user
- Copy `.env.example` to `.env.local` and fill in your Supabase project URL + anon key

Demo class data lives in `lib/classes.ts` so `/schedule` works before Supabase is wired up — swap it for a real `supabase.from("classes").select()` fetch once you've run the schema and seeded some rows.

## Batch 3 — Member & Admin Dashboards (added)
- `/dashboard` — member overview (plan, classes this month, kitchen credit, upcoming bookings), `/dashboard/bookings` (upcoming/history + cancel), plus `membership`, `kitchen-orders`, `settings` stub pages
- `/admin` — HQ overview with live stat cards + a Gym-vs-Kitchen revenue bar chart (Recharts), `/admin/classes`, `/admin/trainers`, `/admin/members`
- `components/DashboardShell.tsx` — shared sidebar shell reused by both member and admin sections
- `components/RequireAuth.tsx` — client-side guard, redirects signed-out visitors to `/login`

**Before going live:** `/admin` currently only checks "is signed in," not role. Gate it on `profiles.is_admin` (already in `supabase/schema.sql`) with a server-side check in `app/admin/layout.tsx`, redirecting non-admins to `/dashboard`.

All dashboard data is mocked in `lib/dashboard.ts` / `lib/admin.ts` — swap for real Supabase queries once bookings/profiles have live rows.

## Batch 4 — Blags Kitchen menu & ordering (added)
- `/kitchen` — full menu page: category tabs (Bowls, Grills, Smoothies, Snacks, Drinks), animated item cards, floating cart button
- `lib/cart-context.tsx` — global cart (add/remove/qty), persisted to `localStorage`, provided app-wide from `app/layout.tsx`
- `components/CartDrawer.tsx` — slide-in cart, reachable from the new cart icon in `Navbar` on every page
- `components/CheckoutModal.tsx` — pickup vs. dine-in (+ table number), notes, sign-in gate (same pattern as `BookingModal`), submits to the order API
- `POST /api/kitchen-orders` — creates an order + line items for the signed-in user; `GET` returns their order history
- `PATCH /api/kitchen-orders/[id]` — updates order status (received → preparing → ready → completed/cancelled), enforced by the `is_admin` RLS policy rather than an app-level check
- `supabase/schema.sql` — added `menu_items`, `kitchen_orders`, `kitchen_order_items` tables + RLS (owners manage their own orders, admins manage all)
- `/dashboard/kitchen-orders` — real order history UI (still on demo data from `lib/kitchen.ts` until Supabase is wired up)
- `/admin/kitchen-orders` — admin order queue with inline status dropdown per order

Demo menu + order data lives in `lib/kitchen.ts` — swap `DEMO_MENU` for `supabase.from("menu_items").select()` and the dashboard/admin demo arrays for the `/api/kitchen-orders` fetch once your Supabase project is seeded.

## Batch 5 — Payments & live AI chat (added)
- **Payments (Paystack):** `components/PaystackButton.tsx` — inline checkout popup; runs in **demo mode** (simulates a successful charge) whenever `NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY` isn't set, so every flow stays clickable before you have real keys
  - `/membership` — real plan cards wired to Paystack; a successful payment updates `profiles.membership_plan` + `membership_expires_at`
  - `/kitchen` checkout — choose "Pay online" (Paystack) or "Pay at pickup/table" (order still goes to the kitchen queue, marked `payment_status = unpaid` until settled)
  - `POST /api/payments/verify` — verifies the transaction server-side (real verify call to Paystack when `PAYSTACK_SECRET_KEY` is set, trusted in demo mode otherwise), records a row in `payments`, and applies the effect (membership renewal or order payment)
  - `/dashboard/membership` — plan + billing history; `/admin/payments` — all transactions across the gym
  - `supabase/schema.sql` — added `payments` table + RLS, and a `payment_status` column on `kitchen_orders`
- **Live AI chat:** `app/api/chat/route.ts` calls the Anthropic Messages API using `ANTHROPIC_API_KEY`, grounded in the real class schedule, membership pricing, and Blags Kitchen menu (`lib/chat-context.ts` builds the system prompt from `lib/classes.ts` / `lib/kitchen.ts` / `lib/payments.ts`, so it never invents prices or classes)
  - `AIChatWidget.tsx` now posts the full conversation to `/api/chat` instead of a placeholder timeout
  - No `ANTHROPIC_API_KEY`? The route replies with a friendly "team will follow up" message instead of erroring, so the widget still feels alive in preview

**Before going live:** get a Paystack account (test keys first) and set `NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY` + `PAYSTACK_SECRET_KEY`; get an Anthropic API key and set `ANTHROPIC_API_KEY`. Both are optional at dev-time — the app runs fully in demo mode without them.

## What's left for a full production launch
- Swap every `DEMO_*` array (`lib/classes.ts`, `lib/kitchen.ts`, `lib/dashboard.ts`, `lib/admin.ts`) for real Supabase queries once you've run `supabase/schema.sql` and seeded rows
- Gate `/admin/*` on `profiles.is_admin` server-side (currently only checks "is signed in" — see the note in `app/admin/layout.tsx`)
- Add a recurring-billing webhook (Paystack subscriptions or a cron) for monthly/annual renewals instead of one-off charges
- Point `/api/chat` at live schedule/menu data instead of the demo arrays once Supabase is wired up


## Batch 6 — Production Data Architecture (added)

- **Admin gating fixed:** `app/admin/layout.tsx` is now a server component that calls `requireAdmin()` (`lib/authz.ts`), which checks `profiles.is_admin` via the authenticated server client and redirects signed-out visitors to `/login` and signed-in non-admins to `/dashboard`. This closes the gap called out in Batch 3/5.
- **Server data layer:** `lib/data/members.ts` and `lib/data/admin.ts` hold the real Supabase queries for the member dashboard and admin dashboard. `app/dashboard/page.tsx`, `app/dashboard/bookings/page.tsx`, `app/admin/page.tsx`, `app/admin/members/page.tsx`, `app/admin/trainers/page.tsx`, and `app/admin/payments/page.tsx` are now server components that call these instead of importing `DEMO_*` arrays directly.
- **Real booking cancellation:** added `PATCH /api/bookings/[id]`, scoped to the signed-in user (defense in depth on top of RLS). `components/BookingsList.tsx` calls it with optimistic UI + rollback.
- **Schedule wired to Supabase:** `lib/data/classes.ts` fetches `/schedule` from the real `classes`/`trainers` tables (with live per-class booking counts for today), falling back to `DEMO_CLASSES` only when the table is empty or Supabase isn't configured — so the page still renders in a fresh preview.
- **Service-role client:** `lib/supabase/admin.ts` — server-only, for future trusted writes (audit logs, webhooks). Admin dashboard reads intentionally go through the normal authenticated client instead, now that RLS has admin-read policies (see below), so we're not reaching for the service-role key more than necessary.
- **Schema additions (`supabase/schema.sql`):** admin read/write policies on `profiles`, `bookings`, and `classes`; a `role` column on `profiles` for future RBAC (Batch 20); and the full next-stage data model from the blueprint so later batches are additive: `membership_plans`, `membership_subscriptions`, `membership_events`, `exercises`, `workouts`, `workout_sets`, `body_measurements`, `fitness_goals`, `challenges`, `challenge_entries`, `reward_transactions`, `referrals`, `notifications`, `support_messages`, `audit_logs` — all with RLS enabled.
- **`.env.example`:** added `SUPABASE_SERVICE_ROLE_KEY` with a warning never to expose it to the browser.

### Re-run this before testing

Batch 6 only *adds* tables/policies — re-run the full `supabase/schema.sql` in your Supabase SQL editor (it's idempotent, `create table if not exists` throughout) to pick up the new tables and policies. To test the admin gate, manually set `is_admin = true` on your own `profiles` row from the SQL editor.

### Left for later batches (intentionally, per the blueprint's own build order)

- `lib/kitchen.ts` (`/kitchen`, `/dashboard/kitchen-orders`, `/admin/kitchen-orders`) still runs on demo arrays — real wiring is scoped to **Batch 23: Blags Kitchen production upgrade**, after the membership/booking foundation is solid.
- Revenue chart (`REVENUE_SERIES`) stays on demo data until there's enough real payment volume to aggregate meaningfully — real aggregation is **Batch 22: Analytics**.
- `membership_plans` is seeded with no rows yet — populating it and wiring `/membership` + checkout to it is **Batch 8: Membership engine**, the next batch.
- Admin member emails aren't shown yet (they live in `auth.users`, which the anon-scoped client can't read) — will be solved properly with a `profiles` view or a narrow service-role RPC in a later pass rather than reaching for the service-role client from a page that doesn't strictly need it today.


## Batch 7 — Premium Marketing Website (added)

- **Homepage rebuilt in the exact 16-section order** from the blueprint: Navbar → Hero → Trust strip → Training goals → Programs → Live schedule preview → Memberships → Personal training → Trainers → Transformations → Facilities → Blags Kitchen → App/member platform → Testimonials → Final CTA → Footer. See `app/page.tsx`.
- **8 new pages**: `/about`, `/classes`, `/trainers`, `/personal-training`, `/facilities`, `/transformations`, `/locations`, `/contact`. `/membership` already existed from Batch 5 and was left as-is.
- **New reusable marketing components** in `components/marketing/`: `TrustStrip`, `TrainingGoals`, `SchedulePreview`, `PersonalTrainingSection`, `TrainersSection`, `TransformationsSection`, `FacilitiesSection`, `AppPlatformSection`, `TestimonialsSection`, `FinalCTA`, `PageHeader` — shared between the homepage and the new full pages so content isn't duplicated.
- **Shared content source**: `lib/marketing.ts` (trainers, testimonials, transformations, facilities, PT services, training goals) — one place to edit copy instead of hunting through components.
- **Mobile bottom CTA**: `components/MobileBookCTA.tsx`, sticky "Book a session" bar on mobile, hidden inside `/dashboard` and `/admin` where the shell already has navigation.
- **Nav/footer fixed**: `Navbar` pointed at a non-existent `/programs`; now points to `/classes`. `Programs` section's "View full schedule" link now actually goes to `/schedule`. `Footer` links out to all the new pages.
- **Build verified**: `npm run build` passes cleanly (33 routes, static where possible). The only build hiccup in this sandbox is Google Fonts being unreachable from the container network — that's a sandbox restriction, not a code issue; it'll fetch fine on Vercel or your local machine.

### Left for later batches

- `/contact` form is front-end only for now (no persistence) — a `contact_messages` table + email notification is natural to add alongside **Batch 21: Notifications**.
- `/personal-training` and `/trainers` are marketing pages only; actual trainer availability + direct PT booking is **Batch 10: Personal training**.
- Schedule preview on the homepage still reads from `DEMO_CLASSES` (it's marketing copy, not the real booking flow) — the real, live-data version is `/schedule`, wired up in Batch 6.


## Batch 8 — Membership Engine (added)

- **Database-driven plans**: `membership_plans` is seeded with the three real plans (idempotent upsert by `code`, matching the existing `PlanId` strings so nothing downstream breaks). `lib/data/plans.ts` reads them; `/membership` is now a server component that fetches live plans and the signed-in user's current plan, passing both to a new client component (`components/MembershipPlans.tsx`) that keeps the existing Paystack checkout UX.
- **Real subscription history**: `POST /api/payments/verify` now mirrors a successful membership payment into `membership_subscriptions` (creates or renews the active row) and logs a `membership_events` row (`activated` / `renewed`) — in addition to the existing `profiles.membership_plan` update, which stays as the fast-path read for the rest of the app.
- **Cancel flow**: `POST /api/membership/cancel` + `components/CancelMembershipButton.tsx` on `/dashboard/membership` — resets the profile plan and marks the subscription `cancelled` with a logged event.
- **Dashboard membership page wired live**: `/dashboard/membership` now pulls the real current plan and real `payments` history (`lib/data/billing.ts`) instead of `DEMO_PROFILE` / `DEMO_BILLING`.
- **One source of truth for pricing**: the homepage `MembershipCTA` teaser previously duplicated plan copy in its own hardcoded array — it now imports `MEMBERSHIP_PLANS` from `lib/payments.ts` directly, so homepage and checkout pricing can't drift apart.
- **Build verified**: `npm run build` passes cleanly (34 routes).

### Re-run this before testing

Re-run `supabase/schema.sql` again (idempotent) to pick up the `membership_plans.code` column and the seeded rows.

### Left for later batches

- Plan **upgrade/downgrade proration** isn't handled — cancelling and resubscribing works today; a proper upgrade path (credit the remainder of the old plan) is natural for a later billing-focused batch once real payment volume exists.
- `PAYSTACK_SECRET_KEY` isn't set, so checkout still runs in demo mode (simulated success) — the verify route already has the real Paystack verification branch ready for when live keys are added.
