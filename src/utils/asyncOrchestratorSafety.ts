/**
 * ASYNC SAFETY WRAPPER
 * Handles:
 * - Promise.allSettled for parallel phases where safe
 * - Proper error handling without cascade failures
 * - Timeout protection
 * - Fallback for each phase
 */

// types removed (unused)

export interface AsyncPhaseResult {
  phase: number;
  name: string;
  status: 'fulfilled' | 'rejected';
  value?: any;
  reason?: string;
  duration: number; // ms
}

export interface OrchestratorOptions {
  timeoutMs?: number; // default 30000 (30 sec)
  parallelPhases?: boolean; // default false (safe sequential)
  fallbackMode?: 'strict' | 'lenient'; // strict: fail fast, lenient: recover
}

const DEFAULT_OPTIONS: OrchestratorOptions = {
  timeoutMs: 30000,
  parallelPhases: false,
  fallbackMode: 'lenient',
};

/**
 * Async-safe version of orchestration
 * Wraps each phase with error handling + timeout
 */
export async function executeOrchestratorPhases(
  phases: Array<{
    name: string;
    fn: () => Promise<any> | any;
    fallback?: () => any;
    critical?: boolean; // if true, failing this phase stops orchestration
  }>,
  options: OrchestratorOptions = DEFAULT_OPTIONS
): Promise<{ results: AsyncPhaseResult[]; successful: boolean; errors: string[] }> {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  const results: AsyncPhaseResult[] = [];
  const errors: string[] = [];

  // Sequential execution (default, safer)
  if (!opts.parallelPhases) {
    for (let i = 0; i < phases.length; i++) {
      const phase = phases[i];
      const startTime = performance.now();

      try {
        const result = await executePhaseWithTimeout(phase.fn, opts.timeoutMs!);
        const duration = performance.now() - startTime;

        results.push({
          phase: i + 1,
          name: phase.name,
          status: 'fulfilled',
          value: result,
          duration,
        });
      } catch (error) {
        const duration = performance.now() - startTime;
        const errorMsg = error instanceof Error ? error.message : String(error);

        // Try fallback
        if (phase.fallback) {
          try {
            const fallbackResult = await executePhaseWithTimeout(
              phase.fallback,
              opts.timeoutMs! / 2 // fallback gets half time
            );
            results.push({
              phase: i + 1,
              name: phase.name,
              status: 'fulfilled',
              value: fallbackResult,
              reason: `failed, used fallback: ${errorMsg}`,
              duration,
            });
          } catch (fallbackError) {
            const fallbackMsg = fallbackError instanceof Error ? fallbackError.message : String(fallbackError);
            errors.push(`Phase ${i + 1} (${phase.name}): ${errorMsg} → fallback also failed: ${fallbackMsg}`);

            results.push({
              phase: i + 1,
              name: phase.name,
              status: 'rejected',
              reason: errorMsg,
              duration,
            });

            if (phase.critical) {
              // Stop orchestration
              console.error(`[Orchestrator] Critical phase failed: ${phase.name}`);
              break;
            }
          }
        } else {
          errors.push(`Phase ${i + 1} (${phase.name}): ${errorMsg}`);
          results.push({
            phase: i + 1,
            name: phase.name,
            status: 'rejected',
            reason: errorMsg,
            duration,
          });

          if (phase.critical) {
            console.error(`[Orchestrator] Critical phase failed: ${phase.name}`);
            break;
          }
        }
      }
    }
  } else {
    // Parallel execution (risky, only for independent phases)
    const promises = phases.map((phase, i) =>
      executePhaseWithTimeout(phase.fn, opts.timeoutMs!)
        .then(
          (value) => ({
            phase: i + 1,
            name: phase.name,
            status: 'fulfilled' as const,
            value,
            duration: 0,
          }),
          (error) => ({
            phase: i + 1,
            name: phase.name,
            status: 'rejected' as const,
            reason: error instanceof Error ? error.message : String(error),
            duration: 0,
          })
        )
    );

    const settled = await Promise.all(promises);
    results.push(...settled);

    settled.forEach((result) => {
      if (result.status === 'rejected') {
        errors.push(`Phase ${result.phase} (${result.name}): ${result.reason}`);
      }
    });
  }

  return {
    results,
    successful: errors.length === 0,
    errors,
  };
}

