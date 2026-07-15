/**
 * BASE REPOSITORY
 * 
 * Foundation for all repositories
 * - Result pattern for consistent error handling
 * - Retry mechanism with exponential backoff
 * - Standard error codes
 */

export interface Result<T> {
  success: boolean;
  data?: T;
  error?: string;
  code?: string;
}

export interface RetryConfig {
  maxAttempts: number;
  baseDelay: number;
  maxDelay: number;
}

export const RepositoryErrorCode = {
  NETWORK_ERROR: 'NETWORK_ERROR',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  NOT_FOUND: 'NOT_FOUND',
  CONFLICT: 'CONFLICT',
  PERMISSION_DENIED: 'PERMISSION_DENIED',
  UNKNOWN: 'UNKNOWN',
} as const;

export type RepositoryErrorCode = typeof RepositoryErrorCode[keyof typeof RepositoryErrorCode];

/**
 * Create success result
 */
export function createSuccessResult<T>(data: T): Result<T> {
  return {
    success: true,
    data,
  };
}

/**
 * Create error result
 */
export function createErrorResult<T>(
  error: string,
  code?: RepositoryErrorCode
): Result<T> {
  return {
    success: false,
    error,
    code: code || RepositoryErrorCode.UNKNOWN,
  };
}

/**
 * Retry function with exponential backoff
 */
export async function withRetry<T>(
  fn: () => Promise<Result<T>>,
  config: RetryConfig = { maxAttempts: 3, baseDelay: 1000, maxDelay: 10000 }
): Promise<Result<T>> {
  let lastError: Result<T> | null = null;

  for (let attempt = 1; attempt <= config.maxAttempts; attempt++) {
    try {
      const result = await fn();
      
      if (result.success) {
        return result;
      }
      
      lastError = result;
      
      // Don't retry on validation errors or permission denied
      if (
        result.code === RepositoryErrorCode.VALIDATION_ERROR ||
        result.code === RepositoryErrorCode.PERMISSION_DENIED
      ) {
        return result;
      }
      
      // If this is the last attempt, return the error
      if (attempt === config.maxAttempts) {
        return result;
      }
      
      // Calculate delay with exponential backoff
      const delay = Math.min(
        config.baseDelay * Math.pow(2, attempt - 1),
        config.maxDelay
      );
      
      await new Promise(resolve => setTimeout(resolve, delay));
    } catch (error) {
      lastError = createErrorResult(
        error instanceof Error ? error.message : 'Unknown error',
        RepositoryErrorCode.UNKNOWN
      );
      
      if (attempt === config.maxAttempts) {
        return lastError;
      }
      
      const delay = Math.min(
        config.baseDelay * Math.pow(2, attempt - 1),
        config.maxDelay
      );
      
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  return lastError || createErrorResult('Max retries exceeded', RepositoryErrorCode.UNKNOWN);
}

/**
 * Base Repository Interface
 */
export interface BaseRepository {
  clearCache(): void;
}
