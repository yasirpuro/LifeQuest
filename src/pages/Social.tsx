import { UserPlus, MapPin, Crown, Lock, Search } from 'lucide-react';
import { useApp } from '../hooks/useApp';
import { MOCK_FRIENDS } from '../data/quests';
import PremiumBanner from '../components/PremiumBanner';
import BottomNav from '../components/BottomNav';
import styles from './Social.module.css';

export default function Social() {
  const { user, setShowPremiumModal } = useApp();

  const statusColors: Record<string, string> = {
    online: '#00ff88',
    quest: '#00d4ff',
    offline: 'rgba(255,255,255,0.2)',
  };

  const statusLabels: Record<string, string> = {
    online: 'Cevrimici',
    quest: 'Gorevde',
    offline: 'Cevrimdisi',
  };

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Sosyal</h1>
      <p className={styles.subtitle}>Arkadaslarini bul, birlikte gorev yap!</p>

      <PremiumBanner />

      <div className={styles.searchWrap}>
        <Search size={18} className={styles.searchIcon} />
        <input
          type="text"
          placeholder="Arkadas ara..."
          className={styles.searchInput}
          onFocus={() => { if (!user.isPremium) setShowPremiumModal(true); }}
          readOnly={!user.isPremium}
        />
        {!user.isPremium && <Lock size={14} className={styles.lockIcon} />}
      </div>

      <div className={styles.mapSection}>
        <h3 className={styles.sectionTitle}>
          <MapPin size={16} /> Yakinindaki Kisiler
        </h3>
        <div className={styles.mapMock}>
          <div className={styles.mapGrid}>
            {[...Array(6)].map((_, i) => (
              <div key={i} className={styles.mapLine} />
            ))}
          </div>
          {MOCK_FRIENDS.slice(0, 3).map((friend, i) => (
            <div
              key={friend.id}
              className={styles.mapPin}
              style={{
                top: `${25 + i * 22}%`,
                left: `${15 + i * 25}%`,
              }}
            >
              <div
                className={styles.mapPinDot}
                style={{ background: statusColors[friend.status] }}
              />
              <span className={styles.mapPinName}>{friend.name.split(' ')[0]}</span>
            </div>
          ))}
          <div className={styles.mapCenter}>
            <div className={styles.mapYou}>Sen</div>
          </div>
          {!user.isPremium && (
            <div className={styles.mapOverlay} onClick={() => setShowPremiumModal(true)}>
              <Crown size={24} />
              <span>Haritayi gormek icin Premium</span>
            </div>
          )}
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h3 className={styles.sectionTitle}>Arkadaslar</h3>
          <button
            className={styles.addBtn}
            onClick={() => { if (!user.isPremium) setShowPremiumModal(true); }}
          >
            <UserPlus size={16} />
            Ekle
          </button>
        </div>

        <div className={styles.friendList}>
          {MOCK_FRIENDS.map(friend => (
            <div key={friend.id} className={styles.friendCard}>
              <div className={styles.friendAvatar}>
                <span>{friend.name.charAt(0)}</span>
                <div
                  className={styles.statusDot}
                  style={{ background: statusColors[friend.status] }}
                />
              </div>
              <div className={styles.friendInfo}>
                <span className={styles.friendName}>{friend.name}</span>
                <span className={styles.friendStatus}>
                  {friend.status === 'quest' ? (
                    <>Gorevde: {friend.currentQuest}</>
                  ) : (
                    statusLabels[friend.status]
                  )}
                </span>
              </div>
              {friend.distance && (
                <span className={styles.distance}>{friend.distance}</span>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className={styles.bottomPad} />
      <BottomNav />
    </div>
  );
}
