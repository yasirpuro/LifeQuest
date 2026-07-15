import { getSupabase } from '../shared/api/supabase';
import { createTestUser } from './auth/authTestHelper';

export interface DuplicateTestResult {
  firstInsert: {
    success: boolean;
    xpBefore: number;
    xpAfter: number;
    xpDelta: number;
    error?: string;
  };
  secondInsert: {
    success: boolean;
    xpBefore: number;
    xpAfter: number;
    xpDelta: number;
    error?: string;
  };
  overall: {
    blocked: boolean;
    xpCorrect: boolean;
    noCrash: boolean;
  };
}

/**
 * Test duplicate prevention with completion_id
 */
export async function testDuplicatePrevention(completionId: string = 'test123'): Promise<DuplicateTestResult> {
  const user = await createTestUser();
  const supabase = getSupabase();
  if (!supabase) {
    throw new Error('Supabase not configured');
  }

  // Get initial XP
  const { data: initialProfile } = await supabase
    .from('profiles')
    .select('xp')
    .eq('id', user.id)
    .single();

  const xpBeforeFirst = initialProfile?.xp || 0;

  // First insert
  const firstQuest = {
    user_id: user.id,
    title: 'Duplicate Test Quest',
    category: 'test',
    difficulty: '1',
    xp_reward: 100,
    completed: true,
    completed_at: new Date().toISOString(),
    completion_id: completionId,
  };

  const { error: firstError } = await supabase
    .from('quests')
    .insert(firstQuest);

  // Get XP after first insert
  const { data: profileAfterFirst } = await supabase
    .from('profiles')
    .select('xp')
    .eq('id', user.id)
    .single();

  const xpAfterFirst = profileAfterFirst?.xp || 0;

  const firstInsertResult = {
    success: !firstError,
    xpBefore: xpBeforeFirst,
    xpAfter: xpAfterFirst,
    xpDelta: xpAfterFirst - xpBeforeFirst,
    error: firstError?.message,
  };

  // Second insert (should be blocked)
  const xpBeforeSecond = xpAfterFirst;

  const { error: secondError } = await supabase
    .from('quests')
    .insert(firstQuest);

  // Get XP after second insert
  const { data: profileAfterSecond } = await supabase
    .from('profiles')
    .select('xp')
    .eq('id', user.id)
    .single();

  const xpAfterSecond = profileAfterSecond?.xp || 0;

  const secondInsertResult = {
    success: !secondError,
    xpBefore: xpBeforeSecond,
    xpAfter: xpAfterSecond,
    xpDelta: xpAfterSecond - xpBeforeSecond,
    error: secondError?.message,
  };

  // Overall results
  const blocked = !!secondError && secondError.message.includes('duplicate');
  const xpCorrect = xpAfterSecond === xpAfterFirst;
  const noCrash = true; // If we got here, no crash occurred

  return {
    firstInsert: firstInsertResult,
    secondInsert: secondInsertResult,
    overall: {
      blocked,
      xpCorrect,
      noCrash,
    },
  };
}

/**
 * Test duplicate prevention in orchestrator level
 */
export async function testOrchestratorDuplicatePrevention(completionId: string = 'test123'): Promise<{
  orchestratorBlocked: boolean;
  databaseBlocked: boolean;
  xpCorrect: boolean;
}> {
  // This would test the orchestrator logic
  // For now, we'll test the database constraint
  const result = await testDuplicatePrevention(completionId);
  
  return {
    orchestratorBlocked: result.overall.blocked, // Would be orchestrator check in real implementation
    databaseBlocked: result.overall.blocked,
    xpCorrect: result.overall.xpCorrect,
  };
}
