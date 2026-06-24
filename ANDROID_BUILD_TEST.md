# LifeQuest Android Build & Test Rehberi

## Gereksinimler

- Android SDK 34+ installed
- Gradle 8+
- Keystore dosyası (`android/keystore.properties` veya `android/release.keystore`)
- Windows PowerShell (build script'ler .ps1)

## Build Adımları

### 1. Web Build & Capacitor Sync

```bash
npm run build
npx cap sync android
```

Bu adımlar `dist/` içeriğini Android assets klasörüne kopyalar.

### 2. Keystore Hazırla

Eğer daha önce oluşturmadıysanız:

```powershell
.\scripts\create-keystore.ps1
```

`android/keystore.properties` oluşturun (keystore.properties.example başlangıç):

```properties
storeFile=../release.keystore
storePassword=YOUR_PASSWORD
keyAlias=lifequest
keyPassword=YOUR_PASSWORD
```

### 3. Release AAB Oluştur

#### Seçenek A: PowerShell Script

```powershell
.\scripts\build-play-bundle.ps1
```

Çıktı: `output/lifequest-release.aab`

#### Seçenek B: Gradle (manuel)

```bash
cd android
./gradlew bundleRelease
```

Çıktı: `android/app/build/outputs/bundle/release/app-release.aab`

### 4. Android Emulator / Cihazda Test

#### Test APK Oluştur (debug)

```bash
cd android
./gradlew assembleDebug
```

Çıktı: `android/app/build/outputs/apk/debug/app-debug.apk`

#### Emülatöre Kur

```bash
adb install -r android/app/build/outputs/apk/debug/app-debug.apk
```

#### Cihaza Kur (USB Debug)

```bash
adb install -r android/app/build/outputs/apk/debug/app-debug.apk
```

## Skill Widget Test

### 1. Dashboard Açılışında

- App açıldığında Dashboard'da `FocusWidget` görünmelidir.
- Focus skill, mastery % ve progress bar gösterilir.

### 2. Native Widget Ekleme (Home Screen)

1. Home ekranında widget ekle > LifeQuest Skill Widget
2. Widget görev tamamlama sonrası eski kalabilir (manuel refresh gerekebilir)
3. `SkillBridge.getFocusSkill()` native tarafında `lifequest_skills_v1` JSON'unu okur

### 3. Veri Senkronizasyonu

- **JS → Native:** `useSkillEngine` progressMap değişince Preferences + Filesystem'a kaydolur
- **Native okuma:** SkillBridge: `SharedPreferences` → `default SharedPreferences` → `filesDir/lifequest_skills_v1.json`

## Hata Giderme

### Build Hatası: "LQ_KEYSTORE not found"

- `android/keystore.properties` var mı kontrol et
- Dosyada doğru path ve şifre var mı kontrol et

### Build Hatası: "namespace 'app.lifequest.twa' vs actual 'com.lifequest.app'"

- `android/app/build.gradle` içinde `namespace`/`applicationId` kontrol et
- Capacitor plugin expected: `com.lifequest.app` (DEBUG: `com.lifequest.app.debug`)

### Notification Çalışmıyor

- `@capacitor/local-notifications` npm paketi kurulu mu kontrol et
- App cihazda notification izni aldı mı kontrol et (Settings)

### Widget Veri Görmüyor

- Browser DevTools'da `localStorage.lifequest_skills_v1` var mı kontrol et
- Cihazda `Settings` → `Apps` → `LifeQuest` → `Data` kısmında SharedPreferences var mı
- `adb shell` ile kontrol:

```bash
adb shell "am broadcast -a com.android.systemui.demo -e command clock -e hhmm 1130"
```

(widget manual refresh için)

## Play Console'a Upload

1. `output/lifequest-release.aab` veya `app-release.aab` indir
2. play.google.com/console → app → Internal testing
3. AAB upload et → "Ready to send" bekle
4. Test → OK → Production release

## Notlar

- Debug build: `com.lifequest.app.debug` — Play Console'da ayrı app
- Release: `com.lifequest.app` — Production app
- Skill Engine localStorage sync: onChange otomatik native'e yazılır

