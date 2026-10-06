"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ShieldCheck,
  Copy,
  Check,
  Download,
  AlertTriangle,
  ArrowRight,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

interface BackupCodesScreenProps {
  codes: string[];
}

export function BackupCodesScreen({ codes }: BackupCodesScreenProps) {
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  const codesText = codes.join("\n");

  const handleCopy = () => {
    navigator.clipboard.writeText(codesText);
    setCopied(true);
    toast.success("Backup codes copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const content = `Universal Auth — Two-Factor Backup Codes
Generated: ${new Date().toLocaleString()}
=====================================================

${codes.map((c, i) => `${String(i + 1).padStart(2, "0")}. ${c}`).join("\n")}

=====================================================
IMPORTANT:
- Each code can be used only ONCE
- Store these in a safe place (password manager, printed copy)
- If you lose access to your authenticator, these codes are your ONLY way back in
- Never share these codes with anyone
`;

    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `universal-auth-backup-codes-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Backup codes downloaded");
  };

  const handleContinue = () => {
    router.push("/dashboard/security");
    router.refresh();
  };

  return (
    <div className="mx-auto max-w-lg space-y-6">
      {/* Header */}
      <div className="space-y-2 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-500/10">
          <ShieldCheck className="h-7 w-7 text-green-600" />
        </div>
        <h1 className="text-2xl font-semibold tracking-tight">
          2FA Enabled Successfully
        </h1>
        <p className="text-sm text-muted-foreground">
          Save your backup codes in a safe place
        </p>
      </div>

      {/* Warning */}
      <div className="flex gap-3 rounded-lg border border-orange-500/20 bg-orange-500/5 p-4">
        <AlertTriangle className="h-5 w-5 shrink-0 text-orange-600" />
        <div className="space-y-1 text-sm">
          <p className="font-medium text-orange-900 dark:text-orange-200">
            Save these codes now
          </p>
          <p className="text-xs text-orange-700 dark:text-orange-300">
            You won&apos;t be able to see them again. Each code can be used only
            once if you lose access to your authenticator app.
          </p>
        </div>
      </div>

      {/* Codes grid */}
      <div className="rounded-xl border bg-muted/30 p-4">
        <div className="grid grid-cols-2 gap-2 font-mono text-sm">
          {codes.map((code, idx) => (
            <div
              key={code}
              className="flex items-center gap-2 rounded-md border bg-background px-3 py-2"
            >
              <span className="text-xs text-muted-foreground">
                {String(idx + 1).padStart(2, "0")}
              </span>
              <span className="font-medium tracking-wider">{code}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <Button variant="outline" onClick={handleCopy} className="flex-1">
          {copied ? (
            <>
              <Check className="mr-2 h-4 w-4 text-green-600" />
              Copied
            </>
          ) : (
            <>
              <Copy className="mr-2 h-4 w-4" />
              Copy all
            </>
          )}
        </Button>
        <Button variant="outline" onClick={handleDownload} className="flex-1">
          <Download className="mr-2 h-4 w-4" />
          Download .txt
        </Button>
      </div>

      {/* Confirmation checkbox */}
      <label className="flex items-start gap-2 rounded-lg border bg-card p-4 text-sm cursor-pointer hover:bg-accent/40">
        <input
          type="checkbox"
          checked={confirmed}
          onChange={(e) => setConfirmed(e.target.checked)}
          className="mt-0.5 h-4 w-4 rounded border-input"
        />
        <span>
          I have saved my backup codes in a safe place. I understand they
          won&apos;t be shown again.
        </span>
      </label>

      {/* Continue */}
      <Button
        onClick={handleContinue}
        disabled={!confirmed}
        className="w-full"
      >
        Continue to dashboard
        <ArrowRight className="ml-2 h-4 w-4" />
      </Button>
    </div>
  );
}
