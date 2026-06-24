const fs = require('fs');
const path = require('path');
const content = fs.readFileSync(path.join(__dirname, '..', 'src', 'utils', 'reconciliationLayer.ts'), 'utf8');
const lines = content.split(/\r?\n/);
const tokens = ['repairWidgetCache', 'rebuildWidgetCache', 'queueRetry', 'saveReconciliationReport', 'localStorage.setItem', 'processRetryQueue', 'getRetryQueue', 'getReconciliationLogs'];
for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  if (tokens.some(token => line.includes(token))) {
    console.log(`${i + 1}: ${line}`);
  }
}
