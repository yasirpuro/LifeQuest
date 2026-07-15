import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import type { Quest, LocationType } from '../../types';
import { questRepository } from '../../core/repositories/questRepository';
import { QUESTS } from '../../data/quests';

interface QuestContextValue {
  quests: Quest[];
  isLoading: boolean;
  error: string | null;
  showPremiumModal: boolean;
  setShowPremiumModal: (show: boolean) => void;
  onboardingComplete: boolean;
  setOnboardingComplete: (complete: boolean) => void;
  selectedLocation: LocationType;
  setSelectedLocation: (location: LocationType) => void;
  freeQuestsToday: number;
  freeLocationsToday: number;
  loadQuests: () => Promise<void>;
  completeQuest: (questId: string, note?: string) => Promise<void>;
  canDoQuest: () => boolean;
  addQuest: (questOrTitle: string | Omit<Quest, 'id' | 'completed'>, difficulty?: number) => void;
  completeOnboarding: () => void;
  startChallenge: (location: LocationType, duration: number) => void;
}

const QuestContext = createContext<QuestContextValue | null>(null);

const fallbackQuestContext: QuestContextValue = {
  quests: [],
  isLoading: false,
  error: null,
  showPremiumModal: false,
  setShowPremiumModal: () => undefined,
  onboardingComplete: false,
  setOnboardingComplete: () => undefined,
  selectedLocation: 'din',
  setSelectedLocation: () => undefined,
  freeQuestsToday: 3,
  freeLocationsToday: 3,
  loadQuests: async () => undefined,
  completeQuest: async () => undefined,
  canDoQuest: () => true,
  addQuest: () => undefined,
  completeOnboarding: () => undefined,
  startChallenge: () => undefined,
};

export function QuestProvider({ children }: { children: ReactNode }) {
  const [quests, setQuests] = useState<Quest[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [onboardingComplete, setOnboardingComplete] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<LocationType>('din');
  const [freeQuestsToday, setFreeQuestsToday] = useState(3);
  const [freeLocationsToday] = useState(3);

  const loadQuests = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Try to resolve a user id from local demo or local profile
      let userId: string | null = null;
      try {
        const demoRaw = typeof window !== 'undefined' ? window.localStorage.getItem('lifequest_demo_user') : null;
        if (demoRaw) {
          const demo = JSON.parse(demoRaw);
          userId = demo?.id ?? null;
        }
      } catch {}

      if (!userId) {
        try {
          const localProfileRaw = typeof window !== 'undefined' ? window.localStorage.getItem('lifequest_local_profile') : null;
          if (localProfileRaw) {
            const lp = JSON.parse(localProfileRaw);
            userId = lp?.id ?? null;
          }
        } catch {}
      }

      // If we have a userId, attempt to load server-side quests; otherwise fall back to defaults
      if (userId) {
        const result = await questRepository.getQuests(userId);
        if (result.success && result.data && result.data.length > 0) {
          setQuests(result.data);
        } else {
          // No quests from server — use bundled defaults
          setQuests(QUESTS);
        }
      } else {
        setQuests(QUESTS);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Questler yüklenemedi');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Auto-load quests on provider mount so dashboard shows content immediately
  useEffect(() => {
    void loadQuests();
  }, [loadQuests]);

  const completeQuest = useCallback(async (questId: string, note?: string) => {
    try {
      const result = await questRepository.saveQuestCompletion(questId, { 
        completed: true,
        completedAt: new Date().toISOString(),
        verificationNote: note 
      });
      if (result.success) {
        setQuests(prev => prev.map(q => q.id === questId ? { ...q, completed: true } : q));
        setFreeQuestsToday(prev => Math.max(0, prev - 1));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Quest tamamlanamadı');
    }
  }, []);

  const canDoQuest = useCallback(() => {
    return freeQuestsToday > 0;
  }, [freeQuestsToday]);

  const addQuest = useCallback((questOrTitle: string | Omit<Quest, 'id' | 'completed'>, difficulty?: number) => {
    const baseQuest = typeof questOrTitle === 'string'
      ? {
          title: questOrTitle,
          description: 'Kendi eklediğin görev',
          location: 'din' as LocationType,
          difficulty: (difficulty ?? 3) as Quest['difficulty'],
          duration: 25,
          dopamine: 20,
          calories: 0,
          scienceTag: 'custom',
          locked: false,
        }
      : questOrTitle;

    const newQuest: Quest = {
      ...baseQuest,
      id: `quest-${Date.now()}`,
      completed: false,
    };
    setQuests(prev => [...prev, newQuest]);
  }, []);

  const completeOnboarding = useCallback(() => {
    setOnboardingComplete(true);
  }, []);

  const startChallenge = useCallback((location: LocationType, duration: number) => {
    setSelectedLocation(location);
    void duration;
  }, []);

  return (
    <QuestContext.Provider
      value={{
        quests,
        isLoading,
        error,
        showPremiumModal,
        setShowPremiumModal,
        onboardingComplete,
        setOnboardingComplete,
        selectedLocation,
        setSelectedLocation,
        freeQuestsToday,
        freeLocationsToday,
        loadQuests,
        completeQuest,
        canDoQuest,
        addQuest,
        completeOnboarding,
        startChallenge,
      }}
    >
      {children}
    </QuestContext.Provider>
  );
}

export function useQuest() {
  const context = useContext(QuestContext);
  return context ?? fallbackQuestContext;
}
