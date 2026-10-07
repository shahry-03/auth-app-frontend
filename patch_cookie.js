const fs = require('fs');
const cp = require('child_process');

const files = cp.execSync("grep -rl 'async function getAccessToken' src/").toString().trim().split('\n');

for (const file of files) {
  if (!file) continue;
  let content = fs.readFileSync(file, 'utf8');

  // Replace cookieHeader parameter with refreshToken
  content = content.replace(
    /async function getAccessToken\(cookieHeader: string, userAgent\?: string, clientIp\?: string\): Promise<string \| null> \{/,
    'async function getAccessToken(refreshToken: string, userAgent?: string, clientIp?: string): Promise<string | null> {'
  );

  // Replace the Cookie header
  content = content.replace(
    /Cookie: cookieHeader,/,
    'Cookie: `refresh_token=${refreshToken}`, // Explicitly construct the exact cookie'
  );

  // Replace the caller
  content = content.replace(
    /const cookieHeader = reqHeaders\.get\("cookie"\) \|\| "";\n\s*const accessToken = refreshToken \? await getAccessToken\(cookieHeader, ua, clientIp\) : null;/g,
    'const accessToken = refreshToken ? await getAccessToken(refreshToken, ua, clientIp) : null;'
  );

  fs.writeFileSync(file, content, 'utf8');
}
console.log('Patched back to refreshToken explicit');
