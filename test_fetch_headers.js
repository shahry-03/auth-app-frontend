const fs = require('fs');
const cp = require('child_process');

const files = cp.execSync("grep -rl 'async function getAccessToken' src/").toString().trim().split('\n');

for (const file of files) {
  if (!file) continue;
  let content = fs.readFileSync(file, 'utf8');

  content = content.replace(
    'headers: { Cookie: `refresh_token=${refreshToken}`, "Content-Type": "application/json", "Content-Length": "0" },',
    `headers: { 
          Cookie: \`refresh_token=\${refreshToken}\`, 
          "Content-Type": "application/json",
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Next.js Server",
          "X-Forwarded-For": "127.0.0.1"
        },
        body: JSON.stringify({}),`
  );
  
  fs.writeFileSync(file, content, 'utf8');
}
console.log('Patched fetch headers');
