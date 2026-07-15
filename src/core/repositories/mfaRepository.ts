/**
 * MFA REPOSITORY
 * 
 * Multi-Factor Authentication using Supabase MFA API
 * - TOTP (Time-based One-Time Password) support
 * - Factor enrollment and verification
 * - Backup codes support
 */

import { getSupabase } from '../../shared/api/supabase';
import { 
  createSuccessResult, 
  createErrorResult, 
  RepositoryErrorCode 
} from './baseRepository';
import type { Result } from './baseRepository';

export interface MFAFactor {
  id: string;
  friendlyName: string;
  factorType: string;
  status: 'verified' | 'unverified';
  createdAt: string;
}

export interface MFAEnrollment {
  qrCode: string;
  secret: string;
  verificationCode: string;
}

export interface MFAChallenge {
  id: string;
  expiresAt: string;
}

/**
 * MFA Repository - Multi-Factor Authentication
 */
export class MFARepository {
  /**
   * Check if user has MFA enabled
   */
  async hasMFAEnabled(userId: string): Promise<Result<boolean>> {
    try {
      const sb = getSupabase();
      if (!sb) {
        return createErrorResult('Supabase bağlantısı yok', RepositoryErrorCode.NETWORK_ERROR);
      }

      const { data, error } = await sb
        .from('user_mfa')
        .select('id')
        .eq('user_id', userId)
        .eq('enabled', true)
        .single();

      if (error && error.code !== 'PGRST116') {
        return createErrorResult(error.message, RepositoryErrorCode.UNKNOWN);
      }

      return createSuccessResult(!!data);
    } catch (error) {
      return createErrorResult(
        error instanceof Error ? error.message : 'MFA kontrolü başarısız',
        RepositoryErrorCode.UNKNOWN
      );
    }
  }

  /**
   * Enroll MFA factor (TOTP)
   */
  async enrollMFA(_userId: string, friendlyName: string): Promise<Result<MFAEnrollment>> {
    try {
      const sb = getSupabase();
      if (!sb) {
        return createErrorResult('Supabase bağlantısı yok', RepositoryErrorCode.NETWORK_ERROR);
      }

      // Using Supabase's MFA API for TOTP enrollment
      const { data: factors, error: factorsError } = await sb.auth.mfa.listFactors();

      if (factorsError) {
        return createErrorResult(factorsError.message, RepositoryErrorCode.UNKNOWN);
      }

      // Check if TOTP already enrolled
      const existingTOTP = factors?.all?.find((f: any) => f.factor_type === 'totp' && f.status === 'verified');
      if (existingTOTP) {
        return createErrorResult('TOTP zaten kayıtlı', RepositoryErrorCode.CONFLICT);
      }

      // Enroll new TOTP factor
      const { data, error } = await sb.auth.mfa.enroll({
        factorType: 'totp',
        friendlyName,
      });

      if (error) {
        return createErrorResult(error.message, RepositoryErrorCode.UNKNOWN);
      }

      return createSuccessResult({
        qrCode: data?.totp.qr_code || '',
        secret: data?.totp.secret || '',
        verificationCode: data?.id || '',
      });
    } catch (error) {
      return createErrorResult(
        error instanceof Error ? error.message : 'MFA kaydı başarısız',
        RepositoryErrorCode.UNKNOWN
      );
    }
  }

  /**
   * Verify MFA factor
   */
  async verifyMFA(userId: string, factorId: string, code: string): Promise<Result<void>> {
    try {
      const sb = getSupabase();
      if (!sb) {
        return createErrorResult('Supabase bağlantısı yok', RepositoryErrorCode.NETWORK_ERROR);
      }

      const { error } = await sb.auth.mfa.challengeAndVerify({
        factorId,
        code,
      });

      if (error) {
        return createErrorResult(error.message, RepositoryErrorCode.UNKNOWN);
      }

      // Store verified factor in database
      const { error: dbError } = await sb
        .from('user_mfa')
        .upsert({
          user_id: userId,
          factor_id: factorId,
          enabled: true,
          updated_at: new Date().toISOString(),
        });

      if (dbError) {
        return createErrorResult(dbError.message, RepositoryErrorCode.UNKNOWN);
      }

      return createSuccessResult(undefined);
    } catch (error) {
      return createErrorResult(
        error instanceof Error ? error.message : 'MFA doğrulaması başarısız',
        RepositoryErrorCode.UNKNOWN
      );
    }
  }

