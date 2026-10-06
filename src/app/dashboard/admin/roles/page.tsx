import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { RolesTable } from "@/components/dashboard/admin/roles-table";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface RoleResponse {
  id: string;
  roleName: string;
  description: string;
  permissions: { name: string; description: string }[];
}

interface PermissionResponse {
  id: string;
  name: string;
  description: string;
}

async function fetchRoles(accessToken: string): Promise<RoleResponse[]> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1"}/admin/roles`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
        cache: "no-store",
      }
    );
    if (!res.ok) return [];
    const json = await res.json();
    return json.data as RoleResponse[];
  } catch {
    return [];
  }
}

async function fetchPermissions(accessToken: string): Promise<PermissionResponse[]> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1"}/admin/permissions`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
        cache: "no-store",
      }
    );
    if (!res.ok) return [];
    const json = await res.json();
    return json.data as PermissionResponse[];
  } catch {
    return [];
  }
}

export default async function AdminRolesPage() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  if (!accessToken) redirect("/login");

  const [roles, permissions] = await Promise.all([
    fetchRoles(accessToken),
    fetchPermissions(accessToken)
  ]);

  return (
    <div className="space-y-6">
      <Link
        href="/dashboard/admin"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to Admin Dashboard
      </Link>
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Roles</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          A list of all roles in the system.
        </p>
      </div>

      <RolesTable initialRoles={roles} accessToken={accessToken} allPermissions={permissions} />
    </div>
  );
}
