# LifeQuest v1.1.0 Release Notes

## Özet

DynEd tabanlı **Skill Engine v1** eklendi — görev tabanlı öğrenmeyi spaced repetition sistemiyle dönüştürdü. Kullanıcılar artık streak kaybetmeden skill mastery hedefine odaklanabilir ve widget'tan focus skill görebilir.

---

## Yeni Özellikler

### 🧠 DynEd Skill Engine (Core)

- **Skill Tree**: 8 ana kategori (Kişisel Gelişim, Dil, Spor, vb.) + sub-skills
- **XP Curve**: `baseXp * difficultyMultiplier * log2(1 + streak)`
  - Streak büyüdükçe XP kazanım artar (bağımlılık)
  - Comeback bonus: 2+ gün inaktif sonrası +80% XP
- **Mastery Calculation**: XP → 0..100% mastery (simple: xp/10)
- **Spaced Repetition**: mastery düşükse sık tekrar, yüksekse seyrek
  - Overdue: 7+ gün
  - Normal: 3-7 gün
  - Mastered: 14+ gün

### 🎯 Focus System (Widget)

- **Dashboard FocusWidget**: 
  - Focus skill (overdue veya lowest mastery)
  - Mastery % + progress bar (gradient animation)
  - Urgency göstergesi (overdue=kırmızı, normal=mavi, mastered=yeşil)
  - Streak göstergesi
  
### 📱 Native Widget Bridge (Android)

- SkillBridge: `lifequest_skills_v1` JSON'u SharedPreferences/Filesystem'dan okur
- SkillWidgetProvider: native widget focus skill + mastery gösterir
- JS ↔ Native: Capacitor Preferences + Filesystem sync

### 📲 Smart Notifications

- `shouldSendNotification()`: günlük max 1 bildirim per skill
- `markNotificationSent()`: today tracking
- Focus skill tekrar zamanı bildirimi (Capacitor LocalNotifications)
- Dashboard'da load sırasında otomatik tetikleme

### 🔄 Migration & Persistence

- Otomatik eski state → DynEd skill format dönüşüm
- `lifequest_skills_v1` localStorage + native sync
- Safe fallback: dosya yedekleri

---

## Technical Changes

### Tipleri Güncellenmiş

- `Quest.skillId?`: opsiyonel skill mapping
- `Skill`, `SkillProgress`: DynEd veri modeli
- `AppContextValue.skillEngine`: optional hook

### Yeni Dosyalar

- `src/hooks/useSkillEngine.ts`: core engine
- `src/data/skillTree.ts`: skill hierarchy
- `src/components/FocusWidget.tsx`: widget component
- `src/utils/notificationHelper.ts`: notification gate
- `src/utils/migrateToSkillEngine.ts`: migration script
- `android/app/src/main/java/app/lifequest.twa/SkillBridge.kt`: native helper
- `android/app/src/main/java/app/lifequest.twa/SkillWidgetProvider.kt`: widget provider
- `android/app/src/main/res/layout/widget_skill.xml`: widget layout
- `android/app/src/main/res/xml/skill_widget_info.xml`: widget metadata

### Güncellenmiş Dosyalar

- `src/context/AppContext.tsx`: skillEngine entegrasyonu, görev → skill XP
- `src/pages/Dashboard.tsx`: FocusWidget import, notification scheduling
- `AndroidManifest.xml`: SkillWidgetProvider receiver kayıt
- `docs/PLAY_CONSOLE_TR.md`: TWA → Capacitor rehberi
- `android/keystore.properties.example`: keystore örneği eklendi

---

## Breaking Changes

❌ Yok — migrations otomatik run

---

## Migration Path (Kullanıcılar)

1. App açılışında `migrateToSkillEngine()` otomatik çalışır
2. Eski `lifequest_state` korunur (backup)
3. Yeni `lifequest_skills_v1` oluşturulur ve totalQuests'e göre XP verilir
4. Skill tree başlatılır

---

## Test Checklist

### Web

- [ ] Dashboard FocusWidget renderlenir
- [ ] Focus skill doğru seçiliyor (overdue/lowest mastery)
- [ ] Progress bar animasyonu çalışıyor
- [ ] Urgency colors değişiyor (red/blue/green)
- [ ] Görev tamamlama → skill XP kazanc
- [ ] Notification (browser console) tetikleniyor
- [ ] localStorage `lifequest_skills_v1` update olyor

### Android

- [ ] Debug APK install (com.lifequest.app.debug)
- [ ] Dashboard yükleniyor
- [ ] Native widget Home ekran'a eklenebiliyor
- [ ] Widget focus skill gösteriyor (mastery %)
- [ ] Preferences sync yapılıyor (adb shell kontrol)
- [ ] Release AAB build başarılı

---

## Known Issues / TODO (v1.2+)

- [ ] Widget real-time refresh (periyodik broadcast)
- [ ] Achievement system (rozetler + DynEd skill unlock)
- [ ] Difficulty-based unlock (skill X %80 olmadan Y açılmıyor)
- [ ] iOS Capacitor widget equivalenti
- [ ] Backend social sync (liderlik, friend progress)

---

## Installation / Upgrade

```bash
# Web
npm install
npm run build
npx cap sync android

# Android Release AAB
./scripts/build-play-bundle.ps1
# → output/lifequest-release.aab

# Test Device
adb install -r android/app/build/outputs/apk/debug/app-debug.apk
```

---

## Kontribütörler & Notlar

- **DynEd Core**: XP curve, spaced repetition, focus selector
- **Widget UX**: progress bar, urgency animations
- **Native Bridge**: SkillBridge + SharedPreferences sync
- **Docs**: ANDROID_BUILD_TEST.md, PLAY_CONSOLE_TR.md güncellemesi

---

## Links

- PLAY_CONSOLE_TR.md: Capacitor AAB upload guide
- ANDROID_BUILD_TEST.md: build & test adımları
- README_SKILL_WIDGET.md: native widget entegrasyon detayı
