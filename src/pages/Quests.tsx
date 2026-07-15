import { useState } from 'react';
import { useAuth } from '../features/auth/authContext';
import { useQuest } from '../features/quests/questContext';
import { LOCATIONS } from '../data/quests';
import QuestCard from '../components/QuestCard';
import ShareModal from '../components/ShareModal';
import PremiumBanner from '../components/PremiumBanner';
import BottomNav from '../components/BottomNav';
import type { Quest, LocationType } from '../types';
import styles from './Quests.module.css';

export default function Quests() {
  const { userProfile } = useAuth();
  const { quests, selectedLocation, setSelectedLocation, setShowPremiumModal, addQuest } = useQuest();
  const [shareQuest, setShareQuest] = useState<Quest | null>(null);
  const [newQuestTitle, setNewQuestTitle] = useState('');
  const [newQuestDifficulty, setNewQuestDifficulty] = useState<number>(3);
  const activeLoc = selectedLocation || 'din';

  const filteredQuests = quests.filter(q => q.location === activeLoc);

  const handleLocationChange = (loc: LocationType) => {
    if (!userProfile?.isPremium && loc !== selectedLocation) {
      const isFirst = !selectedLocation;
      if (!isFirst) {
        setShowPremiumModal(true);
        return;
      }
    }
    setSelectedLocation(loc);
  };

  const handleAddQuest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestTitle.trim()) return;
    addQuest(newQuestTitle.trim(), newQuestDifficulty);
    setNewQuestTitle('');
  };

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Görevler</h1>
      <p className={styles.subtitle}>Mekanını seç, maceraya başla!</p>

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

      <div className={styles.questCreator}>
        <h3 className={styles.creatorTitle}>Kendi Ekstra Hedefini Belirle</h3>
        <form onSubmit={handleAddQuest} className={styles.creatorForm}>
          <input
            type="text"
            className={styles.creatorInput}
            placeholder="Örn: 20 sayfa kitap oku, Sabah namazına kalk..."
            value={newQuestTitle}
            onChange={e => setNewQuestTitle(e.target.value)}
            required
          />
          <div className={styles.creatorRow}>
            <select
              className={styles.creatorSelect}
              value={newQuestDifficulty}
              onChange={e => setNewQuestDifficulty(Number(e.target.value))}
            >
              <option value={1}>Kolay (+15 XP)</option>
              <option value={3}>Orta (+30 XP)</option>
              <option value={5}>Zor (+50 XP)</option>
            </select>
            <button type="submit" className={styles.creatorBtn}>
              Göreve Başla
            </button>
          </div>
        </form>
      </div>

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

