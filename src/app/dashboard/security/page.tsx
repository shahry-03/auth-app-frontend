import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { TwoFactorCard } from "@/components/dashboard/security/two-factor-card";
import { ChangePasswordCard } from "@/components/dashboard/security/change-password-card";

export const metadata = {
  title: "Security",
};

interface BackendUser {
  provider: string;
}

async function fetchCurrentUser(
  accessToken: string
): Promise<BackendUser | null> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1"}/users/me`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
        cache: "no-store",
      }
    );
    if (!res.ok) return null;
    const json = await res.json();
    return json.data as BackendUser;
  } catch {
    return null;
  }
}

export default async function SecurityPage() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  if (!accessToken) redirect("/login");

  const user = await fetchCurrentUser(accessToken);
  if (!user) redirect("/login");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Security</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage your account security and authentication methods.
        </p>
      </div>

      <div className="space-y-4">
        <TwoFactorCard />
        {user.provider === "LOCAL" && <ChangePasswordCard />}
      </div>
    </div>
  );
}