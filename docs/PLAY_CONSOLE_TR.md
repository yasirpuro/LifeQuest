# LifeQuest — Play Console (Capacitor) Rehberi

Bu proje bir React PWA olup Android tarafında **Capacitor** kullanır. Web içeriği `dist/` içinde build edilip Android APK/AAB içine gömülür.

## Mimari

```
Play Store (AAB) → Capacitor android/ → Web içerik gömülü (dist/)
```

## 1. Web build & Capacitor sync

1. Web üretim build'i oluşturun:

```bash
npm run build
```

2. Capacitor ile Android platformunu senkronize edin:

```bash
npx cap sync android
```

`dist/` içeriği Android proje `app/src/main/assets/public` içine kopyalanır (Capacitor).

## 2. Keystore

Android için release imzası gereklidir. Örnek dosya `android/keystore.properties.example`'dır.

Keystore oluşturma (PowerShell):

```powershell
.\scripts\create-keystore.ps1
```

`android/keystore.properties` dosyasını şu formatta oluşturun:

```
storeFile=../release.keystore
storePassword=YOUR_STORE_PASSWORD
keyAlias=lifequest
keyPassword=YOUR_KEY_PASSWORD
```

## 3. AAB oluştur

Projeyi release olarak paketlemek için örnek script:

```powershell
.\scripts\build-play-bundle.ps1
```

Çıktı: `output/lifequest-release.aab` (script yapılandırmasına bağlıdır).

Alternatif: Android Studio → `android/` aç → Build → Generate Signed Bundle / APK.

Önemli: `debug` build Play Console'a yüklenmemelidir. Paket adı release için `com.lifequest.app` olmalıdır.

## 4. Play Console

1. [play.google.com/console](https://play.google.com/console) — geliştirici hesabı
2. Yeni uygulama → Paket: `com.lifequest.app`
3. **Store listing (TR):** ad, kısa/uzun açıklama, ekran görüntüleri, 512 ikon, 1024×500 feature graphic
4. **Gizlilik politikası URL** (ör. `https://lifequest.app/privacy.html`)
5. **Data safety:** uygulamada hangi veriler toplanıyor
6. İçerik derecelendirme anketi
7. Internal testing → `output/lifequest-release.aab` yükle → test et → Production

## 5. assetlinks.json

`assetlinks.json` yalnızca TWA / Digital Asset Links senaryolarında gereklidir. Capacitor uygulaması için zorunlu değildir.

## 6. Güncelleme

- Web içeriğinde değişiklik: yeni `npm run build` → `npx cap sync android` → yeni AAB oluşturup yükleyin.
- Native kod değişikliği: `versionCode++` ve yeni AAB.

## Checklist

- [ ] `android/keystore.properties` oluşturuldu
- [ ] release keystore yedeği güvenli yerde
- [ ] `manifest` ve ikonlar store gereksinimlerine uygun
- [ ] Gizlilik politikası canlı HTTPS URL

**Package:** `com.lifequest.app` · **Web URL (for privacy):** `https://lifequest.app/privacy.html`
