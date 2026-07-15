import { Crown, X, Zap, Users, MapPin, Award, Check } from 'lucide-react';
import { useQuest } from '../features/quests/questContext';
import styles from './PremiumModal.module.css';

export default function PremiumModal() {
  const { showPremiumModal, setShowPremiumModal } = useQuest();

  if (!showPremiumModal) return null;

  const features = [
    { icon: <Zap size={18} />, text: 'Sinirsiz gorev' },
    { icon: <MapPin size={18} />, text: 'Tum mekanlar acik' },
    { icon: <Users size={18} />, text: 'Arkadas ekleme' },
    { icon: <MapPin size={18} />, text: 'Konum paylasimi' },
    { icon: <Award size={18} />, text: 'Ozel rozetler' },
  ];

  return (
    <div className={styles.overlay} onClick={() => setShowPremiumModal(false)}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <button className={styles.close} onClick={() => setShowPremiumModal(false)}>
          <X size={20} />
        </button>

        <div className={styles.crown}>
          <Crown size={48} />
        </div>

        <h2 className={styles.title}>LifeQuest Premium</h2>
        <p className={styles.subtitle}>Hayatini oyunlastir, limitlerini kaldir!</p>

        <div className={styles.price}>
          <span className={styles.amount}>$4.99</span>
          <span className={styles.period}>/ay</span>
        </div>

        <ul className={styles.features}>
          {features.map((f, i) => (
            <li key={i} className={styles.feature}>
              <span className={styles.featureIcon}>{f.icon}</span>
              <span>{f.text}</span>
              <Check size={16} className={styles.check} />
            </li>
          ))}
        </ul>

        <button
          className={styles.cta}
          onClick={() => {
            // Premium upgrade logic would go here
            // For now, just close the modal
            setShowPremiumModal(false);
          }}
        >
          7 Gun Ucretsiz Dene
        </button>

        <p className={styles.disclaimer}>Istedigin zaman iptal et. Deneme suresi bittikten sonra aylik $4.99.</p>
      </div>
    </div>
  );
}
