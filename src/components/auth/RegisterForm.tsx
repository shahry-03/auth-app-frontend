"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, ArrowRight, CheckCircle2, XCircle, Mail, User } from "lucide-react";
import { toast } from "sonner";
import { AxiosError } from "axios";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "./PasswordInput";
import { OAuthButtons } from "./OAuthButtons";
import { apiClient } from "@/lib/api-client";
import { cn } from "@/lib/utils";

// ============================================================
//  Validation schema
// ============================================================
const registerSchema = z
  .object({
    name: z
      .string()
      .min(2, "Name must be at least 2 characters")
      .max(100, "Name is too long"),
    email: z.string().email("Please enter a valid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Must contain an uppercase letter")
      .regex(/[a-z]/, "Must contain a lowercase letter")
      .regex(/[0-9]/, "Must contain a number"),
    confirmPassword: z.string(),
    acceptTerms: z.boolean().refine((v) => v === true, {
      message: "You must accept the terms and conditions",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type RegisterInput = z.infer<typeof registerSchema>;

// ============================================================
//  Password strength calculator
// ============================================================
function getPasswordStrength(password: string): {
  score: number;
  label: string;
  color: string;
} {
  if (!password) return { score: 0, label: "", color: "" };

  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 2) return { score: 1, label: "Weak", color: "bg-red-500" };
  if (score <= 4) return { score: 2, label: "Fair", color: "bg-yellow-500" };
  return { score: 3, label: "Strong", color: "bg-green-500" };
}

// ============================================================
//  Component
// ============================================================
export function RegisterForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [passwordValue, setPasswordValue] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      acceptTerms: false,
    },
  });

  const strength = getPasswordStrength(passwordValue);

  const onSubmit = async (data: RegisterInput) => {
    setIsLoading(true);

    try {
      await apiClient.post("/auth/register", {
        name: data.name,
        email: data.email,
        password: data.password,
      });

      toast.success(
        "Account created! Please check your email to verify your account."
      );

      setTimeout(() => {
        router.push("/login");
      }, 1500);
    } catch (err) {
      const axiosError = err as AxiosError<{
        message?: string;
        error?: string;
      }>;

      if (axiosError.response?.data?.message) {
        toast.error(axiosError.response.data.message);
      } else if (axiosError.code === "ERR_NETWORK") {
        toast.error("Cannot reach server. Is the backend running?");
      } else {
        toast.error("Registration failed. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const requirements = [
    { label: "At least 8 characters", met: passwordValue.length >= 8 },
    { label: "One uppercase letter", met: /[A-Z]/.test(passwordValue) },
    { label: "One lowercase letter", met: /[a-z]/.test(passwordValue) },
    { label: "One number", met: /[0-9]/.test(passwordValue) },
  ];

  return (
    <div className="space-y-7">
      {/* ─── Header ─── */}
      <div className="space-y-2 text-left">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          Create an account
        </h1>
        <p className="text-[15px] text-slate-500">
          Get started with Universal Auth in seconds
        </p>
      </div>

      {/* ─── OAuth Buttons ─── */}
      <OAuthButtons />

      {/* ─── Divider ─── */}
      <div className="relative py-2">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-slate-200 dark:border-slate-800" />
        </div>
        <div className="relative flex justify-center text-[11px] font-bold tracking-widest uppercase">
          <span className="bg-background px-4 text-slate-400">
            OR SIGN UP WITH EMAIL
          </span>
        </div>
      </div>

      {/* ─── Form ─── */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Name */}
        <div className="space-y-2">
          <Label htmlFor="name" className="text-[13px] font-semibold text-slate-700 dark:text-slate-300">Full Name</Label>
          <div className="relative">
            <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              <User className="h-4 w-4" />
            </div>
            <Input
              id="name"
              type="text"
              placeholder="John Doe"
              autoComplete="name"
              autoFocus
              disabled={isLoading}
              className="pl-9 h-11 border-slate-200 dark:border-slate-800 shadow-sm"
              {...register("name")}
            />
          </div>
          {errors.name && (
            <p className="text-xs text-destructive mt-1 font-medium">{errors.name.message}</p>
          )}
        </div>

        {/* Email */}
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
              disabled={isLoading}
              className="pl-9 h-11 border-slate-200 dark:border-slate-800 shadow-sm"
              {...register("email")}
            />
          </div>
          {errors.email && (
            <p className="text-xs text-destructive mt-1 font-medium">{errors.email.message}</p>
          )}
        </div>

        {/* Password */}
        <div className="space-y-2">
          <Label htmlFor="password" className="text-[13px] font-semibold text-slate-700 dark:text-slate-300">Password</Label>
          <PasswordInput
            id="password"
            placeholder="••••••••"
            autoComplete="new-password"
            disabled={isLoading}
            className="h-11 border-slate-200 dark:border-slate-800 shadow-sm"
            {...register("password", {
              onChange: (e) => setPasswordValue(e.target.value),
            })}
          />

          {/* Strength indicator */}
          {passwordValue && (
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-2">
                <div className="flex h-1.5 flex-1 gap-1">
                  {[1, 2, 3].map((level) => (
                    <div
                      key={level}
                      className={cn(
                        "h-full flex-1 rounded-full transition-colors",
                        level <= strength.score ? strength.color : "bg-slate-200 dark:bg-slate-800"
                      )}
                    />
                  ))}
                </div>
                <span
                  className={cn(
                    "text-xs font-semibold uppercase tracking-wider",
                    strength.score === 1 && "text-red-500",
                    strength.score === 2 && "text-yellow-500",
                    strength.score === 3 && "text-green-500"
                  )}
                >
                  {strength.label}
                </span>
              </div>

              <ul className="grid grid-cols-2 gap-2 text-xs">
                {requirements.map((req) => (
                  <li
                    key={req.label}
                    className={cn(
                      "flex items-center gap-1.5 font-medium",
                      req.met ? "text-green-600 dark:text-green-500" : "text-slate-400"
                    )}
                  >
                    {req.met ? (
                      <CheckCircle2 className="h-3.5 w-3.5" />
                    ) : (
                      <XCircle className="h-3.5 w-3.5 opacity-50" />
                    )}
                    {req.label}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {errors.password && (
            <p className="text-xs text-destructive mt-1 font-medium">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Confirm Password */}
        <div className="space-y-2">
          <Label htmlFor="confirmPassword" className="text-[13px] font-semibold text-slate-700 dark:text-slate-300">Confirm Password</Label>
          <PasswordInput
            id="confirmPassword"
            placeholder="••••••••"
            autoComplete="new-password"
            disabled={isLoading}
            className="h-11 border-slate-200 dark:border-slate-800 shadow-sm"
            {...register("confirmPassword")}
          />
          {errors.confirmPassword && (
            <p className="text-xs text-destructive mt-1 font-medium">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        {/* Terms */}
        <div className="space-y-2 pt-1">
          <label className="flex items-start gap-2 text-[13px] text-slate-500 font-medium">
            <input
              type="checkbox"
              disabled={isLoading}
              className="mt-0.5 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-600 dark:border-slate-700 dark:bg-slate-900"
              {...register("acceptTerms")}
            />
            <span>
              I agree to the{" "}
              <Link href="#" className="text-slate-900 dark:text-white underline hover:text-blue-600 transition-colors">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="#" className="text-slate-900 dark:text-white underline hover:text-blue-600 transition-colors">
                Privacy Policy
              </Link>
            </span>
          </label>
          {errors.acceptTerms && (
            <p className="text-xs text-destructive mt-1 font-medium">
              {errors.acceptTerms.message}
            </p>
          )}
        </div>

        {/* Submit */}
        <Button type="submit" className="h-12 w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-medium shadow-md shadow-blue-500/20 border-0 transition-all text-base mt-2" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Creating account...
            </>
          ) : (
            <>
              Create account
              <ArrowRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </form>

      {/* ─── Footer ─── */}
      <p className="text-center text-[14.5px] text-slate-500 pt-2">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}
