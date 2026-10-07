"use client";

import type { ReactNode } from "react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/dashboard/sidebar";
import { TopBar } from "@/components/dashboard/top-bar";
import { useAuth } from "@/hooks/useAuth";
import { Loader2 } from "lucide-react";

function FullPageSpinner() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-[#060913]">
      <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
    </div>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/login");
    }
  }, [isLoading, user, router]);

  if (isLoading) {
    return <FullPageSpinner />;
  }

  if (!user) {
    return null; // will redirect
  }

  return (
    <div className="flex min-h-screen">
      {/* ─── Sidebar ─── */}
      <Sidebar user={user} />

      {/* ─── Main content ─── */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <TopBar user={user} />

        <main className="flex-1 overflow-y-auto bg-slate-50 dark:bg-[#060913] p-8">
          <div className="mx-auto max-w-6xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
