import { describe, it, expect, vi, beforeEach } from 'vitest';
import { authRepository } from '../authRepository';
import { getSupabase } from '../../../shared/api/supabase';

vi.mock('../../../shared/api/supabase');

describe('authRepository', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('login', () => {
    it('should login successfully with valid credentials', async () => {
      const mockSupabase = {
        auth: {
          signInWithPassword: vi.fn().mockResolvedValue({
            data: { user: { id: '1', email: 'test@test.com' }, session: {} },
            error: null,
          }),
        },
      };
      vi.mocked(getSupabase).mockReturnValue(mockSupabase as any);

      const result = await authRepository.login({ email: 'test@test.com', password: 'password' });

      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
    });

    it('should fail with invalid credentials', async () => {
      const mockSupabase = {
        auth: {
          signInWithPassword: vi.fn().mockResolvedValue({
            data: null,
            error: { message: 'Invalid credentials' },
          }),
        },
      };
      vi.mocked(getSupabase).mockReturnValue(mockSupabase as any);

      const result = await authRepository.login({ email: 'test@test.com', password: 'wrong' });

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
  });

  describe('register', () => {
    it('should register successfully with valid data', async () => {
      const mockSupabase = {
        auth: {
          signUp: vi.fn().mockResolvedValue({
            data: { user: { id: '1', email: 'test@test.com' } },
            error: null,
          }),
        },
      };
      vi.mocked(getSupabase).mockReturnValue(mockSupabase as any);

      const result = await authRepository.register({ 
        email: 'test@test.com', 
        password: 'password',
        username: 'Test User'
      });

      expect(result.success).toBe(true);
    });
  });

  describe('logout', () => {
    it('should logout successfully', async () => {
      const mockSupabase = {
        auth: {
          signOut: vi.fn().mockResolvedValue({ error: null }),
        },
      };
      vi.mocked(getSupabase).mockReturnValue(mockSupabase as any);

      const result = await authRepository.logout();

      expect(result.success).toBe(true);
    });
  });
});
