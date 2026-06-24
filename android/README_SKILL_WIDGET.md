Android native widget bridge — Skill focus plan

Amaç
----
JS tarafındaki `lifequest_skills_v1` (localStorage) verisini native Android widget'a güvenilir şekilde iletmek ve widget'ın "focus skill" ve mastery göstermesini sağlamak.

Önerilen yaklaşım
-----------------
1. JS -> Native veri köprüsü: iki basit yöntem gösteriyoruz (hem Capacitor plugin hem de dosya yedeklemesi).

A) Capacitor Preferences (kolay)
- JS tarafında `@capacitor/preferences` kullanarak aynı anahtar ile kaydedin. Örnek:

```ts
import { Preferences } from '@capacitor/preferences';

await Preferences.set({ key: 'lifequest_skills_v1', value: JSON.stringify(progressMap) });
```

Not: Capacitor Preferences Android'de default shared preferences kullanır; SkillBridge önce bu yerde arama yapar.

B) Dosya yedeklemesi (garanti)
- JS tarafında aynı JSON'u uygulama dizinine de yedekleyin (native her zaman okuyabilir):

```ts
import { Filesystem, Directory } from '@capacitor/filesystem';
await Filesystem.writeFile({ path: 'lifequest_skills_v1.json', data: JSON.stringify(progressMap), directory: Directory.Data });
```

SkillBridge native tarafı önce `lifequest_prefs` adlı SharedPreferences anahtarını arar, sonra default SharedPreferences, sonra `filesDir/lifequest_skills_v1.json` dosyasını okur.

Native örnekler
---------------
- `android/app/src/main/java/app/lifequest/twa/SkillBridge.kt`
  - `getFocusSkill(context)` — SharedPreferences/JSON oku, overdue/lowest mastery seç

- `android/app/src/main/java/app/lifequest/twa/SkillWidgetProvider.kt`
  - Basit `AppWidgetProvider` örneği; widget layout `res/layout/widget_skill.xml` kullanır.
  - Manifest'e receiver kaydı eklendi (`@xml/skill_widget_info`).

Test ve entegrasyon
--------------------
1. JS tarafında `useSkillEngine` içindeki `progressMap`'i değişiklik sonrası hem `Preferences.set` ile, hem de `Filesystem.writeFile` ile kaydedin.
2. Cihazda widget ekleyin (Home ekran) — widget veriyi okuyup güncelleyecektir.
3. Widget güncellemeleri: `SkillWidgetProvider.updateAll(context)` fonksiyonu çağrılarak tetiklenebilir (ör. app açılışında veya BroadcastReceiver ile).

Güvenlik
--------
- Sensitive verileri (API anahtarları vb.) SharedPreferences'ta düz metin saklamayın. Bu JSON sadece skill progress ve mastery içermelidir.

Notlar
-----
- Projeye uygun olarak `applicationId`/namespace kontrol edin; SkillBridge package `app.lifequest.twa` klasörüne eklendi.
- Eğer uygulama package adı farklıysa Kotlin dosyalarının package bildirimini güncelleyin.
