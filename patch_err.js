const fs = require('fs');
let content = fs.readFileSync('src/app/dashboard/layout.tsx', 'utf8');

content = content.replace(
  'if (!res.ok) return null;',
  'if (!res.ok) { console.error("refresh failed", res.status, await res.text()); return null; }'
);
fs.writeFileSync('src/app/dashboard/layout.tsx', content);
