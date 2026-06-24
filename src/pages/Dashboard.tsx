import { useState, useEffect } from 'react';
import { Zap, Target, Flame, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../hooks/useApp';
import { LOCATIONS, WEEKLY_STATS } from '../data/quests';
import QuestCard from '../components/QuestCard';
import ShareModal from '../components/ShareModal';
import PremiumBanner from '../components/PremiumBanner';
import BottomNav from '../components/BottomNav';
import FocusWidget from '../components/FocusWidget';
import { QuestFeedbackDisplay } from '../components/QuestFeedbackDisplay';
import { scheduleFocusNotificationIfNeeded } from '../utils/notificationHelper';
import type { Quest } from '../types';
import styles from './Dashboard.module.css';

export default function Dashboard() {
  const { user, quests, selectedLocation, freeQuestsToday, skillEngine } = useApp();
  const [shareQuest, setShareQuest] = useState<Quest | null>(null);
  const navigate = useNavigate();

  // Try to schedule focus notification on dashboard load
  useEffect(() => {
    if (skillEngine) {
      scheduleFocusNotificationIfNeeded(skillEngine);
    }
  }, [skillEngine]);

  const locationQuests = quests.filter(q => q.location === selectedLocation);
  const completedToday = locationQuests.filter(q => q.completed).length;
  const locationInfo = LOCATIONS.find(l => l.id === selectedLocation);
  const maxStat = Math.max(...WEEKLY_STATS.map(s => s.xp), 1);

  const xpPercent = user.xpToNext > 0 ? (user.xp / user.xpToNext) * 100 : 0;

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <div className={styles.avatar} onClick={() => navigate('/profile')}>
            {user.avatar ? (
              <img src={user.avatar} alt="" />
            ) : (
              <span>{user.name.charAt(0)}</span>
            )}
          </div>
          <div>
            <p className={styles.greeting}>Merhaba,</p>
            <h2 className={styles.name}>{user.name}</h2>
          </div>
        </div>
      </header>


      <div className={styles.levelCard}>
        <div className={styles.levelInfo}>
          <span className={styles.levelBadge}>Seviye {user.level}</span>
          <span className={styles.xpText}>{user.xp}/{user.xpToNext} XP</span>
        </div>
        <div className={styles.xpBar}>
          <div className={styles.xpFill} style={{ width: `${xpPercent}%` }} />
        </div>
      </div>

      <FocusWidget />

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <Zap size={20} className={styles.statIconBlue} />
          <span className={styles.statValue}>{user.totalQuests}</span>
          <span className={styles.statLabel}>Gorev</span>
        </div>
        <div className={styles.statCard}>
          <Flame size={20} className={styles.statIconOrange} />
          <span className={styles.statValue}>{user.streak}</span>
          <span className={styles.statLabel}>Gun Seri</span>
        </div>
        <div className={styles.statCard}>
          <Target size={20} className={styles.statIconGreen} />
          <span className={styles.statValue}>{completedToday}/{locationQuests.length}</span>
          <span className={styles.statLabel}>Bugun</span>
        </div>
        <div className={styles.statCard}>
          <TrendingUp size={20} className={styles.statIconPurple} />
          <span className={styles.statValue}>{user.level}</span>
          <span className={styles.statLabel}>Seviye</span>
        </div>
      </div>

      <div className={styles.weeklyChart}>
        <h3 className={styles.sectionTitle}>Haftalik Aktivite</h3>
        <div className={styles.chart}>
          {WEEKLY_STATS.map(stat => (
            <div key={stat.day} className={styles.chartCol}>
              <div className={styles.chartBarWrap}>
                <div
                  className={styles.chartBar}
                  style={{ height: `${(stat.xp / maxStat) * 100}%` }}
                />
              </div>
              <span className={styles.chartLabel}>{stat.day}</span>
            </div>
          ))}
        </div>
      </div>

      <PremiumBanner />

      <div className={styles.questSection}>
        <div className={styles.questHeader}>
          <h3 className={styles.sectionTitle}>
            {locationInfo?.emoji} {locationInfo?.label} Gorevleri
          </h3>
          {!user.isPremium && (
            <span className={styles.freeCount}>{freeQuestsToday} gorev kaldi</span>
          )}
        </div>

        <div className={styles.questList}>
          {locationQuests.map((quest, i) => (
            <QuestCard
              key={quest.id}
              quest={quest}
              index={i}
              onShare={setShareQuest}
            />
          ))}
        </div>
      </div>

      <div className={styles.bottomPad} />
      <BottomNav />
      {shareQuest && <ShareModal quest={shareQuest} onClose={() => setShareQuest(null)} />}
      <QuestFeedbackDisplay />
    </div>
  );
}
