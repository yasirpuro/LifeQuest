import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../features/auth/authContext';
import { useQuest } from '../features/quests/questContext';
import { useSkill } from '../features/skills/skillContext';
import { LOCATIONS, WEEKLY_STATS } from '../data/quests';
import QuestCard from '../components/QuestCard';
import ShareModal from '../components/ShareModal';
import PremiumBanner from '../components/PremiumBanner';
import BottomNav from '../components/BottomNav';
import { QuestFeedbackDisplay } from '../components/QuestFeedbackDisplay';
import { RewardFeedback } from '../components/RewardFeedback';
import MetaSkills from '../components/MetaSkills';
import PremiumAura from '../components/PremiumAura';
import { scheduleFocusNotificationIfNeeded } from '../shared/utils/notificationHelper';
import { startSession, endSession, trackEvent as trackBehaviorEvent } from '../core/services/analyticsService';
import type { Quest } from '../types';
import styles from './Dashboard.module.css';

export default function Dashboard() {
  const { userProfile } = useAuth();
  const { quests, selectedLocation, freeQuestsToday } = useQuest();
  const { skillEngine } = useSkill();
  const [shareQuest, setShareQuest] = useState<Quest | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (skillEngine) scheduleFocusNotificationIfNeeded(skillEngine);
  }, [skillEngine]);

  // Session tracking
  useEffect(() => {
    startSession();
    return () => {
      endSession();
    };
  }, []);

  const locationQuests = quests.filter(q => q.location === selectedLocation);
  // For non-premium (free/demo) users show at most 3 daily quests and hide locked/premium-only quests
  const freeQuests = locationQuests.filter(q => !q.locked);
  const visibleQuests = (!userProfile?.isPremium) ? freeQuests.slice(0, 3) : locationQuests;
  const completedToday = locationQuests.filter(q => q.completed).length;
  const totalToday = visibleQuests.length;
  const progressPercent = totalToday > 0 ? Math.round((completedToday / totalToday) * 100) : 0;
  const remainingToday = totalToday - completedToday;
  const locationInfo = LOCATIONS.find(l => l.id === selectedLocation);
  const statsSource = (userProfile && userProfile.dailyXp && (userProfile.dailyXp.earned ?? 0) > 0) ? WEEKLY_STATS : WEEKLY_STATS.map(s => ({ ...s, xp: 0 }));
  const maxStat = Math.max(...statsSource.map(s => s.xp), 1);
  const todayIdx = new Date().getDay(); // 0=Sun
  const xpPercent = userProfile?.xpToNext && userProfile?.xpToNext > 0 ? Math.min(100, ((userProfile?.xp || 0) / userProfile.xpToNext) * 100) : 0;
  const initials = userProfile?.name ? userProfile.name.charAt(0).toUpperCase() : '?';
  const streak = userProfile?.streak || 0;
  const xpToNext = userProfile?.xpToNext || 100;
  const currentXp = userProfile?.xp || 0;
  const xpLeft = xpToNext - currentXp;

  // Meta skills with fallback
  const metaSkills = userProfile?.metaSkills || {
    focus: { type: 'focus', level: 1, xp: 0, xpToNext: 100, benefits: [] },
    discipline: { type: 'discipline', level: 1, xp: 0, xpToNext: 100, benefits: [] },
    consistency: { type: 'consistency', level: 1, xp: 0, xpToNext: 100, benefits: [] }
  };

  return (
    <div className={styles.page}>

      {/* ── HEADER ── */}
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <div className={styles.avatar} onClick={() => navigate('/profile')}>
            {userProfile?.avatar ? <img src={userProfile.avatar} alt="" /> : <span>{initials}</span>}
          </div>
          <div>
            <p className={styles.greeting}>Hoş Geldin</p>
            <h2 className={styles.name}>{userProfile?.name || 'Kahraman'}</h2>
          </div>
        </div>
        {/* Session hook - top right */}
        {selectedLocation && remainingToday > 0 && (
          <div className={styles.sessionHook}>
            <span className={styles.sessionHookEmoji}>⚡</span>
            <span className={styles.sessionHookText}>{remainingToday} görev kaldı</span>
          </div>
        )}
        {selectedLocation && remainingToday === 0 && totalToday > 0 && (
          <div className={styles.sessionHookDone}>
            <span>✅</span>
            <span className={styles.sessionHookText}>Bugün tamam!</span>
          </div>
        )}
      </header>

      {/* ── STREAK HERO ── */}
      <div className={`${styles.streakHero} ${streak === 0 ? styles.streakZero : streak >= 7 ? styles.streakFire : ''}`}>
        <div className={styles.streakLeft}>
          <span className={styles.streakEmoji}>{streak === 0 ? '💤' : streak >= 30 ? '🏆' : streak >= 7 ? '🔥' : '⚡'}</span>
          <div>
            <div className={styles.streakNum}>{streak}</div>
            <div className={styles.streakLabel}>Günlük Seri</div>
            {streak >= 7 && (
              <div className={styles.streakBonusInfo}>⚡ Bonus Şansı +15%</div>
            )}
          </div>
        </div>
        <div className={styles.streakRight}>
          {streak === 0 ? (
            <div className={styles.streakCta}>Bugün başla →</div>
          ) : !userProfile?.isPremium ? (
            <div className={styles.streakFreezeCta} onClick={() => navigate('/premium')}>
              🧊 Streak Freeze
              <span className={styles.streakFreezeTag}>Premium</span>
            </div>
          ) : (
            <div className={styles.streakProtected}>🛡️ Korumalı</div>
          )}
        </div>
      </div>

      {/* ── REWARD MEMORY ── */}
      {userProfile?.lastReward && (
        <div className={styles.rewardMemory}>
          <span className={styles.rewardMemoryLabel}>Dün:</span>
          {userProfile.lastReward.tier === 'jackpot' ? (
            <span className={styles.rewardMemoryValueJackpot}>🔥 CRITICAL BOOST +{userProfile.lastReward.amount} XP</span>
          ) : userProfile.lastReward.tier === 'medium' ? (
            <span className={styles.rewardMemoryValueMedium}>⚡ Güç Artışı +{userProfile.lastReward.amount} XP</span>
          ) : (
            <span className={styles.rewardMemoryValueSmall}>✨ Bonus +{userProfile.lastReward.amount} XP</span>
          )}
        </div>
      )}

      {/* ── XP + LEVEL ROW ── */}
      <div className={styles.xpRow}>
        <div className={styles.xpRowLeft}>
          <div className={styles.levelChip}>
            <span className={styles.levelLabel}>LV</span>
            <span className={styles.levelNum}>{userProfile?.level || 1}</span>
          </div>
          <div className={styles.xpMeta}>
            <div className={styles.xpVal}>{currentXp} <span className={styles.xpSep}>/</span> {xpToNext} XP</div>
            {xpLeft <= 30 && (
              <div className={styles.xpAlmost}>⚡ Seviye atla! {xpLeft} XP kaldı</div>
            )}
          </div>
        </div>
        <div className={styles.xpBarWrap}>
          <div className={styles.xpTrack}>
            <div className={styles.xpFill} style={{ width: `${xpPercent}%` }} />
          </div>
          <div className={styles.xpPercent}>{Math.round(xpPercent)}%</div>
        </div>
      </div>

      {/* ── META SKILLS ── */}
      <PremiumAura active={userProfile?.isPremium || false}>
        <MetaSkills metaSkills={metaSkills} />
      </PremiumAura>

      {/* ── TODAY PROGRESS ── */}
      {selectedLocation && totalToday > 0 && (
        <div className={styles.todayProgress}>
          <div className={styles.todayProgressHeader}>
            <span className={styles.todayProgressTitle}>Bugünün Hedefi</span>
            <span className={styles.todayProgressCount}>{completedToday}/{totalToday} tamamlandı</span>
          </div>
          <div className={styles.todayProgressTrack}>
            <div
              className={styles.todayProgressFill}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <div className={styles.todayProgressDots}>
            {visibleQuests.map((q) => (
              <div
                key={q.id}
                className={`${styles.todayDot} ${q.completed ? styles.todayDotDone : ''}`}
                title={q.title}
              />
            ))}
          </div>
        </div>
      )}

      {/* ── WEEKLY ACTIVITY ── */}
      <div className={styles.weeklyCard}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionTitle}>Haftalık Aktivite</span>
          <span className={styles.sectionMeta}>{statsSource.reduce((a,s) => a + s.xp, 0)} XP bu hafta</span>
        </div>
        <div className={styles.chart}>
          {statsSource.map((stat, i) => (
            <div key={stat.day} className={styles.chartCol}>
              <div className={styles.chartBarWrap}>
                <div
                  className={`${styles.chartBar} ${i === todayIdx ? styles.today : ''}`}
                  style={{ height: `${Math.max(4, (stat.xp / maxStat) * 100)}%` }}
                />
              </div>
              <span className={styles.chartLabel}>{stat.day}</span>
            </div>
          ))}
        </div>
      </div>

      <PremiumBanner />

      {/* ── QUESTS ── */}
      <div className={styles.questSection}>
        <div className={styles.questHeader}>
          <span className={styles.sectionTitle}>
            {locationInfo ? `${locationInfo.emoji} ${locationInfo.label}` : 'Görevler'}
          </span>
          {!userProfile?.isPremium && (
            <span className={styles.freeCount}>{freeQuestsToday} kaldı</span>
          )}
        </div>

        {!selectedLocation ? (
          <div className={styles.noLocation}>
            <div className={styles.noLocationIcon}>🗺️</div>
            <p className={styles.noLocationTitle}>Kategori Seç</p>
            <p className={styles.noLocationDesc}>Altta gezinmek için bir kategori seç ve görevlerin listelensin.</p>
          </div>
        ) : (
          <div className={styles.questList}>
            {visibleQuests.map((quest, i) => (
              <QuestCard key={quest.id} quest={quest} index={i} onShare={setShareQuest} />
            ))}
            {/* Premium teaser after free quests */}
            {!userProfile?.isPremium && freeQuests.length > 0 && (
              <div 
                className={styles.premiumTeaser} 
                onClick={() => {
                  trackBehaviorEvent('premium_teaser_view');
                  navigate('/premium');
                }}
              >
                <div className={styles.premiumTeaserLeft}>
                  <div className={styles.premiumTeaserIcon}>🔒</div>
                  <div>
                    <div className={styles.premiumTeaserTitle}>+2 Premium Quest Slot</div>
                    <div className={styles.premiumTeaserSub}>Premium ile %30 daha hızlı geliş</div>
                  </div>
                </div>
                <div className={styles.premiumTeaserCta}>Aç →</div>
              </div>
            )}
          </div>
        )}
      </div>

      <div className={styles.bottomPad} />
      <BottomNav />
      {shareQuest && <ShareModal quest={shareQuest} onClose={() => setShareQuest(null)} />}
      <QuestFeedbackDisplay />
      <RewardFeedback />
    </div>
  );
}
