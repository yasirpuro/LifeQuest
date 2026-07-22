# 🎮 LifeQuest

[![Vite](https://shields.io)](https://vitejs.dev)
[![Supabase](https://shields.io)](https://supabase.com)
[![Firebase](https://shields.io)](https://google.com)
[![PWA](https://shields.io)](https://web.dev)
[![License: MIT](https://shields.io)](https://opensource.org)

**LifeQuest**, günlük rutinleri, alışkanlıkları ve görevleri epik RPG mekanikleriyle (XP, seviye atlama, ödüller) birleştiren oyunlaştırılmış bir üretkenlik ve PWA (Progressive Web App) uygulamasıdır.

---

## 🛠️ Teknoloji Yığını & Mimari

- **Frontend:** React + TypeScript + Vite (Hızlı render ve optimize edilmiş derleme süreçleri)
- **Veritabanı & Realtime:** Supabase (PostgreSQL, anlık veri senkronizasyonu ve Row Level Security)
- **Kimlik Doğrulama & Bildirimler:** Firebase Auth & Firebase Cloud Messaging (FCM)
- **Çevrimdışı Destek:** Service Workers tabanlı gelişmiş PWA önbellekleme (Caching) stratejileri

---

## 📂 Proje Yapısı (Project Structure)

```text
├── docs/                     # Mağaza ve hukuki dokümantasyonlar (Privacy Policy, vb.)
├── public/                   # Statik varlıklar ve PWA Manifest (`manifest.json`)
├── src/
│   ├── components/           # Yeniden kullanılabilir UI bileşenleri
│   ├── config/               # `runtimeConfig.ts` gibi ortam ve çalışma zamanı ayarları
│   ├── hooks/                # Özel React kancaları (Custom Hooks)
│   ├── services/             # Supabase ve Firebase entegrasyon servisleri
│   └── App.tsx               # Ana uygulama bileşeni
├── .env.example              # Örnek çevre değişkenleri şablonu
└── manifest.production.json  # Canlı ortam sürüm metadata dosyası
```

---

## 🚀 Kurulum ve Başlatma (Getting Started)

### 1. Yerel Geliştirme Ortamı (Local Development)

Projeyi yerel bilgisayarınızda çalıştırmak için aşağıdaki adımları izleyin:

```bash
# Projeyi klonlayın
git clone https://github.com
cd lifequest

# Bağımlılıkları yükleyin
npm install

# Çevre değişkenlerini yapılandırın
cp .env.example .env.local

# Yerel geliştirme sunucusunu başlatın
npm run dev
```

### 2. Canlı Ortam Dağıtımı (Production Setup & Deployment)

Üretim ortamı özellikleri aktif edilmiş optimize edilmiş çıktıyı (build) almak için:

```bash
# Üretim build sürecini tetikleyin
npm run build

# Yerel olarak production build'ı test edin
npm run preview
```

---

## ⚙️ Çevre Değişkenleri (Environment Variables)

Uygulamanın çalışabilmesi için `.env.local` dosyasında tanımlanması zorunlu olan değişkenler:

| Değişken | Tip | Açıklama |
| :--- | :--- | :--- |
| `VITE_APP_ENV` | `string` | Çalışma ortamı (`development` / `production`) |
| `VITE_APP_NAME` | `string` | Uygulama başlığı (Örn: LifeQuest) |
| `VITE_APP_URL` | `string` | Uygulamanın yayındaki ana URL adresi |
| `VITE_SUPABASE_URL` | `string` | Supabase API Endpoint adresi |
| `VITE_SUPABASE_ANON_KEY` | `string` | Supabase anonim istemci erişim anahtarı |
| `VITE_FIREBASE_API_KEY` | `string` | Firebase Web API Anahtarı |
| `VITE_FIREBASE_AUTH_DOMAIN` | `string` | Firebase Authentication domain adresi |
| `VITE_FIREBASE_PROJECT_ID` | `string` | Firebase benzersiz proje kimliği |
| `VITE_FIREBASE_STORAGE_BUCKET`| `string` | Firebase Cloud Storage saklama alanı adı |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | `string` | Cloud Messaging push bildirim gönderici ID'si |
| `VITE_FIREBASE_APP_ID` | `string` | Firebase Uygulama (App) ID değeri |

---

## 📦 Sürüm ve Dağıtım Yönetimi (Release Management)

- **Yapılandırma Yönetimi:** Canlı ortam varsayılanları `src/config/runtimeConfig.ts` dosyasında tutulur.
- **Sürüm Metadata:** Mağaza sürümleri ve güncellemeler `manifest.production.json` üzerinden takip edilir.
- **PWA Kurulumu:** Manifest ayarları `public/manifest.json` içindedir.

### 📄 Regülasyon ve Mağaza Linkleri
* ⚖️ [Gizlilik Politikası (Privacy Policy)](docs/privacy-policy.html)
* 📜 [Kullanım Şartları (Terms of Service)](docs/terms-of-service.html)
* 🚀 [Google Play Console Kontrol Listesi](docs/PLAY_CONSOLE_CHECKLIST.md)
* 📝 [Google Play Store Sürüm Notları](docs/PLAY_STORE_RELEASE_NOTES.md)

---

## 🤝 Katkıda Bulunma (Contributing)

1. Bu depoyu çatallayın (Fork).
2. Yeni bir özellik dalı (Feature Branch) açın: `git checkout -b feature/yeni-ozellik`.
3. Değişikliklerinizi kaydedin: `git commit -m 'Ekle: Yeni özellik detayı'`.
4. Dalınızı gönderin: `git push origin feature/yeni-ozellik`.
5. Bir **Pull Request (PR)** oluşturun.

---

## 📄 Lisans

Bu proje **MIT Lisansı** altında lisanslanmıştır. Detaylar için `LICENSE` dosyasına göz atabilirsiniz.

---

**Muhammed Yasir İğde** - Founder & Product Engineer
