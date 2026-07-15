import { useEffect, useState, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { useApp } from '../hooks/useApp';
import styles from './RewardFeedback.module.css';
import type { RewardEvent } from '../types';

export function RewardFeedback() {
  const { rewardEvent, setRewardEvent } = useApp();
  const [currentEvent, setCurrentEvent] = useState<RewardEvent | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  const triggerJackpotEffects = useCallback(() => {
    // Confetti effect
    const duration = 3000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#ffb300', '#863bff', '#47bfff']
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#ffb300', '#863bff', '#47bfff']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();

    // Haptic vibration (if supported)
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate([200, 100, 200, 100, 400]);
    }
  }, []);

  const triggerMediumEffects = useCallback(() => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate([100, 50, 100]);
    }
  }, []);

  const triggerNearMissEffects = useCallback(() => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate([50, 50, 50]);
    }
  }, []);

  useEffect(() => {
    if (rewardEvent) {
      setCurrentEvent(rewardEvent);
      setIsVisible(true);

      // Trigger effects based on tier
      if (rewardEvent.tier === 'jackpot') {
        triggerJackpotEffects();
      } else if (rewardEvent.tier === 'medium') {
        triggerMediumEffects();
      } else if (rewardEvent.tier === 'near_miss') {
        triggerNearMissEffects();
      }

      // Auto-hide
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(() => {
          setRewardEvent(null);
          setCurrentEvent(null);
        }, 500); // Wait for fade out animation
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [rewardEvent, setRewardEvent, triggerJackpotEffects, triggerMediumEffects, triggerNearMissEffects]);

  if (!currentEvent && !isVisible) return null;

  const { tier, amount } = currentEvent || { tier: 'none', amount: 0 };

  const getTierContent = () => {
    switch (tier) {
      case 'small':
        return {
          icon: '✨',
          title: 'Küçük Bonus',
          xp: `+${amount} XP`,
          styleClass: styles.tierSmall
        };
      case 'medium':
        return {
          icon: '⚡',
          title: 'Güç Artışı',
          xp: `+${amount} XP`,
          styleClass: styles.tierMedium
        };
      case 'jackpot':
        return {
          icon: '🔥',
          title: 'CRITICAL BOOST',
          xp: `+${amount} XP`,
          styleClass: styles.tierJackpot
        };
      case 'near_miss':
        return {
          icon: '🔥',
          title: 'Neredeyse Jackpot!',
          xp: 'Gerilim yükseliyor...',
          styleClass: styles.tierNearMiss
        };
      default:
        return null;
    }
  };

  const content = getTierContent();
  if (!content) return null;

  return (
    <div className={`${styles.overlay} ${isVisible ? styles.visible : styles.hidden}`}>
      <div className={`${styles.toast} ${content.styleClass} ${tier === 'jackpot' ? styles.shake : ''}`}>
        <div className={styles.icon}>{content.icon}</div>
        <div className={styles.info}>
          <div className={styles.title}>{content.title}</div>
          <div className={styles.xp}>{content.xp}</div>
        </div>
      </div>
    </div>
  );
}
