"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Shield, ShieldCheck, Loader2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { AxiosError } from "axios";

import { buttonVariants } from "@/components/ui/button";
import { apiClient } from "@/lib/api-client";
import { cn } from "@/lib/utils";

interface TwoFactorStatus {
  enabled: boolean;
}

export function TwoFactorCard() {
  const [loading, setLoading] = useState(true);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const res = await apiClient.get<{ data: TwoFactorStatus }>(
          "/auth/2fa/status"
        );
        if (!cancelled) setEnabled(res.data.data.enabled);
      } catch (err) {
        const axiosError = err as AxiosError;
        // 401/403 means not logged in or wrong role — ignore silently
        if (axiosError.response?.status !== 401) {
          toast.error("Failed to load 2FA status");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="rounded-xl border bg-card">
      <div className="flex items-start justify-between gap-4 p-6">
        <div className="flex gap-4">
          <div
            className={cn(
              "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
              enabled
                ? "bg-green-500/10 text-green-600"
                : "bg-orange-500/10 text-orange-600"
            )}
          >
            {enabled ? (
              <ShieldCheck className="h-5 w-5" />
            ) : (
              <Shield className="h-5 w-5" />
            )}
          </div>
          <div>
            <h3 className="font-semibold">Two-Factor Authentication</h3>
            <p className="mt-1 max-w-md text-sm text-muted-foreground">
              Add an extra layer of security to your account by requiring a
              code from your authenticator app when signing in.
            </p>

            {loading ? (
              <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                <Loader2 className="h-3 w-3 animate-spin" />
                Checking status...
              </div>
            ) : enabled ? (
              <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-green-500/10 px-2.5 py-1 text-xs font-medium text-green-600">
                <CheckCircle2 className="h-3 w-3" />
                Enabled
              </div>
            ) : (
              <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-orange-500/10 px-2.5 py-1 text-xs font-medium text-orange-600">
                Not enabled
              </div>
            )}
          </div>
        </div>

        <div className="shrink-0">
          {enabled ? (
            <Link
              href="/dashboard/security/2fa/setup?mode=disable"
              className={cn(
                buttonVariants({ variant: "outline", size: "sm" }),
              )}
            >
              Disable
            </Link>
          ) : (
            <Link
              href="/dashboard/security/2fa/setup"
              className={cn(buttonVariants({ size: "sm" }))}
            >
              Enable 2FA
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}