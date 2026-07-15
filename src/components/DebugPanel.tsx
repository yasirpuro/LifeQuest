import { useState, useEffect } from 'react';
import { useAuth } from '../features/auth/authContext';
import { useSkill } from '../features/skills/skillContext';
import { useQuest } from '../features/quests/questContext';
import { getSupabase, isSupabaseConfigured, isProduction, isStaging } from '../shared/api/supabase';

// Local helper function (moved from deleted orchestrator)
function getDayKey(ts = Date.now()): string {
  return new Date(ts).toISOString().slice(0, 10);
}

/**
 * DEV DEBUG PANEL
 * Açmak için: URL'ye ?debug=1 ekle
 * Kapatmak için: ?debug=0 veya query param olmadan aç
 *
 * window.__APP_STATE__ üzerinden de erişilebilir (DevTools Console)
 */
export function DebugPanel() {
  const [show, setShow] = useState(false);
  const [tab, setTab] = useState<'state' | 'quests' | 'skills' | 'supabase' | 'testing'>('state');
  const { userProfile } = useAuth();
  const { skillsProgress, completionResult } = useSkill();
  const { quests, selectedLocation, freeQuestsToday, freeLocationsToday } = useQuest();
  const [supabaseStatus, setSupabaseStatus] = useState<any>(null);
  const testResults = {
    auth: 'PENDING',
    profileRestore: 'PENDING',
    duplicate: 'PENDING',
    offlineSync: 'PENDING',
  };

  // Activate via URL ?debug=1
  useEffect(() => {
    const url = new URLSearchParams(window.location.search);
    if (url.get('debug') === '1') setShow(true);
  }, []);

  // Check Supabase status
  useEffect(() => {
    const checkSupabase = () => {
      const client = getSupabase();
      if (!client) {
        setSupabaseStatus({
          configured: isSupabaseConfigured,
          environment: isProduction ? 'production' : isStaging ? 'staging' : 'development',
          connected: false,
          error: 'Client not initialized'
        });
        return;
      }

      // Check auth session
      client.auth.getSession().then(({ data: { session }, error }) => {
        setSupabaseStatus({
          configured: isSupabaseConfigured,
          environment: isProduction ? 'production' : isStaging ? 'staging' : 'development',
          connected: true,
          session: session ? 'Active' : 'None',
          userId: session?.user?.id || null,
          email: session?.user?.email || null,
          error: error?.message || null
        });
      });
    };

    checkSupabase();
  }, []);

  // Expose on window for DevTools
  useEffect(() => {
    (window as any).__APP_STATE__ = {
      user: userProfile,
      quests,
      skillsProgress,
      selectedLocation,
      completionResult,
      freeQuestsToday,
    };
  });

  if (!show) {
    return (
      <button
        onClick={() => setShow(true)}
        style={{
          position: 'fixed', bottom: 80, right: 12, zIndex: 9999,
          background: '#1a1a2e', color: '#6C63FF', border: '1px solid #6C63FF',
          borderRadius: 8, padding: '4px 10px', fontSize: 11, cursor: 'pointer', opacity: 0.7
        }}
        title="Debug Panel (dev only)"
      >
        🛠 DEBUG
      </button>
    );
  }

  const completedToday = quests.filter(q => q.completed).length;
  const today = getDayKey();
  const dailyXp = (userProfile as any).dailyXp;

  return (
    <div style={{
      position: 'fixed', bottom: 80, right: 8, zIndex: 9999,
      background: '#0d0d1a', color: '#e0e0f0', border: '1px solid #6C63FF',
      borderRadius: 12, width: 320, maxHeight: '75vh', overflow: 'hidden',
      display: 'flex', flexDirection: 'column', fontFamily: 'monospace',
      fontSize: 11, boxShadow: '0 0 20px #6C63FF44'
    }}>
      {/* Header */}
      <div style={{ padding: '8px 12px', borderBottom: '1px solid #333', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ color: '#6C63FF', fontWeight: 700 }}>🛠 DEBUG PANEL</span>
        <div style={{ display: 'flex', gap: 8 }}>
          {(['state', 'quests', 'skills', 'supabase', 'testing'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              background: tab === t ? '#6C63FF' : 'transparent', color: tab === t ? '#fff' : '#999',
              border: '1px solid #444', borderRadius: 4, padding: '2px 6px', cursor: 'pointer', fontSize: 10
            }}>{t}</button>
          ))}
          <button onClick={() => setShow(false)} style={{ background: 'none', border: 'none', color: '#ff4757', cursor: 'pointer', fontWeight: 700 }}>✕</button>
        </div>
      </div>

      {/* Content */}
      <div style={{ overflow: 'auto', padding: 12, flex: 1 }}>
        {tab === 'state' && (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <tbody>
              {[
                ['XP', userProfile?.xp || 0],
                ['Level', userProfile?.level || 1],
                ['Streak', userProfile?.streak || 0],
                ['Daily XP', `${dailyXp?.earned ?? 0} / 1000 (${dailyXp?.date ?? '-'})`],
                ['Today Key', today],
                ['Daily Reset Day', '-'],
                ['Quests Done Today', `${completedToday} / ${quests.length}`],
                ['Free Quests Left', freeQuestsToday],
                ['Free Locations Left', freeLocationsToday],
                ['Premium', userProfile?.isPremium ? '✅' : '❌'],
                ['Location', selectedLocation ?? '—'],
                ['Last Quest At', userProfile?.lastQuestCompletedAt ? new Date(userProfile.lastQuestCompletedAt).toLocaleTimeString() : '—'],
                ['Streak Risk', (userProfile as any).streakRiskLevel ?? '—'],
              ].map(([k, v]) => (
                <tr key={k as string} style={{ borderBottom: '1px solid #1e1e3a' }}>
                  <td style={{ color: '#888', paddingRight: 8, paddingBottom: 4 }}>{k}</td>
                  <td style={{ color: '#c0f0d0', fontWeight: 700 }}>{String(v)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {tab === 'quests' && (
          <div>
            {quests.slice(0, 20).map(q => (
              <div key={q.id} style={{
                display: 'flex', justifyContent: 'space-between',
                borderBottom: '1px solid #1e1e3a', padding: '3px 0', color: q.completed ? '#4caf50' : '#aaa'
              }}>
                <span style={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {q.completed ? '✅ ' : '⬜ '}{q.title}
                </span>
                <span style={{ color: '#666' }}>d{q.difficulty}</span>
              </div>
            ))}
            {quests.length > 20 && <div style={{ color: '#666', marginTop: 4 }}>+{quests.length - 20} more</div>}
          </div>
        )}

        {tab === 'skills' && (
          <div>
            {Object.entries(skillsProgress || {}).length === 0 && (
              <div style={{ color: '#666' }}>No skill progress yet — complete a quest first.</div>
            )}
            {Object.entries(skillsProgress || {}).map(([id, s]: any) => (
              <div key={id} style={{ borderBottom: '1px solid #1e1e3a', padding: '4px 0' }}>
                <div style={{ color: '#a0a0ff' }}>{id}</div>
                <div style={{ display: 'flex', gap: 12, color: '#c0f0d0', fontSize: 10 }}>
                  <span>XP: {s.xp}</span>
                  <span>Mastery: {s.mastery}%</span>
                  <span>Due: {s.nextDue ? new Date(s.nextDue).toLocaleDateString() : '—'}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === 'supabase' && (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <tbody>
              {[
                ['Configured', supabaseStatus?.configured ? '✅' : '❌'],
                ['Environment', supabaseStatus?.environment || '—'],
                ['Connected', supabaseStatus?.connected ? '✅' : '❌'],
                ['Session', supabaseStatus?.session || '—'],
                ['User ID', supabaseStatus?.userId || '—'],
                ['Email', supabaseStatus?.email || '—'],
                ['Error', supabaseStatus?.error || '—'],
              ].map(([k, v]) => (
                <tr key={k as string} style={{ borderBottom: '1px solid #1e1e3a' }}>
                  <td style={{ color: '#888', paddingRight: 8, paddingBottom: 4 }}>{k}</td>
                  <td style={{ color: v === '✅' ? '#4caf50' : v === '❌' ? '#ff4757' : '#c0f0d0', fontWeight: 700 }}>{String(v)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {tab === 'testing' && (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <tbody>
              {[
                ['Auth Test', testResults.auth],
                ['Profile Restore', testResults.profileRestore],
                ['Duplicate Prevention', testResults.duplicate],
                ['Offline Sync', testResults.offlineSync],
              ].map(([k, v]) => (
                <tr key={k as string} style={{ borderBottom: '1px solid #1e1e3a' }}>
                  <td style={{ color: '#888', paddingRight: 8, paddingBottom: 4 }}>{k}</td>
                  <td style={{ 
                    color: v === 'PASS' ? '#4caf50' : v === 'FAIL' ? '#ff4757' : '#ffd700',
                    fontWeight: 700 
                  }}>{String(v)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Last completion result */}
      {completionResult && (
        <div style={{ padding: '6px 12px', borderTop: '1px solid #333', background: '#0a0a1f', fontSize: 10 }}>
          <span style={{ color: '#ffd700' }}>Last: </span>
          <span style={{ color: '#4caf50' }}>+{completionResult.xpEarned} XP</span>
          {completionResult.leveledUp && <span style={{ color: '#ff9800', marginLeft: 8 }}>🎉 LEVEL UP → {completionResult.newLevel}</span>}
        </div>
      )}
    </div>
  );
}

export default DebugPanel;
