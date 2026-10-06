import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { EditRoleForm } from "@/components/dashboard/admin/edit-role-form";

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

async function fetchRole(accessToken: string, roleId: string): Promise<RoleResponse | null> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1"}/admin/roles/${roleId}`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
        cache: "no-store",
      }
    );
    if (!res.ok) return null;
    const json = await res.json();
    return json.data as RoleResponse;
  } catch {
    return null;
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

export default async function AdminRoleDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  if (!accessToken) redirect("/login");

  const resolvedParams = await params;
  const [role, permissions] = await Promise.all([
    fetchRole(accessToken, resolvedParams.id),
    fetchPermissions(accessToken)
  ]);

  if (!role) {
    return (
      <div className="space-y-6">
        <Link
          href="/dashboard/admin/roles"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Roles
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Role Not Found</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            The role you are looking for does not exist.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Link
        href="/dashboard/admin/roles"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to Roles
      </Link>
      
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Role Details</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Detailed information about the {role.roleName} role.
          </p>
        </div>
        <EditRoleForm role={role} allPermissions={permissions} accessToken={accessToken} />
      </div>

      <div className="rounded-xl border bg-card p-6">
        <dl className="grid gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              ID
            </dt>
            <dd className="mt-1 text-sm font-medium font-mono">{role.id}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Name
            </dt>
            <dd className="mt-1 text-sm font-medium">{role.roleName}</dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Description
            </dt>
            <dd className="mt-1 text-sm font-medium">{role.description || "N/A"}</dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Assigned Permissions
            </dt>
            <dd className="mt-2 flex flex-wrap gap-2">
              {role.permissions?.length > 0 ? (
                role.permissions.map((p) => (
                  <span
                    key={p.name}
                    className="rounded bg-muted px-2 py-1 text-xs text-muted-foreground"
                  >
                    {p.name}
                  </span>
                ))
              ) : (
                <span className="text-sm text-muted-foreground">No permissions assigned.</span>
              )}
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