/**
 * Execute single phase with timeout + error handling
 */
export async function executePhaseWithTimeout<T>(
  fn: () => Promise<T> | T,
  timeoutMs: number
): Promise<T> {
  return Promise.race([
    Promise.resolve(fn()).then((result) => {
      if (result instanceof Error) throw result;
      return result;
    }),
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error(`Phase timeout after ${timeoutMs}ms`)), timeoutMs)
    ),
  ]);
}

/**
 * Verify phase result integrity
 */
export function verifyPhaseResult(
  result: AsyncPhaseResult,
  schema?: { [key: string]: 'string' | 'number' | 'boolean' | 'object' }
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (result.status === 'rejected') {
    errors.push(`Phase failed: ${result.reason}`);
    return { valid: false, errors };
  }

  if (!schema) {
    return { valid: true, errors }; // no schema provided, assume valid
  }

  Object.entries(schema).forEach(([key, type]) => {
    const value = result.value?.[key];
    const actualType = typeof value;

    if (actualType !== type) {
      errors.push(`Field \"${key}\" expected ${type}, got ${actualType}`);
    }
  });

  return { valid: errors.length === 0, errors };
}

/**
 * Merge phase results safely
 */
export function mergePhaseResults(results: AsyncPhaseResult[]): any {
  const merged: any = {};

  results.forEach((result) => {
    if (result.status === 'fulfilled' && result.value) {
      // Assume each phase returns an object
      if (typeof result.value === 'object') {
        Object.assign(merged, result.value);
      }
    }
  });

  return merged;
}

/**
 * Rollback support: if later phase fails, previous should be reversed
 * (only for critical operations)
 */
export interface RollbackPoint {
  phase: number;
  snapshot: any;
  reverseOperation: () => Promise<void>;
}

export class OrchestratorWithRollback {
  private rollbacks: RollbackPoint[] = [];
  private options: OrchestratorOptions;

  constructor(options?: OrchestratorOptions) {
    this.options = { ...DEFAULT_OPTIONS, ...options };
  }

  async execute(
    phases: Array<{
      name: string;
      fn: () => Promise<any> | any;
      snapshot?: () => any; // capture state before phase
      reversal?: () => Promise<void>; // rollback if needed
      fallback?: () => any;
      critical?: boolean;
    }>
  ): Promise<{ success: boolean; results: AsyncPhaseResult[]; rolled_back: boolean }> {
    const results: AsyncPhaseResult[] = [];
    let rolled_back = false;

    for (let i = 0; i < phases.length; i++) {
      const phase = phases[i];
      const startTime = performance.now();

      try {
        // Capture snapshot before phase
        const snapshot = phase.snapshot?.();
        if (phase.reversal) {
          this.rollbacks.push({
            phase: i,
            snapshot,
            reverseOperation: phase.reversal,
          });
        }

        const result = await executePhaseWithTimeout(phase.fn, this.options.timeoutMs!);
        const duration = performance.now() - startTime;

        results.push({
          phase: i + 1,
          name: phase.name,
          status: 'fulfilled',
          value: result,
          duration,
        });
      } catch (error) {
        const duration = performance.now() - startTime;
        const errorMsg = error instanceof Error ? error.message : String(error);

        results.push({
          phase: i + 1,
          name: phase.name,
          status: 'rejected',
          reason: errorMsg,
          duration,
        });

        // Try rollback if critical
        if (phase.critical) {
          console.warn(`[Orchestrator] Critical phase failed, attempting rollback...`);
          await this.rollback();
          rolled_back = true;
          break;
        }
      }
    }

    return {
      success: results.every((r) => r.status === 'fulfilled'),
      results,
      rolled_back,
    };
  }

  private async rollback(): Promise<void> {
    // Reverse in reverse order
    while (this.rollbacks.length > 0) {
      const rb = this.rollbacks.pop()!;
      try {
        await rb.reverseOperation();
        console.log(`[Rollback] Reversed phase ${rb.phase}`);
      } catch (e) {
        console.error(`[Rollback] Failed to reverse phase ${rb.phase}:`, e);
      }
    }
  }
}
