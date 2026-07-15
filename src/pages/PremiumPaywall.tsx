import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Zap, Shield, TrendingUp, Sparkles, Check } from 'lucide-react';
import { trackEvent as trackBehaviorEvent } from '../core/services/analyticsService';
import styles from './PremiumPaywall.module.css';

export default function PremiumPaywall() {
  const navigate = useNavigate();

  // Track premium page open
  trackBehaviorEvent('premium_page_open');

  const handleStartTrial = () => {
    // Track trial button click
    trackBehaviorEvent('trial_button_click');
    console.log('[PREMIUM] Trial button clicked');
    // TODO: Implement trial logic
    navigate('/dashboard');
  };

  const handleBack = () => {
    navigate('/dashboard');
  };

  return (
    <div className={styles.container}>
      <button className={styles.backButton} onClick={handleBack}>
        <ArrowLeft size={24} />
      </button>

      <div className={styles.content}>
        <div className={styles.header}>
          <div className={styles.iconContainer}>
            <Sparkles className={styles.icon} size={48} />
          </div>
          <h1 className={styles.title}>LifeQuest Premium</h1>
          <p className={styles.subtitle}>Daha hızlı gelişen versiyonun</p>
        </div>

        <div className={styles.features}>
          <div className={styles.feature}>
            <div className={styles.featureIcon}>
              <Zap size={24} />
            </div>
            <div className={styles.featureContent}>
              <h3 className={styles.featureTitle}>Daha Fazla Günlük Quest</h3>
              <p className={styles.featureDescription}>5 yerine 3 günlük görev ile daha hızlı ilerle</p>
            </div>
          </div>

          <div className={styles.feature}>
            <div className={styles.featureIcon}>
              <Shield size={24} />
            </div>
            <div className={styles.featureContent}>
              <h3 className={styles.featureTitle}>Streak Freeze</h3>
              <p className={styles.featureDescription}>Streak'ini dondur, gün kaçırma</p>
            </div>
          </div>

          <div className={styles.feature}>
            <div className={styles.featureIcon}>
              <TrendingUp size={24} />
            </div>
            <div className={styles.featureContent}>
              <h3 className={styles.featureTitle}>Gelişmiş Skill Analizleri</h3>
              <p className={styles.featureDescription}>Detaylı ilerleme takibi ve öneriler</p>
            </div>
          </div>

          <div className={styles.feature}>
            <div className={styles.featureIcon}>
              <Sparkles size={24} />
            </div>
            <div className={styles.featureContent}>
              <h3 className={styles.featureTitle}>Özel Premium Aura</h3>
              <p className={styles.featureDescription}>Glow efektleri ve özel animasyonlar</p>
            </div>
          </div>
        </div>

        <div className={styles.pricing}>
          <div className={styles.trialCard}>
            <div className={styles.trialBadge}>7 GÜN ÜCRETSİZ</div>
            <h2 className={styles.trialTitle}>Hemen Başla</h2>
            <p className={styles.trialDescription}>
              Sonra aylık ₺49.99
            </p>
            <button className={styles.trialButton} onClick={handleStartTrial}>
              <span className={styles.trialButtonText}>7 Gün Ücretsiz Başla</span>
              <Check size={20} className={styles.trialButtonIcon} />
            </button>
          </div>
        </div>

        <div className={styles.trust}>
          <p className={styles.trustText}>
            İstediğin zaman iptal et. Kredi kartı gerekmez.
          </p>
        </div>
      </div>
    </div>
  );
}
