"use client";

import { useEffect, useState, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, XCircle, Loader2, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { AxiosError } from "axios";

import { Button } from "@/components/ui/button";
import { apiClient } from "@/lib/api-client";

const activeVerifications = new Map<string, Promise<any>>();

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const email = searchParams.get("email");
  
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("Verifying your email address...");
  const [isResending, setIsResending] = useState(false);

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("Verification token is missing from the URL.");
      return;
    }

    let mounted = true;

    const verifyToken = async () => {
      try {
        if (!activeVerifications.has(token)) {
          activeVerifications.set(token, apiClient.post("/auth/verify-email", { token }));
        }
        await activeVerifications.get(token);
        
        if (mounted) {
          setStatus("success");
          setMessage("Your email has been successfully verified!");
          toast.success("Email verified successfully");
          
          setTimeout(() => {
            if (mounted) router.push("/login");
          }, 2000);
        }
      } catch (err) {
        if (mounted) {
          activeVerifications.delete(token);
          const axiosError = err as AxiosError<{ message?: string }>;
          setStatus("error");
          setMessage(
            axiosError.response?.data?.message || 
            "The verification link is invalid or has expired."
          );
        }
      }
    };

    verifyToken();
    return () => { mounted = false; };
  }, [token, router]);

  const handleResend = async () => {
    if (!email) {
      toast.error("Email address is required to resend verification link.");
      return;
    }

    setIsResending(true);
    try {
      await apiClient.post("/auth/resend-verification", { email });
      toast.success("A new verification link has been sent to your email.");
    } catch (err) {
      const axiosError = err as AxiosError<{ message?: string }>;
      toast.error(
        axiosError.response?.data?.message || 
        "Failed to resend verification email."
      );
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="space-y-6 text-center">
      {status === "loading" && (
        <>
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
          <div className="space-y-2 text-left">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white text-center">Verifying email</h1>
            <p className="text-[15px] text-slate-500 text-center">{message}</p>
          </div>
        </>
      )}

      {status === "success" && (
        <>
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-green-600 shadow-lg shadow-green-500/20">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <div className="space-y-2 text-left">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white text-center">Email Verified!</h1>
            <p className="text-[15px] text-slate-500 text-center">{message}</p>
          </div>
          <Button onClick={() => router.push("/login")} className="h-12 w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-medium shadow-md shadow-blue-500/20 border-0 transition-all text-base mt-2">
            Continue to login
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </>
      )}

      {status === "error" && (
        <>
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-100 text-red-600 shadow-lg shadow-red-500/20">
            <XCircle className="h-6 w-6" />
          </div>
          <div className="space-y-2 text-left">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white text-center">Verification Failed</h1>
            <p className="text-[15px] text-slate-500 text-center">{message}</p>
          </div>
          <div className="space-y-3 pt-4">
            {email && (
              <Button
                onClick={handleResend}
                disabled={isResending}
                variant="outline"
                className="w-full h-12 text-base font-medium"
              >
                {isResending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                Resend verification email
              </Button>
            )}
            <Button onClick={() => router.push("/login")} variant={email ? "ghost" : "outline"} className="w-full h-12 text-base font-medium">
              Back to login
            </Button>
          </div>
        </>
      )}
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    }>
      <VerifyEmailContent />
    </Suspense>
  );
}
