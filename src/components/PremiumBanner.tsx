import { Crown, ChevronRight } from 'lucide-react';
import { useApp } from '../hooks/useApp';
import styles from './PremiumBanner.module.css';

export default function PremiumBanner() {
  const { user, setShowPremiumModal } = useApp();

  if (user.isPremium) return null;

  return (
    <button className={styles.banner} onClick={() => setShowPremiumModal(true)}>
      <div className={styles.iconWrap}>
        <Crown size={20} />
      </div>
      <div className={styles.text}>
        <span className={styles.title}>Premium'u dene - 7 gun ucretsiz</span>
        <span className={styles.sub}>Sinirsiz gorev, tum mekanlar, ozel rozetler</span>
      </div>
      <ChevronRight size={20} className={styles.arrow} />
    </button>
  );
}
