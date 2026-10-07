const fs = require('fs');
const cp = require('child_process');

const files = cp.execSync("grep -rl 'async function getAccessToken' src/").toString().trim().split('\n');

for (const file of files) {
  if (!file) continue;
  let content = fs.readFileSync(file, 'utf8');

  content = content.replace(
    'headers: { Cookie: `refresh_token=${refreshToken}` },',
    'headers: { Cookie: `refresh_token=${refreshToken}`, "Content-Type": "application/json", "Content-Length": "0" },'
  );
  
  fs.writeFileSync(file, content, 'utf8');
  console.log('Patched', file);
}
