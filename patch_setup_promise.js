const fs = require('fs');
const file = 'src/components/dashboard/security/two-factor-setup.tsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Remove the useRef block and import
content = content.replace('import { useState, useEffect, useRef } from "react";', 'import { useState, useEffect } from "react";');
content = content.replace('  const setupAttempted = useRef(false);', '');
content = content.replace('    if (setupAttempted.current) return;\n    setupAttempted.current = true;', '');

// 2. Add module-level promise
const moduleVars = `import Link from "next/link";

let globalSetupPromise: Promise<any> | null = null;`;

content = content.replace('import Link from "next/link";', moduleVars);

// 3. Update useEffect
const newEffect = `
  // ─── Initial load ───
  useEffect(() => {
    if (mode === "disable") {
      return;
    }

    let cancelled = false;
    const load = async () => {
      try {
        if (!globalSetupPromise) {
          globalSetupPromise = apiClient.post<{ data: SetupResponse }>("/auth/2fa/setup");
        }
        const res = await globalSetupPromise;
        if (!cancelled) {
          setSetupData(res.data.data);
          setStep("qr");
        }
      } catch (err) {
        globalSetupPromise = null; // Reset on error
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

  // Clean up global promise when leaving setup component completely
  useEffect(() => {
    return () => {
      // We only clear it if we actually navigate away or complete it
      // but to be safe we can just let it persist until next hard reload
    }
  }, []);
`;

// regex replace the entire old useEffect
content = content.replace(/  \/\/ ─── Initial load ───[\s\S]*?\}, \[mode, router\]\);/, newEffect.trim());

fs.writeFileSync(file, content, 'utf8');
console.log('Patched two-factor-setup.tsx with module promise');
