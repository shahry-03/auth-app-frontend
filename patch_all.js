const fs = require('fs');
const cp = require('child_process');

const files = cp.execSync("grep -rl 'cookieStore.get(\"accessToken\")' src/").toString().trim().split('\n');

const newLogic = `async function getAccessToken(refreshToken: string): Promise<string | null> {
  try {
    const res = await fetch(
      \`\${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1"}/auth/refresh\`,
      {
        method: "POST",
        headers: { Cookie: \`refresh_token=\${refreshToken}\` },
        cache: "no-store",
      }
    );
    if (!res.ok) return null;
    const json = await res.json();
    return json?.data?.accessToken || null;
  } catch {
    return null;
  }
}`;

for (const file of files) {
  if (!file) continue;
  let content = fs.readFileSync(file, 'utf8');

  // Find the first async function definition to insert before it
  if (!content.includes('getAccessToken(refreshToken: string)')) {
    const match = content.match(/async function [A-Za-z0-9_]+\(/);
    if (match) {
      content = content.replace(match[0], newLogic + '\n\n' + match[0]);
    } else {
      // just put it after imports
      const importLast = content.lastIndexOf('import');
      const insertIdx = content.indexOf('\n', importLast) + 1;
      content = content.slice(0, insertIdx) + '\n' + newLogic + '\n' + content.slice(insertIdx);
    }
  }
  
  // Replace the cookieStore getting logic
  content = content.replace(/const accessToken = cookieStore\.get\("accessToken"\)\?\.value;/g, 
    'const refreshToken = cookieStore.get("refresh_token")?.value;\n  const accessToken = refreshToken ? await getAccessToken(refreshToken) : null;');
    
  fs.writeFileSync(file, content, 'utf8');
  console.log('Patched', file);
}
