"use client";

import { Bell, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Breadcrumbs } from "./breadcrumbs";
import { UserNav } from "./user-nav";
import { ThemeToggle } from "@/components/theme-toggle";

interface TopBarProps {
  user: {
    id?: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

export function TopBar({ user }: TopBarProps) {
  return (
    <header className="sticky top-0 z-10 flex h-[72px] items-center gap-4 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-[#0A0F1C]/80 px-8 backdrop-blur-xl">
      {/* ─── Breadcrumbs (left) ─── */}
      <div className="flex-1 font-medium text-[14.5px]">
        <Breadcrumbs />
      </div>

      {/* ─── Search (center-right) ─── */}
      <button
        type="button"
        className="hidden items-center gap-3 rounded-full border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 px-4 py-2 text-[13px] text-slate-500 transition-all hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-300 md:flex w-64 shadow-sm"
      >
        <Search className="h-4 w-4" />
        <span className="flex-1 text-left">Search...</span>
        <kbd className="inline-flex items-center gap-1 rounded bg-white dark:bg-slate-800 px-1.5 py-0.5 font-mono text-[10px] font-medium text-slate-400 border border-slate-200 dark:border-slate-700 shadow-sm">
          <span className="text-xs">⌘</span>K
        </kbd>
      </button>

      {/* ─── Notifications & Theme ─── */}
      <div className="flex items-center gap-1.5">
        <ThemeToggle />
        <Button
          variant="ghost"
          size="icon"
          className="relative h-[38px] w-[38px] rounded-full text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
        >
          <Bell className="h-[18px] w-[18px]" />
          <span className="absolute right-2 top-2 flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-indigo-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-indigo-500" />
          </span>
        </Button>
      </div>

      {/* ─── Divider ─── */}
      <div className="h-6 w-px bg-slate-200 dark:bg-slate-800 mx-1" />

      {/* ─── User nav ─── */}
      <UserNav user={user} />
    </header>
  );
}
