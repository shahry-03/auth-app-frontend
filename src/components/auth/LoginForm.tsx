"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Loader2,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  KeyRound,
  Mail,
} from "lucide-react";
import { toast } from "sonner";
import { AxiosError } from "axios";
import Cookies from "js-cookie";
import { tokenStore } from "@/lib/auth/token-store";
import { clearAuthCache } from "@/hooks/useAuth";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "./PasswordInput";
import { OAuthButtons } from "./OAuthButtons";
import { apiClient } from "@/lib/api-client";
import { cn } from "@/lib/utils";

// ============================================================
//  Validation schemas
// ============================================================
const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

const twoFactorSchema = z.object({
  code: z
    .string()
    .min(6, "Code must be at least 6 characters")
    .max(14, "Code too long")
    .refine(
      (val) => {
        const isTOTP = /^\d{6}$/.test(val);
        const isBackupCode = /^[A-Z0-9-]{6,14}$/.test(val);
        return isTOTP || isBackupCode;
      },
      { message: "Enter a valid code" }
    ),
});

type LoginInput = z.infer<typeof loginSchema>;
type TwoFactorInput = z.infer<typeof twoFactorSchema>;

// ============================================================
//  Response types
// ============================================================
interface LoginSuccessResponse {
  success: true;
  message: string;
  data: {
    accessToken: string;
    refreshToken: string;
    tokenType: string;
    expiresIn: number;
    user: Record<string, unknown>;
  };
}

interface LoginTwoFactorRequired {
  success: true;
  message: string;
  data: {
    requiresTwoFactor?: boolean;
    twoFactorRequired?: boolean;
    tempToken?: string;
    temporaryToken?: string;
    user?: Record<string, unknown>;
  };
}

interface LoginErrorResponse {
  status: number;
  error: string;
  message: string;
}

type LoginResponse = LoginSuccessResponse | LoginTwoFactorRequired;

