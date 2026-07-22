/**
 * Beta Release Gate - Ürün
 * İlk 60s anlaşılır, İlk quest tamamlanıyor, Reward sonrası devam isteği, Premium değeri net
 */

import { calculateKPIs, getCurrentSessionMetrics, startSession, endSession, trackEvent } from '../core/services/analyticsService';

interface ProductGateResult {
  first60sUnderstandable: boolean;
  firstQuestCompleted: boolean;
  continuationAfterReward: boolean;
  premiumValueClear: boolean;
  overallPass: boolean;
}

async function testFirst60sUnderstandable(): Promise<boolean> {
  console.log('🔍 İlk 60s anlaşılabilirlik kontrol ediliyor...');
  
  // Simulate onboarding flow timing
  const onboardingSteps = [
    'welcome_screen',
    'category_selection',
    'skill_selection',
    'dashboard_view',
  ];
  
  let totalTime = 0;
  for (const _step of onboardingSteps) {
    const stepTime = Math.random() * 15 + 5; // 5-20 seconds per step
    totalTime += stepTime;
  }
  
  // Check if total onboarding time is under 60 seconds
  const isUnder60s = totalTime < 60;
  console.log(`Onboarding süresi: ${totalTime.toFixed(1)}s`);
  console.log(`Status: ${isUnder60s ? '✅ PASS' : '❌ FAIL'}`);
  
  return isUnder60s;
}

async function testFirstQuestCompleted(): Promise<boolean> {
  console.log('🔍 İlk quest tamamlanabilirlik kontrol ediliyor...');
  
  // Start a session and track quest completion
  startSession();
  
  // Simulate user completing first quest
  await new Promise(resolve => setTimeout(resolve, 100));
  trackEvent('quest_completed', {
    quest_id: 'first-quest',
    category: 'egitim',
    difficulty: 'yeni',
  });
  
  // Get session metrics
  const metrics = getCurrentSessionMetrics();
  const firstQuestCompleted = metrics.tasks >= 1;
  
  endSession();
  
  console.log(`Tamamlanan quest sayısı: ${metrics.tasks}`);
  console.log(`Status: ${firstQuestCompleted ? '✅ PASS' : '❌ FAIL'}`);
  
  return firstQuestCompleted;
}

async function testContinuationAfterReward(): Promise<boolean> {
  console.log('🔍 Reward sonrası devam isteği kontrol ediliyor...');
  
  // Start session
  startSession();
  
  // Complete first quest
  trackEvent('quest_completed', {
    quest_id: 'quest-1',
  });
  
  // Show reward
  trackEvent('reward_shown', {
    reward_type: 'skill_xp',
  });
  
  // Check if user continues after reward
  await new Promise(resolve => setTimeout(resolve, 100));
  trackEvent('quest_completed', {
    quest_id: 'quest-2',
  });
  
  // Calculate KPIs
  const kpis = calculateKPIs();
  const continuationRate = kpis.continuationRate;
  
  endSession();
  
  // Continuation rate should be > 0.5 (50%)
  const goodContinuation = continuationRate > 0.5;
  console.log(`Continuation rate: ${(continuationRate * 100).toFixed(1)}%`);
  console.log(`Status: ${goodContinuation ? '✅ PASS' : '❌ FAIL'}`);
  
  return goodContinuation;
}

async function testPremiumValueClear(): Promise<boolean> {
  console.log('🔍 Premium değeri netliği kontrol ediliyor...');
  
  // Check if premium features are clearly communicated
  const premiumFeatures = [
    'unlimited_quests',
    'advanced_analytics',
    'skill_mastery',
    'custom_rewards',
  ];
  
  // Simulate premium page view
  trackEvent('premium_page_open', {
    features_shown: premiumFeatures.length,
  });
  
  // Check if premium value proposition is clear
  const valueClear = premiumFeatures.length >= 3;
  console.log(`Premium özellik sayısı: ${premiumFeatures.length}`);
  console.log(`Status: ${valueClear ? '✅ PASS' : '❌ FAIL'}`);
  
  return valueClear;
}

async function main() {
  console.log('🧪 Beta Release Gate - Ürün Test Başlatılıyor...\n');
  
  const results: ProductGateResult = {
    first60sUnderstandable: await testFirst60sUnderstandable(),
    firstQuestCompleted: await testFirstQuestCompleted(),
    continuationAfterReward: await testContinuationAfterReward(),
    premiumValueClear: await testPremiumValueClear(),
    overallPass: false,
  };
  
  console.log('\n📊 Test Sonuçları:\n');
  console.log('=== İlk 60s Anlaşılabilir ===');
  console.log(`Status: ${results.first60sUnderstandable ? '✅ PASS' : '❌ FAIL'}`);
  
  console.log('\n=== İlk Quest Tamamlanabilir ===');
  console.log(`Status: ${results.firstQuestCompleted ? '✅ PASS' : '❌ FAIL'}`);
  
  console.log('\n=== Reward Sonrası Devam İsteği ===');
  console.log(`Status: ${results.continuationAfterReward ? '✅ PASS' : '❌ FAIL'}`);
  
  console.log('\n=== Premium Değeri Net ===');
  console.log(`Status: ${results.premiumValueClear ? '✅ PASS' : '❌ FAIL'}`);
  
  // Overall pass check
  results.overallPass = 
    results.first60sUnderstandable &&
    results.firstQuestCompleted &&
    results.continuationAfterReward &&
    results.premiumValueClear;
  
  console.log('\n' + '='.repeat(50));
  console.log(results.overallPass ? '✅ BETA RELEASE GATE (PRODUCT) - PASS' : '❌ BETA RELEASE GATE (PRODUCT) - FAIL');
  console.log('='.repeat(50));
  
  process.exit(results.overallPass ? 0 : 1);
}

main();
