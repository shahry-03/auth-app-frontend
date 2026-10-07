const fs = require('fs');
const cp = require('child_process');

const files = cp.execSync("find src/app/dashboard -name 'page.tsx'").toString().trim().split('\n');

for (const file of files) {
  if (!file) continue;
  let content = fs.readFileSync(file, 'utf8');

  if (content.includes('useAuth();') && !content.includes('import { useAuth }')) {
    content = content.replace('"use client";\n', '"use client";\nimport { useAuth } from "@/hooks/useAuth";\n');
    fs.writeFileSync(file, content, 'utf8');
    console.log("Fixed import in", file);
  }
}
