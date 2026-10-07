const fs = require('fs');
const cp = require('child_process');

const files = cp.execSync("grep -rl 'async function getAccessToken' src/").toString().trim().split('\n');

for (const file of files) {
  if (!file) continue;
  let content = fs.readFileSync(file, 'utf8');

  content = content.replace(
    /"X-Forwarded-For": clientIp \|\| "127\.0\.0\.1"/,
    `"X-Forwarded-For": clientIp || "127.0.0.1",
          "Origin": process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
          "Referer": (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000") + "/dashboard"`
  );

  fs.writeFileSync(file, content, 'utf8');
}
console.log('Patched Origin and Referer');
