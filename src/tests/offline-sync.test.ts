/**
 * Phase D: Offline Sync Test
 * Firestore offline persistence → Internet OFF → Quest/Reward/Skill XP → Kapat → Internet ON → Sync → Local=Cloud
 */

import { runOfflineSyncTest } from './offlineSyncTestHelper';

async function main() {
  console.log('🧪 Phase D: Offline Sync Test Başlatılıyor...\n');
  
  try {
    const result = await runOfflineSyncTest();
    
    console.log('📊 Test Sonuçları:\n');
    console.log('=== Offline Quest ===');
    console.log(`Quest Tamamlandı: ${result.offlineQuest.questCompleted ? '✅' : '❌'}`);
    console.log(`XP Kazanıldı: ${result.offlineQuest.xpEarned}`);
    console.log(`Reward Alındı: ${result.offlineQuest.rewardReceived ? '✅' : '❌'}`);
    console.log(`Skill XP Kazanıldı: ${result.offlineQuest.skillXpGained}`);
    
    console.log('\n=== Local State ===');
    console.log(`XP: ${result.localState.xp}`);
    console.log(`Quests: ${result.localState.quests}`);
    console.log(`Skills: ${JSON.stringify(result.localState.skills)}`);
    
    console.log('\n=== Cloud State ===');
    console.log(`XP: ${result.cloudState.xp}`);
    console.log(`Quests: ${result.cloudState.quests}`);
    console.log(`Skills: ${JSON.stringify(result.cloudState.skills)}`);
    
    console.log('\n=== Sync Result ===');
    console.log(`Sync Başarılı: ${result.syncResult.success ? '✅' : '❌'}`);
    console.log(`Local == Cloud: ${result.syncResult.localEqualsCloud ? '✅' : '❌'}`);
    console.log(`Queue Processed: ${result.syncResult.queueProcessed}`);
    console.log(`Queue Failed: ${result.syncResult.queueFailed}`);
    
    // Test başarılı mı?
    const testPassed = 
      result.offlineQuest.questCompleted &&
      result.syncResult.success &&
      result.syncResult.localEqualsCloud &&
      result.syncResult.queueFailed === 0;
    
    console.log('\n' + '='.repeat(50));
    console.log(testPassed ? '✅ TEST BAŞARILI' : '❌ TEST BAŞARISIZ');
    console.log('='.repeat(50));
    
    process.exit(testPassed ? 0 : 1);
  } catch (error) {
    console.error('❌ Test hatası:', error);
    process.exit(1);
  }
}

main();
