import { useState } from 'react';
import { useApp } from '../hooks/useApp';
import { LOCATIONS } from '../data/quests';
import QuestCard from '../components/QuestCard';
import ShareModal from '../components/ShareModal';
import PremiumBanner from '../components/PremiumBanner';
import BottomNav from '../components/BottomNav';
import type { Quest, LocationType } from '../types';
import styles from './Quests.module.css';

export default function Quests() {
  const { quests, selectedLocation, setSelectedLocation, user, setShowPremiumModal } = useApp();
  const [shareQuest, setShareQuest] = useState<Quest | null>(null);
  const activeLoc = selectedLocation || 'gym';

  const filteredQuests = quests.filter(q => q.location === activeLoc);

  const handleLocationChange = (loc: LocationType) => {
    if (!user.isPremium && loc !== selectedLocation) {
      const isFirst = !selectedLocation;
      if (!isFirst) {
        setShowPremiumModal(true);
        return;
      }
    }
    setSelectedLocation(loc);
  };

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Gorevler</h1>
      <p className={styles.subtitle}>Mekanini sec, maceraya basla!</p>

      <div className={styles.tabs}>
        {LOCATIONS.map(loc => (
          <button
            key={loc.id}
            className={`${styles.tab} ${activeLoc === loc.id ? styles.tabActive : ''}`}
            style={activeLoc === loc.id ? { borderColor: loc.color, color: loc.color } : {}}
            onClick={() => handleLocationChange(loc.id)}
          >
            <span className={styles.tabEmoji}>{loc.emoji}</span>
            <span className={styles.tabLabel}>{loc.label}</span>
          </button>
        ))}
      </div>

      <PremiumBanner />

      <div className={styles.list}>
        {filteredQuests.map((quest, i) => (
          <QuestCard
            key={quest.id}
            quest={quest}
            index={i}
            onShare={setShareQuest}
          />
        ))}
      </div>

      <div className={styles.bottomPad} />
      <BottomNav />
      {shareQuest && <ShareModal quest={shareQuest} onClose={() => setShareQuest(null)} />}
    </div>
  );
}
