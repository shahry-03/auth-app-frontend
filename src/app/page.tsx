import Link from "next/link";
import {
  Shield,
  Key,
  Lock,
  Sparkles,
  ArrowRight,
  Zap,
  Database,
  CheckCircle2,
  Box,
  Layers,
  Terminal,
  Code2,
  Server,
  Activity
} from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/theme-toggle";

// ============================================================
//  Feature data
// ============================================================
const features = [
  {
    icon: Shield,
    title: "JWT Authentication",
    description: "Access & refresh token rotation with HS512 signing and secure cookie storage.",
    iconColor: "text-blue-500",
    iconBg: "bg-blue-500/10",
  },
  {
    icon: Key,
    title: "OAuth2 + 2FA",
    description: "Sign in with Google or GitHub. Enable TOTP-based two-factor authentication.",
    iconColor: "text-purple-500",
    iconBg: "bg-purple-500/10",
  },
  {
    icon: Lock,
    title: "Account Protection",
    description: "Rate limiting, account lockout, and failed login attempt tracking.",
    iconColor: "text-emerald-500",
    iconBg: "bg-emerald-500/10",
  },
  {
    icon: Sparkles,
    title: "Role-Based Access",
    description: "Granular permissions system with roles, permissions, and user assignments.",
    iconColor: "text-indigo-500",
    iconBg: "bg-indigo-500/10",
  },
  {
    icon: Database,
    title: "PostgreSQL / MySQL",
    description: "Flyway migrations, type-safe queries, and production-grade schema design.",
    iconColor: "text-blue-500",
    iconBg: "bg-blue-500/10",
  },
  {
    icon: Zap,
    title: "Email Verification",
    description: "Welcome, verification, and password reset emails with templated content.",
    iconColor: "text-amber-500",
    iconBg: "bg-amber-500/10",
  },
];

