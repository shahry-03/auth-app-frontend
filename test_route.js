const fs = require('fs');
let content = fs.readFileSync('src/app/dashboard/layout.tsx', 'utf8');

content = content.replace(
  'if (!refreshToken) redirect("/login");',
  'if (!refreshToken) { console.error("refresh_token missing from cookies. Cookies received:", cookieStore.getAll()); redirect("/login"); }'
);
fs.writeFileSync('src/app/dashboard/layout.tsx', content);