  /**
   * Challenge MFA during login
   */
  async challengeMFA(_userId: string): Promise<Result<MFAChallenge>> {
    try {
      const sb = getSupabase();
      if (!sb) {
        return createErrorResult('Supabase bağlantısı yok', RepositoryErrorCode.NETWORK_ERROR);
      }

      // Get verified TOTP factor
      const { data: factors, error: factorsError } = await sb.auth.mfa.listFactors();

      if (factorsError) {
        return createErrorResult(factorsError.message, RepositoryErrorCode.UNKNOWN);
      }

      const totpFactor = factors?.all?.find((f: any) => f.factor_type === 'totp' && f.status === 'verified');
      if (!totpFactor) {
        return createErrorResult('MFA faktörü bulunamadı', RepositoryErrorCode.NOT_FOUND);
      }

      // Create challenge
      const { data, error } = await sb.auth.mfa.challenge({
        factorId: totpFactor.id,
      });

      if (error) {
        return createErrorResult(error.message, RepositoryErrorCode.UNKNOWN);
      }

      return createSuccessResult({
        id: data?.id || '',
        expiresAt: String(data?.expires_at || ''),
      });
    } catch (error) {
      return createErrorResult(
        error instanceof Error ? error.message : 'MFA challenge başarısız',
        RepositoryErrorCode.UNKNOWN
      );
    }
  }

  /**
   * Verify MFA challenge
   */
  async verifyMFAChallenge(challengeId: string, code: string, factorId: string): Promise<Result<void>> {
    try {
      const sb = getSupabase();
      if (!sb) {
        return createErrorResult('Supabase bağlantısı yok', RepositoryErrorCode.NETWORK_ERROR);
      }

      const { error } = await sb.auth.mfa.verify({
        challengeId,
        code,
        factorId,
      });

      if (error) {
        return createErrorResult(error.message, RepositoryErrorCode.UNKNOWN);
      }

      return createSuccessResult(undefined);
    } catch (error) {
      return createErrorResult(
        error instanceof Error ? error.message : 'MFA challenge doğrulaması başarısız',
        RepositoryErrorCode.UNKNOWN
      );
    }
  }

  /**
   * Disable MFA
   */
  async disableMFA(userId: string, factorId: string): Promise<Result<void>> {
    try {
      const sb = getSupabase();
      if (!sb) {
        return createErrorResult('Supabase bağlantısı yok', RepositoryErrorCode.NETWORK_ERROR);
      }

      // Unenroll factor
      const { error } = await sb.auth.mfa.unenroll({
        factorId,
      });

      if (error) {
        return createErrorResult(error.message, RepositoryErrorCode.UNKNOWN);
      }

      // Update database
      const { error: dbError } = await sb
        .from('user_mfa')
        .update({ enabled: false, updated_at: new Date().toISOString() })
        .eq('user_id', userId)
        .eq('factor_id', factorId);

      if (dbError) {
        return createErrorResult(dbError.message, RepositoryErrorCode.UNKNOWN);
      }

      return createSuccessResult(undefined);
    } catch (error) {
      return createErrorResult(
        error instanceof Error ? error.message : 'MFA devre dışı bırakma başarısız',
        RepositoryErrorCode.UNKNOWN
      );
    }
  }

  /**
   * List MFA factors
   */
  async listMFAs(userId: string): Promise<Result<MFAFactor[]>> {
    try {
      const sb = getSupabase();
      if (!sb) {
        return createErrorResult('Supabase bağlantısı yok', RepositoryErrorCode.NETWORK_ERROR);
      }

      const { data, error } = await sb
        .from('user_mfa')
        .select('*')
        .eq('user_id', userId)
        .eq('enabled', true);

      if (error) {
        return createErrorResult(error.message, RepositoryErrorCode.UNKNOWN);
      }

      const factors: MFAFactor[] = (data || []).map((f: any) => ({
        id: f.factor_id,
        friendlyName: f.friendly_name || 'TOTP',
        factorType: 'totp',
        status: 'verified',
        createdAt: f.created_at,
      }));

      return createSuccessResult(factors);
    } catch (error) {
      return createErrorResult(
        error instanceof Error ? error.message : 'MFA listesi alınamadı',
        RepositoryErrorCode.UNKNOWN
      );
    }
  }
}

// Singleton instance
export const mfaRepository = new MFARepository();
