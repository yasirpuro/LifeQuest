import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react';
import { useAuth } from '../auth/authContext';
import { settingsRepository, type Preferences } from '../../core/repositories/settingsRepository';

interface SettingsContextValue {
  preferences: Preferences;
  isLoading: boolean;
  updatePreferences: (patch: Partial<Preferences>) => Promise<void>;
}

const defaultPreferences: Preferences = {
  locale: 'tr-TR',
  language: 'tr',
  theme: 'auto',
  notifications: true,
  soundEnabled: true,
  vibrationEnabled: true,
};

const SettingsContext = createContext<SettingsContextValue | null>(null);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const { userProfile } = useAuth();
  const [preferences, setPreferences] = useState<Preferences>(defaultPreferences);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadPreferences = async () => {
      if (!userProfile?.id) return;
      setIsLoading(true);
      const result = await settingsRepository.getPreferences(userProfile.id);
      if (result.success && result.data) {
        setPreferences(result.data);
      }
      setIsLoading(false);
    };

    void loadPreferences();
  }, [userProfile?.id]);

  const updatePreferences = useCallback(async (patch: Partial<Preferences>) => {
    if (!userProfile?.id) return;
    const result = await settingsRepository.updatePreferences(userProfile.id, patch);
    if (result.success && result.data) {
      setPreferences(result.data);
    }
  }, [userProfile?.id]);

  return (
    <SettingsContext.Provider value={{ preferences, isLoading, updatePreferences }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) throw new Error('useSettings must be used within SettingsProvider');
  return context;
}
