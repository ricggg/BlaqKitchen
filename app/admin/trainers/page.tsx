import { getAdminTrainers } from "@/lib/data/admin";
import { Plus } from "lucide-react";

export default async function AdminTrainersPage() {
  const trainers = await getAdminTrainers();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-[family-name:var(--font-display)] uppercase text-2xl text-[var(--color-text)]">
          Trainers
        </h2>
        <button className="inline-flex items-center gap-2 rounded-sm bg-[var(--color-blaze)] px-4 py-2 text-sm font-semibold text-white">
          <Plus size={16} /> Add trainer
        </button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {trainers.map((t) => (
          <div key={t.id} className="rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
            <div className="w-10 h-10 rounded-full bg-[var(--color-surface-elevated)] border border-[var(--color-border-strong)] flex items-center justify-center text-sm font-semibold text-[var(--color-text)]">
              {t.name.split(" ").map((w) => w[0]).join("")}
            </div>
            <p className="mt-3 font-medium text-[var(--color-text)]">{t.name}</p>
            <p className="text-xs text-[var(--color-text-faint)] mt-0.5">{t.specialty}</p>
            <p className="text-xs text-[var(--color-text-muted)] mt-3">{t.classesThisWeek} classes this week</p>
          </div>
        ))}
      </div>
    </div>
  );
}
