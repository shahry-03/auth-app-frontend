"use client";

import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";
import { RolesTable } from "@/components/dashboard/admin/roles-table";
import { apiClient } from "@/lib/api-client";

export default function AdminRolesPage() {
  const { user } = useAuth();
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    apiClient.get('/admin/roles')
      .then(res => setData(res.data?.data?.content || res.data?.data || []))
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, [user]);

  if (!user) return null;

  return (
    <div className="space-y-6">
      <Link href="/dashboard/admin" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to Admin Dashboard
      </Link>
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Roles</h1>
        <p className="mt-1 text-sm text-muted-foreground">Manage system roles.</p>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-8"><Loader2 className="h-6 w-6 animate-spin text-blue-500" /></div>
      ) : (
        <RolesTable initialRoles={data} accessToken="" />
      )}
    </div>
  );
}
