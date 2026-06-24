const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, '..', 'src', 'utils', 'reconciliationLayer.ts');
let src = fs.readFileSync(file, 'utf8');
const old = "const RETRY_QUEUE_KEY = 'lifequest_retry_queue_v1';\nconst RECONCILIATION_LOG_KEY = 'lifequest_reconciliation_log_v1';\n\n/**";
const neu = `const RETRY_QUEUE_KEY = 'lifequest_retry_queue_v1';\nconst RECONCILIATION_LOG_KEY = 'lifequest_reconciliation_log_v1';\n// In-memory replacements for persistence to enforce single-writer contract.\nlet inMemoryRetryQueue = [];\nlet inMemoryReconciliationLogs = [];\n\n/**`;
if (!src.includes(old)) {
  console.error('Old block not found, aborting');
  process.exit(2);
}
src = src.replace(old, neu);
fs.writeFileSync(file, src, 'utf8');
console.log('patched constants');
