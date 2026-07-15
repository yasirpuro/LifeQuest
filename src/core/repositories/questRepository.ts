import { getSupabase } from '../../shared/api/supabase';
import type { Quest, LocationType } from '../../types';
import { 
  createSuccessResult, 
  createErrorResult, 
  RepositoryErrorCode 
} from './baseRepository';
import type { Result } from './baseRepository';

/**
 * QuestRepository - Single source of truth for quest data access
 * - Handles quest CRUD operations
 * - Persists quest completion results (after orchestrator logic)
 * - Provides caching for quest data
 * - Offline-ready fallback support
 * 
 * IMPORTANT: This repository does NOT contain business logic.
 * Quest completion logic is handled by the orchestrator.
 * This repository ONLY persists data.
 */
export class QuestRepository {
  private cache: Map<string, Quest[]> = new Map();
  private questCache: Map<string, Quest> = new Map();

  /**
   * Get all quests for a user
   */
  async getQuests(userId: string): Promise<Result<Quest[]>> {
    try {
      // Check cache first
      if (this.cache.has(userId)) {
        return createSuccessResult(this.cache.get(userId)!);
      }

      const sb = getSupabase();
      if (!sb) {
        return createErrorResult('Supabase bağlantısı yok', RepositoryErrorCode.NETWORK_ERROR);
      }

      const { data, error } = await sb
        .from('quests')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        return createErrorResult(error.message, RepositoryErrorCode.UNKNOWN);
      }

      this.cache.set(userId, data || []);
      return createSuccessResult(data || []);
    } catch (error) {
      return createErrorResult(
        error instanceof Error ? error.message : 'Görevler alınamadı',
        RepositoryErrorCode.UNKNOWN
      );
    }
  }

  /**
   * Get quest by ID
   */
  async getQuestById(id: string): Promise<Result<Quest | null>> {
    try {
      // Check cache first
      if (this.questCache.has(id)) {
        return createSuccessResult(this.questCache.get(id)!);
      }

      const sb = getSupabase();
      if (!sb) {
        return createErrorResult('Supabase bağlantısı yok', RepositoryErrorCode.NETWORK_ERROR);
      }

      const { data, error } = await sb
        .from('quests')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return createSuccessResult(null);
        }
        return createErrorResult(error.message, RepositoryErrorCode.NOT_FOUND);
      }

      this.questCache.set(id, data);
      return createSuccessResult(data);
    } catch (error) {
      return createErrorResult(
        error instanceof Error ? error.message : 'Görev alınamadı',
        RepositoryErrorCode.UNKNOWN
      );
    }
  }

  /**
   * Create new quest
   */
  async createQuest(quest: Omit<Quest, 'id'>): Promise<Result<Quest>> {
    try {
      const sb = getSupabase();
      if (!sb) {
        return createErrorResult('Supabase bağlantısı yok', RepositoryErrorCode.NETWORK_ERROR);
      }

      const { data, error } = await sb
        .from('quests')
        .insert(quest)
        .select()
        .single();

      if (error) {
        return createErrorResult(error.message, RepositoryErrorCode.UNKNOWN);
      }

      // Update cache
      this.questCache.set(data.id, data);
      
      // Invalidate user's quest cache
      const userId = (quest as any).user_id;
      if (userId && this.cache.has(userId)) {
        this.cache.delete(userId);
      }

      return createSuccessResult(data);
    } catch (error) {
      return createErrorResult(
        error instanceof Error ? error.message : 'Görev oluşturulamadı',
        RepositoryErrorCode.UNKNOWN
      );
    }
  }

  /**
   * Bulk create quests
   */
  async createQuests(quests: Omit<Quest, 'id'>[]): Promise<Result<Quest[]>> {
    try {
      const sb = getSupabase();
      if (!sb) {
        return createErrorResult('Supabase bağlantısı yok', RepositoryErrorCode.NETWORK_ERROR);
      }

      const { data, error } = await sb
        .from('quests')
        .insert(quests)
        .select();

      if (error) {
        return createErrorResult(error.message, RepositoryErrorCode.UNKNOWN);
      }

      // Invalidate caches
      this.cache.clear();
      this.questCache.clear();

      return createSuccessResult(data || []);
    } catch (error) {
      return createErrorResult(
        error instanceof Error ? error.message : 'Görevler oluşturulamadı',
        RepositoryErrorCode.UNKNOWN
      );
    }
  }


  /**
   * Update quest
   */
  async updateQuest(id: string, patch: Partial<Quest>): Promise<Result<Quest>> {
    try {
      const sb = getSupabase();
      if (!sb) {
        return createErrorResult('Supabase bağlantısı yok', RepositoryErrorCode.NETWORK_ERROR);
      }

      const { data, error } = await sb
        .from('quests')
        .update(patch)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        return createErrorResult(error.message, RepositoryErrorCode.UNKNOWN);
      }

      // Update cache
      this.questCache.set(id, data);

      // Invalidate user's quest cache
      const userId = (data as any).user_id;
      if (userId && this.cache.has(userId)) {
        this.cache.delete(userId);
      }

      return createSuccessResult(data);
    } catch (error) {
      return createErrorResult(
        error instanceof Error ? error.message : 'Görev güncellenemedi',
        RepositoryErrorCode.UNKNOWN
      );
    }
  }

  /**
   * Delete quest
   */
  async deleteQuest(id: string): Promise<Result<void>> {
    try {
      const sb = getSupabase();
      if (!sb) {
        return createErrorResult('Supabase bağlantısı yok', RepositoryErrorCode.NETWORK_ERROR);
      }

      const { error } = await sb
        .from('quests')
        .delete()
        .eq('id', id);

      if (error) {
        return createErrorResult(error.message, RepositoryErrorCode.UNKNOWN);
      }

      // Remove from cache
      this.questCache.delete(id);

      // Invalidate user's quest cache (we don't have userId here, so clear all)
      this.cache.clear();

      return createSuccessResult(undefined);
    } catch (error) {
      return createErrorResult(
        error instanceof Error ? error.message : 'Görev silinemedi',
        RepositoryErrorCode.UNKNOWN
      );
    }
  }

  /**
   * Save quest completion result (after orchestrator logic)
   * This is a persistence-only operation - no business logic
   */
  async saveQuestCompletion(
    questId: string,
    completionData: {
      completed: boolean;
      completedAt?: string;
      verificationNote?: string;
      xpEarned?: number;
    }
  ): Promise<Result<Quest>> {
    try {
      const sb = getSupabase();
      if (!sb) {
        return createErrorResult('Supabase bağlantısı yok', RepositoryErrorCode.NETWORK_ERROR);
      }

      const { data, error } = await sb
        .from('quests')
        .update(completionData)
        .eq('id', questId)
        .select()
        .single();

      if (error) {
        return createErrorResult(error.message, RepositoryErrorCode.UNKNOWN);
      }

      // Update cache
      this.questCache.set(questId, data);

      // Invalidate user's quest cache
      const userId = (data as any).user_id;
      if (userId && this.cache.has(userId)) {
        this.cache.delete(userId);
      }

      return createSuccessResult(data);
    } catch (error) {
      return createErrorResult(
        error instanceof Error ? error.message : 'Görev tamamlanması kaydedilemedi',
        RepositoryErrorCode.UNKNOWN
      );
    }
  }

  /**
   * Get quests by location
   */
  async getQuestsByLocation(userId: string, location: LocationType): Promise<Result<Quest[]>> {
    try {
      const sb = getSupabase();
      if (!sb) {
        return createErrorResult('Supabase bağlantısı yok', RepositoryErrorCode.NETWORK_ERROR);
      }

      const { data, error } = await sb
        .from('quests')
        .select('*')
        .eq('user_id', userId)
        .eq('location', location)
        .order('created_at', { ascending: false });

      if (error) {
        return createErrorResult(error.message, RepositoryErrorCode.UNKNOWN);
      }

      return createSuccessResult(data || []);
    } catch (error) {
      return createErrorResult(
        error instanceof Error ? error.message : 'Konuma göre görevler alınamadı',
        RepositoryErrorCode.UNKNOWN
      );
    }
  }

  /**
   * Clear all caches
   */
  clearCache(): void {
    this.cache.clear();
    this.questCache.clear();
  }

  /**
   * Clear cache for specific user
   */
  clearUserCache(userId: string): void {
    this.cache.delete(userId);
  }
}

// Singleton instance
export const questRepository = new QuestRepository();
