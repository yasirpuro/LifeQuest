/**
 * Migration script: eski LifeQuest state'i yeni DynEd skill engine format'ına dönüştürür
 * 
 * Kullanım:
 * - App.tsx App yükü sırasında veya manuel olarak çağır
 * - Varolan kullanıcılar için otomatik safe migration
 */

import type { SkillProgress } from '../types';
import { SKILL_TREE } from '../data/skillTree';
import { loadJsonKey, saveJsonKey } from './persistenceOwner';

const STORAGE_KEY_OLD = 'lifequest_state';
const STORAGE_KEY_SKILLS = 'lifequest_skills_v1';

export function migrateToSkillEngine(): boolean {
  try {
    // Eğer yeni format zaten varsa, işlem yapma
    const existing = loadJsonKey<any>(STORAGE_KEY_SKILLS);
    if (existing) {
      return false; // Already migrated
    }

    // Eski state'i oku
    const oldState = loadJsonKey<any>(STORAGE_KEY_OLD);
    if (!oldState) {
      // Yeni kullanıcı: boş skill map oluştur
      const init: Record<string, SkillProgress> = {};
      flattenSkillTree().forEach(s => {
        init[s.id] = { skillId: s.id, xp: 0, mastery: 0, lastPracticed: null, nextDue: null, decayRate: 0.05 };
      });
      saveJsonKey(STORAGE_KEY_SKILLS, init);
      return true;
    }

    // Eski state -> yeni skill engine
    const migratedSkills: Record<string, SkillProgress> = {};
    const skillTree = flattenSkillTree();
    
    // İlk olarak tüm skill'leri sıfırla
    skillTree.forEach(s => {
      migratedSkills[s.id] = { skillId: s.id, xp: 0, mastery: 0, lastPracticed: null, nextDue: null, decayRate: 0.05 };
    });

    // Eğer eski state'de totalQuests varsa, XP dağıt (başlangıç bonusu)
    if (oldState.user && oldState.user.totalQuests) {
      const baseXp = Math.min(oldState.user.totalQuests * 5, 500); // cap 500 XP
      const mainSkill = skillTree[0];
      if (mainSkill) {
          migratedSkills[mainSkill.id] = {
            ...migratedSkills[mainSkill.id],
            xp: baseXp,
            mastery: Math.min(100, Math.floor(baseXp / 10)),
            lastPracticed: new Date().toISOString(),
            decayRate: 0.05,
          };
      }
    }

    // Yeni format'ı localStorage'a yaz
    saveJsonKey(STORAGE_KEY_SKILLS, migratedSkills);

    // Optional: console log
    console.log('[DynEd] Skill Engine migration completed. Users start with skill tree.');

    return true;
  } catch (e) {
    console.error('[DynEd] Migration failed:', e);
    return false;
  }
}

// Helper: skill tree'yi flatten et
function flattenSkillTree(): Array<{ id: string; name: string }> {
  const list: Array<{ id: string; name: string }> = [];
  const walk = (node: any) => {
    list.push({ id: node.id, name: node.name });
    if (node.children) node.children.forEach((c: any) => walk(c));
  };
  SKILL_TREE.forEach(n => walk(n));
  return list;
}
