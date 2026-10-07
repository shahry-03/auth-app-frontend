const fs = require('fs');
const file = 'src/components/dashboard/security/two-factor-setup.tsx';
let content = fs.readFileSync(file, 'utf8');

// replace the empty useEffect cleanup with a setTimeout
content = content.replace(
  `  // Clean up global promise when leaving setup component completely
  useEffect(() => {
    return () => {
      // We only clear it if we actually navigate away or complete it
      // but to be safe we can just let it persist until next hard reload
    }
  }, []);`,
  `  useEffect(() => {
    return () => {
      // Clear the global promise safely after StrictMode simulated unmount
      setTimeout(() => {
        globalSetupPromise = null;
      }, 500);
    };
  }, []);`
);

fs.writeFileSync(file, content, 'utf8');
console.log('Added setTimeout clear');
