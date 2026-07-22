import { useState } from 'react';
import { Target } from 'lucide-react';
import styles from './LevelAssessmentModal.module.css';
import type { LocationOption, CategoryPreference } from '../types';

interface Props {
  location?: LocationOption;
  onComplete: (pref: CategoryPreference) => void;
}

export default function LevelAssessmentModal({ location, onComplete }: Props) {
  const [experience, setExperience] = useState<'yeni' | 'orta' | 'ileri' | null>(null);
  const [time, setTime] = useState<15 | 30 | 60 | 90 | null>(null);

  const handleSubmit = () => {
    if (experience === null || time === null) return;
    onComplete({ experience, duration: time });
  };

  const locationLabel = location?.label || 'Seçilen alan';

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.icon}>
          <Target size={32} />
        </div>
        
        <h2 className={styles.title}>Hedef Belirleme</h2>
        <p className={styles.subtitle}>
          {locationLabel} kategorisi için sana en uygun görevleri hazırlamamız için birkaç soruya cevap ver.
        </p>

        <div className={styles.question}>
          <span className={styles.questionTitle}>1. Bu alandaki mevcut tecrüben/bilgin nedir?</span>
          <div className={styles.options}>
            <button 
              className={`${styles.optionBtn} ${experience === 'yeni' ? styles.selected : ''}`}
              onClick={() => setExperience('yeni')}
            >
              <span>🌱 Hiç yok / Yeni başlıyorum</span>
            </button>
            <button 
              className={`${styles.optionBtn} ${experience === 'orta' ? styles.selected : ''}`}
              onClick={() => setExperience('orta')}
            >
              <span>🌿 Biraz tecrübem var</span>
            </button>
            <button 
              className={`${styles.optionBtn} ${experience === 'ileri' ? styles.selected : ''}`}
              onClick={() => setExperience('ileri')}
            >
              <span>🌳 İleri seviyedeyim</span>
            </button>
          </div>
        </div>

        <div className={styles.question}>
          <span className={styles.questionTitle}>2. Günlük ne kadar zaman ayırabilirsin?</span>
          <div className={styles.options}>
            <button 
              className={`${styles.optionBtn} ${time === 15 ? styles.selected : ''}`}
              onClick={() => setTime(15)}
            >
              <span>⏱️ 15 Dakika (Hızlı)</span>
            </button>
            <button 
              className={`${styles.optionBtn} ${time === 30 ? styles.selected : ''}`}
              onClick={() => setTime(30)}
            >
              <span>⏳ 30 Dakika (Normal)</span>
            </button>
            <button 
              className={`${styles.optionBtn} ${time === 60 ? styles.selected : ''}`}
              onClick={() => setTime(60)}
            >
              <span>🕰️ 1 Saat (Ciddi)</span>
            </button>
            <button 
              className={`${styles.optionBtn} ${time === 90 ? styles.selected : ''}`}
              onClick={() => setTime(90)}
            >
              <span>🔥 1.5 Saat (Adanmış)</span>
            </button>
          </div>
        </div>

        <button 
          className={styles.submitBtn} 
          disabled={experience === null || time === null}
          onClick={handleSubmit}
        >
          Seviyemi Belirle
        </button>
      </div>
    </div>
  );
}
