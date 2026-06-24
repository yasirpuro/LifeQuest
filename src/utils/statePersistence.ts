import type { AppState } from '../context/appContextValue';
import type { SkillProgress } from '../types';
import { persistAppStateSnapshot } from './persistenceOwner';

export interface PersistentAppSnapshot extends AppState {
  skillEngine?: {
    progressMap: Record<string, SkillProgress>;
  };
  widgetCache?: Record<string, any>;
  snapshotTimestamp?: string;
}

export async function persistSnapshot(snapshot: PersistentAppSnapshot): Promise<{ success: boolean; message: string }> {
  return persistAppStateSnapshot(snapshot as any);
}
