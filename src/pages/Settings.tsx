import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Crown, AlertTriangle, RefreshCw, XCircle, ArrowRightLeft, ChevronDown, ChevronUp } from 'lucide-react';
import { useAuth } from '../features/auth/authContext';
import { useQuest } from '../features/quests/questContext';
import { LOCATIONS } from '../data/quests';
import BottomNav from '../components/BottomNav';
import LevelAssessmentModal from '../components/LevelAssessmentModal';
import type { LocationType, CategoryPreference } from '../types';
import styles from './Settings.module.css';

export default function Settings() {
  const { userProfile, logout, updateUserProfile } = useAuth();
  const { setShowPremiumModal, setQuestsForLocation, selectedLocation, setSelectedLocation } = useQuest();
  const navigate = useNavigate();
  
  const [showAssessment, setShowAssessment] = useState(false);
  const [showCategorySwitch, setShowCategorySwitch] = useState(false);
  const [showConfirmSwitch, setShowConfirmSwitch] = useState(false);
  const [pendingCategory, setPendingCategory] = useState<LocationType | null>(null);
  const [showPrefEdit, setShowPrefEdit] = useState(false);
  const [error, setError] = useState('');

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  // ── Kategori Değiştirme (Onay Gerekli) ──
  const handleCategorySwitchRequest = (catId: LocationType) => {
    if (catId === selectedLocation) return;
    setPendingCategory(catId);
    setShowCategorySwitch(false);
    setShowConfirmSwitch(true);
  };

  const confirmCategorySwitch = () => {
    if (!pendingCategory || !userProfile) return;
    
    // Eski kategorinin görevlerini sıfırla
    if (selectedLocation) {
      setQuestsForLocation(selectedLocation, []);
    }
    
    // Yeni kategoriye geç - XP ve streak korunur, eski tercihler de korunur
    const newPrefs = { ...(userProfile.categoryPreferences || {}) };
    
    updateUserProfile({
      categoryPreferences: newPrefs,
      challengeFocus: pendingCategory,
      challengeDay: 1,
      challengeStartTimestamp: new Date().toISOString(),
      // XP, streak, level KORUNUYOR - bunları sıfırlamıyoruz
    });

    // localStorage'daki görevleri temizle
    try {
      window.localStorage.removeItem('lifequest_quests');
    } catch {}

    setShowConfirmSwitch(false);
    setPendingCategory(null);
    
    // Quest context'i de güncelle
    setSelectedLocation(pendingCategory);
    
    // Yeni kategorinin anketi için modal aç
    setShowAssessment(true);
  };

  // ── Tercih Değiştirme (Seviye/Süre - Sıfırlama Hakkı Kullanır) ──
  const handleResetPreference = () => {
    if (!userProfile) return;
    const resets = userProfile.preferenceResetCount ?? 3;
    
    if (userProfile.isPremium || resets > 0) {
      setShowAssessment(true);
    } else {
      setError('Bu ayki tercih değiştirme hakkınız doldu (0/3). Premium alarak sınırsız değişim yapabilirsiniz.');
    }
  };

  const handleAssessmentComplete = (pref: CategoryPreference) => {
    if (!userProfile) return;
    const currentResets = userProfile.preferenceResetCount ?? 3;
    const activeFocus = pendingCategory || selectedLocation || userProfile.challengeFocus || 'din';

    // Eski görevleri temizle
    setQuestsForLocation(activeFocus as LocationType, []);
    try {
      window.localStorage.removeItem('lifequest_quests');
    } catch {}
    
    updateUserProfile({
      categoryPreferences: {
        ...(userProfile.categoryPreferences || {}),
        [activeFocus]: pref
      },
      challengeFocus: activeFocus as LocationType,
      preferenceResetCount: userProfile.isPremium ? currentResets : Math.max(0, currentResets - 1),
    });

    setShowAssessment(false);
    setPendingCategory(null);
    navigate('/dashboard');
  };

  if (!userProfile) return null;
  
  const resetsLeft = userProfile.preferenceResetCount ?? 3;
  const currentFocus = userProfile.challengeFocus || selectedLocation || 'din';
  const currentLoc = LOCATIONS.find(l => l.id === currentFocus);
  const currentPref = userProfile.categoryPreferences?.[currentFocus];

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Ayarlar</h1>
        <p>Hesabınızı ve tercihlerinizi yönetin.</p>
      </header>

      <main className={styles.main}>
        {error && (
          <div className={styles.errorBox}>
            <AlertTriangle size={20} />
            <span>{error}</span>
            <button onClick={() => setError('')}><XCircle size={16} /></button>
          </div>
        )}

        {/* ── Mevcut Hedef ── */}
        <section className={styles.section}>
          <h2>Aktif Hedefiniz</h2>
          <div className={styles.card}>
            <div className={styles.cardInfo}>
              <span style={{ fontSize: 28 }}>{currentLoc?.emoji || '🎯'}</span>
              <div>
                <h3>{currentLoc?.label || 'Belirlenmedi'}</h3>
                {currentPref ? (
                  <p>
                    {currentPref.experience === 'yeni' ? '🌱 Yeni' : currentPref.experience === 'orta' ? '🌿 Orta' : '🌳 İleri'} • {currentPref.duration} Dk/Gün
                  </p>
                ) : (
                  <p>Tercih henüz belirlenmedi</p>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* ── Kategori Değiştirme ── */}
        <section className={styles.section}>
          <h2>Kategori Değiştir</h2>
          <div className={styles.card}>
            <div className={styles.cardInfo}>
              <ArrowRightLeft className={styles.iconBlue} size={24} />
              <div>
                <h3>Başka Bir Hedefe Geç</h3>
                <p>Görevleriniz sıfırlanır ama XP ve seriniz korunur.</p>
              </div>
            </div>
            <button 
              className={styles.actionBtn} 
              onClick={() => setShowCategorySwitch(!showCategorySwitch)}
            >
              {showCategorySwitch ? <><ChevronUp size={16} /> Kapat</> : <><ChevronDown size={16} /> Kategorileri Göster</>}
            </button>
            
            {showCategorySwitch && (
              <div className={styles.categoryGrid}>
                {LOCATIONS.map(loc => (
                  <button
                    key={loc.id}
                    className={`${styles.categoryBtn} ${loc.id === currentFocus ? styles.categoryActive : ''}`}
                    onClick={() => handleCategorySwitchRequest(loc.id)}
                    disabled={loc.id === currentFocus}
                  >
                    <span className={styles.catEmoji}>{loc.emoji}</span>
                    <span className={styles.catLabel}>{loc.label.split(' ')[0]}</span>
                    {loc.id === currentFocus && <span className={styles.catBadge}>Aktif</span>}
                  </button>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* ── Seviye/Süre Düzenleme ── */}
        <section className={styles.section}>
          <h2>Görev Tercihleri</h2>
          <div className={styles.card}>
            <div className={styles.cardInfo}>
              <RefreshCw className={styles.iconBlue} size={24} />
              <div>
                <h3>Seviye ve Süre Ayarla</h3>
                <p>Mevcut hedefiniz için seviye veya süreyi değiştirin.</p>
                {!userProfile.isPremium && (
                  <span className={styles.limitText}>Kalan Hak: {resetsLeft}/3</span>
                )}
              </div>
            </div>
            
            {currentPref && (
              <button className={styles.editBtn} onClick={() => setShowPrefEdit(!showPrefEdit)}>
                {showPrefEdit ? 'Kapat' : 'Hızlı Düzenle'}
              </button>
            )}

            {showPrefEdit && currentPref && (
              <div className={styles.quickEdit}>
                <div className={styles.quickRow}>
                  <span>Seviye:</span>
                  <div className={styles.quickBtns}>
                    {(['yeni', 'orta', 'ileri'] as const).map(lvl => (
                      <button
                        key={lvl}
                        className={`${styles.qBtn} ${currentPref.experience === lvl ? styles.qBtnActive : ''}`}
                        onClick={() => {
                          if (currentPref.experience === lvl) return;
                          const newPref = { ...currentPref, experience: lvl };
                          setQuestsForLocation(currentFocus as LocationType, []);
                          try { window.localStorage.removeItem('lifequest_quests'); } catch {}
                          
                          const newResets = userProfile.isPremium ? resetsLeft : Math.max(0, resetsLeft - 1);
                          if (!userProfile.isPremium && resetsLeft <= 0) {
                            setError('Tercih değiştirme hakkınız doldu!');
                            return;
                          }
                          updateUserProfile({
                            categoryPreferences: {
                              ...(userProfile.categoryPreferences || {}),
                              [currentFocus]: newPref
                            },
                            preferenceResetCount: newResets,
                          });
                        }}
                      >
                        {lvl === 'yeni' ? '🌱' : lvl === 'orta' ? '🌿' : '🌳'} {lvl.charAt(0).toUpperCase() + lvl.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
                <div className={styles.quickRow}>
                  <span>Süre:</span>
                  <div className={styles.quickBtns}>
                    {([15, 30, 60, 90] as const).map(dur => (
                      <button
                        key={dur}
                        className={`${styles.qBtn} ${currentPref.duration === dur ? styles.qBtnActive : ''}`}
                        onClick={() => {
                          if (currentPref.duration === dur) return;
                          const newPref = { ...currentPref, duration: dur };
                          setQuestsForLocation(currentFocus as LocationType, []);
                          try { window.localStorage.removeItem('lifequest_quests'); } catch {}
                          
                          const newResets = userProfile.isPremium ? resetsLeft : Math.max(0, resetsLeft - 1);
                          if (!userProfile.isPremium && resetsLeft <= 0) {
                            setError('Tercih değiştirme hakkınız doldu!');
                            return;
                          }
                          updateUserProfile({
                            categoryPreferences: {
                              ...(userProfile.categoryPreferences || {}),
                              [currentFocus]: newPref
                            },
                            preferenceResetCount: newResets,
                          });
                        }}
                      >
                        {dur} dk
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <button className={styles.actionBtn} onClick={handleResetPreference}>
              Anketi Baştan Çöz
            </button>
          </div>
        </section>

        {/* ── Abonelik ── */}
        <section className={styles.section}>
          <h2>Abonelik</h2>
          <div className={`${styles.card} ${userProfile.isPremium ? styles.premiumActive : ''}`}>
            <div className={styles.cardInfo}>
              <Crown className={userProfile.isPremium ? styles.iconGold : styles.iconGray} size={24} />
              <div>
                <h3>{userProfile.isPremium ? 'LifeQuest Premium' : 'Ücretsiz Plan'}</h3>
                <p>{userProfile.isPremium ? 'Tüm özellikler aktif.' : 'Günlük 3 görev, 2 özel görev ekleme, ayda 3 tercih değişimi.'}</p>
              </div>
            </div>
            {!userProfile.isPremium && (
              <button className={styles.premiumBtn} onClick={() => setShowPremiumModal(true)}>
                Premium'a Yükselt
              </button>
            )}
          </div>
        </section>

        {/* ── Hesap ── */}
        <section className={styles.section}>
          <h2>Hesap</h2>
          <button className={styles.logoutBtn} onClick={handleLogout}>
            <LogOut size={20} />
            <span>Çıkış Yap</span>
          </button>
        </section>
      </main>

      {/* ── Kategori Değiştirme Onay Diyaloğu ── */}
      {showConfirmSwitch && pendingCategory && (
        <div className={styles.overlay}>
          <div className={styles.confirmModal}>
            <AlertTriangle size={40} color="#ff4757" />
            <h3>Kategori Değişikliği</h3>
            <p>
              <strong>{currentLoc?.label}</strong> hedefinden{' '}
              <strong>{LOCATIONS.find(l => l.id === pendingCategory)?.label}</strong> hedefine geçmek istiyorsunuz.
            </p>
            <div className={styles.confirmInfo}>
              <div className={styles.confirmKeep}>✅ XP, Seviye ve Seriniz korunacak</div>
              <div className={styles.confirmLose}>⚠️ Mevcut görevleriniz sıfırlanacak</div>
              <div className={styles.confirmLose}>⚠️ Yeni hedef için tercih anketi açılacak</div>
            </div>
            <div className={styles.confirmBtns}>
              <button className={styles.cancelBtn} onClick={() => { setShowConfirmSwitch(false); setPendingCategory(null); }}>
                Vazgeç
              </button>
              <button className={styles.dangerBtn} onClick={confirmCategorySwitch}>
                Onayla ve Değiştir
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Anket Modal ── */}
      {showAssessment && (
        <LevelAssessmentModal 
          location={pendingCategory ? LOCATIONS.find(l => l.id === pendingCategory) : currentLoc}
          onComplete={handleAssessmentComplete} 
        />
      )}
      
      <BottomNav />
    </div>
  );
}
