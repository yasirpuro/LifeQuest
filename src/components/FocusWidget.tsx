import {} from 'react';
import { useApp } from '../hooks/useApp';
import styles from './FocusWidget.module.css';

export default function FocusWidget() {
  const { user, skillEngine } = useApp();
  if (!skillEngine) return null;

  const payload = skillEngine.buildDecisionPayload(user.streak);
  if (!payload) return null;

  const { streak, focusSkill, urgency, xpToNextLevel } = payload as any;
  const skillName = skillEngine.skills.find((s: any) => s.id === focusSkill.skillId)?.name || focusSkill.skillId;
  const progressPercent = Math.min(100, focusSkill.mastery);

  return (
    <div className={`${styles.card} ${styles[urgency]}`}>
      <div className={styles.left}>
        <div className={styles.title}>🎯 Bugün Odak</div>
        <div className={styles.skill}>{skillName}</div>
        <div className={styles.progressBarContainer}>
          <div className={styles.progressBar} style={{ width: `${progressPercent}%` }} />
        </div>
        <div className={styles.meta}>Mastery: {focusSkill.mastery}% · XP to next: +{xpToNextLevel}</div>
      </div>
      <div className={styles.right}>
        <div className={`${styles.streak} ${styles[`urgency_${urgency}`]}`}>
          <span>🔥</span>
          <span>{streak}</span>
        </div>
      </div>
    </div>
  );
}
