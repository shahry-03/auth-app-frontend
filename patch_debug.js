const fs = require('fs');
const file = 'src/app/dashboard/layout.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  'if (!accessToken) redirect("/login");',
  'if (!accessToken) { console.error("Redirecting because accessToken is null. refreshToken was:", refreshToken); redirect("/login"); }'
);

fs.writeFileSync(file, content);
