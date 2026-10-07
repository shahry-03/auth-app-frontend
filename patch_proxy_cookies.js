const fs = require('fs');
const cp = require('child_process');

const files = cp.execSync("grep -rl 'async function getAccessToken' src/").toString().trim().split('\n');

for (const file of files) {
  if (!file) continue;
  let content = fs.readFileSync(file, 'utf8');

  // Change signature
  content = content.replace(
    /async function getAccessToken\(refreshToken: string, userAgent\?: string, clientIp\?: string\): Promise<string \| null> \{/,
    'async function getAccessToken(cookieHeader: string, userAgent?: string, clientIp?: string): Promise<string | null> {'
  );

  // Change headers
  content = content.replace(
    /Cookie: `refresh_token=\${encodeURIComponent\(refreshToken\)}`/,
    'Cookie: cookieHeader'
  );

  // Update caller
  content = content.replace(
    /const clientIp = [^\n]+;\n\s*const accessToken = refreshToken \? await getAccessToken\(refreshToken, ua, clientIp\) : null;/g,
    `const clientIp = reqHeaders.get("x-forwarded-for") || reqHeaders.get("x-real-ip") || "127.0.0.1";
  const cookieHeader = reqHeaders.get("cookie") || "";
  const accessToken = refreshToken ? await getAccessToken(cookieHeader, ua, clientIp) : null;`
  );

  fs.writeFileSync(file, content, 'utf8');
}
console.log('Patched proxy cookies');
