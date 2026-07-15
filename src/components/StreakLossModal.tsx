import { Heart, ArrowRight } from 'lucide-react';
import styles from './StreakLossModal.module.css';

interface StreakLossModalProps {
  streakLost: number;
  onClose: () => void;
  onContinue: () => void;
}

export default function StreakLossModal({ streakLost, onClose, onContinue }: StreakLossModalProps) {
  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <div className={styles.iconContainer}>
          <div className={styles.iconGlow} />
          <div className={styles.icon}>
            <Heart size={64} />
          </div>
        </div>

        <h2 className={styles.title}>💔 Serini Kaybettin</h2>
        <p className={styles.subtitle}>{streakLost} günlük seri bitti</p>

        <div className={styles.description}>
          <p className={styles.message}>
            Endişelenme, herkes bazen düşer.
          </p>
          <p className={styles.encouragement}>
            Önemli olan: kalkıp devam etmektir.
          </p>
        </div>

        <div className={styles.recovery}>
          <span className={styles.recoveryIcon}>🔥</span>
          <span className={styles.recoveryText}>
            Yeni seri başlat → streak'i geri kazanabilirsin
          </span>
        </div>

        <button className={styles.cta} onClick={onContinue}>
          <span className={styles.ctaText}>Yeni Seri Başlat</span>
          <ArrowRight size={20} className={styles.ctaIcon} />
        </button>
      </div>
    </div>
  );
}
