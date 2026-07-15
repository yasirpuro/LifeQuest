import { Brain, Flame, Calendar, X } from 'lucide-react';
import type { MetaSkillType } from '../types';
import styles from './SkillLevelUpModal.module.css';

interface SkillLevelUpModalProps {
  skill: MetaSkillType;
  level: number;
  onClose: () => void;
}

const SKILL_CONFIG = {
  focus: {
    icon: Brain,
    color: '#863bff',
    title: 'Focus',
    description: 'Odaklanma yeteneği',
    benefit: 'Bonus şansın arttı',
  },
  discipline: {
    icon: Flame,
    color: '#ff6b6b',
    title: 'Discipline',
    description: 'Öz disiplin',
    benefit: 'Streak decay yavaşlar',
  },
  consistency: {
    icon: Calendar,
    color: '#47bfff',
    title: 'Consistency',
    description: 'Süreklilik',
    benefit: 'XP çarpanın arttı',
  },
};

export default function SkillLevelUpModal({ skill, level, onClose }: SkillLevelUpModalProps) {
  const config = SKILL_CONFIG[skill];
  const Icon = config.icon;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <button className={styles.close} onClick={onClose}>
          <X size={24} />
        </button>

        <div className={styles.iconContainer}>
          <div className={styles.iconGlow} style={{ backgroundColor: config.color }} />
          <div className={styles.icon} style={{ color: config.color }}>
            <Icon size={64} />
          </div>
        </div>

        <h2 className={styles.title}>{config.title} Level Up!</h2>
        <p className={styles.subtitle}>Level {level}</p>

        <div className={styles.description}>
          {config.description} güçlendin
        </div>

        <div className={styles.benefit}>
          <span className={styles.benefitIcon}>⚡</span>
          <span className={styles.benefitText}>{config.benefit}</span>
        </div>

        <button className={styles.cta} onClick={onClose}>
          Devam Et
        </button>
      </div>
    </div>
  );
}
