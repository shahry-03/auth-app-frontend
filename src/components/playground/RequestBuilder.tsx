"use client";

import { useMemo, useState } from "react";
import type { ApiEndpoint } from "@/lib/endpoints";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { apiClient } from "@/lib/api-client";
import axios from "axios";
import { cn } from "@/lib/utils";
import { Send, Lock, Loader2, Code2, Braces, Settings2 } from "lucide-react";
import type { ApiResponse } from "./ResponseViewer";

interface RequestBuilderProps {
  endpoint: ApiEndpoint;
  onLoading: () => void;
  onResponse: (result: ApiResponse | { error: string }) => void;
}

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1";
const SERVER_ROOT = API_BASE.replace(/\/api\/v1\/?$/, "");

const METHOD_COLORS_PREMIUM: Record<string, string> = {
  GET: "text-blue-600 dark:text-blue-400 bg-blue-500/10 border-blue-500/20",
  POST: "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
  PUT: "text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-500/20",
  PATCH: "text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-500/20",
  DELETE: "text-red-600 dark:text-red-400 bg-red-500/10 border-red-500/20",
};

export function RequestBuilder({
  endpoint,
  onLoading,
  onResponse,
}: RequestBuilderProps) {
  const [pathParams, setPathParams] = useState<Record<string, string>>(() => {
    const params: Record<string, string> = {};
    endpoint.params?.forEach((p) => {
      if (p.in === "path") params[p.name] = p.example ?? "";
    });
    return params;
  });

  const [body, setBody] = useState<string>(() => {
    if (!endpoint.body?.length) return "";
    const defaultBody: Record<string, unknown> = {};
    endpoint.body.forEach((f) => {
      if (f.example !== undefined) defaultBody[f.name] = f.example;
    });
    return JSON.stringify(defaultBody, null, 2);
  });
  
  const [isSending, setIsSending] = useState(false);

  const resolvedPath = useMemo(() => {
    let path = endpoint.path;
    for (const [key, value] of Object.entries(pathParams)) {
      path = path.replace(`{${key}}`, encodeURIComponent(value || `{${key}}`));
    }
    return path;
  }, [endpoint.path, pathParams]);

  const handleSend = async () => {
    setIsSending(true);
    onLoading();

    let parsedBody: unknown = undefined;
    if (body.trim() && endpoint.body?.length) {
      try {
        parsedBody = JSON.parse(body);
      } catch {
        onResponse({ error: "Invalid JSON in request body" });
        setIsSending(false);
        return;
      }
    }

    const start = performance.now();

    try {
      let res;

      if (resolvedPath.startsWith("/api/v1")) {
        // Standard API
        res = await apiClient.request({
          method: endpoint.method,
          url: resolvedPath.replace(/^\/api\/v1/, ""),
          data: parsedBody,
        });
      } else {
        // Dev endpoints
        res = await axios.request({
          method: endpoint.method,
          url: `${SERVER_ROOT}${resolvedPath}`,
          data: parsedBody,
          headers: { "Content-Type": "application/json" },
        });
      }

      const time = Math.round(performance.now() - start);
      onResponse({
        status: res.status,
        statusText: res.statusText,
        data: res.data,
        time,
      });
    } catch (err: unknown) {
      const time = Math.round(performance.now() - start);
      const axiosErr = err as {
        response?: { status: number; statusText: string; data: unknown };
        message?: string;
      };

      if (axiosErr.response) {
        onResponse({
          status: axiosErr.response.status,
          statusText: axiosErr.response.statusText,
          data: axiosErr.response.data,
          time,
        });
      } else {
        onResponse({ error: axiosErr.message || "Request failed" });
      }
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="flex h-full flex-col bg-white dark:bg-[#060913]">
      {/* ─── Header ─── */}
      <div className="flex flex-col gap-3 border-b border-slate-200 p-6 dark:border-slate-800">
        <div className="flex items-center gap-4">
          <span
            className={cn(
              "flex h-[26px] items-center justify-center rounded-[6px] border px-2.5 text-[12px] font-bold tracking-wide",
              METHOD_COLORS_PREMIUM[endpoint.method]
            )}
          >
            {endpoint.method}
          </span>
          <code className="flex-1 truncate font-mono text-[16px] font-semibold text-slate-900 dark:text-slate-100">
            {resolvedPath}
          </code>
          {endpoint.requiresAuth && (
            <span className="flex shrink-0 items-center gap-1.5 rounded-full border border-amber-200/50 bg-amber-50 px-2.5 py-1 text-[11px] font-semibold text-amber-700 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-400">
              <Lock className="h-[10px] w-[10px]" /> Auth Required
            </span>
          )}
        </div>
        <p className="text-[14px] text-slate-500 dark:text-slate-400">
          {endpoint.summary}
        </p>
      </div>

      {/* ─── Tabs/Config Area ─── */}
      <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
        {endpoint.params && endpoint.params.length > 0 && (
          <div className="mb-8 space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-2 dark:border-slate-800/60">
              <Settings2 className="h-4 w-4 text-slate-400" />
              <h3 className="text-[12px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
                Path Parameters
              </h3>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {endpoint.params.map((param) => (
                <div key={param.name} className="space-y-1.5">
                  <label htmlFor={param.name} className="text-[13px] font-medium text-slate-700 dark:text-slate-300">
                    {param.name}
                  </label>
                  <Input
                    id={param.name}
                    value={pathParams[param.name] ?? ""}
                    onChange={(e) =>
                      setPathParams((prev) => ({
                        ...prev,
                        [param.name]: e.target.value,
                      }))
                    }
                    placeholder={param.example}
                    className="h-10 border-slate-200 bg-slate-50 font-mono text-[13px] shadow-sm focus-visible:ring-indigo-500 dark:border-slate-800 dark:bg-[#0A0F1C] dark:focus-visible:ring-indigo-500"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {endpoint.body && endpoint.body.length > 0 && (
          <div className="flex flex-col space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2 dark:border-slate-800/60">
              <div className="flex items-center gap-2">
                <Braces className="h-4 w-4 text-slate-400" />
                <h3 className="text-[12px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
                  Request Body (JSON)
                </h3>
              </div>
            </div>
            <div className="group relative rounded-xl border border-slate-200 bg-slate-50 focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500 dark:border-slate-800 dark:bg-[#0A0F1C]">
              <div className="absolute right-3 top-3 rounded bg-slate-200 px-1.5 py-0.5 text-[10px] font-semibold text-slate-500 dark:bg-slate-800 dark:text-slate-400 pointer-events-none opacity-50">
                JSON
              </div>
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                className={cn(
                  "h-[280px] w-full resize-none bg-transparent p-4 font-mono text-[13px] leading-relaxed text-slate-800 dark:text-slate-200",
                  "focus:outline-none"
                )}
                spellCheck={false}
              />
            </div>
          </div>
        )}

        {!endpoint.body?.length && !endpoint.params?.length && (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50/50 py-12 dark:border-slate-800 dark:bg-slate-900/20">
            <Code2 className="mb-3 h-6 w-6 text-slate-300 dark:text-slate-700" />
            <p className="text-[14px] text-slate-500 dark:text-slate-400">
              This endpoint does not require a request body or parameters.
            </p>
          </div>
        )}
      </div>

      {/* ─── Footer Action ─── */}
      <div className="border-t border-slate-200 bg-slate-50/50 p-4 dark:border-slate-800 dark:bg-[#0A0F1C]/50">
        <Button 
          onClick={handleSend} 
          disabled={isSending}
          className="h-11 w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-[14px] font-semibold text-white shadow-md shadow-indigo-500/20 transition-all hover:from-blue-500 hover:to-indigo-500 hover:shadow-lg hover:shadow-indigo-500/30 active:scale-[0.98]" 
        >
          {isSending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Sending...
            </>
          ) : (
            <>
              Send Request
              <Send className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
