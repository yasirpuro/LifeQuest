export interface ConflictResolutionResult {
  applied: boolean;
  reason: string;
}

export function resolveConflict(_local: unknown, _remote: unknown): ConflictResolutionResult {
  return { applied: true, reason: 'latest-write-wins' };
}
