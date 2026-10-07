const fs = require('fs');
const file = 'src/app/dashboard/admin/roles/[id]/page.tsx';

const newCode = `"use client";

import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";
import { EditRoleForm } from "@/components/dashboard/admin/edit-role-form";
import { ManageRolePermissions } from "@/components/dashboard/admin/manage-role-permissions";
import { apiClient } from "@/lib/api-client";

interface RoleResponse {
  id: string;
  roleName: string;
  description: string;
  permissions: { id: string; name: string; description: string }[];
}

interface PermissionResponse {
  id: string;
  name: string;
  description: string;
}

export default function AdminRoleDetailPage() {
  const { user } = useAuth();
  const params = useParams();
  const id = params.id as string;
  
  const [role, setRole] = useState<RoleResponse | null>(null);
  const [permissions, setPermissions] = useState<PermissionResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    async function loadData() {
      try {
        const [roleRes, permRes] = await Promise.all([
          apiClient.get(\`/admin/roles/\${id}\`),
          apiClient.get('/admin/permissions')
        ]);
        setRole(roleRes.data?.data);
        setPermissions(permRes.data?.data?.content || []);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [user, id]);

  if (!user) return null;

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (!role) {
    return (
      <div className="space-y-6">
        <Link href="/dashboard/admin/roles" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Roles
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Role Not Found</h1>
          <p className="mt-1 text-sm text-muted-foreground">The role you are looking for does not exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Link href="/dashboard/admin/roles" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to Roles
      </Link>
      
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Role Details</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage permissions for {role.roleName}.
          </p>
        </div>
        <EditRoleForm role={role} accessToken="" />
      </div>

      <div className="rounded-xl border bg-card p-6">
        <dl className="grid gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Role Name</dt>
            <dd className="mt-1 text-sm font-medium">{role.roleName}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Description</dt>
            <dd className="mt-1 text-sm font-medium">{role.description || "N/A"}</dd>
          </div>
          
          <div className="sm:col-span-2 mt-4 pt-4 border-t">
            <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-4">Permissions</dt>
            <ManageRolePermissions 
              roleId={role.id} 
              rolePermissions={role.permissions || []} 
              allPermissions={permissions} 
              accessToken="" 
            />
          </div>
        </dl>
      </div>
    </div>
  );
}
`;

fs.writeFileSync(file, newCode, 'utf8');
console.log('Fixed roles/[id]/page.tsx');
