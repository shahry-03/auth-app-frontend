"use client";

import { Loader2, Box, Check, Copy } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

export interface ApiResponse {
  status: number;
  statusText: string;
  data: unknown;
  time: number;
}

interface ResponseViewerProps {
  response: ApiResponse | null;
  loading: boolean;
  error: string | null;
}

function getStatusColor(status: number): string {
  if (status >= 200 && status < 300)
    return "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:text-emerald-400";
  if (status >= 300 && status < 400)
    return "bg-blue-500/10 text-blue-600 border-blue-500/20 dark:text-blue-400";
  if (status >= 400 && status < 500)
    return "bg-amber-500/10 text-amber-600 border-amber-500/20 dark:text-amber-400";
  return "bg-red-500/10 text-red-600 border-red-500/20 dark:text-red-400";
}

export function ResponseViewer({
  response,
  loading,
  error,
}: ResponseViewerProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!response?.data) return;
    navigator.clipboard.writeText(JSON.stringify(response.data, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="flex h-full flex-col items-center justify-center space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
        <p className="text-[14px] font-medium text-slate-500 dark:text-slate-400">
          Sending request...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-full flex-col items-center justify-center p-6 text-center">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10">
          <Box className="h-6 w-6 text-red-500" />
        </div>
        <p className="text-[15px] font-bold text-red-600 dark:text-red-400">
          Request Failed
        </p>
        <p className="mt-2 max-w-md text-[14px] text-slate-500 dark:text-slate-400">
          {error}
        </p>
      </div>
    );
  }

  if (!response) {
    return (
      <div className="flex h-full flex-col items-center justify-center p-6 text-center">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="h-2 w-2 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.5)]" />
        </div>
        <p className="text-[15px] font-bold text-slate-900 dark:text-white">
          No response yet
        </p>
        <p className="mt-2 text-[14px] text-slate-500 dark:text-slate-400">
          Send a request to see the API response here.
        </p>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col bg-white dark:bg-[#060913]">
      <div className="flex shrink-0 items-center justify-between border-b border-slate-200 px-6 py-4 dark:border-slate-800 bg-slate-50/50 dark:bg-[#0A0F1C]/50">
        <div className="flex items-center gap-3">
          <span
            className={cn(
              "flex h-[26px] items-center justify-center rounded-[6px] border px-2.5 text-[12px] font-bold tracking-wide",
              getStatusColor(response.status)
            )}
          >
            {response.status} {response.statusText}
          </span>
          <div className="h-4 w-px bg-slate-300 dark:bg-slate-700" />
          <span className="text-[13px] font-medium text-slate-500 dark:text-slate-400">
            {response.time}ms
          </span>
        </div>
        <button
          onClick={handleCopy}
          className="group flex h-[26px] items-center gap-1.5 rounded-[6px] border border-slate-200 bg-white px-2 text-[11px] font-semibold text-slate-500 transition-all hover:bg-slate-50 hover:text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-white"
        >
          {copied ? (
            <Check className="h-3 w-3 text-emerald-500" />
          ) : (
            <Copy className="h-3 w-3 transition-transform group-hover:scale-110" />
          )}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>

      <div className="flex-1 overflow-auto bg-slate-50 p-6 custom-scrollbar dark:bg-slate-900/50">
        <pre className="whitespace-pre-wrap font-mono text-[13px] leading-relaxed text-slate-800 dark:text-slate-300">
          {JSON.stringify(response.data, null, 2)}
        </pre>
      </div>
    </div>
  );
}
