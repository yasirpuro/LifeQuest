import { getSupabase } from '../../shared/api/supabase';
import type { SkillProgress } from '../../types';
import { 
  createSuccessResult, 
  createErrorResult, 
  RepositoryErrorCode 
} from './baseRepository';
import type { Result } from './baseRepository';

/**
 * SkillRepository - Single source of truth for skill progress data access
 * - Handles skills progress load/save operations
 * - Persists skill progress results (after orchestrator logic)
 * - Provides caching for skill data
 * - Offline-ready fallback support
 * 
 * IMPORTANT: This repository does NOT contain business logic.
 * Skill calculation logic is handled by the orchestrator.
 * This repository ONLY persists data.
 */
export class SkillRepository {
  private cache: Map<string, Record<string, SkillProgress>> = new Map();

  /**
   * Get skills progress for a user
   */
  async getSkillsProgress(userId: string): Promise<Result<Record<string, SkillProgress>>> {
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
        .from('skills_progress')
        .select('*')
        .eq('user_id', userId);

      if (error) {
        return createErrorResult(error.message, RepositoryErrorCode.UNKNOWN);
      }

      // Convert array to record
      const progressMap: Record<string, SkillProgress> = {};
      if (data) {
        data.forEach((item: any) => {
          progressMap[item.skill_id] = {
            skillId: item.skill_id,
            xp: item.xp,
            mastery: item.mastery,
            lastPracticed: item.last_practiced,
            nextDue: item.next_due,
            decayRate: item.decay_rate,
            lastDecayCheck: item.last_decay_check,
          };
        });
      }

      this.cache.set(userId, progressMap);
      return createSuccessResult(progressMap);
    } catch (error) {
      return createErrorResult(
        error instanceof Error ? error.message : 'Beceri ilerlemesi alınamadı',
        RepositoryErrorCode.UNKNOWN
      );
    }
  }

  /**
   * Get skill progress for a specific skill
   */
  async getSkillProgress(userId: string, skillId: string): Promise<Result<SkillProgress | null>> {
    try {
      const sb = getSupabase();
      if (!sb) {
        return createErrorResult('Supabase bağlantısı yok', RepositoryErrorCode.NETWORK_ERROR);
      }

      const { data, error } = await sb
        .from('skills_progress')
        .select('*')
        .eq('user_id', userId)
        .eq('skill_id', skillId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return createSuccessResult(null);
        }
        return createErrorResult(error.message, RepositoryErrorCode.NOT_FOUND);
      }

      const progress: SkillProgress = {
        skillId: skillId,
        xp: data.xp,
        mastery: data.mastery,
        lastPracticed: data.last_practiced,
        nextDue: data.next_due,
        decayRate: data.decay_rate,
        lastDecayCheck: data.last_decay_check,
      };

      return createSuccessResult(progress);
    } catch (error) {
      return createErrorResult(
        error instanceof Error ? error.message : 'Beceri ilerlemesi alınamadı',
        RepositoryErrorCode.UNKNOWN
      );
    }
  }

  /**
   * Save skills progress (after orchestrator logic)
   * This is a persistence-only operation - no business logic
   */
  async saveSkillsProgress(
    userId: string,
    progressMap: Record<string, SkillProgress>
  ): Promise<Result<void>> {
    try {
      const sb = getSupabase();
      if (!sb) {
        return createErrorResult('Supabase bağlantısı yok', RepositoryErrorCode.NETWORK_ERROR);
      }

      // Upsert all skills progress
      const records = Object.entries(progressMap).map(([skillId, progress]) => ({
        user_id: userId,
        skill_id: skillId,
        xp: progress.xp,
        mastery: progress.mastery,
        last_practiced: progress.lastPracticed,
        next_due: progress.nextDue,
        decay_rate: progress.decayRate,
        last_decay_check: progress.lastDecayCheck,
      }));

      const { error } = await sb
        .from('skills_progress')
        .upsert(records, { onConflict: 'user_id,skill_id' });

      if (error) {
        return createErrorResult(error.message, RepositoryErrorCode.UNKNOWN);
      }

      // Update cache
      this.cache.set(userId, progressMap);

      return createSuccessResult(undefined);
    } catch (error) {
      return createErrorResult(
        error instanceof Error ? error.message : 'Beceri ilerlemesi kaydedilemedi',
        RepositoryErrorCode.UNKNOWN
      );
    }
  }

  /**
   * Update a single skill progress
   */
  async updateSkillProgress(
    userId: string,
    skillId: string,
    patch: Partial<SkillProgress>
  ): Promise<Result<SkillProgress>> {
    try {
      const sb = getSupabase();
      if (!sb) {
        return createErrorResult('Supabase bağlantısı yok', RepositoryErrorCode.NETWORK_ERROR);
      }

      const updateData: any = {};
      if (patch.xp !== undefined) updateData.xp = patch.xp;
      if (patch.mastery !== undefined) updateData.mastery = patch.mastery;
      if (patch.lastPracticed !== undefined) updateData.last_practiced = patch.lastPracticed;
      if (patch.nextDue !== undefined) updateData.next_due = patch.nextDue;
      if (patch.decayRate !== undefined) updateData.decay_rate = patch.decayRate;
      if (patch.lastDecayCheck !== undefined) updateData.last_decay_check = patch.lastDecayCheck;

      const { data, error } = await sb
        .from('skills_progress')
        .update(updateData)
        .eq('user_id', userId)
        .eq('skill_id', skillId)
        .select()
        .single();

      if (error) {
        return createErrorResult(error.message, RepositoryErrorCode.UNKNOWN);
      }

      const progress: SkillProgress = {
        skillId: skillId,
        xp: data.xp,
        mastery: data.mastery,
        lastPracticed: data.last_practiced,
        nextDue: data.next_due,
        decayRate: data.decay_rate,
        lastDecayCheck: data.last_decay_check,
      };

      // Update cache
      if (this.cache.has(userId)) {
        const cached = this.cache.get(userId)!;
        cached[skillId] = progress;
        this.cache.set(userId, cached);
      }

      return createSuccessResult(progress);
    } catch (error) {
      return createErrorResult(
        error instanceof Error ? error.message : 'Beceri ilerlemesi güncellenemedi',
        RepositoryErrorCode.UNKNOWN
      );
    }
  }

  /**
   * Delete skill progress
   */
  async deleteSkillProgress(userId: string, skillId: string): Promise<Result<void>> {
    try {
      const sb = getSupabase();
      if (!sb) {
        return createErrorResult('Supabase bağlantısı yok', RepositoryErrorCode.NETWORK_ERROR);
      }

      const { error } = await sb
        .from('skills_progress')
        .delete()
        .eq('user_id', userId)
        .eq('skill_id', skillId);

      if (error) {
        return createErrorResult(error.message, RepositoryErrorCode.UNKNOWN);
      }

      // Update cache
      if (this.cache.has(userId)) {
        const cached = this.cache.get(userId)!;
        delete cached[skillId];
        this.cache.set(userId, cached);
      }

      return createSuccessResult(undefined);
    } catch (error) {
      return createErrorResult(
        error instanceof Error ? error.message : 'Beceri ilerlemesi silinemedi',
        RepositoryErrorCode.UNKNOWN
      );
    }
  }

  /**
   * Clear all caches
   */
  clearCache(): void {
    this.cache.clear();
  }

  /**
   * Clear cache for specific user
   */
  clearUserCache(userId: string): void {
    this.cache.delete(userId);
  }
}

// Singleton instance
export const skillRepository = new SkillRepository();
