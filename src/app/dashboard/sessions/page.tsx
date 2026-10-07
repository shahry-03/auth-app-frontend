"use client";

import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { SessionsList, type Session } from "@/components/dashboard/sessions/sessions-list";
import { apiClient } from "@/lib/api-client";

export default function SessionsPage() {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    apiClient.get('/users/me/sessions')
      .then(res => setSessions(res.data?.data || []))
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, [user]);

  if (!user) return null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Active Sessions</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage devices that are currently signed into your account.
        </p>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-8"><Loader2 className="h-6 w-6 animate-spin text-blue-500" /></div>
      ) : (
        <SessionsList initialSessions={sessions} accessToken="" />
      )}
    </div>
  );
}
