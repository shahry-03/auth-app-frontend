const fs = require('fs');
const cp = require('child_process');

const files = cp.execSync("grep -rl 'async function getAccessToken' src/").toString().trim().split('\n');

for (const file of files) {
  if (!file) continue;
  let content = fs.readFileSync(file, 'utf8');

  // Add import { headers } from "next/headers" if not exists
  if (!content.includes('import { headers }')) {
    content = content.replace('import { cookies }', 'import { cookies, headers }');
  }

  // Update getAccessToken signature
  content = content.replace(
    'async function getAccessToken(refreshToken: string): Promise<string | null> {',
    'async function getAccessToken(refreshToken: string, userAgent?: string): Promise<string | null> {'
  );

  // Update fetch headers
  content = content.replace(
    /"User-Agent": "Mozilla.*",/,
    '"User-Agent": userAgent || "Mozilla/5.0",'
  );

  // Update caller
  content = content.replace(
    'const accessToken = refreshToken ? await getAccessToken(refreshToken) : null;',
    `const reqHeaders = await headers();
  const ua = reqHeaders.get("user-agent") || undefined;
  const accessToken = refreshToken ? await getAccessToken(refreshToken, ua) : null;`
  );

  fs.writeFileSync(file, content, 'utf8');
}
console.log('Patched User-Agent forwarding');
