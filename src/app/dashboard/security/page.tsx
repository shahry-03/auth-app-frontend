"use client";
import { useAuth } from "@/hooks/useAuth";

import { redirect } from "next/navigation";
import { TwoFactorCard } from "@/components/dashboard/security/two-factor-card";
import { ChangePasswordCard } from "@/components/dashboard/security/change-password-card";


interface BackendUser {
  provider: string;
}

export default function SecurityPage() {
  const { user } = useAuth();
  if (!user) return null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Security</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage your account security and authentication methods.
        </p>
      </div>

      <div className="space-y-4">
        <TwoFactorCard />
        {user.provider === "LOCAL" && <ChangePasswordCard />}
      </div>
    </div>
  );
}