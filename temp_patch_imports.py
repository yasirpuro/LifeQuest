from pathlib import Path

files = [
    ('src/utils/productionSafety.ts', "const CRASH_LOG_KEY = 'lifequest_crash_log_v1';\n", "import { loadJsonKey, saveDataVersion, loadCrashLogs, saveCrashLogs, loadLastSyncs, saveLastSyncs, getDeviceTimeCheck, saveDeviceTimeCheck } from './persistenceOwner';\n\nconst CRASH_LOG_KEY = 'lifequest_crash_log_v1';\n"),
    ('src/utils/smartNotificationScheduler.ts', "import type { SkillProgress } from '../types';\nimport { persistNotificationFrequency } from './persistenceOwner';\n", "import type { SkillProgress } from '../types';\nimport { loadNotificationFrequency, persistNotificationFrequency } from './persistenceOwner';\n"),
    ('src/utils/smartNotificationScheduler.ts', "const FREQ_STORAGE_KEY = 'lifequest_notify_freq_v1';\n\n", ""),
]

for path_str, old, new in files:
    path = Path(path_str)
    text = path.read_text(encoding='utf-8')
    if old not in text:
        print(f'NEEDLE_NOT_FOUND {path_str} | {old!r}')
        continue
    path.write_text(text.replace(old, new, 1), encoding='utf-8')
    print(f'PATCHED {path_str}')
