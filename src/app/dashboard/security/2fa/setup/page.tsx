import { Suspense } from "react";
import { TwoFactorSetup } from "@/components/dashboard/security/two-factor-setup";

export const metadata = {
  title: "2FA Setup",
};

export default function TwoFactorSetupPage() {
  return (
    <Suspense fallback={null}>
      <TwoFactorSetup />
    </Suspense>
  );
}