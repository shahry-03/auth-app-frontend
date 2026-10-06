"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  User,
  Shield,
  Monitor,
  Plug,
  ArrowUpRight,
  ShieldAlert,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ============================================================
//  Navigation items
// ============================================================
const navItems = [
  {
    title: "Overview",
    href: "/dashboard",
    icon: LayoutDashboard,
    exact: true,
  },
  {
    title: "Profile",
    href: "/dashboard/profile",
    icon: User,
  },
  {
    title: "Security",
    href: "/dashboard/security",
    icon: Shield,
  },
  {
    title: "Sessions",
    href: "/dashboard/sessions",
    icon: Monitor,
  },
];

// ============================================================
//  Component
// ============================================================
interface SidebarUser {
  roles?: { roleName: string }[];
  [key: string]: unknown;
}

export function Sidebar({ user }: { user?: SidebarUser }) {
  const pathname = usePathname();

  const isAdmin = user?.roles?.some((r) => r.roleName === "ADMIN");

  const adminItem = {
    title: "Admin",
    href: "/dashboard/admin",
    icon: ShieldAlert,
  };

  const visibleNavItems = isAdmin ? [...navItems, adminItem] : navItems;

  return (
    <aside className="hidden w-64 shrink-0 border-r border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-[#0A0F1C]/50 lg:flex lg:flex-col">
      {/* ─── Brand ─── */}
      <div className="flex h-[72px] items-center px-6">
        <Link href="/" className="flex items-center gap-3 font-semibold transition-opacity hover:opacity-90">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/20">
            <Shield className="h-[18px] w-[18px] text-white" />
          </div>
          <span className="text-[17px] tracking-tight text-slate-900 dark:text-white">
            Universal <span className="text-blue-600 dark:text-blue-400">Auth</span>
          </span>
        </Link>
      </div>

      {/* ─── Navigation ─── */}
      <nav className="flex-1 space-y-1 p-4">
        {visibleNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex items-center gap-3 rounded-[10px] px-3.5 py-2.5 text-[14.5px] font-medium transition-all duration-200",
                isActive
                  ? "bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 shadow-sm border border-indigo-100/50 dark:border-indigo-500/10"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-200"
              )}
            >
              <Icon className={cn(
                "h-4 w-4 transition-colors",
                isActive ? "text-indigo-600 dark:text-indigo-400" : "text-slate-400 group-hover:text-slate-500 dark:group-hover:text-slate-300"
              )} />
              {item.title}
            </Link>
          );
        })}
      </nav>

      {/* ─── API Playground CTA ─── */}
      <div className="p-4 pt-0">
        <Link
          href="/playground"
          className="group flex items-center justify-between gap-2 rounded-[10px] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 px-4 py-3 text-[13px] font-medium text-slate-600 dark:text-slate-400 shadow-sm transition-all hover:border-indigo-300 dark:hover:border-indigo-500/30 hover:text-indigo-600 dark:hover:text-indigo-400 hover:shadow-md hover:shadow-indigo-500/5"
        >
          <span className="flex items-center gap-2.5">
            <Plug className="h-4 w-4 text-slate-400 group-hover:text-indigo-500 transition-colors" />
            API Playground
          </span>
          <ArrowUpRight className="h-3.5 w-3.5 opacity-50 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100" />
        </Link>
      </div>
    </aside>
  );
}
