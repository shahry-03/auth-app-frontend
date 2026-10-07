const fs = require('fs');
const file = 'src/app/dashboard/page.tsx';
let content = fs.readFileSync(file, 'utf8');

// Add useState, useEffect and apiClient imports
if (!content.includes('import { useState, useEffect }')) {
  content = content.replace('import { useAuth }', 'import { useState, useEffect } from "react";\nimport { useAuth }');
}
if (!content.includes('import { apiClient }')) {
  content = content.replace('import { useAuth }', 'import { apiClient } from "@/lib/api-client";\nimport { useAuth }');
}

// Modify DashboardOverviewPage
content = content.replace(
  'export default function DashboardOverviewPage() {\n  const { user } = useAuth();',
  `export default function DashboardOverviewPage() {
  const { user } = useAuth();
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [loading2FA, setLoading2FA] = useState(true);

  useEffect(() => {
    if (!user) return;
    apiClient.get('/auth/2fa/status')
      .then((res) => setTwoFactorEnabled(res.data?.data?.enabled))
      .catch(() => {})
      .finally(() => setLoading2FA(false));
  }, [user]);`
);

// Modify StatCard for Two-Factor
content = content.replace(
  /<StatCard\s+icon=\{Shield\}\s+label="Two-Factor"\s+value="Disabled"\s+hint="Add extra security"\s+accent="orange"\s+\/>/g,
  `<StatCard
          icon={Shield}
          label="Two-Factor"
          value={loading2FA ? "..." : twoFactorEnabled ? "Protected" : "Disabled"}
          hint={loading2FA ? "Loading" : twoFactorEnabled ? "2FA is enabled" : "Add extra security"}
          accent={loading2FA ? "blue" : twoFactorEnabled ? "emerald" : "orange"}
        />`
);

fs.writeFileSync(file, content, 'utf8');
console.log('Fixed dashboard page.tsx');
