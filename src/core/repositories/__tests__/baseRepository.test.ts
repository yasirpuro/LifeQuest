import { describe, it, expect, vi } from 'vitest';
import { createSuccessResult, createErrorResult, withRetry, RepositoryErrorCode } from '../baseRepository';

describe('baseRepository', () => {
  describe('createSuccessResult', () => {
    it('should create a success result with data', () => {
      const data = { id: '1', name: 'Test' };
      const result = createSuccessResult(data);
      
      expect(result.success).toBe(true);
      expect(result.data).toEqual(data);
      expect(result.error).toBeUndefined();
    });
  });

  describe('createErrorResult', () => {
    it('should create an error result with message', () => {
      const result = createErrorResult('Test error');
      
      expect(result.success).toBe(false);
      expect(result.error).toBe('Test error');
      expect(result.code).toBe(RepositoryErrorCode.UNKNOWN);
    });

    it('should create an error result with custom code', () => {
      const result = createErrorResult('Test error', RepositoryErrorCode.NETWORK_ERROR);
      
      expect(result.success).toBe(false);
      expect(result.error).toBe('Test error');
      expect(result.code).toBe(RepositoryErrorCode.NETWORK_ERROR);
    });
  });

  describe('withRetry', () => {
    it('should succeed on first attempt', async () => {
      const fn = vi.fn().mockResolvedValue(createSuccessResult('success'));
      const result = await withRetry(fn);
      
      expect(fn).toHaveBeenCalledTimes(1);
      expect(result.success).toBe(true);
      expect(result.data).toBe('success');
    });

    it('should retry on failure and eventually succeed', async () => {
      const fn = vi.fn()
        .mockRejectedValueOnce(new Error('Network error'))
        .mockResolvedValue(createSuccessResult('success'));
      
      const result = await withRetry(fn, { maxAttempts: 3, baseDelay: 10, maxDelay: 100 });
      
      expect(fn).toHaveBeenCalledTimes(2);
      expect(result.success).toBe(true);
      expect(result.data).toBe('success');
    });

    it('should fail after max attempts', async () => {
      const fn = vi.fn().mockRejectedValue(new Error('Network error'));
      
      const result = await withRetry(fn, { maxAttempts: 2, baseDelay: 10, maxDelay: 100 });
      
      expect(fn).toHaveBeenCalledTimes(2);
      expect(result.success).toBe(false);
      expect(result.error).toBe('Network error');
    });

    it('should not retry on validation errors', async () => {
      const fn = vi.fn().mockResolvedValue(
        createErrorResult('Validation failed', RepositoryErrorCode.VALIDATION_ERROR)
      );
      
      const result = await withRetry(fn, { maxAttempts: 3, baseDelay: 10, maxDelay: 100 });
      
      expect(fn).toHaveBeenCalledTimes(1);
      expect(result.success).toBe(false);
      expect(result.code).toBe(RepositoryErrorCode.VALIDATION_ERROR);
    });

    it('should not retry on permission denied errors', async () => {
      const fn = vi.fn().mockResolvedValue(
        createErrorResult('Permission denied', RepositoryErrorCode.PERMISSION_DENIED)
      );
      
      const result = await withRetry(fn, { maxAttempts: 3, baseDelay: 10, maxDelay: 100 });
      
      expect(fn).toHaveBeenCalledTimes(1);
      expect(result.success).toBe(false);
      expect(result.code).toBe(RepositoryErrorCode.PERMISSION_DENIED);
    });
  });
});
