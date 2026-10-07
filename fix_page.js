const fs = require('fs');
const file = 'src/app/dashboard/page.tsx';
let content = fs.readFileSync(file, 'utf8');

if (!content.includes('const primaryRole')) {
  content = content.replace(
    '  const { user } = useAuth();\n  if (!user) return null;\n\n  return (',
    '  const { user } = useAuth();\n  if (!user) return null;\n\n  const primaryRole = user.roles?.[0]?.roleName || "USER";\n  const firstName = user.name?.split(" ")[0] || "User";\n\n  return ('
  );
  fs.writeFileSync(file, content, 'utf8');
}
