const fs = require('fs');
const file = 'src/components/dashboard/security/two-factor-setup.tsx';
let content = fs.readFileSync(file, 'utf8');

// Add useRef import if needed
if (!content.includes('useRef')) {
  content = content.replace('useEffect, useState', 'useEffect, useState, useRef');
}

// Modify useEffect
const replacement = `
  const setupAttempted = useRef(false);

  // ─── Initial load ───
  useEffect(() => {
    if (mode === "disable") {
      return;
    }

    if (setupAttempted.current) return;
    setupAttempted.current = true;

    let cancelled = false;
    const load = async () => {`;

content = content.replace(
  `  // ─── Initial load ───
  useEffect(() => {
    if (mode === "disable") {
      return;
    }

    let cancelled = false;
    const load = async () => {`,
  replacement
);

fs.writeFileSync(file, content, 'utf8');
console.log('Patched two-factor-setup.tsx');
