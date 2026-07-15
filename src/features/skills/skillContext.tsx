import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { Skill, SkillProgress } from '../../types';
import { skillRepository } from '../../core/repositories/skillRepository';

interface SkillContextValue {
  skills: Skill[];
  skillsProgress: Record<string, SkillProgress>;
  skillProgress: Record<string, SkillProgress>;
  skillEngine: any;
  isLoading: boolean;
  error: string | null;
  completionResult: { xpEarned: number; leveledUp: boolean; newLevel: number } | null;
  loadSkills: () => Promise<void>;
  updateSkillProgress: (skillId: string, progress: Partial<SkillProgress>) => Promise<void>;
  getSkillProgress: (skillId: string) => SkillProgress | null;
}

const SkillContext = createContext<SkillContextValue | null>(null);

export function SkillProvider({ children }: { children: ReactNode }) {
  const [skills] = useState<Skill[]>([]);
  const [skillProgress, setSkillProgress] = useState<Record<string, SkillProgress>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [skillEngine] = useState<any>(null);

  const loadSkills = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await skillRepository.getSkillsProgress('user-id');
      if (result.success && result.data) {
        setSkillProgress(result.data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Skill progress yüklenemedi');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateSkillProgress = useCallback(async (skillId: string, progress: Partial<SkillProgress>) => {
    try {
      const result = await skillRepository.updateSkillProgress('user-id', skillId, progress);
      if (result.success && result.data) {
        setSkillProgress(prev => ({
          ...prev,
          [skillId]: result.data!,
        }));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Skill progress güncellenemedi');
    }
  }, []);

  const getSkillProgress = useCallback((skillId: string) => {
    return skillProgress[skillId] || null;
  }, [skillProgress]);

  return (
    <SkillContext.Provider
      value={{
        skills,
        skillsProgress: skillProgress,
        skillProgress,
        skillEngine,
        isLoading,
        error,
        completionResult: null,
        loadSkills,
        updateSkillProgress,
        getSkillProgress,
      }}
    >
      {children}
    </SkillContext.Provider>
  );
}

export function useSkill() {
  const context = useContext(SkillContext);
  if (!context) {
    throw new Error('useSkill must be used within SkillProvider');
  }
  return context;
}
