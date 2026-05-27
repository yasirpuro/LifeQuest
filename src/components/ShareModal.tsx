import { X, Download, Share2, Brain, Clock, Flame } from 'lucide-react';
import type { Quest } from '../types';
import { useApp } from '../hooks/useApp';
import styles from './ShareModal.module.css';

interface Props {
  quest: Quest;
  onClose: () => void;
}

export default function ShareModal({ quest, onClose }: Props) {
  const { user } = useApp();

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <button className={styles.close} onClick={onClose}>
          <X size={20} />
        </button>

        <h3 className={styles.heading}>Gorev Kartini Paylas</h3>

        <div className={styles.card}>
          <div className={styles.cardGlow} />
          <div className={styles.cardHeader}>
            <span className={styles.logo}>LifeQuest</span>
            <span className={styles.badge}>#{quest.difficulty} Zorluk</span>
          </div>

          <h4 className={styles.cardTitle}>{quest.title}</h4>
          <p className={styles.cardDesc}>{quest.description}</p>

          <div className={styles.cardTags}>
            <span><Brain size={14} /> Dopamin +{quest.dopamine}%</span>
            <span><Clock size={14} /> {quest.duration} dk</span>
            {quest.calories > 0 && <span><Flame size={14} /> {quest.calories} kcal</span>}
          </div>

          <div className={styles.cardFooter}>
            <div className={styles.userInfo}>
              <div className={styles.avatar}>
                {user.avatar ? (
                  <img src={user.avatar} alt="" />
                ) : (
                  <span>{user.name.charAt(0) || '?'}</span>
                )}
              </div>
              <span className={styles.userName}>{user.name || 'LifeQuester'}</span>
            </div>
            <span className={styles.viralText}>Bu gorevi gordum anlamadim indirdim</span>
          </div>
        </div>

        <div className={styles.actions}>
          <button className={styles.downloadBtn}>
            <Download size={18} />
            Karti Indir
          </button>
          <button className={styles.shareBtn}>
            <Share2 size={18} />
            Paylas
          </button>
        </div>
      </div>
    </div>
  );
}
