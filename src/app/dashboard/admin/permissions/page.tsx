import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { PermissionsTable } from "@/components/dashboard/admin/permissions-table";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface PermissionResponse {
  id: string;
  name: string;
  description: string;
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

export default async function AdminPermissionsPage() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  if (!accessToken) redirect("/login");

  const permissions = await fetchPermissions(accessToken);

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
        <h1 className="text-3xl font-bold tracking-tight">Permissions</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          A list of all permissions in the system.
        </p>
      </div>

      <PermissionsTable initialPermissions={permissions} accessToken={accessToken} />
    </div>
  );
}
