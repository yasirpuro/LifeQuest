import { useState } from 'react';
import { useApp } from '../hooks/useApp';
import { isOnboardingDone as persistIsOnboardingDone, markOnboardingDone as persistMarkOnboardingDone } from '../utils/persistenceOwner';
import { SKILL_TREE } from '../data/skillTree';
import styles from './OnboardingWizard.module.css';

// WizardStep type removed (unused)

export function isOnboardingDone(): boolean {
  return persistIsOnboardingDone();
}

export function markOnboardingDone() {
  return persistMarkOnboardingDone();
}

export default function OnboardingWizard({ onComplete }: { onComplete?: () => void }) {
  const { skillEngine } = useApp();
  const [step, setStep] = useState<'welcome' | 'skills' | 'focus' | 'complete'>('welcome');
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);

  const handleNext = () => {
    if (step === 'welcome') setStep('skills');
    else if (step === 'skills') setStep('focus');
    else if (step === 'focus') {
      if (selectedSkill && skillEngine) {
        // Set first focus skill
        skillEngine.getFocusSkill();
        markOnboardingDone();
        setStep('complete');
        onComplete?.();
      }
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        {step === 'welcome' && (
          <div className={styles.content}>
            <h1>🎮 LifeQuest'e Hoş Geldin!</h1>
            <p>Hayatını RPG'ye çevirme zamanı. Her görev tamamla, skill master ol, streak'i kaybet ettirme.</p>
            <button onClick={handleNext} className={styles.btn}>Başla</button>
          </div>
        )}

        {step === 'skills' && (
          <div className={styles.content}>
            <h2>📚 Hangi Alanlara Odaklanmak İstiyorsun?</h2>
            <p>Skill tree'deki kategoriler:</p>
            <div className={styles.skillGrid}>
              {SKILL_TREE.map((skill) => (
                <div
                  key={skill.id}
                  className={`${styles.skillCard} ${selectedSkill === skill.id ? styles.selected : ''}`}
                  onClick={() => setSelectedSkill(skill.id)}
                >
                  <span className={styles.name}>{skill.name}</span>
                  <span className={styles.desc}>{skill.description}</span>
                </div>
              ))}
            </div>
            <div className={styles.actions}>
              <button onClick={() => setStep('welcome')} className={styles.btnSecondary}>Geri</button>
              <button onClick={handleNext} disabled={!selectedSkill} className={styles.btn}>
                Devam Et
              </button>
            </div>
          </div>
        )}

        {step === 'focus' && (
          <div className={styles.content}>
            <h2>🎯 Bugünkü Odağı Seç</h2>
            <p>Hangi skill'i güçlendir?</p>
            <div className={styles.focusInfo}>
              <p>Seçtin: <strong>{selectedSkill}</strong></p>
              <p className={styles.small}>Her gün bu skill'e odaklanıp XP kazanacaksın. Mastery arttıkça yeni challenge'lar unlock olur.</p>
            </div>
            <div className={styles.actions}>
              <button onClick={() => setStep('skills')} className={styles.btnSecondary}>Geri</button>
              <button onClick={handleNext} className={styles.btn}>Tamamla</button>
            </div>
          </div>
        )}

        {step === 'complete' && (
          <div className={styles.content}>
            <h1>🚀 Başarılı!</h1>
            <p>Skill engine'i başlattın. Dashboard'dan başla!</p>
            <button onClick={onComplete} className={styles.btn}>Dashboard'a Git</button>
          </div>
        )}
      </div>
    </div>
  );
}
