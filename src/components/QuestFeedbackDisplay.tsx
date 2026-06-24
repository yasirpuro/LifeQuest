import { useEffect, useState } from 'react';
import { useApp } from '../hooks/useApp';
import { XPGainFeedback, StreakWarning } from './EmptyStates';
import styles from './QuestFeedbackDisplay.module.css';

/**
 * Real-time feedback from orchestrated quest completion
 * Shows: XP earned, level up, notifications, warnings, state health
 */
export function QuestFeedbackDisplay() {
  const { completionResult, user } = useApp();
  const [visible, setVisible] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    if (!completionResult) {
      setVisible(false);
      return;
    }

    setFadeOut(false);
    setVisible(true);

    // Auto-fade after 4 seconds
    const timer = setTimeout(() => setFadeOut(true), 4000);
    return () => clearTimeout(timer);
  }, [completionResult]);

  if (!visible || !completionResult) return null;

  const { xpEarned, leveledUp, newLevel, notificationSent, notifications, warnings } = completionResult;

  return (
    <div className={`${styles.container} ${fadeOut ? styles.fadeOut : ''}`}>
      {/* XP Gain Feedback */}
      {xpEarned > 0 && (
        <div className={styles.section}>
          <XPGainFeedback amount={xpEarned} source="quest" skillName={notificationSent ? 'Focus Skill' : undefined} />
        </div>
      )}

      {/* Level Up Notification */}
      {leveledUp && newLevel && (
        <div className={`${styles.section} ${styles.levelUp}`}>
          <div className={styles.emoji}>🎉</div>
          <h3>Level {newLevel}!</h3>
          <p>New features unlocked</p>
        </div>
      )}

      {/* Smart Notifications */}
      {notifications && notifications.length > 0 && (
        <div className={styles.section}>
          {notifications.map((notif: any, idx: number) => (
            <div key={idx} className={styles.notification}>
              <h4>{notif.title}</h4>
              <p>{notif.body}</p>
            </div>
          ))}
        </div>
      )}

      {/* Warnings (if any) */}
      {warnings && warnings.length > 0 && (
        <div className={styles.section}>
          <div className={styles.warnings}>
            <p className={styles.warningLabel}>⚠️ Warnings:</p>
            {warnings.map((w: any, idx: number) => (
              <p key={idx} className={styles.warningText}>
                {w}
              </p>
            ))}
          </div>
        </div>
      )}

      {/* Streak Risk if applicable */}
      {user.streakRiskLevel && user.streakRiskLevel !== 'safe' && (
        <StreakWarning daysInactive={user.streakRiskLevel === 'critical' ? 2 : 1} hasToken={!!user.recoveryState?.tokens?.length} />
      )}

      {/* State Health Indicator */}
      <div className={styles.stateHealth}>
        <span className={styles.indicator}>📊 State OK</span>
      </div>
    </div>
  );
}
