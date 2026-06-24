import styles from './EmptyStates.module.css';

export function EmptyQuestsState({ reason = 'no-tasks' }: { reason?: string }) {
  const messages = {
    'no-tasks': { emoji: '📭', title: 'Görev yok', desc: 'Bugün için hiç görev yok. Yeni görev ekle veya kategori seç.' },
    'no-skills': { emoji: '🌱', title: 'Skill tree boş', desc: 'Henüz hiç skill practice yapmadın. Bugün başla!' },
    'skill-mastered': { emoji: '🏆', title: 'Skill Master!', desc: 'Bu skill %100 mastery! Yeni alana geç.' },
    'recovery-mode': { emoji: '🔄', title: 'Comeback Mode', desc: "Streak kaybettin ama endişe etme. Comeback quest'i tamamla." },
  };

  const msg = messages[reason as keyof typeof messages] || messages['no-tasks'];

  return (
    <div className={styles.empty}>
      <div className={styles.emoji}>{msg.emoji}</div>
      <h3>{msg.title}</h3>
      <p>{msg.desc}</p>
    </div>
  );
}

export function EmptySkillState() {
  return (
    <div className={styles.empty}>
      <div className={styles.emoji}>🎯</div>
      <h3>Focus skill seç</h3>
      <p>Henüz focus skill seçilmedi. Dashboard'dan başla!</p>
    </div>
  );
}

export function XPGainFeedback({
  amount,
  source,
  skillName,
}: {
  amount: number;
  source: 'quest' | 'comeback' | 'bonus' | 'decay';
  skillName?: string;
}) {
  const sourceEmoji = {
    quest: '⭐',
    comeback: '🔥',
    bonus: '🎁',
    decay: '📉',
  };

  const sourceText = {
    quest: `Görev tamamladın!`,
    comeback: `Geri döndün! Comeback bonus!`,
    bonus: `Bonus XP!`,
    decay: `Skill decay: -${amount} mastery`,
  };

  return (
    <div className={`${styles.feedback} ${styles[source]}`}>
      <span className={styles.emoji}>{sourceEmoji[source]}</span>
      <div>
        <p className={styles.text}>{sourceText[source]}</p>
        {skillName && <p className={styles.skill}>{skillName}</p>}
        <p className={styles.xp}>+{amount} XP</p>
      </div>
    </div>
  );
}

export function StreakWarning({ daysInactive, hasToken }: { daysInactive: number; hasToken: boolean }) {
  if (daysInactive === 0) return null;

  const risk = daysInactive === 1 ? 'warning' : 'critical';
  const message = daysInactive === 1 ? '⚠️ 1 gün kalmış!' : '🔥 Streak kaybettin!';

  return (
    <div className={`${styles.warning} ${styles[risk]}`}>
      <p>{message}</p>
      {hasToken && <p className={styles.recovery}>🛡️ Freeze token'ını kullan!</p>}
    </div>
  );
}
