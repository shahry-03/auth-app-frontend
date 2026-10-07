const fs = require('fs');
const file = 'src/app/dashboard/admin/users/[id]/page.tsx';

const newCode = `"use client";

import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";
import { EditUserForm } from "@/components/dashboard/admin/edit-user-form";
import { ManageUserRoles } from "@/components/dashboard/admin/manage-user-roles";
import { apiClient } from "@/lib/api-client";

interface UserResponse {
  id: string;
  email: string;
  name: string;
  enabled: boolean;
  provider: string;
  createdAt: string;
  roles: { id: string; roleName: string; permissions: { name: string }[] }[];
}

interface RoleResponse {
  id: string;
  roleName: string;
  description: string;
}

export default function AdminUserDetailPage() {
  const { user } = useAuth();
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();
  
  const [targetUser, setTargetUser] = useState<UserResponse | null>(null);
  const [roles, setRoles] = useState<RoleResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    
    async function loadData() {
      try {
        const [userRes, rolesRes] = await Promise.all([
          apiClient.get(\`/admin/users/\${id}\`),
          apiClient.get('/admin/roles')
        ]);
        setTargetUser(userRes.data?.data);
        setRoles(rolesRes.data?.data?.content || []);
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

  if (!targetUser) {
    return (
      <div className="space-y-6">
        <Link href="/dashboard/admin/users" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Users
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">User Not Found</h1>
          <p className="mt-1 text-sm text-muted-foreground">The user you are looking for does not exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Link href="/dashboard/admin/users" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to Users
      </Link>
      
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">User Details</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Detailed information about {targetUser.name}.
          </p>
        </div>
        {/* Pass an empty string for accessToken since apiClient uses tokenStore */}
        <EditUserForm user={targetUser} accessToken="" />
      </div>

      <div className="rounded-xl border bg-card p-6">
        <dl className="grid gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Name</dt>
            <dd className="mt-1 text-sm font-medium">{targetUser.name}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Email</dt>
            <dd className="mt-1 text-sm font-medium">{targetUser.email}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Status</dt>
            <dd className="mt-1 text-sm font-medium">
              <span className={\`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold \${targetUser.enabled ? 'bg-green-500/10 text-green-600' : 'bg-red-500/10 text-red-600'}\`}>
                {targetUser.enabled ? "Active" : "Inactive"}
              </span>
            </dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Provider</dt>
            <dd className="mt-1 text-sm font-medium">{targetUser.provider || "LOCAL"}</dd>
          </div>
          <div className="sm:col-span-2 mt-4 pt-4 border-t">
            <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-4">Roles & Permissions</dt>
            <ManageUserRoles 
              userId={targetUser.id} 
              userRoles={targetUser.roles || []} 
              allRoles={roles} 
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
console.log('Fixed users/[id]/page.tsx');
