import type { SessionChain } from '../../types';

/**
 * Session Chain Service
 * Momentum triggers to extend session length
 * Converts "task → reward → exit" to "task → reward → next hook"
 */

const SESSION_CHAIN_KEY = 'lifequest_session_chain';
const SESSION_TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes session timeout

/**
 * Get current session chain from localStorage
 */
export function getSessionChain(): SessionChain {
  if (typeof window === 'undefined') {
    return {
      consecutiveQuests: 0,
      bonusMultiplier: 1.0,
      nextBonusThreshold: 3,
      active: false,
      startedAt: new Date().toISOString(),
    };
  }

  try {
    const stored = localStorage.getItem(SESSION_CHAIN_KEY);
    if (!stored) {
      return {
        consecutiveQuests: 0,
        bonusMultiplier: 1.0,
        nextBonusThreshold: 3,
        active: false,
        startedAt: new Date().toISOString(),
      };
    }

    const chain = JSON.parse(stored) as SessionChain;
    
    // Check if session has expired
    const sessionAge = Date.now() - new Date(chain.startedAt).getTime();
    if (sessionAge > SESSION_TIMEOUT_MS) {
      // Session expired, reset
      return {
        consecutiveQuests: 0,
        bonusMultiplier: 1.0,
        nextBonusThreshold: 3,
        active: false,
        startedAt: new Date().toISOString(),
      };
    }

    return chain;
  } catch {
    return {
      consecutiveQuests: 0,
      bonusMultiplier: 1.0,
      nextBonusThreshold: 3,
      active: false,
      startedAt: new Date().toISOString(),
    };
  }
}

/**
 * Save session chain to localStorage
 */
function saveSessionChain(chain: SessionChain): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(SESSION_CHAIN_KEY, JSON.stringify(chain));
}

/**
 * Increment session chain after quest completion
 */
export function incrementSessionChain(): SessionChain {
  const chain = getSessionChain();
  
  // Increment consecutive quests
  chain.consecutiveQuests += 1;
  
  // Activate chain if not already active
  if (!chain.active) {
    chain.active = true;
    chain.startedAt = new Date().toISOString();
  }
  
  // Check for bonus thresholds
  const bonusThresholds = [3, 5, 8, 12, 15];
  const currentThresholdIndex = bonusThresholds.findIndex(t => t === chain.nextBonusThreshold);
  
  if (chain.consecutiveQuests >= chain.nextBonusThreshold) {
    // Increase bonus multiplier (NERFED from 0.25 to 0.20, max 1.8x instead of 2.5x)
    chain.bonusMultiplier = Math.min(chain.bonusMultiplier + 0.20, 1.8); // Max 2.5x
    
    // Set next threshold
    if (currentThresholdIndex < bonusThresholds.length - 1) {
      chain.nextBonusThreshold = bonusThresholds[currentThresholdIndex + 1];
    } else {
      chain.nextBonusThreshold = chain.consecutiveQuests + 5; // Progressive after max
    }
  }
  
  saveSessionChain(chain);
  return chain;
}

/**
 * Reset session chain (call on logout or explicit reset)
 */
export function resetSessionChain(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(SESSION_CHAIN_KEY);
}

/**
 * Get session chain hook message for UI
 */
export function getSessionChainHook(chain: SessionChain): {
  showHook: boolean;
  message: string;
  bonusProgress: number;
  nextReward: string;
} {
  if (!chain.active || chain.consecutiveQuests === 0) {
    return {
      showHook: false,
      message: '',
      bonusProgress: 0,
      nextReward: '',
    };
  }

  const questsUntilBonus = chain.nextBonusThreshold - chain.consecutiveQuests;
  const bonusProgress = Math.min(
    ((chain.consecutiveQuests % 5) / 5) * 100,
    100
  );

  if (questsUntilBonus <= 0) {
    return {
      showHook: true,
      message: `🔥 ${chain.bonusMultiplier.toFixed(2)}x BONUS AKTİF!`,
      bonusProgress: 100,
      nextReward: 'Maksimum bonusa ulaştın!',
    };
  }

  if (questsUntilBonus === 1) {
    return {
      showHook: true,
      message: '⚡ Şu an momentumdasın! 1 görev daha → bonus katlanır',
      bonusProgress: 80,
      nextReward: `+${(chain.bonusMultiplier + 0.20).toFixed(2)}x bonus`,
    };
  }

  if (questsUntilBonus <= 3) {
    return {
      showHook: true,
      message: `⚡ ${questsUntilBonus} görev daha → bonus artar`,
      bonusProgress: 60,
      nextReward: `+${(chain.bonusMultiplier + 0.20).toFixed(2)}x bonus`,
    };
  }

  return {
    showHook: chain.consecutiveQuests >= 2, // Show after 2 quests
    message: `🔥 ${chain.consecutiveQuests} görev üst üste`,
    bonusProgress: bonusProgress,
    nextReward: `${questsUntilBonus} görev sonra bonus`,
  };
}

/**
 * Calculate bonus multiplier for XP based on session chain
 */
export function calculateSessionBonus(chain: SessionChain): number {
  if (!chain.active) return 1.0;
  return chain.bonusMultiplier;
}
