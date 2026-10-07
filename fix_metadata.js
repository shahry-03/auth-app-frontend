const fs = require('fs');
const cp = require('child_process');

const files = cp.execSync("find src/app/dashboard -name 'page.tsx'").toString().trim().split('\n');

for (const file of files) {
  if (!file) continue;
  let content = fs.readFileSync(file, 'utf8');

  if (content.includes('export const metadata')) {
    content = content.replace(/export const metadata = \{[\s\S]*?\};\n/, '');
    fs.writeFileSync(file, content, 'utf8');
    console.log("Removed metadata from", file);
  }
}
