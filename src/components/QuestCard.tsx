import { useState } from 'react';
import { Clock, Flame, Brain, Lock, Check, Share2 } from 'lucide-react';
import type { Quest } from '../types';
import { useApp } from '../hooks/useApp';
import VerificationModal from './VerificationModal';
import styles from './QuestCard.module.css';

interface Props {
  quest: Quest;
  index: number;
  onShare: (quest: Quest) => void;
}

export default function QuestCard({ quest, index, onShare }: Props) {
  const { completeQuest, canDoQuest, setShowPremiumModal, user } = useApp();
  const [isVerifyOpen, setIsVerifyOpen] = useState(false);

  const difficultyStars = Array.from({ length: 5 }, (_, i) => (
    <span key={i} className={i < quest.difficulty ? styles.starActive : styles.star}>&#9733;</span>
  ));

  const handleComplete = () => {
    if (quest.locked && !user.isPremium) {
      setShowPremiumModal(true);
      return;
    }
    if (!canDoQuest()) {
      setShowPremiumModal(true);
      return;
    }
    setIsVerifyOpen(true);
  };

  return (
    <div
      className={`${styles.card} ${quest.completed ? styles.completed : ''} ${quest.locked && !user.isPremium ? styles.locked : ''}`}
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      {quest.locked && !user.isPremium && (
        <div className={styles.lockOverlay} onClick={() => setShowPremiumModal(true)}>
          <Lock size={24} />
          <span>Premium</span>
        </div>
      )}

      <div className={styles.header}>
        <div className={styles.titleRow}>
          <h3 className={styles.title}>{quest.title}</h3>
          <div className={styles.difficulty}>{difficultyStars}</div>
        </div>
        <p className={styles.description}>{quest.description}</p>
      </div>

      <div className={styles.tags}>
        <span className={styles.tag}>
          <Brain size={14} />
          Dopamin +{quest.dopamine}%
        </span>
        <span className={styles.tag}>
          <Clock size={14} />
          {quest.duration} dk
        </span>
        {quest.calories > 0 && (
          <span className={styles.tag}>
            <Flame size={14} />
            {quest.calories} kcal
          </span>
        )}
      </div>

      <div className={styles.scienceTag}>
        <Brain size={12} />
        {quest.scienceTag}
      </div>

      {quest.completed && quest.verificationNote && (
        <div className={styles.proofNote}>
          <span>📝 Kanıt:</span> {quest.verificationNote}
        </div>
      )}

      <div className={styles.actions}>
        {quest.completed ? (
          <button className={styles.doneBtn} disabled>
            <Check size={16} />
            Tamamlandı!
          </button>
        ) : (
          <button className={styles.completeBtn} onClick={handleComplete}>
            Görevi Tamamla
          </button>
        )}
        <button className={styles.shareBtn} onClick={() => onShare(quest)}>
          <Share2 size={16} />
        </button>
      </div>

      {isVerifyOpen && (
        <VerificationModal
          questTitle={quest.title}
          placeholder={
            quest.location === 'din'
              ? 'Örn: Bugün namazlarımı vaktinde kıldım, Kuran okudum, zikir çektim...'
              : quest.location === 'spor'
              ? 'Örn: Egzersiz setlerimi tamamladım, kalorimi takip ettim...'
              : quest.location === 'egitim'
              ? 'Örn: Pomodoro seanslarımı yaptım, 2 saat ders çalıştım...'
              : quest.location === 'dil'
              ? 'Örn: 20 kelime ezberledim, podcast dinledim, günlük yazdım...'
              : quest.location === 'lookmaxing'
              ? 'Örn: Cilt bakımımı yaptım, dik durdum, stil optimizasyonu yaptım...'
              : quest.location === 'futbol'
              ? 'Örn: Top kontrolü çalıştım, sprint yaptım, taktik izledim...'
              : quest.location === 'basketbol'
              ? 'Örn: Şut mekaniği çalıştım, dribbling drilleri yaptım...'
              : 'Örn: Görevi eksiksiz tamamladım, notlar aldım...'
          }
          onConfirm={(note) => {
            completeQuest(quest.id, note);
            setIsVerifyOpen(false);
          }}
          onClose={() => setIsVerifyOpen(false)}
        />
      )}
    </div>
  );
}