// ============================================================
//  Page
// ============================================================
export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col font-sans bg-[#FAFAFB] dark:bg-[#060913] text-slate-900 dark:text-slate-100 overflow-x-hidden selection:bg-indigo-500/30">
      {/* ─── Navbar ─── */}
      <header className="sticky top-0 z-50 w-full border-b border-slate-200/50 dark:border-white/5 bg-white/70 dark:bg-[#0A0F1C]/70 backdrop-blur-xl transition-all">
        <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-6 lg:px-8">
          <Link href="/" className="group flex items-center gap-3 font-semibold tracking-tight transition-opacity hover:opacity-90">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/20">
              <Shield className="h-4 w-4 text-white" />
            </div>
            <span className="text-[17px] text-slate-900 dark:text-white">
              Universal <span className="text-indigo-600 dark:text-indigo-400">Auth</span>
            </span>
          </Link>
          <nav className="flex items-center gap-6">
            <Link
              href="/playground"
              className="hidden text-[14px] font-medium text-slate-600 transition-colors hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 md:flex items-center gap-1.5"
            >
              <Terminal className="h-4 w-4" />
              API Playground
            </Link>
            <Link
              href="https://github.com/shahry-03/auth-app-backend"
              target="_blank"
              rel="noreferrer"
              className="hidden items-center gap-2 text-[14px] font-medium text-slate-600 transition-colors hover:text-slate-900 dark:text-slate-400 dark:hover:text-white md:flex"
            >
              <GithubIcon className="h-4 w-4" />
              GitHub
            </Link>
            <div className="h-4 w-px bg-slate-200 dark:bg-slate-800 hidden md:block" />
            <ThemeToggle />
            <Link 
              href="/login" 
              className="inline-flex h-9 items-center justify-center rounded-lg bg-slate-900 px-4 text-[14px] font-medium text-white shadow transition-colors hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-950 disabled:pointer-events-none disabled:opacity-50 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200 dark:focus-visible:ring-slate-300"
            >
              Sign in
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        {/* ─── Hero ─── */}
        <section className="relative overflow-hidden pt-24 pb-32 md:pt-32 md:pb-40">
          {/* Subtle background glow */}
          <div className="pointer-events-none absolute left-1/2 top-0 -z-10 -translate-x-1/2 transform-gpu blur-[120px]">
            <div className="aspect-[1155/678] w-[72.1875rem] bg-gradient-to-tr from-indigo-500/10 to-purple-500/20 opacity-40 dark:from-indigo-600/20 dark:to-purple-600/20 dark:opacity-50" style={{ clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)' }}></div>
          </div>

          <div className="mx-auto flex max-w-7xl flex-col items-center px-6 text-center lg:px-8">
            {/* Badge */}
            <div className="mb-8 inline-flex items-center gap-2.5 rounded-full border border-indigo-200/50 dark:border-indigo-500/20 bg-indigo-50 dark:bg-indigo-500/10 px-3.5 py-1.5 text-[13px] font-medium text-indigo-700 dark:text-indigo-300 backdrop-blur-md transition-all hover:bg-indigo-100 dark:hover:bg-indigo-500/20 shadow-sm shadow-indigo-500/5">
              <span className="flex h-2 w-2 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.8)]" />
              Production-ready · 41 REST APIs
            </div>

            {/* Heading */}
            <h1 className="max-w-4xl text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-6xl md:text-7xl lg:text-[80px] leading-[1.1]">
              Authentication that just{" "}
              <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent dark:from-blue-400 dark:via-indigo-400 dark:to-purple-400 pb-2">
                WORKS
              </span>
            </h1>

            {/* Subheading */}
            <p className="mx-auto mt-8 max-w-2xl text-[18px] leading-relaxed text-slate-600 dark:text-slate-400 sm:text-[20px]">
              A complete, production-grade authentication backend with JWT,
              OAuth2, 2FA, RBAC, rate limiting, and email verification. <br className="hidden sm:block" />
              <span className="font-medium text-slate-700 dark:text-slate-300">Built with Spring Boot 3 & Next.js 16.</span>
            </p>

            {/* CTAs */}
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-5">
              <Link
                href="/playground"
                className="group flex h-12 items-center justify-center gap-2 rounded-xl bg-slate-900 px-8 text-[15px] font-semibold text-white shadow-[0_0_40px_-10px_rgba(99,102,241,0.5)] transition-all hover:bg-slate-800 hover:shadow-[0_0_40px_-5px_rgba(99,102,241,0.7)] hover:-translate-y-0.5 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 sm:w-auto w-full"
              >
                Try the API Playground
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="https://github.com/shahry-03/auth-app-backend"
                target="_blank"
                rel="noreferrer"
                className="group flex h-12 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-8 text-[15px] font-semibold text-slate-700 shadow-sm transition-all hover:bg-slate-50 hover:text-slate-900 hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900/50 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white dark:hover:border-slate-700 sm:w-auto w-full"
              >
                <GithubIcon className="h-[18px] w-[18px]" />
                View on GitHub
              </Link>
            </div>

            {/* Technical visual flow */}
            <div className="mx-auto mt-20 hidden md:flex max-w-4xl flex-col items-center select-none">
              <div className="flex w-full items-center justify-between text-xs font-mono font-medium text-slate-400 dark:text-slate-500">
                <div className="flex flex-col items-center gap-2">
                  <div className="flex h-12 w-32 items-center justify-center rounded-lg border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">Client App</div>
                </div>
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-200 to-transparent dark:via-slate-800"></div>
                <div className="flex flex-col items-center gap-2">
                  <div className="flex h-12 w-48 items-center justify-center rounded-lg border border-indigo-200 bg-indigo-50 text-indigo-700 shadow-sm shadow-indigo-500/10 dark:border-indigo-500/30 dark:bg-indigo-500/10 dark:text-indigo-400 ring-1 ring-inset ring-indigo-500/20">Universal Auth API</div>
                </div>
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-200 to-transparent dark:via-slate-800"></div>
                <div className="flex flex-col items-center gap-2">
                  <div className="flex h-12 w-32 items-center justify-center rounded-lg border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">PostgreSQL</div>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* ─── Metrics ─── */}
        <section className="border-y border-slate-200/50 bg-white py-12 dark:border-slate-800/50 dark:bg-[#0A0F1C]/30">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="grid grid-cols-2 gap-8 text-center sm:grid-cols-4">
              {[
                { value: "41", label: "REST APIs" },
                { value: "9", label: "DB Tables" },
                { value: "100%", label: "Test Coverage" },
                { value: "0", label: "Config Required" },
              ].map((stat) => (
                <div key={stat.label} className="flex flex-col gap-1">
                  <div className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">{stat.value}</div>
                  <div className="text-[12px] font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── Features ─── */}
        <section className="py-24 sm:py-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-[14px] font-bold tracking-widest uppercase text-indigo-600 dark:text-indigo-400">Features</h2>
              <p className="mt-4 text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
                Everything you need to ship
              </p>
              <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
                Batteries-included authentication with security best practices built in from day one.
              </p>
            </div>

            <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-6 sm:mt-20 lg:max-w-none lg:grid-cols-3">
              {features.map((feature) => {
                const Icon = feature.icon;
                return (
                  <div
                    key={feature.title}
                    className="group relative flex flex-col rounded-[16px] border border-slate-200 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-lg dark:border-white/5 dark:bg-white/[0.02] dark:hover:border-white/10 dark:hover:bg-white/[0.04]"
                  >
                    <div className={cn("mb-6 flex h-12 w-12 items-center justify-center rounded-xl transition-colors", feature.iconBg)}>
                      <Icon className={cn("h-6 w-6", feature.iconColor)} />
                    </div>
                    <h3 className="mb-3 text-[17px] font-bold text-slate-900 dark:text-white">{feature.title}</h3>
                    <p className="text-[15px] leading-relaxed text-slate-600 dark:text-slate-400">
                      {feature.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ─── Security / Architecture ─── */}
        <section className="border-t border-slate-200/50 bg-slate-50 py-24 dark:border-slate-800/50 dark:bg-[#080C17] sm:py-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="grid items-center gap-16 lg:grid-cols-2">
              <div>
                <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
                  Authentication infrastructure, ready to ship.
                </h2>
                <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
                  Stop reinventing the wheel. Universal Auth provides a complete, secure-by-default foundation for your next project.
                </p>
                
                <dl className="mt-10 max-w-xl space-y-4 text-base leading-7 text-slate-600 dark:text-slate-400">
                  {[
                    "Secure by default configuration",
                    "Refresh token rotation",
                    "OAuth2 providers (Google, GitHub)",
                    "TOTP-based Two-Factor Authentication",
                    "Role-based access control (RBAC)",
                    "Rate limiting & account lockout",
                    "Session & device management",
                  ].map((benefit) => (
                    <div key={benefit} className="relative pl-9">
                      <dt className="inline font-semibold text-slate-900 dark:text-slate-200">
                        <CheckCircle2 className="absolute left-1 top-1 h-5 w-5 text-indigo-500" aria-hidden="true" />
                        {benefit}
                      </dt>
                    </div>
                  ))}
                </dl>
              </div>
              <div className="rounded-[20px] border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900 lg:p-12">
                <div className="space-y-6 font-mono text-sm">
                  <div className="flex items-center gap-4 rounded-lg bg-slate-50 p-4 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                    <Activity className="h-5 w-5 text-emerald-500" />
                    <div>
                      <div className="font-semibold text-slate-900 dark:text-slate-200">Rate Limiter Active</div>
                      <div className="text-xs text-slate-500">Bucket4j intercepting requests</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 rounded-lg bg-slate-50 p-4 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                    <Shield className="h-5 w-5 text-indigo-500" />
                    <div>
                      <div className="font-semibold text-slate-900 dark:text-slate-200">Spring Security Chain</div>
                      <div className="text-xs text-slate-500">Stateless session, CSRF disabled</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 rounded-lg bg-slate-50 p-4 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                    <Key className="h-5 w-5 text-amber-500" />
                    <div>
                      <div className="font-semibold text-slate-900 dark:text-slate-200">JWT Filter</div>
                      <div className="text-xs text-slate-500">Validating HS512 signatures</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── Developer Experience ─── */}
        <section className="py-24 sm:py-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
                Built to be reused.
              </h2>
              <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
                Clone it, configure it, customize it, and integrate it into your next Spring Boot application in minutes.
              </p>
              <div className="mt-10 flex items-center justify-center gap-6">
                <Link
                  href="https://github.com/shahry-03/auth-app-backend"
                  target="_blank"
                  rel="noreferrer"
                  className="group flex h-12 items-center justify-center gap-2 rounded-xl bg-slate-900 px-8 text-[15px] font-semibold text-white shadow-sm transition-all hover:bg-slate-800 hover:-translate-y-0.5 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
                >
                  <GithubIcon className="h-5 w-5" />
                  View on GitHub <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ─── API Playground Promotion ─── */}
        <section className="border-t border-slate-200/50 bg-slate-50 py-24 dark:border-slate-800/50 dark:bg-[#0A0F1C]/50 sm:py-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="grid items-center gap-16 lg:grid-cols-2">
              <div className="order-2 lg:order-1 rounded-[20px] border border-slate-200 bg-[#0d1117] p-6 shadow-xl dark:border-slate-800 lg:p-8">
                <div className="flex items-center gap-2 mb-6 border-b border-slate-800 pb-4">
                  <div className="h-3 w-3 rounded-full bg-red-500" />
                  <div className="h-3 w-3 rounded-full bg-amber-500" />
                  <div className="h-3 w-3 rounded-full bg-green-500" />
                </div>
                <div className="space-y-4 font-mono text-sm text-slate-300">
                  <div className="flex items-center gap-4">
                    <span className="font-bold text-green-400 w-12">POST</span>
                    <span className="text-blue-300">/api/v1/auth/login</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-bold text-green-400 w-12">POST</span>
                    <span className="text-blue-300">/api/v1/auth/refresh</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-bold text-green-400 w-12">POST</span>
                    <span className="text-blue-300">/api/v1/auth/logout</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-bold text-blue-400 w-12">GET</span>
                    <span className="text-blue-300">/api/v1/users/me</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-bold text-amber-400 w-12">PUT</span>
                    <span className="text-blue-300">/api/v1/users/password</span>
                  </div>
                </div>
              </div>
              <div className="order-1 lg:order-2">
                <h2 className="text-[14px] font-bold tracking-widest uppercase text-indigo-600 dark:text-indigo-400">API Playground</h2>
                <h3 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
                  Explore the API
                </h3>
                <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
                  Test all 41 endpoints directly from your browser. View request payloads, response schemas, and instantly understand how the backend works without writing a single line of code.
                </p>
                <div className="mt-8">
                  <Link
                    href="/playground"
                    className="inline-flex items-center gap-2 font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors"
                  >
                    Open API Playground <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── Final CTA ─── */}
        <section className="relative overflow-hidden py-24 sm:py-32">
          {/* Subtle background glow */}
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,rgba(99,102,241,0.08),transparent_70%)] dark:bg-[radial-gradient(ellipse_at_center,rgba(99,102,241,0.15),transparent_70%)]" />
          
          <div className="mx-auto max-w-7xl px-6 text-center lg:px-8">
            <h2 className="mx-auto max-w-2xl text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
              Ready to stop rebuilding authentication?
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-slate-600 dark:text-slate-400">
              Start with a production-ready Spring Boot authentication foundation and customize it for your application.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-5">
              <Link
                href="/playground"
                className="group flex h-12 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-8 text-[15px] font-semibold text-white shadow-md shadow-indigo-500/20 transition-all hover:from-blue-500 hover:to-indigo-500 hover:shadow-lg hover:shadow-indigo-500/30 hover:-translate-y-0.5 sm:w-auto w-full"
              >
                Try API Playground
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="https://github.com/shahry-03/auth-app-backend"
                target="_blank"
                rel="noreferrer"
                className="flex h-12 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-8 text-[15px] font-semibold text-slate-700 shadow-sm transition-all hover:bg-slate-50 hover:text-slate-900 dark:border-slate-800 dark:bg-slate-900/50 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white sm:w-auto w-full"
              >
                View on GitHub
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* ─── Footer ─── */}
      <footer className="border-t border-slate-200/50 bg-white py-10 dark:border-slate-800/50 dark:bg-[#060913]">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="md:flex md:items-center md:justify-between">
            <div className="flex justify-center md:justify-start items-center gap-2 font-semibold text-slate-900 dark:text-white">
              <Shield className="h-5 w-5 text-indigo-500" />
              <span>Universal Auth</span>
            </div>
            <div className="mt-6 flex justify-center space-x-6 md:mt-0 text-sm font-medium text-slate-500 dark:text-slate-400">
              <Link href="/playground" className="hover:text-slate-900 dark:hover:text-white transition-colors">
                API Playground
              </Link>
              <Link href="https://github.com/shahry-03/auth-app-backend" target="_blank" rel="noreferrer" className="hover:text-slate-900 dark:hover:text-white transition-colors">
                GitHub
              </Link>
              <Link href="/login" className="hover:text-slate-900 dark:hover:text-white transition-colors">
                Sign In
              </Link>
            </div>
          </div>
          <div className="mt-8 border-t border-slate-200/50 pt-8 dark:border-slate-800/50 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-slate-500 dark:text-slate-400 text-center md:text-left">
              Production-ready authentication for Spring Boot applications.
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-400 text-center">
              &copy; 2026 Universal Auth.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

// ============================================================
//  GitHub Icon
// ============================================================
function GithubIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  );
}
