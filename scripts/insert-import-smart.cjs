const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, '..', 'src', 'utils', 'smartNotificationScheduler.ts');
let src = fs.readFileSync(file, 'utf8');
const needle = "import type { SkillProgress } from '../types';\n\n";
if (!src.includes(needle)) {
  console.error('Needle not found');
  process.exit(2);
}
const replace = "import type { SkillProgress } from '../types';\nimport { persistNotificationFrequency } from './persistenceOwner';\n\n";
src = src.replace(needle, replace);
fs.writeFileSync(file, src, 'utf8');
console.log('inserted import');
