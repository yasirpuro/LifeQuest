import { Award, Flame, Target, TrendingUp, Crown, Lock } from 'lucide-react';
import { useAuth } from '../features/auth/authContext';
import { useQuest } from '../features/quests/questContext';
import { WEEKLY_STATS } from '../data/quests';
import PremiumBanner from '../components/PremiumBanner';
import BottomNav from '../components/BottomNav';
import styles from './Profile.module.css';

export default function Profile() {
  const { userProfile } = useAuth();
  const { setShowPremiumModal } = useQuest();

  const xpPercent = userProfile?.xpToNext && userProfile?.xpToNext > 0 ? (userProfile.xp / userProfile.xpToNext) * 100 : 0;
  const totalXp = WEEKLY_STATS.reduce((sum, s) => sum + s.xp, 0);
  const unlockedBadges = userProfile?.badges?.filter(b => b.unlocked) || [];
  const lockedBadges = userProfile?.badges?.filter(b => !b.unlocked) || [];

  return (
    <div className={styles.page}>
      <div className={styles.headerBg} />

      <div className={styles.profileSection}>
        <div className={styles.avatarWrap}>
          <div className={styles.avatar}>
            {userProfile?.avatar ? (
              <img src={userProfile.avatar} alt="" />
            ) : (
              <span>{userProfile?.name?.charAt(0) || '?'}</span>
            )}
          </div>
          {userProfile?.isPremium && (
            <div className={styles.premiumBadge}>
              <Crown size={12} />
            </div>
          )}
        </div>

        <h1 className={styles.name}>{userProfile?.name || 'LifeQuester'}</h1>
        {userProfile?.bio && <p className={styles.bio}>{userProfile.bio}</p>}

        <div className={styles.levelRow}>
          <span className={styles.levelTag}>Seviye {userProfile?.level || 1}</span>
          <div className={styles.xpBar}>
            <div className={styles.xpFill} style={{ width: `${xpPercent}%` }} />
          </div>
          <span className={styles.xpLabel}>{userProfile?.xp || 0}/{userProfile?.xpToNext || 100}</span>
        </div>
      </div>

      <div className={styles.statsRow}>
        <div className={styles.stat}>
          <Target size={20} className={styles.iconBlue} />
          <span className={styles.statVal}>{userProfile?.totalQuests || 0}</span>
          <span className={styles.statLbl}>Görev</span>
        </div>
        <div className={styles.divider} />
        <div className={styles.stat}>
          <Flame size={20} className={styles.iconOrange} />
          <span className={styles.statVal}>{userProfile?.streak || 0}</span>
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
        <h3 className={styles.sectionTitle}>Haftalık İstatistik</h3>
        <div className={styles.weekGrid}>
          {WEEKLY_STATS.map(stat => (
            <div key={stat.day} className={styles.weekCard}>
              <span className={styles.weekDay}>{stat.day}</span>
              <span className={styles.weekVal}>{stat.quests}</span>
              <span className={styles.weekLbl}>görev</span>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.bottomPad} />
      <BottomNav />
    </div>
  );
}
