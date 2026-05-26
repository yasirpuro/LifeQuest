import { Award, Flame, Target, TrendingUp, Crown, Lock } from 'lucide-react';
import { useApp } from '../hooks/useApp';
import { WEEKLY_STATS } from '../data/quests';
import PremiumBanner from '../components/PremiumBanner';
import BottomNav from '../components/BottomNav';
import styles from './Profile.module.css';

export default function Profile() {
  const { user, setShowPremiumModal } = useApp();

  const xpPercent = user.xpToNext > 0 ? (user.xp / user.xpToNext) * 100 : 0;
  const totalXp = WEEKLY_STATS.reduce((sum, s) => sum + s.xp, 0);
  const unlockedBadges = user.badges.filter(b => b.unlocked);
  const lockedBadges = user.badges.filter(b => !b.unlocked);

  return (
    <div className={styles.page}>
      <div className={styles.headerBg} />

      <div className={styles.profileSection}>
        <div className={styles.avatarWrap}>
          <div className={styles.avatar}>
            {user.avatar ? (
              <img src={user.avatar} alt="" />
            ) : (
              <span>{user.name.charAt(0)}</span>
            )}
          </div>
          {user.isPremium && (
            <div className={styles.premiumBadge}>
              <Crown size={12} />
            </div>
          )}
        </div>

        <h1 className={styles.name}>{user.name}</h1>
        {user.bio && <p className={styles.bio}>{user.bio}</p>}

        <div className={styles.levelRow}>
          <span className={styles.levelTag}>Seviye {user.level}</span>
          <div className={styles.xpBar}>
            <div className={styles.xpFill} style={{ width: `${xpPercent}%` }} />
          </div>
          <span className={styles.xpLabel}>{user.xp}/{user.xpToNext}</span>
        </div>
      </div>

      <div className={styles.statsRow}>
        <div className={styles.stat}>
          <Target size={20} className={styles.iconBlue} />
          <span className={styles.statVal}>{user.totalQuests}</span>
          <span className={styles.statLbl}>Gorev</span>
        </div>
        <div className={styles.divider} />
        <div className={styles.stat}>
          <Flame size={20} className={styles.iconOrange} />
          <span className={styles.statVal}>{user.streak}</span>
          <span className={styles.statLbl}>Seri</span>
        </div>
        <div className={styles.divider} />
        <div className={styles.stat}>
          <TrendingUp size={20} className={styles.iconGreen} />
          <span className={styles.statVal}>{totalXp}</span>
          <span className={styles.statLbl}>XP</span>
        </div>
        <div className={styles.divider} />
        <div className={styles.stat}>
          <Award size={20} className={styles.iconPurple} />
          <span className={styles.statVal}>{unlockedBadges.length}</span>
          <span className={styles.statLbl}>Rozet</span>
        </div>
      </div>

      <PremiumBanner />

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Rozetler</h3>
        <div className={styles.badgeGrid}>
          {unlockedBadges.map(badge => (
            <div key={badge.id} className={styles.badge}>
              <span className={styles.badgeIcon}>{badge.icon}</span>
              <span className={styles.badgeName}>{badge.name}</span>
            </div>
          ))}
          {lockedBadges.map(badge => (
            <div
              key={badge.id}
              className={`${styles.badge} ${styles.badgeLocked}`}
              onClick={badge.premium ? () => setShowPremiumModal(true) : undefined}
            >
              <span className={styles.badgeIcon}>
                {badge.premium ? <Lock size={20} /> : badge.icon}
              </span>
              <span className={styles.badgeName}>{badge.name}</span>
              {badge.premium && <span className={styles.premTag}>Premium</span>}
            </div>
          ))}
        </div>
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Haftalik Istatistik</h3>
        <div className={styles.weekGrid}>
          {WEEKLY_STATS.map(stat => (
            <div key={stat.day} className={styles.weekCard}>
              <span className={styles.weekDay}>{stat.day}</span>
              <span className={styles.weekVal}>{stat.quests}</span>
              <span className={styles.weekLbl}>gorev</span>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.bottomPad} />
      <BottomNav />
    </div>
  );
}
