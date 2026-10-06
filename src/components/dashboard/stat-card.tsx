import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  hint?: string;
  accent?: "default" | "green" | "blue" | "purple" | "orange";
}

const accentStyles = {
  default: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 group-hover:bg-slate-200 dark:group-hover:bg-slate-700",
  green: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 group-hover:bg-emerald-500/20",
  blue: "bg-blue-500/10 text-blue-600 dark:text-blue-400 group-hover:bg-blue-500/20",
  purple: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 group-hover:bg-indigo-500/20",
  orange: "bg-amber-500/10 text-amber-600 dark:text-amber-400 group-hover:bg-amber-500/20",
};

const borderStyles = {
  default: "hover:border-slate-300 dark:hover:border-slate-700",
  green: "hover:border-emerald-300/50 dark:hover:border-emerald-500/30",
  blue: "hover:border-blue-300/50 dark:hover:border-blue-500/30",
  purple: "hover:border-indigo-300/50 dark:hover:border-indigo-500/30",
  orange: "hover:border-amber-300/50 dark:hover:border-amber-500/30",
};

export function StatCard({
  icon: Icon,
  label,
  value,
  hint,
  accent = "default",
}: StatCardProps) {
  return (
    <div className={cn(
      "group flex flex-col rounded-[14px] border border-slate-200 bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-md dark:border-slate-800 dark:bg-slate-900/50",
      borderStyles[accent]
    )}>
      <div className="flex items-start justify-between">
        <div
          className={cn(
            "flex h-10 w-10 items-center justify-center rounded-xl transition-colors duration-300",
            accentStyles[accent]
          )}
        >
          <Icon className="h-[18px] w-[18px]" />
        </div>
      </div>
      <div className="mt-5 space-y-1">
        <div className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">{value}</div>
        <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
          {label}
        </div>
        {hint && (
          <div className="text-[13px] text-slate-400">{hint}</div>
        )}
      </div>
    </div>
  );
}
