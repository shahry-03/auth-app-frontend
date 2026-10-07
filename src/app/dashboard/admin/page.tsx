"use client";
import { useAuth } from "@/hooks/useAuth";

import { redirect } from "next/navigation";
import Link from "next/link";
import { Users, Shield, Key } from "lucide-react";

interface BackendUser {
  roles: { roleName: string }[];
}

export default function AdminDashboardPage() {
  const { user } = useAuth();
  if (!user) return null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage system users, roles, and permissions.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Link
          href="/dashboard/admin/users"
          className="group flex flex-col justify-between rounded-xl border bg-card p-6 transition-colors hover:border-foreground/20 hover:bg-accent/40"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600">
            <Users className="h-6 w-6" />
          </div>
          <div className="mt-4">
            <h3 className="font-semibold group-hover:underline">Manage Users</h3>
            <p className="text-sm text-muted-foreground">
              View, edit, and suspend user accounts.
            </p>
          </div>
        </Link>

        <Link
          href="/dashboard/admin/roles"
          className="group flex flex-col justify-between rounded-xl border bg-card p-6 transition-colors hover:border-foreground/20 hover:bg-accent/40"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-500/10 text-purple-600">
            <Shield className="h-6 w-6" />
          </div>
          <div className="mt-4">
            <h3 className="font-semibold group-hover:underline">Manage Roles</h3>
            <p className="text-sm text-muted-foreground">
              Create and configure system roles.
            </p>
          </div>
        </Link>

        <Link
          href="/dashboard/admin/permissions"
          className="group flex flex-col justify-between rounded-xl border bg-card p-6 transition-colors hover:border-foreground/20 hover:bg-accent/40"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-500/10 text-green-600">
            <Key className="h-6 w-6" />
          </div>
          <div className="mt-4">
            <h3 className="font-semibold group-hover:underline">Manage Permissions</h3>
            <p className="text-sm text-muted-foreground">
              View all available permissions.
            </p>
          </div>
        </Link>
      </div>
    </div>
  );
}
