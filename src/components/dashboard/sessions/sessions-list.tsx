"use client";

import { useState } from "react";
import {
  Monitor,
  Smartphone,
  Tablet,
  Laptop,
  Loader2,
  Trash2,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";
import { AxiosError } from "axios";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { apiClient } from "@/lib/api-client";
import { formatRelativeTime, formatDate } from "@/lib/format-time";
import { parseUserAgent } from "@/lib/parse-user-agent";
import { cn } from "@/lib/utils";

export interface Session {
  id: string;
  createdAt: string;
  expiresAt: string;
  lastUsedAt: string;
  ipAddress: string | null;
  userAgent: string | null;
  current: boolean;
}

interface SessionsListProps {
  initialSessions: Session[];
}

function DeviceIcon({
  type,
  className,
}: {
  type: "desktop" | "mobile" | "tablet" | "unknown";
  className?: string;
}) {
  if (type === "mobile") return <Smartphone className={className} />;
  if (type === "tablet") return <Tablet className={className} />;
  if (type === "desktop") return <Laptop className={className} />;
  return <Monitor className={className} />;
}

export function SessionsList({ initialSessions }: SessionsListProps) {
  const [sessions, setSessions] = useState<Session[]>(initialSessions);
  const [revokingId, setRevokingId] = useState<string | null>(null);
  const [revokeAllOpen, setRevokeAllOpen] = useState(false);
  const [revokingAll, setRevokingAll] = useState(false);

  const handleRevoke = async (sessionId: string) => {
    setRevokingId(sessionId);
    try {
      await apiClient.delete(`/users/me/sessions/${sessionId}`);
      setSessions((prev) => prev.filter((s) => s.id !== sessionId));
      toast.success("Session revoked");
    } catch (err) {
      const axiosError = err as AxiosError<{ message?: string }>;
      toast.error(
        axiosError.response?.data?.message || "Failed to revoke session"
      );
    } finally {
      setRevokingId(null);
    }
  };

  const handleRevokeAll = async () => {
    setRevokingAll(true);
    try {
      await apiClient.delete("/users/me/sessions");
      setSessions((prev) => prev.filter((s) => s.current));
      toast.success("All other sessions have been revoked");
      setRevokeAllOpen(false);
    } catch (err) {
      const axiosError = err as AxiosError<{ message?: string }>;
      toast.error(
        axiosError.response?.data?.message || "Failed to revoke sessions"
      );
    } finally {
      setRevokingAll(false);
    }
  };

  const otherSessionsCount = sessions.filter((s) => !s.current).length;

  if (sessions.length === 0) {
    return (
      <div className="rounded-xl border bg-card p-12 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted">
          <Monitor className="h-6 w-6 text-muted-foreground" />
        </div>
        <h3 className="mt-4 font-semibold">No active sessions</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          You have no other devices signed into your account.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-3">
        {sessions.map((session) => {
          const device = parseUserAgent(session.userAgent);
          const isRevoking = revokingId === session.id;

          return (
            <div
              key={session.id}
              className={cn(
                "rounded-xl border bg-card transition-shadow hover:shadow-sm",
                session.current && "border-green-500/30"
              )}
            >
              <div className="flex items-start gap-4 p-5">
                <div
                  className={cn(
                    "flex h-11 w-11 shrink-0 items-center justify-center rounded-lg",
                    session.current
                      ? "bg-green-500/10 text-green-600"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  <DeviceIcon type={device.type} className="h-5 w-5" />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-medium">
                      {device.browser} on {device.os}
                    </span>
                    {session.current && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-green-500/10 px-2 py-0.5 text-xs font-medium text-green-600">
                        <CheckCircle2 className="h-3 w-3" />
                        Current
                      </span>
                    )}
                  </div>

                  <div className="mt-2 space-y-1 text-xs text-muted-foreground">
                    {session.ipAddress && (
                      <p>
                        <span className="font-medium text-foreground/70">
                          IP:
                        </span>{" "}
                        {session.ipAddress}
                      </p>
                    )}
                    <p>
                      <span className="font-medium text-foreground/70">
                        Started:
                      </span>{" "}
                      {formatDate(session.createdAt)}
                    </p>
                    <p>
                      <span className="font-medium text-foreground/70">
                        Last active:
                      </span>{" "}
                      {formatRelativeTime(session.lastUsedAt)}
                    </p>
                    <p>
                      <span className="font-medium text-foreground/70">
                        Expires:
                      </span>{" "}
                      {formatDate(session.expiresAt)}
                    </p>
                  </div>
                </div>

                {!session.current && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRevoke(session.id)}
                    disabled={isRevoking}
                    className="shrink-0 text-destructive hover:bg-destructive/10 hover:text-destructive"
                  >
                    {isRevoking ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        <Trash2 className="mr-1.5 h-3.5 w-3.5" />
                        Revoke
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {otherSessionsCount > 0 && (
        <div className="mt-6">
          <Button
            variant="outline"
            onClick={() => setRevokeAllOpen(true)}
            className="w-full sm:w-auto"
          >
            <AlertTriangle className="mr-2 h-4 w-4" />
            Sign out all other sessions ({otherSessionsCount})
          </Button>
        </div>
      )}

      <Dialog open={revokeAllOpen} onOpenChange={setRevokeAllOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Sign out all other sessions?</DialogTitle>
            <DialogDescription>
              This will sign you out of {otherSessionsCount}{" "}
              {otherSessionsCount === 1 ? "device" : "devices"} except this
              one. Those devices will need to sign in again.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setRevokeAllOpen(false)}
              disabled={revokingAll}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleRevokeAll}
              disabled={revokingAll}
            >
              {revokingAll ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing out...
                </>
              ) : (
                "Sign out all"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
