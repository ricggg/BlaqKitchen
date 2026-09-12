import { getAdminMembers } from "@/lib/data/admin";
import AdminMembersTable from "@/components/AdminMembersTable";

export default async function AdminMembersPage() {
  const members = await getAdminMembers();

  return (
    <div>
      <h2 className="font-[family-name:var(--font-display)] uppercase text-2xl text-[var(--color-text)] mb-6">
        Members
      </h2>
      <AdminMembersTable members={members} />
    </div>
  );
}
