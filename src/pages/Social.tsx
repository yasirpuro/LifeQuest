import { useState } from 'react';
import { UserPlus, Crown, Search, Heart, Trophy, Star, Zap, Flame, Medal } from 'lucide-react';
import { useAuth } from '../features/auth/authContext';
import { useSocial } from '../features/social/socialContext';
import { useQuest } from '../features/quests/questContext';
import PremiumBanner from '../components/PremiumBanner';
import BottomNav from '../components/BottomNav';
import styles from './Social.module.css';

type Tab = 'leaderboard' | 'friends';

const LEAGUE_TIERS = [
  { name: 'Bronz Lig', minLevel: 1, maxLevel: 4, icon: '🥉', color: '#cd7f32' },
  { name: 'Gümüş Lig', minLevel: 5, maxLevel: 9, icon: '🥈', color: '#C0C0C0' },
  { name: 'Altın Lig', minLevel: 10, maxLevel: 19, icon: '🥇', color: '#FFD700' },
  { name: 'Elmas Lig', minLevel: 20, maxLevel: 49, icon: '💎', color: '#b9f2ff' },
  { name: 'Efsane Lig', minLevel: 50, maxLevel: 999, icon: '👑', color: '#ff4757' },
];

function getLeague(level: number) {
  return LEAGUE_TIERS.find(t => level >= t.minLevel && level <= t.maxLevel) || LEAGUE_TIERS[0];
}

function getLevelTitle(level: number) {
  if (level < 3) return 'Acemi Yolcu';
  if (level < 6) return 'Disiplin Tohumu';
  if (level < 10) return 'Gelişim Savaşçısı';
  if (level < 15) return 'İrade Ustası';
  if (level < 20) return 'Disiplin Şampiyonu';
  if (level < 30) return 'Efsane Savaşçı';
  return 'Tanrısal Ruh';
}

