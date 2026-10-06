"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { QRCodeSVG } from "qrcode.react";
import {
  Shield,
  Loader2,
  Copy,
  Check,
  ArrowLeft,
  AlertTriangle,
} from "lucide-react";
import { toast } from "sonner";
import { AxiosError } from "axios";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { apiClient } from "@/lib/api-client";

// ============================================================
//  Backend response — updated to match actual fields
// ============================================================
interface SetupResponse {
  secret: string;
  qrCodeDataUri: string; // base64 PNG (not used — we render fresh SVG)
  otpAuthUrl: string; // otpauth:// URL for authenticator apps
}

type Mode = "enable" | "disable";

// ============================================================
//  Main component
// ============================================================
export function TwoFactorSetup() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const mode: Mode =
    searchParams.get("mode") === "disable" ? "disable" : "enable";

  const [step, setStep] = useState<"loading" | "qr" | "disable">(
    mode === "disable" ? "disable" : "loading"
  );
  const [setupData, setSetupData] = useState<SetupResponse | null>(null);
  const [code, setCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);

  // ─── Initial load ───
  useEffect(() => {
    if (mode === "disable") {
      return;
    }

    let cancelled = false;
    const load = async () => {
      try {
        const res = await apiClient.post<{ data: SetupResponse }>(
          "/auth/2fa/setup"
        );
        if (!cancelled) {
          setSetupData(res.data.data);
          setStep("qr");
        }
      } catch (err) {
        if (cancelled) return;
        const axiosError = err as AxiosError<{ message?: string }>;
        toast.error(
          axiosError.response?.data?.message ||
            "Failed to initialize 2FA setup"
        );
        router.push("/dashboard/security");
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [mode, router]);

  const handleCopySecret = () => {
    if (!setupData?.secret) return;
    navigator.clipboard.writeText(setupData.secret);
    setCopied(true);
    toast.success("Secret copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length !== 6) {
      toast.error("Please enter a 6-digit code");
      return;
    }
    setIsSubmitting(true);
    try {
      await apiClient.post("/auth/2fa/enable", { code });
      toast.success("Two-factor authentication enabled!");
      router.push("/dashboard/security");
      router.refresh();
    } catch (err) {
      const axiosError = err as AxiosError<{ message?: string }>;
      toast.error(
        axiosError.response?.data?.message ||
          "Invalid code. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDisable = async (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length !== 6) {
      toast.error("Please enter a 6-digit code");
      return;
    }
    setIsSubmitting(true);
    try {
      await apiClient.post("/auth/2fa/disable", { code });
      toast.success("Two-factor authentication disabled");
      router.push("/dashboard/security");
      router.refresh();
    } catch (err) {
      const axiosError = err as AxiosError<{ message?: string }>;
      toast.error(
        axiosError.response?.data?.message ||
          "Invalid code. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // ─── Loading ───
  if (step === "loading") {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  // ─── Disable mode ───
  if (step === "disable") {
    return (
      <div className="mx-auto max-w-md space-y-6">
        <Link
          href="/dashboard/security"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to security
        </Link>

        <div className="space-y-3 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10">
            <AlertTriangle className="h-7 w-7 text-destructive" />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Disable Two-Factor Authentication
          </h1>
          <p className="text-sm text-muted-foreground">
            This will reduce your account security. Enter the 6-digit code from
            your authenticator app to confirm.
          </p>
        </div>

        <form onSubmit={handleDisable} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="disable-code">Verification Code</Label>
            <Input
              id="disable-code"
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={6}
              placeholder="000000"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
              className="text-center font-mono text-lg tracking-[0.4em]"
              autoFocus
              disabled={isSubmitting}
            />
          </div>

          <Button
            type="submit"
            variant="destructive"
            className="w-full"
            disabled={isSubmitting || code.length !== 6}
          >
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Disable 2FA
          </Button>
        </form>
      </div>
    );
  }

  // ─── QR + Verify (Enable mode) ───
  return (
    <div className="mx-auto max-w-lg space-y-6">
      <Link
        href="/dashboard/security"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to security
      </Link>

      <div className="space-y-2 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-foreground text-background">
          <Shield className="h-7 w-7" />
        </div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Set up Two-Factor Authentication
        </h1>
        <p className="text-sm text-muted-foreground">
          Scan the QR code with your authenticator app
        </p>
      </div>

      {/* QR + Secret card */}
      <div className="rounded-xl border bg-card p-6">
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
          {/* QR code — rendered from otpAuthUrl */}
          <div className="shrink-0 rounded-lg border bg-white p-3">
            {setupData?.otpAuthUrl ? (
              <QRCodeSVG
                value={setupData.otpAuthUrl}
                size={180}
                level="M"
                includeMargin={false}
              />
            ) : (
              <div className="flex h-[180px] w-[180px] items-center justify-center text-xs text-muted-foreground">
                No QR available
              </div>
            )}
          </div>

          {/* Instructions */}
          <div className="flex-1 space-y-4">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Can&apos;t scan?
              </p>
              <p className="mt-1 text-sm">Manually enter this secret key:</p>
            </div>

            <div className="flex items-center gap-2 rounded-lg border bg-muted/40 p-3">
              <code className="flex-1 break-all font-mono text-xs">
                {setupData?.secret}
              </code>
              <Button
                type="button"
                size="sm"
                variant="ghost"
                onClick={handleCopySecret}
                className="shrink-0"
              >
                {copied ? (
                  <Check className="h-3.5 w-3.5 text-green-600" />
                ) : (
                  <Copy className="h-3.5 w-3.5" />
                )}
              </Button>
            </div>

            <p className="text-xs text-muted-foreground">
              Use Google Authenticator, Authy, or 1Password.
            </p>
          </div>
        </div>
      </div>

      {/* Verify form */}
      <form onSubmit={handleVerify} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="verify-code">
            Enter the 6-digit code from your app
          </Label>
          <Input
            id="verify-code"
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={6}
            placeholder="000000"
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
            className="text-center font-mono text-lg tracking-[0.4em]"
            autoFocus
            disabled={isSubmitting}
          />
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={isSubmitting || code.length !== 6}
        >
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Verify & Enable
        </Button>
      </form>
    </div>
  );
}