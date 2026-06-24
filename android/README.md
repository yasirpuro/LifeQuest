# LifeQuest Android (TWA)

**Package:** `app.lifequest.twa`  
**Web URL:** `https://lifequest.app/index.html` (gradle.properties içinde `LQ_HOST` ile değiştirilir)

## Android Studio ile AAB

1. Android Studio → **Open** → bu `android/` klasörü
2. SDK 34 yüklü olsun
3. `gradle.properties.example` → `gradle.properties` kopyala, şifreleri gir
4. Proje kökünde `release.keystore` (`scripts/create-keystore.ps1`)
5. **Build → Generate Signed Bundle / APK → Android App Bundle (Release)**

Çıktı: `app/build/outputs/bundle/release/app-release.aab`

## Komut satırı

Önce Gradle wrapper oluştur (bir kez, Android Studio açınca otomatik gelir):

```bash
gradle wrapper
```

Sonra:

```powershell
..\scripts\build-play-bundle.ps1
```

Tam rehber: [`docs/PLAY_CONSOLE_TR.md`](../docs/PLAY_CONSOLE_TR.md)
