import styles from './PremiumAura.module.css';

interface PremiumAuraProps {
  active: boolean;
  children: React.ReactNode;
}

export default function PremiumAura({ active, children }: PremiumAuraProps) {
  if (!active) {
    return <>{children}</>;
  }

  return (
    <div className={styles.premiumWrapper}>
      <div className={styles.aura} />
      <div className={styles.glow} />
      <div className={styles.content}>
        {children}
      </div>
    </div>
  );
}
