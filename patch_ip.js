const fs = require('fs');
const cp = require('child_process');

const files = cp.execSync("grep -rl 'async function getAccessToken' src/").toString().trim().split('\n');

for (const file of files) {
  if (!file) continue;
  let content = fs.readFileSync(file, 'utf8');

  // Add clientIp to signature
  content = content.replace(
    'async function getAccessToken(refreshToken: string, userAgent?: string): Promise<string | null> {',
    'async function getAccessToken(refreshToken: string, userAgent?: string, clientIp?: string): Promise<string | null> {'
  );

  // Add clientIp to fetch headers
  content = content.replace(
    '"X-Forwarded-For": "127.0.0.1"',
    '"X-Forwarded-For": clientIp || "127.0.0.1"'
  );

  // Update caller
  content = content.replace(
    /const ua = reqHeaders\.get\("user-agent"\) \|\| undefined;\n\s*const accessToken = refreshToken \? await getAccessToken\(refreshToken, ua\) : null;/g,
    `const ua = reqHeaders.get("user-agent") || undefined;
  const clientIp = reqHeaders.get("x-forwarded-for") || reqHeaders.get("x-real-ip") || "127.0.0.1";
  const accessToken = refreshToken ? await getAccessToken(refreshToken, ua, clientIp) : null;`
  );

  fs.writeFileSync(file, content, 'utf8');
}
console.log('Patched IP forwarding');
