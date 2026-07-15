/**
 * Anticipation Service
 * Creates "what's next?" curiosity - stronger than dopamine
 * Prevents predictability and builds engagement through uncertainty
 */

export interface AnticipationHint {
  type: 'surprise' | 'big_reward' | 'special' | 'mystery';
  message: string;
  probability: number; // 0-1
  showAfterQuest: number; // show after X quests in session
}

const ANTICIPATION_HINTS: AnticipationHint[] = [
  {
    type: 'surprise',
    message: '👀 Bir sonraki görevde sürpriz olabilir',
    probability: 0.15,
    showAfterQuest: 2,
  },
  {
    type: 'big_reward',
    message: '🎁 Büyük ödül yaklaşıyor',
    probability: 0.10,
    showAfterQuest: 3,
  },
  {
    type: 'special',
    message: '✨ Özel bir şey hazırlanıyor',
    probability: 0.08,
    showAfterQuest: 4,
  },
  {
    type: 'mystery',
    message: '🔮 Gizli bir şey seni bekliyor',
    probability: 0.05,
    showAfterQuest: 5,
  },
];

let lastShownHintIndex = -1;
let sessionQuestCount = 0;

/**
 * Get anticipation hint for current session
 * Shows hints based on session progress and probability
 */
export function getAnticipationHint(): AnticipationHint | null {
  sessionQuestCount++;

  // Don't show hints in first quest
  if (sessionQuestCount < 2) return null;

  // Filter hints that should show at this session progress
  const eligibleHints = ANTICIPATION_HINTS.filter(
    hint => sessionQuestCount >= hint.showAfterQuest
  );

  if (eligibleHints.length === 0) return null;

  // Roll for each hint
  for (const hint of eligibleHints) {
    if (Math.random() < hint.probability) {
      // Don't show same hint twice in a row
      const hintIndex = ANTICIPATION_HINTS.indexOf(hint);
      if (hintIndex === lastShownHintIndex) continue;

      lastShownHintIndex = hintIndex;
      return hint;
    }
  }

  return null;
}

/**
 * Reset session (call on logout or new session)
 */
export function resetAnticipationSession(): void {
  sessionQuestCount = 0;
  lastShownHintIndex = -1;
}

/**
 * Get anticipation probability for UI display
 * Shows users that something special might happen
 */
export function getAnticipationProbability(): number {
  if (sessionQuestCount < 2) return 0;

  // Calculate cumulative probability
  const eligibleHints = ANTICIPATION_HINTS.filter(
    hint => sessionQuestCount >= hint.showAfterQuest
  );

  const cumulativeProbability = eligibleHints.reduce(
    (sum, hint) => sum + hint.probability,
    0
  );

  return Math.min(cumulativeProbability, 0.5); // Cap at 50%
}
