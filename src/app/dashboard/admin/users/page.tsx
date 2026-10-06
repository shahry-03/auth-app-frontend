import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { UsersTable } from "@/components/dashboard/admin/users-table";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface UserResponse {
  id: string;
  email: string;
  name: string;
  enabled: boolean;
  provider: string;
  createdAt: string;
  roles: { roleName: string }[];
}

async function fetchUsers(accessToken: string): Promise<UserResponse[]> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1"}/admin/users`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
        cache: "no-store",
      }
    );
    if (!res.ok) return [];
    const json = await res.json();
    return json.data as UserResponse[];
  } catch {
    return [];
  }
}

export default async function AdminUsersPage() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  if (!accessToken) redirect("/login");

  const users = await fetchUsers(accessToken);

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
        <h1 className="text-3xl font-bold tracking-tight">Users</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          A list of all users in the system.
        </p>
      </div>

      <UsersTable initialUsers={users} accessToken={accessToken} />
    </div>
  );
}
