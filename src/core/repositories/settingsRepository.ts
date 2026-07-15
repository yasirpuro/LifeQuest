import { getSupabase } from '../../shared/api/supabase';
import { createSuccessResult, createErrorResult, RepositoryErrorCode } from './baseRepository';
import type { Result } from './baseRepository';

export interface Preferences {
  locale: string;
  language: string;
  theme: string;
  notifications: boolean;
  soundEnabled: boolean;
  vibrationEnabled: boolean;
}

export class SettingsRepository {
  private cache: Map<string, Preferences> = new Map();

  async getPreferences(userId: string): Promise<Result<Preferences>> {
    try {
      if (this.cache.has(userId)) {
        return createSuccessResult(this.cache.get(userId)!);
      }

      const sb = getSupabase();
      if (!sb) {
        return createErrorResult('Supabase bağlantısı yok', RepositoryErrorCode.NETWORK_ERROR);
      }

      const { data, error } = await sb
        .from('user_preferences')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) {
        return createErrorResult(error.message, RepositoryErrorCode.UNKNOWN);
      }

      const prefs: Preferences = {
        locale: data?.locale || 'tr-TR',
        language: data?.language || 'tr',
        theme: data?.theme || 'auto',
        notifications: data?.notifications ?? true,
        soundEnabled: data?.sound_enabled ?? true,
        vibrationEnabled: data?.vibration_enabled ?? true,
      };

      this.cache.set(userId, prefs);
      return createSuccessResult(prefs);
    } catch (error) {
      return createErrorResult(
        error instanceof Error ? error.message : 'Preferences alınamadı',
        RepositoryErrorCode.UNKNOWN
      );
    }
  }

  async updatePreferences(userId: string, preferences: Partial<Preferences>): Promise<Result<Preferences>> {
    try {
      const sb = getSupabase();
      if (!sb) {
        return createErrorResult('Supabase bağlantısı yok', RepositoryErrorCode.NETWORK_ERROR);
      }

      const updateData: any = { updated_at: new Date().toISOString() };
      if (preferences.locale !== undefined) updateData.locale = preferences.locale;
      if (preferences.language !== undefined) updateData.language = preferences.language;
      if (preferences.theme !== undefined) updateData.theme = preferences.theme;
      if (preferences.notifications !== undefined) updateData.notifications = preferences.notifications;
      if (preferences.soundEnabled !== undefined) updateData.sound_enabled = preferences.soundEnabled;
      if (preferences.vibrationEnabled !== undefined) updateData.vibration_enabled = preferences.vibrationEnabled;

      const { data, error } = await sb
        .from('user_preferences')
        .upsert({ user_id: userId, ...updateData })
        .select()
        .single();

      if (error) {
        return createErrorResult(error.message, RepositoryErrorCode.UNKNOWN);
      }

      const updated: Preferences = {
        locale: data.locale || 'tr-TR',
        language: data.language || 'tr',
        theme: data.theme || 'auto',
        notifications: data.notifications ?? true,
        soundEnabled: data.sound_enabled ?? true,
        vibrationEnabled: data.vibration_enabled ?? true,
      };

      this.cache.set(userId, updated);
      return createSuccessResult(updated);
    } catch (error) {
      return createErrorResult(
        error instanceof Error ? error.message : 'Preferences güncellenemedi',
        RepositoryErrorCode.UNKNOWN
      );
    }
  }

  clearCache(): void {
    this.cache.clear();
  }
}

export const settingsRepository = new SettingsRepository();
