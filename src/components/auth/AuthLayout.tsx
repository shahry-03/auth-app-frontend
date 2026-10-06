import { Shield, Key, Sparkles, Lock, ArrowRight, Users, Leaf, ShieldCheck } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { ThemeToggle } from "@/components/theme-toggle";

interface AuthLayoutProps {
  children: ReactNode;
}

const features = [
  {
    icon: Shield,
    title: "JWT Authentication",
    description: "Secure access with JWT tokens and refresh token rotation.",
    iconColor: "text-blue-400",
    iconBg: "bg-blue-500/10",
  },
  {
    icon: Users,
    title: "OAuth2 & 2FA",
    description: "Google, GitHub, and TOTP support for enhanced security.",
    iconColor: "text-purple-400",
    iconBg: "bg-purple-500/10",
  },
  {
    icon: Lock,
    title: "Account Protection",
    description: "Rate limiting, account lockout and secure sessions.",
    iconColor: "text-emerald-400",
    iconBg: "bg-emerald-500/10",
  },
  {
    icon: ShieldCheck,
    title: "Role-Based Access",
    description: "Granular permissions and role management.",
    iconColor: "text-amber-400",
    iconBg: "bg-amber-500/10",
  },
];

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen font-sans">
      {/* ─── Left: Branding ─── */}
      <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-[#0A0F1C] p-12 text-white lg:flex">
        {/* Deep background mesh gradients */}
        <div className="pointer-events-none absolute -top-[20%] -right-[10%] h-[700px] w-[700px] rounded-full bg-indigo-600/20 blur-[120px]" />
        <div className="pointer-events-none absolute top-[20%] -left-[10%] h-[600px] w-[600px] rounded-full bg-blue-600/10 blur-[100px]" />
        
        {/* Header / Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/20">
            <Shield className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-semibold tracking-tight">
            Universal <span className="text-blue-400">Auth</span>
          </span>
        </div>

        {/* Content */}
        <div className="relative z-10 -mt-12 space-y-10">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-slate-300 backdrop-blur-md">
              <Leaf className="h-3.5 w-3.5 text-emerald-400" />
              Spring Boot Authentication Template
            </div>
            <h1 className="text-5xl font-bold leading-[1.1] tracking-tight">
              Production-ready <br />
              <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">
                authentication for
              </span>{" "}
              <br />
              Spring Boot applications
            </h1>
            <p className="max-w-lg text-lg text-slate-400 leading-relaxed">
              A reusable authentication system with JWT, OAuth2, refresh tokens, 
              2FA, role-based access, and account protection.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 max-w-2xl">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="group relative flex cursor-pointer flex-col justify-between overflow-hidden rounded-2xl border border-white/5 bg-[#111827]/40 p-5 transition-all hover:bg-white/[0.03] hover:border-white/10"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${feature.iconBg}`}>
                      <Icon className={`h-5 w-5 ${feature.iconColor}`} />
                    </div>
                    <ArrowRight className="h-4 w-4 text-slate-600 transition-colors group-hover:text-slate-300" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-slate-100">{feature.title}</h3>
                    <p className="mt-1 text-[13px] text-slate-400 leading-snug">
                      {feature.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-10 flex items-center gap-2 text-[13px] text-slate-500 font-medium">
          <Leaf className="h-4 w-4 text-emerald-500" />
          <span>Built with Spring Boot & Next.js</span>
          <span className="mx-2">•</span>
          <span>2025</span>
        </div>
      </div>

      {/* ─── Right: Form ─── */}
      <div className="relative flex w-full flex-col items-center justify-center bg-background p-6 lg:w-1/2">
        {/* Subtle background glow on right side */}
        <div className="pointer-events-none absolute top-0 right-0 h-[500px] w-[500px] rounded-full bg-blue-500/5 blur-[100px] dark:bg-blue-500/10" />
        
        <div className="absolute top-4 right-4 md:top-8 md:right-8 z-10">
          <div className="rounded-full border bg-card/50 p-1 shadow-sm backdrop-blur-md">
            <ThemeToggle />
          </div>
        </div>
        
        <div className="w-full max-w-[420px] relative z-10">{children}</div>
      </div>
    </div>
  );
}
