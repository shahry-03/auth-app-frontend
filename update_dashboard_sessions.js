const fs = require('fs');
const file = 'src/app/dashboard/page.tsx';
let content = fs.readFileSync(file, 'utf8');

// Add activeSessions state
content = content.replace(
  'const [loading2FA, setLoading2FA] = useState(true);',
  'const [loading2FA, setLoading2FA] = useState(true);\n  const [sessionsCount, setSessionsCount] = useState<number | null>(null);'
);

// Add fetch to useEffect
content = content.replace(
  /apiClient\.get\('\/auth\/2fa\/status'\)[\s\S]*?\.finally\(\(\) => setLoading2FA\(false\)\);/,
  `Promise.all([
      apiClient.get('/auth/2fa/status').catch(() => ({ data: { data: { enabled: false } } })),
      apiClient.get('/users/me/sessions').catch(() => ({ data: { data: [] } }))
    ]).then(([twoFaRes, sessionsRes]) => {
      setTwoFactorEnabled(twoFaRes.data?.data?.enabled || false);
      setSessionsCount(sessionsRes.data?.data?.length || 1);
    }).finally(() => {
      setLoading2FA(false);
    });`
);

// Replace StatCard for Active Sessions
content = content.replace(
  /<StatCard\s+icon=\{Monitor\}\s+label="Active Sessions"\s+value="1"\s+hint="Current device"\s+accent="blue"\s+\/>/g,
  `<StatCard
          icon={Monitor}
          label="Active Sessions"
          value={sessionsCount === null ? "..." : sessionsCount.toString()}
          hint={sessionsCount === 1 ? "Current device" : "Multiple devices"}
          accent="blue"
        />`
);

fs.writeFileSync(file, content, 'utf8');
console.log('Fixed dashboard page.tsx sessions stat');
