"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import type { AdminMember } from "@/lib/admin";

export default function AdminMembersTable({ members }: { members: AdminMember[] }) {
  const [query, setQuery] = useState("");

  const filtered = members.filter(
    (m) =>
      m.name.toLowerCase().includes(query.toLowerCase()) ||
      m.email.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div>
      <div className="flex items-center justify-end mb-6">
        <div className="relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-faint)]" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search members…"
            className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-sm pl-9 pr-3 py-2 text-sm text-[var(--color-text)] focus:outline-none focus:border-[var(--color-blaze)] w-56"
          />
        </div>
      </div>

      <div className="overflow-x-auto rounded-md border border-[var(--color-border)]">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--color-border)] text-left text-[var(--color-text-faint)]">
              <th className="px-5 py-3 font-medium">Name</th>
              <th className="px-5 py-3 font-medium">Email</th>
              <th className="px-5 py-3 font-medium">Plan</th>
              <th className="px-5 py-3 font-medium">Joined</th>
              <th className="px-5 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((m) => (
              <tr key={m.id} className="border-b border-[var(--color-border)] last:border-0 bg-[var(--color-surface)]">
                <td className="px-5 py-3.5 text-[var(--color-text)] font-medium">{m.name}</td>
                <td className="px-5 py-3.5 text-[var(--color-text-muted)]">{m.email || "—"}</td>
                <td className="px-5 py-3.5 text-[var(--color-text-muted)]">{m.plan}</td>
                <td className="px-5 py-3.5 text-[var(--color-text-muted)]">{m.joined}</td>
                <td className="px-5 py-3.5">
                  <span
                    className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                      m.status === "active"
                        ? "bg-[var(--color-success)]/10 text-[var(--color-success)]"
                        : "bg-[var(--color-danger)]/10 text-[var(--color-danger)]"
                    }`}
                  >
                    {m.status}
                  </span>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="px-5 py-10 text-center text-[var(--color-text-faint)]">
                  No members match your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
