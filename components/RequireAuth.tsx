"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";

export default function RequireAuth({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [loading, user, router]);

  if (loading) {
    return (
      <div className="min-h-[100svh] flex items-center justify-center bg-[var(--color-bg)] pt-16">
        <p className="text-sm text-[var(--color-text-faint)]">Loading…</p>
      </div>
    );
  }

  if (!user) return null;

  return <>{children}</>;
}
