import fs from 'fs';
import path from 'path';
const filePath = path.join(process.cwd(), 'src', 'utils', 'questCompletionOrchestrator.ts');
let content = fs.readFileSync(filePath, 'utf8');

// Replace widgetCommandBus import
content = content.replace(
  "import { updateWidgetCache, getWidgetCache } from './widgetCommandBus';",
  "import { getWidgetCache } from './widgetCommandBus';"
);

// Replace productionSafety import
content = content.replace(
  "import { logCrash, recordSync } from './productionSafety';",
  "import { logCrash } from './productionSafety';"
);

// Replace native sync block between PHASE 10 comment and PHASE 10.5 comment using regex
const syncRegex = /PHASE 10: NATIVE SYNC[\s\S]*?PHASE 10.5: RECONCILIATION CHECK/;
if (syncRegex.test(content)) {
  content = content.replace(syncRegex, `PHASE 10: NATIVE STATE VERIFICATION (read-only)\n    // ============================================================\n    const nativeVerification = await verifyNativeState(skillMap, now);\n    if (!nativeVerification.ok) {\n      result.warnings.push('Native state verification failed: ' + nativeVerification.message);\n      logCrash(new Error('Native state verification failed: ' + nativeVerification.message));\n    }\n\n    // PHASE 10.5: RECONCILIATION CHECK`);
} else {
  console.error('Sync block regex not found; aborting.');
  process.exit(2);
}

fs.writeFileSync(filePath, content, 'utf8');
console.log('Patched', filePath);
