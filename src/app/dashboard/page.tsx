"use client";

import { redirect } from "next/navigation";
import { useState, useEffect } from "react";
import { apiClient } from "@/lib/api-client";
import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";
import {
  Shield,
  Key,
  Monitor,
  Calendar,
  ArrowRight,
  Sparkles,
  Lock,
  UserCircle,
} from "lucide-react";
import { StatCard } from "@/components/dashboard/stat-card";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface BackendUser {
  id: string;
  email: string;
  name: string;
  image: string | null;
  enabled: boolean;
  createdAt: string;
  provider: string;
  roles: { roleName: string; permissions: { name: string }[] }[];
}

function formatDate(iso: string | null | undefined): string {
  if (!iso) return "N/A";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "N/A";
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];
  return `${months[d.getUTCMonth()]} ${d.getUTCDate()}, ${d.getUTCFullYear()}`;
}

function getGreeting(): string {
  const hour = new Date().getUTCHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

export default function DashboardOverviewPage() {
  const { user } = useAuth();
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [loading2FA, setLoading2FA] = useState(true);
  const [sessionsCount, setSessionsCount] = useState<number | null>(null);

  useEffect(() => {
    if (!user) return;
    Promise.all([
      apiClient.get('/auth/2fa/status').catch(() => ({ data: { data: { enabled: false } } })),
      apiClient.get('/users/me/sessions').catch(() => ({ data: { data: [] } }))
    ]).then(([twoFaRes, sessionsRes]) => {
      setTwoFactorEnabled(twoFaRes.data?.data?.enabled || false);
      setSessionsCount(sessionsRes.data?.data?.length || 1);
    }).finally(() => {
      setLoading2FA(false);
    });
  }, [user]);
  if (!user) return null;

  const primaryRole = user.roles?.[0]?.roleName || "USER";
  const firstName = user.name?.split(" ")[0] || "User";

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* ─── Welcome header ─── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            {getGreeting()}, {firstName} <span className="inline-block origin-[70%_70%] animate-[wave_2.5s_ease-in-out_infinite]">👋</span>
          </h1>
          <p className="mt-1.5 text-[15px] text-slate-500">
            Here&apos;s what&apos;s happening with your account today.
          </p>
        </div>
        <Link
          href="/playground"
          className={cn(
            buttonVariants({ variant: "outline" }),
            "h-10 gap-2 self-start sm:self-auto rounded-lg border-slate-200 dark:border-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 hover:text-indigo-600 dark:hover:text-indigo-400 hover:border-indigo-200 dark:hover:border-indigo-500/20 transition-all shadow-sm"
          )}
        >
          <Sparkles className="h-4 w-4 text-indigo-500" />
          Explore API Playground <ArrowRight className="h-3.5 w-3.5 ml-1 opacity-50" />
        </Link>
      </div>

      {/* ─── Stats grid ─── */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={Shield}
          label="Two-Factor"
          value={loading2FA ? "..." : twoFactorEnabled ? "Protected" : "Disabled"}
          hint={loading2FA ? "Loading" : twoFactorEnabled ? "2FA is enabled" : "Add extra security"}
          accent={loading2FA ? "blue" : twoFactorEnabled ? "green" : "orange"}
        />
        <StatCard
          icon={Monitor}
          label="Active Sessions"
          value={sessionsCount === null ? "..." : sessionsCount.toString()}
          hint={sessionsCount === 1 ? "Current device" : "Multiple devices"}
          accent="blue"
        />
        <StatCard
          icon={UserCircle}
          label="Role"
          value={primaryRole}
          hint={`${user.roles?.[0]?.permissions?.length ?? 0} permissions`}
          accent="purple"
        />
        <StatCard
          icon={Calendar}
          label="Member Since"
          value={formatDate(user.createdAt)}
          hint={user.provider}
          accent="green"
        />
      </div>

      {/* ─── Two-column section ─── */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Profile summary card */}
        <div className="lg:col-span-2 overflow-hidden rounded-[14px] border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900/50">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/60 px-7 py-5">
            <div>
              <h2 className="text-base font-semibold text-slate-900 dark:text-white">Profile</h2>
              <p className="text-[13px] text-slate-500">
                Your account information
              </p>
            </div>
            <Link
              href="/dashboard/profile"
              className="group flex items-center gap-1 text-[13px] font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors"
            >
              Edit <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>

          <div className="p-7">
            {/* Avatar + name row */}
            <div className="flex items-center gap-5 pb-7 border-b border-slate-100 dark:border-slate-800/60">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 text-xl font-bold text-slate-700 dark:text-slate-300 shadow-sm border border-slate-200/50 dark:border-slate-700/50">
                {user.name?.substring(0, 2).toUpperCase() ?? "U"}
              </div>
              <div className="min-w-0 flex-1 space-y-0.5">
                <div className="truncate text-lg font-bold text-slate-900 dark:text-white">{user.name}</div>
                <div className="truncate text-[15px] text-slate-500">
                  {user.email}
                </div>
              </div>
              <div className="flex items-center gap-1.5 rounded-full border border-emerald-200 dark:border-emerald-500/20 bg-emerald-50 dark:bg-emerald-500/10 px-3 py-1 shadow-sm">
                <div className={cn("h-2 w-2 rounded-full", user.enabled ? "bg-emerald-500 animate-pulse" : "bg-red-500")} />
                <span className="text-[13px] font-semibold text-emerald-700 dark:text-emerald-400">
                  {user.enabled ? "Active" : "Inactive"}
                </span>
              </div>
            </div>

            {/* Details grid */}
            <dl className="grid gap-6 pt-7 sm:grid-cols-2">
              <div className="space-y-1.5">
                <dt className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Provider
                </dt>
                <dd className="text-[14.5px] font-medium text-slate-900 dark:text-slate-200">
                  {user.provider || "LOCAL"}
                </dd>
              </div>
              <div className="space-y-1.5">
                <dt className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Email Status
                </dt>
                <dd className="text-[14.5px] font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                  Verified
                </dd>
              </div>
              <div className="space-y-1.5">
                <dt className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Roles
                </dt>
                <dd className="flex flex-wrap gap-2 pt-0.5">
                  {user.roles?.map((r) => (
                    <span
                      key={r.roleName}
                      className="rounded-md border border-indigo-200 dark:border-indigo-500/20 bg-indigo-50 dark:bg-indigo-500/10 px-2.5 py-1 text-[11px] font-bold text-indigo-700 dark:text-indigo-300 shadow-sm uppercase tracking-wider"
                    >
                      {r.roleName}
                    </span>
                  ))}
                </dd>
              </div>
              <div className="space-y-1.5">
                <dt className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Joined
                </dt>
                <dd className="text-[14.5px] font-medium text-slate-900 dark:text-slate-200">
                  {formatDate(user.createdAt)}
                </dd>
              </div>
            </dl>
          </div>
        </div>

        {/* Quick actions card */}
        <div className="overflow-hidden rounded-[14px] border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900/50">
          <div className="border-b border-slate-100 dark:border-slate-800/60 px-6 py-5">
            <h2 className="text-base font-semibold text-slate-900 dark:text-white">Quick Actions</h2>
            <p className="text-[13px] text-slate-500">
              Common security tasks
            </p>
          </div>

          <div className="flex flex-col p-3">
            <QuickAction
              icon={Shield}
              title="Enable 2FA"
              description="Add TOTP authentication"
              href="/dashboard/security"
              iconColor="text-emerald-500"
              iconBg="bg-emerald-500/10"
            />
            <QuickAction
              icon={Key}
              title="Change password"
              description="Update your credentials"
              href="/dashboard/security"
              iconColor="text-amber-500"
              iconBg="bg-amber-500/10"
            />
            <QuickAction
              icon={Monitor}
              title="Manage sessions"
              description="View active devices"
              href="/dashboard/sessions"
              iconColor="text-blue-500"
              iconBg="bg-blue-500/10"
            />
            <QuickAction
              icon={Lock}
              title="API Playground"
              description="Test 41 endpoints live"
              href="/playground"
              iconColor="text-indigo-500"
              iconBg="bg-indigo-500/10"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================
//  Quick action row
// ============================================================
function QuickAction({
  icon: Icon,
  title,
  description,
  href,
  iconColor,
  iconBg,
}: {
  icon: typeof Shield;
  title: string;
  description: string;
  href: string;
  iconColor: string;
  iconBg: string;
}) {
  return (
    <Link
      href={href}
      className="group flex items-center gap-4 rounded-[10px] p-3 transition-all hover:bg-slate-50 dark:hover:bg-slate-800/50"
    >
      <div className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors", iconBg)}>
        <Icon className={cn("h-[18px] w-[18px]", iconColor)} />
      </div>
      <div className="min-w-0 flex-1 space-y-0.5">
        <div className="text-[14px] font-semibold text-slate-900 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{title}</div>
        <div className="truncate text-[13px] text-slate-500">
          {description}
        </div>
      </div>
      <ArrowRight className="h-4 w-4 shrink-0 text-slate-400 opacity-0 -translate-x-2 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100 group-hover:text-indigo-500" />
    </Link>
  );
}
