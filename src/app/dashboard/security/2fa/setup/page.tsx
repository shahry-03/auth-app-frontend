"use client";

import { Suspense } from "react";
import { TwoFactorSetup } from "@/components/dashboard/security/two-factor-setup";


export default function TwoFactorSetupPage() {
  return (
    <Suspense fallback={null}>
      <TwoFactorSetup />
    </Suspense>
  );
}