"use client";
import { useAuth } from "@/hooks/useAuth";

import { redirect } from "next/navigation";
import { ProfileDetails } from "@/components/dashboard/profile-details";

interface BackendUser {
  id: string;
  email: string;
  name: string;
  image: string | null;
  enabled: boolean;
  createdAt: string;
  provider: string;
  roles: { roleName: string; permissions: { name: string }[] }[];
}

export default function ProfilePage() {
  const { user } = useAuth();
  if (!user) return null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage your account settings and personal information.
        </p>
      </div>

      <ProfileDetails initialUser={user} />
    </div>
  );
}