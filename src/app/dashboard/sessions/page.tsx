import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import {
  SessionsList,
  type Session,
} from "@/components/dashboard/sessions/sessions-list";

export const metadata = {
  title: "Sessions",
};

async function fetchSessions(accessToken: string): Promise<Session[]> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1"}/users/me/sessions`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
        cache: "no-store",
      }
    );
    if (!res.ok) return [];
    const json = await res.json();
    return (json.data ?? []) as Session[];
  } catch {
    return [];
  }
}

export default async function SessionsPage() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  if (!accessToken) redirect("/login");

  const sessions = await fetchSessions(accessToken);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Active Sessions</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage devices that are currently signed into your account.
        </p>
      </div>

      <SessionsList initialSessions={sessions} />
    </div>
  );
}
