"use client";

import { useState } from "react";
import Link from "next/link";
import {
  API_ENDPOINTS,
  getEndpointById,
  getTotalEndpointCount,
  type ApiEndpoint,
} from "@/lib/endpoints";
import { EndpointList } from "@/components/playground/EndpointList";
import { RequestBuilder } from "@/components/playground/RequestBuilder";
import {
  ResponseViewer,
  type ApiResponse,
} from "@/components/playground/ResponseViewer";
import { ThemeToggle } from "@/components/theme-toggle";
import { Shield, ChevronRight, Activity } from "lucide-react";
import { UserNav } from "@/components/dashboard/user-nav";

// We can just conditionally render UserNav if the user exists, but it's a client component.
// Or we can just leave it out if we don't have user info in this page easily.
// The instructions said "User/account control if it already exists".
// Let's check if the previous playground page had it. The previous didn't have user nav, 
// so I'll leave it out or provide a simple Sign In link if we want, or just omit it.
// I will omit it to match exactly the previous functionality but with improved styling.

export default function PlaygroundPage() {
  const [selectedId, setSelectedId] = useState<string>(
    () => API_ENDPOINTS[0]?.endpoints[0]?.id ?? ""
  );
  const [response, setResponse] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedEndpoint = selectedId ? getEndpointById(selectedId) : undefined;

  const handleResponse = (result: ApiResponse | { error: string }) => {
    setLoading(false);
    if ("error" in result) {
      setError(result.error);
      setResponse(null);
    } else {
      setError(null);
      setResponse(result);
    }
  };

  const handleEndpointSelect = (endpoint: ApiEndpoint) => {
    setSelectedId(endpoint.id);
    setResponse(null);
    setError(null);
  };

  return (
    <div className="flex h-screen flex-col bg-white dark:bg-[#060913] text-slate-900 dark:text-slate-100 font-sans selection:bg-indigo-500/30 overflow-hidden">
      {/* ─── Top Navigation ─── */}
      <header className="flex h-[60px] shrink-0 items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-[#0A0F1C]/70 backdrop-blur-xl px-4 lg:px-6">
        <div className="flex items-center gap-4">
          <Link href="/" className="group flex items-center gap-2.5 font-semibold transition-opacity hover:opacity-90">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 shadow-sm shadow-indigo-500/20">
              <Shield className="h-3.5 w-3.5 text-white" />
            </div>
            <span className="text-[15px] text-slate-900 dark:text-white hidden sm:inline-block tracking-tight">
              Universal Auth
            </span>
          </Link>
          
          <div className="hidden sm:flex items-center gap-2 text-slate-300 dark:text-slate-700">
            <ChevronRight className="h-4 w-4" />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[14px] font-medium text-slate-600 dark:text-slate-300">
              API Playground
            </span>
            <span className="hidden rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-[11px] font-semibold text-slate-500 dark:border-slate-800 dark:bg-slate-900/50 dark:text-slate-400 sm:inline-block">
              {getTotalEndpointCount()} endpoints
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden items-center gap-2 rounded-full border border-emerald-200/50 bg-emerald-50 px-2.5 py-1 dark:border-emerald-500/20 dark:bg-emerald-500/10 sm:flex shadow-sm">
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
            <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400">
              API Connected
            </span>
          </div>
          
          <div className="h-4 w-px bg-slate-200 dark:bg-slate-800 hidden sm:block" />
          
          <ThemeToggle />
        </div>
      </header>

      {/* ─── Main Layout ─── */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-72 shrink-0 overflow-hidden border-r border-slate-200 bg-slate-50/50 dark:border-slate-800 dark:bg-[#0A0F1C]/50 flex flex-col hidden md:flex">
          <EndpointList selectedId={selectedId} onSelect={handleEndpointSelect} />
        </aside>

        {/* API Workspace */}
        <main className="flex flex-1 flex-col overflow-hidden bg-white dark:bg-[#060913] lg:flex-row">
          {selectedEndpoint ? (
            <>
              {/* Request Panel */}
              <div className="flex flex-col border-b border-slate-200 dark:border-slate-800 lg:w-[55%] lg:border-b-0 lg:border-r">
                <RequestBuilder
                  key={selectedEndpoint.id}
                  endpoint={selectedEndpoint}
                  onLoading={() => setLoading(true)}
                  onResponse={handleResponse}
                />
              </div>
              
              {/* Response Panel */}
              <div className="flex flex-col bg-slate-50/50 dark:bg-[#0A0F1C]/30 lg:w-[45%]">
                <ResponseViewer response={response} loading={loading} error={error} />
              </div>
            </>
          ) : (
            <div className="flex flex-1 flex-col items-center justify-center text-slate-500 dark:text-slate-400">
              <Activity className="mb-4 h-8 w-8 text-slate-300 dark:text-slate-700" />
              <p className="text-[14px] font-medium">Select an endpoint to get started</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
