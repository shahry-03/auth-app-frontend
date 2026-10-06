"use client";

import { useMemo, useState } from "react";
import { API_ENDPOINTS, type ApiEndpoint } from "@/lib/endpoints";
import { Input } from "@/components/ui/input";
import { Search, Shield, FlaskConical, Command } from "lucide-react";
import { cn } from "@/lib/utils";

interface EndpointListProps {
  selectedId: string;
  onSelect: (endpoint: ApiEndpoint) => void;
}

const METHOD_COLORS_PREMIUM: Record<string, string> = {
  GET: "text-blue-600 dark:text-blue-400 bg-blue-500/10 border-blue-500/20",
  POST: "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
  PUT: "text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-500/20",
  PATCH: "text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-500/20",
  DELETE: "text-red-600 dark:text-red-400 bg-red-500/10 border-red-500/20",
};

export function EndpointList({ selectedId, onSelect }: EndpointListProps) {
  const [search, setSearch] = useState("");

  const filteredGroups = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return API_ENDPOINTS;

    return API_ENDPOINTS.map((group) => ({
      ...group,
      endpoints: group.endpoints.filter(
        (e) =>
          e.path.toLowerCase().includes(q) ||
          e.summary.toLowerCase().includes(q) ||
          e.method.toLowerCase().includes(q)
      ),
    })).filter((g) => g.endpoints.length > 0);
  }, [search]);

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-slate-200 p-4 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50">
        <div className="relative flex items-center">
          <Search className="absolute left-3 top-1/2 h-[14px] w-[14px] -translate-y-1/2 text-slate-400" />
          <Input
            placeholder="Search endpoints..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-9 w-full rounded-lg border-slate-200 bg-white pl-9 pr-12 text-[13px] shadow-sm transition-all focus-visible:ring-1 focus-visible:ring-indigo-500 dark:border-slate-800 dark:bg-slate-900 dark:focus-visible:ring-indigo-500 placeholder:text-slate-400"
          />
          <kbd className="pointer-events-none absolute right-3 flex h-5 items-center gap-1 rounded border border-slate-200 bg-slate-50 px-1.5 font-mono text-[10px] font-medium text-slate-400 dark:border-slate-700 dark:bg-slate-800">
            <span>⌘</span>K
          </kbd>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3 custom-scrollbar">
        {filteredGroups.length === 0 ? (
          <div className="mt-8 flex flex-col items-center justify-center gap-2 text-center">
            <Search className="h-6 w-6 text-slate-300 dark:text-slate-700" />
            <p className="text-[13px] font-medium text-slate-500 dark:text-slate-400">
              No endpoints found
            </p>
          </div>
        ) : (
          filteredGroups.map((group) => (
            <div key={group.key} className="mb-6 last:mb-2">
              <div className="mb-2 flex items-center gap-2 px-1 text-[11px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                <span>{group.icon}</span>
                <span>{group.label}</span>
                <span className="ml-auto font-medium text-slate-300 dark:text-slate-600">
                  {group.endpoints.length}
                </span>
              </div>
              <div className="space-y-1">
                {group.endpoints.map((endpoint) => {
                  const isActive = selectedId === endpoint.id;
                  return (
                    <button
                      key={endpoint.id}
                      onClick={() => onSelect(endpoint)}
                      className={cn(
                        "group flex w-full items-center gap-3 rounded-[8px] px-2.5 py-2 text-left transition-all duration-200",
                        isActive
                          ? "bg-indigo-50 dark:bg-indigo-500/10 shadow-sm border border-indigo-100/50 dark:border-indigo-500/10"
                          : "hover:bg-slate-100 dark:hover:bg-slate-800/50 border border-transparent"
                      )}
                    >
                      <span
                        className={cn(
                          "flex w-12 shrink-0 items-center justify-center rounded-[4px] border px-1 py-0.5 text-[10px] font-bold tracking-wide",
                          METHOD_COLORS_PREMIUM[endpoint.method]
                        )}
                      >
                        {endpoint.method}
                      </span>
                      
                      <div className="flex min-w-0 flex-1 items-center gap-2">
                        <span className={cn(
                          "truncate font-mono text-[12px]",
                          isActive 
                            ? "font-semibold text-indigo-700 dark:text-indigo-300" 
                            : "font-medium text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-slate-200"
                        )}>
                          {endpoint.path.replace("/api/v1", "")}
                        </span>
                        <div className="ml-auto flex items-center gap-1 opacity-60">
                          {endpoint.requiresAdmin && (
                            <Shield className="h-3 w-3 text-slate-400" />
                          )}
                          {endpoint.devOnly && (
                            <FlaskConical className="h-3 w-3 text-slate-400" />
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
