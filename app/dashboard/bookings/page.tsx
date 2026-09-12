import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getUpcomingBookings, getBookingHistory } from "@/lib/data/members";
import BookingsList from "@/components/BookingsList";

export default async function BookingsPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const [upcoming, history] = await Promise.all([
    getUpcomingBookings(user.id),
    getBookingHistory(user.id),
  ]);

  return (
    <div>
      <h2 className="font-[family-name:var(--font-display)] uppercase text-2xl text-[var(--color-text)] mb-6">
        My bookings
      </h2>
      <BookingsList initialUpcoming={upcoming} history={history} />
    </div>
  );
}