// ============================================================
//  Component
// ============================================================
export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

  const [step, setStep] = useState<"credentials" | "2fa">("credentials");
  const [isLoading, setIsLoading] = useState(false);
  const [tempToken, setTempToken] = useState<string | null>(null);
  const [useBackupCode, setUseBackupCode] = useState(false);
  const [unverifiedEmail, setUnverifiedEmail] = useState<string | null>(null);
  const [isResending, setIsResending] = useState(false);

  // ─── Step 1: credentials form ───
  const credentialsForm = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  // ─── Step 2: 2FA form ───
  const twoFactorForm = useForm<TwoFactorInput>({
    resolver: zodResolver(twoFactorSchema),
    defaultValues: { code: "" },
  });

  // ═══════════════════════════════════════════════════════════
  //  Helper: Save tokens and redirect
  // ═══════════════════════════════════════════════════════════
  const completeLogin = (
    accessToken: string,
    user: Record<string, unknown>
  ) => {
    clearAuthCache();
    tokenStore.set(accessToken);
    localStorage.setItem("user", JSON.stringify(user));

    toast.success("Welcome back!");
    router.push(callbackUrl);
    router.refresh();
  };

  // ═══════════════════════════════════════════════════════════
  //  Step 1: Submit credentials
  // ═══════════════════════════════════════════════════════════
  const onCredentialsSubmit = async (data: LoginInput) => {
    setIsLoading(true);
    setUnverifiedEmail(null); // Clear previous error

    try {
      const response = await apiClient.post<LoginResponse>(
        "/auth/login",
        data
      );

      const responseData = response.data.data;

      // ─── Case A: 2FA required ───
      const is2FARequired =
        "requiresTwoFactor" in responseData
          ? responseData.requiresTwoFactor
          : "twoFactorRequired" in responseData
            ? responseData.twoFactorRequired
            : false;

      const temp =
        "tempToken" in responseData
          ? responseData.tempToken
          : "temporaryToken" in responseData
            ? responseData.temporaryToken
            : null;

      if (is2FARequired || temp) {
        if (!temp) {
          toast.error("2FA required but no temporary token received");
          return;
        }
        setTempToken(temp);
        setStep("2fa");
        return;
      }

      // ─── Case B: Normal login (no 2FA) ───
      if ("accessToken" in responseData && responseData.accessToken) {
        const user = "user" in responseData ? responseData.user : {};
        completeLogin(responseData.accessToken, user as Record<string, unknown>);
        return;
      }

      toast.error("Unexpected server response. Please try again.");
    } catch (err) {
      const axiosError = err as AxiosError<LoginErrorResponse>;
      const message = axiosError.response?.data?.message || "";
      const errorField = axiosError.response?.data?.error || "";
      const status = axiosError.response?.status;

      // Detect unverified email
      const isUnverified =
        errorField.toLowerCase().includes("not verified") ||
        message.toLowerCase().includes("verify your email") ||
        status === 403;

      if (isUnverified) {
        setUnverifiedEmail(data.email);
      } else {
        setUnverifiedEmail(null);
      }

      if (message) {
        toast.error(message);
      } else if (axiosError.code === "ERR_NETWORK") {
        toast.error("Cannot reach server. Is the backend running?");
      } else {
        toast.error("Login failed. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // ═══════════════════════════════════════════════════════════
  //  Step 2: Submit 2FA code (TOTP or backup code)
  // ═══════════════════════════════════════════════════════════
  const onTwoFactorSubmit = async (data: TwoFactorInput) => {
    if (!tempToken) {
      toast.error("Session expired. Please login again.");
      setStep("credentials");
      return;
    }

    setIsLoading(true);

    try {
      const response = await apiClient.post<LoginSuccessResponse>(
        "/auth/2fa/verify",
        {
          tempToken,
          code: data.code,
        }
      );

      const { accessToken, user } = response.data.data;

      if (!accessToken) {
        toast.error("2FA verification failed. Please try again.");
        return;
      }

      completeLogin(accessToken, user);
    } catch (err) {
      const axiosError = err as AxiosError<LoginErrorResponse>;
      if (axiosError.response?.data?.message) {
        toast.error(axiosError.response.data.message);
      } else if (axiosError.code === "ERR_NETWORK") {
        toast.error("Cannot reach server. Is the backend running?");
      } else {
        toast.error(
          useBackupCode
            ? "Invalid backup code. Please try again."
            : "Invalid 2FA code. Please try again."
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  // ═══════════════════════════════════════════════════════════
  //  Resend verification email
  // ═══════════════════════════════════════════════════════════
  const handleResendVerification = async () => {
    if (!unverifiedEmail) return;

    setIsResending(true);
    try {
      await apiClient.post("/auth/resend-verification", {
        email: unverifiedEmail,
      });
      toast.success("Verification email sent! Check your inbox.");
    } catch (err) {
      const axiosError = err as AxiosError<{ message?: string }>;
      toast.error(
        axiosError.response?.data?.message ||
          "Failed to resend verification email"
      );
    } finally {
      setIsResending(false);
    }
  };

  // ═══════════════════════════════════════════════════════════
  //  Render: Step 2 — 2FA verification
  // ═══════════════════════════════════════════════════════════
  if (step === "2fa") {
    return (
      <div className="space-y-6">
        {/* ─── Header ─── */}
        <div className="space-y-3 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-indigo-600 text-white shadow-lg shadow-indigo-600/20">
            {useBackupCode ? (
              <KeyRound className="h-6 w-6" />
            ) : (
              <ShieldCheck className="h-6 w-6" />
            )}
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            {useBackupCode ? "Backup Code" : "Two-Factor Auth"}
          </h1>
          <p className="text-[15px] text-slate-500">
            {useBackupCode
              ? "Enter one of the backup codes you saved during 2FA setup."
              : "Enter the 6-digit code from your authenticator app."}
          </p>
        </div>

        {/* ─── Form ─── */}
        <form
          onSubmit={twoFactorForm.handleSubmit(onTwoFactorSubmit)}
          className="space-y-5"
        >
          <div className="space-y-2">
            <Label htmlFor="code" className="text-[13px] font-semibold text-slate-700 dark:text-slate-300">
              {useBackupCode ? "BACKUP CODE" : "VERIFICATION CODE"}
            </Label>
            <Input
              id="code"
              type="text"
              inputMode={useBackupCode ? "text" : "numeric"}
              autoComplete="one-time-code"
              placeholder={useBackupCode ? "XXXX-XXXX-XXXX" : "000000"}
              maxLength={useBackupCode ? 14 : 6}
              autoFocus
              disabled={isLoading}
              {...twoFactorForm.register("code", {
                onChange: (e) => {
                  if (useBackupCode) {
                    e.target.value = e.target.value
                      .replace(/[^A-Za-z0-9-]/g, "")
                      .toUpperCase();
                  } else {
                    e.target.value = e.target.value.replace(/\D/g, "");
                  }
                },
              })}
              className={cn(
                "h-12 text-center font-mono border-slate-200 dark:border-slate-800 shadow-sm",
                useBackupCode
                  ? "text-base tracking-[0.2em]"
                  : "text-xl tracking-[0.4em]"
              )}
            />
            {twoFactorForm.formState.errors.code && (
              <p className="text-xs text-destructive mt-1 font-medium">
                {twoFactorForm.formState.errors.code.message}
              </p>
            )}
          </div>

          <Button type="submit" className="h-12 w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-medium shadow-md shadow-blue-500/20 border-0 transition-all text-base" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Verifying...
              </>
            ) : (
              <>
                Verify code
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </form>

        {/* ─── Toggle link ─── */}
        <button
          type="button"
          onClick={() => {
            setUseBackupCode((v) => !v);
            twoFactorForm.reset();
          }}
          className="flex w-full items-center justify-center text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors"
        >
          {useBackupCode
            ? "Use authenticator app instead"
            : "Can't access your app? Use a backup code"}
        </button>

        {/* ─── Back to login ─── */}
        <button
          type="button"
          onClick={() => {
            setStep("credentials");
            setTempToken(null);
            setUseBackupCode(false);
            twoFactorForm.reset();
          }}
          className="flex w-full items-center justify-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to login
        </button>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════
  //  Render: Step 1 — credentials
  // ═══════════════════════════════════════════════════════════
  return (
    <div className="space-y-7">
      <div className="space-y-2 text-left">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Welcome back</h1>
        <p className="text-[15px] text-slate-500">
          Sign in to your account to continue
        </p>
      </div>

      <OAuthButtons />

      <div className="relative py-2">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-slate-200 dark:border-slate-800" />
        </div>
        <div className="relative flex justify-center text-[11px] font-bold tracking-widest uppercase">
          <span className="bg-background px-4 text-slate-400">
            OR CONTINUE WITH EMAIL
          </span>
        </div>
      </div>

      <form
        onSubmit={credentialsForm.handleSubmit(onCredentialsSubmit)}
        className="space-y-5"
      >
        <div className="space-y-2">
          <Label htmlFor="email" className="text-[13px] font-semibold text-slate-700 dark:text-slate-300">Email</Label>
          <div className="relative">
            <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              <Mail className="h-4 w-4" />
            </div>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              autoFocus
              disabled={isLoading}
              className="pl-9 h-11 border-slate-200 dark:border-slate-800 shadow-sm"
              {...credentialsForm.register("email")}
            />
          </div>
          {credentialsForm.formState.errors.email && (
            <p className="text-xs text-destructive mt-1 font-medium">
              {credentialsForm.formState.errors.email.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password" className="text-[13px] font-semibold text-slate-700 dark:text-slate-300">Password</Label>
            <Link
              href="/forgot-password"
              className="text-[13px] font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
            >
              Forgot password?
            </Link>
          </div>
          <PasswordInput
            id="password"
            placeholder="Enter your password"
            autoComplete="current-password"
            disabled={isLoading}
            className="h-11 border-slate-200 dark:border-slate-800 shadow-sm"
            {...credentialsForm.register("password")}
          />
          {credentialsForm.formState.errors.password && (
            <p className="text-xs text-destructive mt-1 font-medium">
              {credentialsForm.formState.errors.password.message}
            </p>
          )}
        </div>

        <Button type="submit" className="h-12 w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-medium shadow-md shadow-blue-500/20 border-0 transition-all text-base mt-2" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Signing in...
            </>
          ) : (
            <>
              Sign in
              <ArrowRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </form>

      {/* ═══════════════════════════════════════════════════════════
          Unverified email alert — appears after failed login attempt
          ═══════════════════════════════════════════════════════════ */}
      {unverifiedEmail && (
        <div className="flex items-start gap-3 rounded-lg border border-orange-500/20 bg-orange-500/5 p-4">
          <div className="flex-1 space-y-3">
            <div className="flex items-start gap-2">
              <Mail className="mt-0.5 h-4 w-4 shrink-0 text-orange-600" />
              <div>
                <p className="text-sm font-medium text-orange-900 dark:text-orange-200">
                  Email not verified
                </p>
                <p className="mt-1 text-xs text-orange-700 dark:text-orange-300 leading-relaxed">
                  We sent a verification link to{" "}
                  <span className="font-medium">{unverifiedEmail}</span>.
                  Didn&apos;t receive it? Check your spam folder or resend.
                </p>
              </div>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleResendVerification}
              disabled={isResending}
              className="h-8 border-orange-500/30 text-xs text-orange-700 hover:bg-orange-500/10 hover:text-orange-900 dark:text-orange-300 dark:hover:text-orange-100"
            >
              {isResending ? (
                <>
                  <Loader2 className="mr-1.5 h-3 w-3 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Mail className="mr-1.5 h-3 w-3" />
                  Resend verification email
                </>
              )}
            </Button>
          </div>
        </div>
      )}

      <p className="text-center text-[14.5px] text-slate-500 pt-2">
        Don&apos;t have an account?{" "}
        <Link
          href="/register"
          className="font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
        >
          Sign up
        </Link>
      </p>
    </div>
  );
}
