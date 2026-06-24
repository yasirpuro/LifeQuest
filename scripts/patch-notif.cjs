const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, '..', 'src', 'utils', 'smartNotificationScheduler.ts');
let src = fs.readFileSync(file, 'utf8');
// Insert import after the first import line
src = src.replace("import type { SkillProgress } from '../types';\n\n", "import type { SkillProgress } from '../types';\nimport { persistNotificationFrequency } from './persistenceOwner';\n\n");
// Replace localStorage write in saveFrequencyMap
src = src.replace("localStorage.setItem(FREQ_STORAGE_KEY, JSON.stringify(map));", "// Delegate persistence to single-writer\n    persistNotificationFrequency(map).catch(() => {\n      // best-effort\n    });");
fs.writeFileSync(file, src, 'utf8');
console.log('patched smartNotificationScheduler');
