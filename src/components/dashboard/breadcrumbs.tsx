"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const LABELS: Record<string, string> = {
  dashboard: "Dashboard",
  profile: "Profile",
  security: "Security",
  sessions: "Sessions",
  "2fa": "2FA",
  setup: "Setup",
  playground: "Playground",
  admin: "Admin",
  users: "Users",
  roles: "Roles",
  permissions: "Permissions",
};

export function Breadcrumbs() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  if (segments.length === 0) return null;

  const crumbs = segments.map((seg, idx) => {
    const href = "/" + segments.slice(0, idx + 1).join("/");
    // try to capitalize label if not in LABELS (e.g. for dynamic IDs)
    let label = LABELS[seg];
    if (!label) {
      if (seg.length > 20) {
        label = seg.substring(0, 8) + "..."; // UUID or long ID
      } else {
        label = seg.charAt(0).toUpperCase() + seg.slice(1);
      }
    }
    const isLast = idx === segments.length - 1;

    return { href, label, isLast };
  });

  return (
    <nav className="flex items-center gap-1.5 text-[14.5px]">
      {crumbs.map((crumb) => (
        <span key={crumb.href} className="flex items-center gap-1.5">
          {crumb.isLast ? (
            <span className="font-semibold text-slate-900 dark:text-slate-200 tracking-tight">{crumb.label}</span>
          ) : (
            <>
              <Link
                href={crumb.href}
                className="font-medium text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 transition-colors tracking-tight"
              >
                {crumb.label}
              </Link>
              <ChevronRight className="h-3.5 w-3.5 text-slate-300 dark:text-slate-600" />
            </>
          )}
        </span>
      ))}
    </nav>
  );
}
