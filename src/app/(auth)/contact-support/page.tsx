import Link from "next/link";
import { LifeBuoy, Mail, ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Account Recovery · Universal Auth",
  description: "Recover access to your account if you lost 2FA access",
};

export default function ContactSupportPage() {
  return (
    <div className="space-y-6">
      <Link
        href="/login"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to sign in
      </Link>

      {/* Header */}
      <div className="space-y-3 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-foreground text-background">
          <LifeBuoy className="h-7 w-7" />
        </div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Account Recovery
        </h1>
        <p className="text-sm text-muted-foreground">
          Lost access to both your authenticator app and backup codes?
          We&apos;re here to help.
        </p>
      </div>

      {/* Email instructions */}
      <div className="rounded-xl border bg-card p-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600">
            <Mail className="h-5 w-5" />
          </div>
          <div>
            <p className="font-medium">Email our support team</p>
            <p className="text-xs text-muted-foreground">
              Response within 24-48 hours
            </p>
          </div>
        </div>

        <div className="rounded-lg border bg-muted/40 p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Email address
          </p>
          <a
            href="mailto:support@universal-auth.com"
            className="mt-1 block font-mono text-sm font-medium hover:underline"
          >
            support@universal-auth.com
          </a>
        </div>
      </div>

      {/* What to include */}
      <div className="rounded-xl border bg-card p-6 space-y-4">
        <h2 className="font-semibold">Include the following in your email:</h2>
        <ul className="space-y-3 text-sm text-muted-foreground">
          <Item icon="📧" label="Registered email address" />
          <Item icon="📅" label="Approximate account creation date" />
          <Item icon="🕐" label="Last successful login date" />
          <Item icon="🎯" label="Reason for recovery request" />
          <Item icon="🔐" label="Any other proof of ownership" />
        </ul>
      </div>

      {/* Warning */}
      <div className="rounded-lg border border-orange-500/20 bg-orange-500/5 p-4 text-xs text-orange-700 dark:text-orange-300">
        <p className="font-medium">⚠️ Security Notice</p>
        <p className="mt-1">
          For your security, we may require additional verification before
          disabling 2FA. This protects your account from unauthorized access.
        </p>
      </div>
    </div>
  );
}

function Item({ icon, label }: { icon: string; label: string }) {
  return (
    <li className="flex items-start gap-2">
      <span className="text-base leading-none">{icon}</span>
      <span>{label}</span>
    </li>
  );
}