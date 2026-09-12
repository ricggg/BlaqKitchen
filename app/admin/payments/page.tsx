import { getAdminPayments } from "@/lib/data/admin";

const STATUS_COLOR: Record<string, string> = {
  success: "text-[var(--color-success)] bg-[var(--color-success)]/10",
  pending: "text-[var(--color-warn)] bg-[var(--color-warn)]/10",
  failed: "text-[var(--color-danger)] bg-[var(--color-danger)]/10",
};

export default async function AdminPaymentsPage() {
  const payments = await getAdminPayments();
  const total = payments.filter((p) => p.status === "success").reduce((s, p) => s + p.amountNaira, 0);

  return (
    <div>
      <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
        <h2 className="font-[family-name:var(--font-display)] uppercase text-2xl text-[var(--color-text)]">
          Payments
        </h2>
        <p className="text-sm text-[var(--color-text-muted)]">
          Settled: <span className="text-[var(--color-text)] font-semibold">₦{total.toLocaleString()}</span>
        </p>
      </div>

      <div className="overflow-x-auto rounded-md border border-[var(--color-border)]">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--color-border)] text-left text-[var(--color-text-faint)]">
              <th className="px-5 py-3 font-medium">Customer</th>
              <th className="px-5 py-3 font-medium">Description</th>
              <th className="px-5 py-3 font-medium">Amount</th>
              <th className="px-5 py-3 font-medium">Date</th>
              <th className="px-5 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((p) => (
              <tr key={p.id} className="border-b border-[var(--color-border)] last:border-0 bg-[var(--color-surface)]">
                <td className="px-5 py-3.5 text-[var(--color-text)] font-medium whitespace-nowrap">{p.customer}</td>
                <td className="px-5 py-3.5 text-[var(--color-text-muted)]">{p.description}</td>
                <td className="px-5 py-3.5 text-[var(--color-text)] font-medium whitespace-nowrap">
                  ₦{p.amountNaira.toLocaleString()}
                </td>
                <td className="px-5 py-3.5 text-[var(--color-text-muted)] whitespace-nowrap">{p.date}</td>
                <td className="px-5 py-3.5">
                  <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_COLOR[p.status]}`}>
                    {p.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
