const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, '..', 'src', 'utils', 'smartNotificationScheduler.ts');
let src = fs.readFileSync(file, 'utf8');
const re = /import type \{ SkillProgress \} from '\.\.\/types';/;
if (!re.test(src)) {
  console.error('pattern not found');
  process.exit(2);
}
src = src.replace(re, "import type { SkillProgress } from '../types';\nimport { persistNotificationFrequency } from './persistenceOwner';");
fs.writeFileSync(file, src, 'utf8');
console.log('patched import via regex');
