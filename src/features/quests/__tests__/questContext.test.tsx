import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { QuestProvider, useQuest } from '../questContext';
import { questRepository } from '../../../core/repositories/questRepository';

vi.mock('../../../core/repositories/questRepository');

describe('questContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should provide quest context', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <QuestProvider>{children}</QuestProvider>
    );

    const { result } = renderHook(() => useQuest(), { wrapper });

    expect(result.current).toBeDefined();
    expect(result.current.quests).toEqual([]);
    expect(result.current.isLoading).toBe(false);
  });

  it('should load quests', async () => {
    const mockQuests = [
      { 
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
      },
    ];
    vi.mocked(questRepository.getQuests).mockResolvedValue({
      success: true,
      data: mockQuests,
    });

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <QuestProvider>{children}</QuestProvider>
    );

    const { result } = renderHook(() => useQuest(), { wrapper });

    await act(async () => {
      await result.current.loadQuests();
    });

    expect(result.current.quests).toEqual(mockQuests);
  });

  it('should complete quest', async () => {
    const mockQuests = [
      { 
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
      },
    ];
    vi.mocked(questRepository.getQuests).mockResolvedValue({
      success: true,
      data: mockQuests,
    });
    vi.mocked(questRepository.saveQuestCompletion).mockResolvedValue({
      success: true,
    });

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <QuestProvider>{children}</QuestProvider>
    );

    const { result } = renderHook(() => useQuest(), { wrapper });

    await act(async () => {
      await result.current.loadQuests();
      await result.current.completeQuest('1', 'Test note');
    });

    expect(result.current.quests[0].completed).toBe(true);
  });
});
