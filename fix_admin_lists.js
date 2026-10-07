const fs = require('fs');

function rewritePage(file, entityName, endpoint, componentName, propName) {
  const newCode = `"use client";

import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";
import { ${componentName} } from "@/components/dashboard/admin/${componentName.toLowerCase().replace('table', '-table').replace('list', '-list')}";
import { apiClient } from "@/lib/api-client";

export default function Admin${entityName}Page() {
  const { user } = useAuth();
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    apiClient.get('${endpoint}')
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
        <h1 className="text-3xl font-bold tracking-tight">${entityName}</h1>
        <p className="mt-1 text-sm text-muted-foreground">Manage system ${entityName.toLowerCase()}.</p>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-8"><Loader2 className="h-6 w-6 animate-spin text-blue-500" /></div>
      ) : (
        <${componentName} ${propName}={data} accessToken="" />
      )}
    </div>
  );
}
`;
  fs.writeFileSync(file, newCode, 'utf8');
}

rewritePage('src/app/dashboard/admin/users/page.tsx', 'Users', '/admin/users', 'UsersTable', 'initialUsers');
rewritePage('src/app/dashboard/admin/roles/page.tsx', 'Roles', '/admin/roles', 'RolesTable', 'initialRoles');
rewritePage('src/app/dashboard/admin/permissions/page.tsx', 'Permissions', '/admin/permissions', 'PermissionsTable', 'initialPermissions');

console.log('Fixed admin list pages');
