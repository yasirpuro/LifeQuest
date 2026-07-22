import { CheckCircle } from 'lucide-react';
import styles from './DifficultyFeedbackModal.module.css';

interface Props {
  onFeedback: (feedback: 'kolay' | 'orta' | 'zor') => void;
}

export default function DifficultyFeedbackModal({ onFeedback }: Props) {
  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.icon}>
          <CheckCircle size={32} />
        </div>
        
        <h2 className={styles.title}>Görev Tamamlandı!</h2>
        <p className={styles.subtitle}>
          Zorluğu sana göre ayarlayabilmemiz için bu görev nasıldı?
        </p>

        <div className={styles.options}>
          <button 
            className={`${styles.optionBtn} ${styles.easy}`}
            onClick={() => onFeedback('kolay')}
          >
            Kolay 🟢 (Zorlaştır)
          </button>
          
          <button 
            className={`${styles.optionBtn} ${styles.medium}`}
            onClick={() => onFeedback('orta')}
          >
            Tam Kararında 🟡
          </button>
          
          <button 
            className={`${styles.optionBtn} ${styles.hard}`}
            onClick={() => onFeedback('zor')}
          >
            Zorlandı 🔴 (Kolaylaştır)
          </button>
        </div>
      </div>
    </div>
  );
}