export default function Social() {
  const { userProfile } = useAuth();
  const { friends, sendSupportToFriend } = useSocial();
  const { setShowPremiumModal } = useQuest();
  const [activeTab, setActiveTab] = useState<Tab>('leaderboard');
  const [searchValue, setSearchValue] = useState('');

  const statusColors: Record<string, string> = {
    online: '#00ff88',
    quest: '#00d4ff',
    offline: 'rgba(255,255,255,0.2)',
  };

  const statusLabels: Record<string, string> = {
    online: '🟢 Çevrimiçi',
    quest: '⚡ Görevde',
    offline: '⚫ Çevrimdışı',
  };

  // Leaderboard — me + friends, sorted by level then xp
  const leaderboard = [
    {
      id: 'me',
      name: userProfile?.name || 'Sen',
      level: userProfile?.level || 1,
      xp: userProfile?.xp || 0,
      xpToNext: userProfile?.xpToNext || 100,
      avatar: userProfile?.avatar || '',
      status: 'online' as const,
      currentQuest: undefined as string | undefined,
      sentSupportToday: false,
      isMe: true,
      streak: userProfile?.streak || 0,
    },
    ...friends.map(f => ({
      id: f.id,
      name: f.name,
      level: f.level,
      xp: f.xp,
      xpToNext: f.xpToNext,
      avatar: f.avatar,
      status: f.status,
      currentQuest: f.currentQuest,
      sentSupportToday: f.sentSupportToday,
      isMe: false,
    }))
  ].sort((a, b) => {
    if (b.level !== a.level) return b.level - a.level;
    return b.xp - a.xp;
  });

  const myLeague = getLeague(userProfile?.level || 1);
  const myTitle = getLevelTitle(userProfile?.level || 1);
  const myXpPercent = userProfile?.xpToNext && userProfile?.xpToNext > 0 ? Math.min(((userProfile?.xp || 0) / userProfile.xpToNext) * 100, 100) : 0;

  const getRankEmoji = (idx: number) => {
    if (idx === 0) return '🥇';
    if (idx === 1) return '🥈';
    if (idx === 2) return '🥉';
    return `${idx + 1}.`;
  };

  const filteredFriends = friends.filter(f =>
    f.name.toLowerCase().includes(searchValue.toLowerCase())
  );

  return (
    <div className={styles.page}>

      {/* My League Card */}
      <div className={styles.myLeagueCard} style={{ borderColor: myLeague.color + '44' }}>
        <div className={styles.myLeagueLeft}>
          <span className={styles.myLeagueTier} style={{ color: myLeague.color }}>
            {myLeague.icon} {myLeague.name}
          </span>
          <h2 className={styles.myLeagueName}>{userProfile?.name || 'Kahraman'}</h2>
          <span className={styles.myLeagueTitle}>{myTitle}</span>
        </div>
        <div className={styles.myLeagueRight}>
          <div className={styles.myLevelBadge} style={{ background: `${myLeague.color}22`, borderColor: myLeague.color + '55' }}>
            <span className={styles.myLevelNum}>{userProfile?.level || 1}</span>
            <span className={styles.myLevelLabel}>Seviye</span>
          </div>
        </div>

        <div className={styles.myLeagueBottom}>
          <div className={styles.myXpRow}>
            <span className={styles.myXpLabel}>
              <Zap size={12} /> {userProfile?.xp || 0} / {userProfile?.xpToNext || 100} XP
            </span>
            <span className={styles.myStreakLabel}>
              <Flame size={12} /> {userProfile?.streak || 0} gün seri
            </span>
          </div>
          <div className={styles.myXpBar}>
            <div className={styles.myXpFill} style={{ width: `${myXpPercent}%` }} />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${activeTab === 'leaderboard' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('leaderboard')}
        >
          <Trophy size={15} />
          Lig Sıralaması
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'friends' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('friends')}
        >
          <Star size={15} />
          Arkadaşlar
        </button>
      </div>

      <PremiumBanner />

      {/* Search */}
      <div className={styles.searchWrap}>
        <Search size={16} className={styles.searchIcon} />
        <input
          type="text"
          placeholder="Arkadaş ara..."
          className={styles.searchInput}
          value={searchValue}
          onChange={e => setSearchValue(e.target.value)}
        />
      </div>

      {/* LEADERBOARD TAB */}
      {activeTab === 'leaderboard' && (
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <h3 className={styles.sectionTitle}>
              <Trophy size={16} />
              Disiplin Ligi Sıralaması
            </h3>
            <button
              className={styles.addBtn}
              onClick={() => { /* Invite / share — available for all users */ navigator.clipboard?.writeText(window.location.href).catch(()=>{}); }}
            >
              <UserPlus size={14} />
              Davet Et
            </button>
          </div>

          {/* League badges */}
          <div className={styles.leagueBadges}>
            {LEAGUE_TIERS.map(tier => (
              <div
                key={tier.name}
                className={`${styles.leagueBadge} ${myLeague.name === tier.name ? styles.leagueBadgeActive : ''}`}
                style={myLeague.name === tier.name ? { borderColor: tier.color, background: tier.color + '15' } : {}}
              >
                <span>{tier.icon}</span>
                <span className={styles.leagueBadgeName} style={myLeague.name === tier.name ? { color: tier.color } : {}}>
                  {tier.name.split(' ')[0]}
                </span>
              </div>
            ))}
          </div>

          <div className={styles.leaderboardList}>
            {leaderboard.map((player, idx) => {
              const xpPercent = player.xpToNext > 0 ? Math.min((player.xp / player.xpToNext) * 100, 100) : 0;
              const league = getLeague(player.level);
              const title = getLevelTitle(player.level);
              return (
                <div
                  key={player.id}
                  className={`${styles.playerCard} ${player.isMe ? styles.meCard : ''} ${idx === 0 ? styles.goldCard : idx === 1 ? styles.silverCard : idx === 2 ? styles.bronzeCard : ''}`}
                >
                  <div className={styles.rankWrap}>
                    <span className={styles.rank}>{getRankEmoji(idx)}</span>
                  </div>

                  <div className={styles.playerAvatar} style={{ background: `linear-gradient(135deg, ${league.color}aa, ${league.color}44)` }}>
                    {player.avatar ? (
                      <img src={player.avatar} alt="" />
                    ) : (
                      <span>{player.name.charAt(0)}</span>
                    )}
                    <div
                      className={styles.statusDot}
                      style={{ background: statusColors[player.status] }}
                    />
                  </div>

                  <div className={styles.playerDetails}>
                    <div className={styles.nameRow}>
                      <span className={styles.playerName}>
                        {player.name}
                        {player.isMe && <span className={styles.meTag}> (Sen)</span>}
                      </span>
                      <span className={styles.playerLeague} style={{ color: league.color }}>
                        {league.icon}
                      </span>
                    </div>
                    <span className={styles.playerTitle}>{title}</span>

                    {player.currentQuest && (
                      <span className={styles.playerStatus}>
                        ⚡ {player.currentQuest}
                      </span>
                    )}

                    <div className={styles.progressRow}>
                      <div className={styles.xpBar}>
                        <div
                          className={styles.xpFill}
                          style={{ width: `${xpPercent}%`, background: `linear-gradient(90deg, ${league.color}, ${league.color}aa)` }}
                        />
                      </div>
                      <span className={styles.xpText}>Sv.{player.level} • {player.xp} XP</span>
                    </div>
                  </div>

                  {!player.isMe && (
                    <button
                      className={`${styles.supportBtn} ${(player as typeof player & { sentSupportToday: boolean }).sentSupportToday ? styles.supportSent : ''}`}
                      onClick={() => sendSupportToFriend(player.id)}
                      disabled={(player as typeof player & { sentSupportToday: boolean }).sentSupportToday}
                      title="Arkadaşına moral gönder (+10 XP)"
                    >
                      <Heart size={15} fill={(player as typeof player & { sentSupportToday: boolean }).sentSupportToday ? '#ff4757' : 'none'} />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* FRIENDS TAB */}
      {activeTab === 'friends' && (
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <h3 className={styles.sectionTitle}>
              <Medal size={16} />
              Arkadaş Listesi
            </h3>
            <button
              className={styles.addBtn}
              onClick={() => { if (!userProfile?.isPremium) setShowPremiumModal(true); }}
            >
              <UserPlus size={14} />
              Ekle
            </button>
          </div>

          <div className={styles.friendList}>
            {filteredFriends.map(friend => {
              const xpPercent = friend.xpToNext > 0 ? Math.min((friend.xp / friend.xpToNext) * 100, 100) : 0;
              const league = getLeague(friend.level);
              const title = getLevelTitle(friend.level);
              return (
                <div key={friend.id} className={styles.friendCard}>
                  <div
                    className={styles.friendAvatar}
                    style={{ background: `linear-gradient(135deg, ${league.color}aa, ${league.color}44)` }}
                  >
                    {friend.avatar ? (
                      <img src={friend.avatar} alt="" />
                    ) : (
                      <span>{friend.name.charAt(0)}</span>
                    )}
                    <div className={styles.statusDot} style={{ background: statusColors[friend.status] }} />
                  </div>

                  <div className={styles.friendInfo}>
                    <div className={styles.friendNameRow}>
                      <span className={styles.friendName}>{friend.name}</span>
                      <span className={styles.friendLeague} style={{ color: league.color }}>
                        {league.icon} Sv.{friend.level}
                      </span>
                    </div>
                    <span className={styles.friendTitle}>{title}</span>
                    <span className={styles.friendStatus}>{statusLabels[friend.status]}</span>
                    {friend.currentQuest && (
                      <span className={styles.friendQuest}>⚡ {friend.currentQuest}</span>
                    )}

                    <div className={styles.friendXpRow}>
                      <div className={styles.xpBar}>
                        <div
                          className={styles.xpFill}
                          style={{ width: `${xpPercent}%`, background: `linear-gradient(90deg, ${league.color}, ${league.color}88)` }}
                        />
                      </div>
                      <span className={styles.xpText}>{friend.xp}/{friend.xpToNext} XP</span>
                    </div>
                  </div>

                  <button
                    className={`${styles.supportBtn} ${friend.sentSupportToday ? styles.supportSent : ''}`}
                    onClick={() => sendSupportToFriend(friend.id)}
                    disabled={friend.sentSupportToday}
                    title="Moral ver (+10 XP)"
                  >
                    <Heart size={16} fill={friend.sentSupportToday ? '#ff4757' : 'none'} />
                    <span>{friend.sentSupportToday ? '✓' : '+XP'}</span>
                  </button>
                </div>
              );
            })}

            {filteredFriends.length === 0 && (
              <div className={styles.emptyState}>
                <span>😔</span>
                <p>Arkadaş bulunamadı</p>
              </div>
            )}
          </div>

          {/* Premium - Add Friend CTA */}
          {!userProfile?.isPremium && (
            <div className={styles.premiumCta} onClick={() => setShowPremiumModal(true)}>
              <Crown size={20} style={{ color: '#FFD700' }} />
              <div>
                <p className={styles.premiumCtaTitle}>Premium ile sınırsız arkadaş ekle</p>
                <p className={styles.premiumCtaDesc}>Gerçek arkadaşlarını bul, birlikte büyüyün</p>
              </div>
            </div>
          )}
        </div>
      )}

      <div className={styles.bottomPad} />
      <BottomNav />
    </div>
  );
}
