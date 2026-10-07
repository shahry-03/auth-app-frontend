const fs = require('fs');
const cp = require('child_process');

const files = cp.execSync("find src/components/dashboard/admin -name '*.tsx'").toString().trim().split('\n');

for (const file of files) {
  if (!file) continue;
  let content = fs.readFileSync(file, 'utf8');

  content = content.replace(
    'import { useState }\nimport { apiClient } from "@/lib/api-client"; from "react";',
    'import { useState } from "react";\nimport { apiClient } from "@/lib/api-client";'
  );

  fs.writeFileSync(file, content, 'utf8');
}
console.log('Fixed syntax in admin components');
