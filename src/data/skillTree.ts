import type { SkillTreeNode } from '../types';

// Basit örnek skill tree. İhtiyaç halinde genişletilebilir.
export const SKILL_TREE: SkillTreeNode[] = [
  {
    id: 'kisisel-gelisim',
    name: 'Kişisel Gelişim',
    description: 'Günlük disiplin, odak ve küçük alışkanlıklar',
    children: [
      { id: 'disiplin', name: 'Disiplin', parentId: 'kisisel-gelisim' },
      { id: 'odak', name: 'Odak', parentId: 'kisisel-gelisim' },
    ],
  },
  {
    id: 'dil',
    name: 'Dil Öğrenme',
    description: 'Kelime, dilbilgisi ve pratik',
    children: [
      { id: 'kelime', name: 'Kelime', parentId: 'dil' },
      { id: 'dilbilgisi', name: 'Dilbilgisi', parentId: 'dil' },
    ],
  },
  {
    id: 'spor',
    name: 'Spor & Fitness',
    children: [
      { id: 'cardio', name: 'Cardio', parentId: 'spor' },
      { id: 'guc', name: 'Güç', parentId: 'spor' },
    ],
  },
];

export default SKILL_TREE;
