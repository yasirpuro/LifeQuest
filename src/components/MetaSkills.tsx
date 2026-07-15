import { Brain, Flame, Calendar } from 'lucide-react';
import type { MetaSkills } from '../types';
import styles from './MetaSkills.module.css';

interface MetaSkillsProps {
  metaSkills: MetaSkills;
}

const META_SKILL_CONFIG = {
  focus: {
    icon: Brain,
    color: '#863bff',
    label: 'Focus',
    description: 'Odaklanma yeteneği',
  },
  discipline: {
    icon: Flame,
    color: '#ff6b6b',
    label: 'Discipline',
    description: 'Öz disiplin',
  },
  consistency: {
    icon: Calendar,
    color: '#47bfff',
    label: 'Consistency',
    description: 'Süreklilik',
  },
};

export default function MetaSkills({ metaSkills }: MetaSkillsProps) {
  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Karakter Gelişimi</h3>
      <div className={styles.skillsGrid}>
        {(Object.keys(metaSkills) as Array<keyof MetaSkills>).map((skillKey) => {
          const skill = metaSkills[skillKey];
          const config = META_SKILL_CONFIG[skillKey];
          const Icon = config.icon;
          const progressPercent = (skill.xp / skill.xpToNext) * 100;

          return (
            <div key={skillKey} className={styles.skillCard}>
              <div className={styles.skillHeader}>
                <div className={styles.skillIcon} style={{ color: config.color }}>
                  <Icon size={20} />
                </div>
                <div className={styles.skillInfo}>
                  <span className={styles.skillLabel}>{config.label}</span>
                  <span className={styles.skillLevel}>Level {skill.level}</span>
                </div>
              </div>
              
              <div className={styles.skillDescription}>
                {config.description}
              </div>

              <div className={styles.progressBar}>
                <div 
                  className={styles.progressFill}
                  style={{ 
                    width: `${progressPercent}%`,
                    backgroundColor: config.color 
                  }}
                />
              </div>
              
              <div className={styles.skillStats}>
                <span className={styles.xpText}>{skill.xp} / {skill.xpToNext} XP</span>
                {skill.level > 1 && (
                  <span className={styles.bonusText}>+{(skill.level - 1) * 2}% bonus</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
