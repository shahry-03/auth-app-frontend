import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { EditUserForm } from "@/components/dashboard/admin/edit-user-form";
import { ManageUserRoles } from "@/components/dashboard/admin/manage-user-roles";

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

async function fetchUser(accessToken: string, userId: string): Promise<UserResponse | null> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1"}/admin/users/${userId}`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
        cache: "no-store",
      }
    );
    if (!res.ok) return null;
    const json = await res.json();
    return json.data as UserResponse;
  } catch {
    return null;
  }
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

export default async function AdminUserDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  if (!accessToken) redirect("/login");

  const resolvedParams = await params;
  const [user, roles] = await Promise.all([
    fetchUser(accessToken, resolvedParams.id),
    fetchRoles(accessToken)
  ]);

  if (!user) {
    return (
      <div className="space-y-6">
        <Link
          href="/dashboard/admin/users"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Users
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">User Not Found</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            The user you are looking for does not exist.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Link
        href="/dashboard/admin/users"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to Users
      </Link>
      
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">User Details</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Detailed information about {user.name}.
          </p>
        </div>
        <EditUserForm user={user} accessToken={accessToken} />
      </div>

      <div className="rounded-xl border bg-card p-6">
        <dl className="grid gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              ID
            </dt>
            <dd className="mt-1 text-sm font-medium font-mono">{user.id}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Name
            </dt>
            <dd className="mt-1 text-sm font-medium">{user.name}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Email
            </dt>
            <dd className="mt-1 text-sm font-medium">{user.email}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Status
            </dt>
            <dd className="mt-1 text-sm font-medium">
              <span
                className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                  user.enabled
                    ? "bg-green-500/10 text-green-600"
                    : "bg-red-500/10 text-red-600"
                }`}
              >
                {user.enabled ? "Active" : "Inactive"}
              </span>
            </dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Provider
            </dt>
            <dd className="mt-1 text-sm font-medium">{user.provider || "LOCAL"}</dd>
          </div>
          <div className="sm:col-span-2 mt-4 pt-4 border-t">
            <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-4">
              Roles & Permissions
            </dt>
            <ManageUserRoles 
              userId={user.id} 
              userRoles={user.roles || []} 
              allRoles={roles} 
              accessToken={accessToken} 
            />
          </div>
        </dl>
      </div>
    </div>
  );
}
