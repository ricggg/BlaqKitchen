import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowRight, Dumbbell, UtensilsCrossed } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getMemberProfile, getUpcomingBookings } from "@/lib/data/members";

export default async function DashboardOverview() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const [profile, upcoming] = await Promise.all([
    getMemberProfile(user.id, user.email ?? null),
    getUpcomingBookings(user.id),
  ]);

  const firstName = profile.fullName.split(" ")[0] || "there";

  return (
    <div>
      <h2 className="font-[family-name:var(--font-display)] uppercase text-2xl text-[var(--color-text)] mb-1">
        Welcome back, {firstName}
      </h2>
      <p className="text-sm text-[var(--color-text-muted)] mb-8">
        Here&rsquo;s what&rsquo;s coming up this week.
      </p>

      <div className="grid sm:grid-cols-3 gap-4 mb-10">
        <div className="rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
          <p className="text-xs text-[var(--color-text-faint)]">Current plan</p>
          <p className="mt-1 font-[family-name:var(--font-display)] text-xl text-[var(--color-text)]">
            {profile.plan}
          </p>
          <p className="text-xs text-[var(--color-text-muted)] mt-1">
            {profile.planRenews ? `Renews ${profile.planRenews}` : "No active plan"}
          </p>
        </div>
        <div className="rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
          <p className="text-xs text-[var(--color-text-faint)]">Classes this month</p>
          <p className="mt-1 font-[family-name:var(--font-display)] text-xl text-[var(--color-text)]">
            {profile.classesThisMonth}
          </p>
          <p className="text-xs text-[var(--color-text-muted)] mt-1">Keep the streak going</p>
        </div>
        <div className="rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
          <p className="text-xs text-[var(--color-text-faint)]">Blaqs Kitchen credit</p>
          <p className="mt-1 font-[family-name:var(--font-display)] text-xl text-[var(--color-brass)]">
            ₦{profile.kitchenCreditsNaira.toLocaleString()}
          </p>
          <p className="text-xs text-[var(--color-text-muted)] mt-1">From your monthly plan</p>
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-[var(--color-text)]">Upcoming bookings</h3>
        <Link href="/dashboard/bookings" className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text)] flex items-center gap-1">
          View all <ArrowRight size={14} />
        </Link>
      </div>

      {upcoming.length === 0 ? (
        <div className="rounded-md border border-dashed border-[var(--color-border)] px-5 py-8 text-center mb-10">
          <p className="text-sm text-[var(--color-text-muted)]">No upcoming bookings yet.</p>
          <Link href="/schedule" className="text-sm text-[var(--color-blaze)] hover:underline mt-2 inline-block">
            Browse the schedule
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-px bg-[var(--color-border)] rounded-md overflow-hidden mb-10">
          {upcoming.map((b) => (
            <div key={b.id} className="bg-[var(--color-surface)] px-5 py-4 flex flex-wrap items-center justify-between gap-x-4 gap-y-1">
              <div className="flex items-center gap-3 min-w-0">
                <Dumbbell size={16} className="text-[var(--color-blaze)] shrink-0" />
                <div className="min-w-0">
                  <p className="text-sm font-medium text-[var(--color-text)] truncate">{b.className}</p>
                  <p className="text-xs text-[var(--color-text-faint)] truncate">{b.category} · {b.trainer}</p>
                </div>
              </div>
              <p className="text-sm text-[var(--color-text-muted)] shrink-0">{b.date} · {b.time}</p>
            </div>
          ))}
        </div>
      )}

      <div className="rounded-md border border-[var(--color-border)] bg-[var(--gradient-card)] p-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <UtensilsCrossed size={20} className="text-[var(--color-brass)]" />
          <div>
            <p className="font-medium text-[var(--color-text)]">Hungry after your next session?</p>
            <p className="text-sm text-[var(--color-text-muted)]">Order ahead from Blaqs Kitchen.</p>
          </div>
        </div>
        <Link
          href="/kitchen"
          className="inline-flex items-center gap-2 rounded-sm border border-[var(--color-brass)] px-4 py-2.5 text-sm font-semibold text-[var(--color-brass)] hover:bg-[var(--color-brass)] hover:text-black transition-colors"
        >
          Order now <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
}
