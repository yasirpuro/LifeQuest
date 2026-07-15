import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import QuestCard from '../QuestCard';

describe('QuestCard', () => {
  it('should render quest title', () => {
    const quest = {
      id: '1',
      title: 'Test Quest',
      description: 'Test description',
      location: 'din' as const,
      difficulty: 1 as const,
      duration: 30,
      dopamine: 10,
      calories: 100,
      scienceTag: 'test',
      completed: false,
      locked: false,
    };

    render(
      <QuestCard
        quest={quest}
        index={0}
        onShare={() => {}}
      />
    );

    expect(screen.getByText('Test Quest')).toBeDefined();
  });

  it('should render quest description', () => {
    const quest = {
      id: '1',
      title: 'Test Quest',
      description: 'Test description',
      location: 'din' as const,
      difficulty: 1 as const,
      duration: 30,
      dopamine: 10,
      calories: 100,
      scienceTag: 'test',
      completed: false,
      locked: false,
    };

    render(
      <QuestCard
        quest={quest}
        index={0}
        onShare={() => {}}
      />
    );

    expect(screen.getByText('Test description')).toBeDefined();
  });
});
