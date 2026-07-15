/**
 * PREMIUM REPOSITORY
 * 
 * Server-side premium validation and billing sync
 */

import { getSupabase } from '../../shared/api/supabase';
import { 
  createSuccessResult, 
  createErrorResult, 
  RepositoryErrorCode,
  withRetry 
} from './baseRepository';
import type { Result } from './baseRepository';

export interface PremiumSubscription {
  isPremium: boolean;
  subscriptionId?: string;
  plan?: string;
  status?: string;
  expiresAt?: string;
}

/**
 * Premium Repository - Server-side premium validation
 */
export class PremiumRepository {
  private cache: Map<string, boolean> = new Map();

  /**
   * Check if user has premium access
   */
  async checkPremiumAccess(userId: string): Promise<Result<boolean>> {
    return withRetry(async () => {
      try {
        // Check cache first
        if (this.cache.has(userId)) {
          return createSuccessResult(this.cache.get(userId)!);
        }

        const sb = getSupabase();
        if (!sb) {
          return createErrorResult('Supabase bağlantısı yok', RepositoryErrorCode.NETWORK_ERROR);
        }

        // Call Supabase RPC function for server-side validation
        const { data, error } = await sb.rpc('check_premium_access', {
          user_id: userId,
        });

        if (error) {
          return createErrorResult(error.message, RepositoryErrorCode.UNKNOWN);
        }

        const isPremium = data || false;
        this.cache.set(userId, isPremium);
        return createSuccessResult(isPremium);
      } catch (error) {
        return createErrorResult(
          error instanceof Error ? error.message : 'Premium kontrolü başarısız',
          RepositoryErrorCode.UNKNOWN
        );
      }
    });
  }

  /**
   * Validate premium feature access
   */
  async validatePremiumFeature(userId: string, feature: string): Promise<Result<{ allowed: boolean }>> {
    return withRetry(async () => {
      try {
        const sb = getSupabase();
        if (!sb) {
          return createErrorResult('Supabase bağlantısı yok', RepositoryErrorCode.NETWORK_ERROR);
        }

        // Call Supabase RPC function for feature validation
        const { data, error } = await sb.rpc('validate_premium_feature', {
          user_id: userId,
          feature_name: feature,
        });

        if (error) {
          return createErrorResult(error.message, RepositoryErrorCode.UNKNOWN);
        }

        return createSuccessResult({ allowed: data || false });
      } catch (error) {
        return createErrorResult(
          error instanceof Error ? error.message : 'Feature validasyonu başarısız',
          RepositoryErrorCode.UNKNOWN
        );
      }
    });
  }

  /**
   * Sync premium status with billing
   */
  async syncPremiumStatus(userId: string, isPremium: boolean): Promise<Result<void>> {
    return withRetry(async () => {
      try {
        const sb = getSupabase();
        if (!sb) {
          return createErrorResult('Supabase bağlantısı yok', RepositoryErrorCode.NETWORK_ERROR);
        }

        // Update user profile
        const { error } = await sb
          .from('profiles')
          .update({ is_premium: isPremium })
          .eq('id', userId);

        if (error) {
          return createErrorResult(error.message, RepositoryErrorCode.UNKNOWN);
        }

        // Update cache
        this.cache.set(userId, isPremium);
        return createSuccessResult(undefined);
      } catch (error) {
        return createErrorResult(
          error instanceof Error ? error.message : 'Premium sync başarısız',
          RepositoryErrorCode.UNKNOWN
        );
      }
    });
  }

  /**
   * Get premium subscription details
   */
  async getPremiumSubscription(userId: string): Promise<Result<PremiumSubscription>> {
    return withRetry(async () => {
      try {
        const sb = getSupabase();
        if (!sb) {
          return createErrorResult('Supabase bağlantısı yok', RepositoryErrorCode.NETWORK_ERROR);
        }

        const { data, error } = await sb
          .from('profiles')
          .select('is_premium')
          .eq('id', userId)
          .single();

        if (error) {
          return createErrorResult(error.message, RepositoryErrorCode.UNKNOWN);
        }

        return createSuccessResult({
          isPremium: data?.is_premium || false,
        });
      } catch (error) {
        return createErrorResult(
          error instanceof Error ? error.message : 'Subscription bilgisi alınamadı',
          RepositoryErrorCode.UNKNOWN
        );
      }
    });
  }

  /**
   * Clear cache
   */
  clearCache(): void {
    this.cache.clear();
  }
}

// Singleton instance
export const premiumRepository = new PremiumRepository();
