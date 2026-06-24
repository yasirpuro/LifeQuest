import type { Quest, LocationOption, Badge, Friend, WeeklyStats, LocationType } from '../types';

export const LOCATIONS: LocationOption[] = [
  { id: 'din', emoji: '🕌', label: 'Manevi Disiplin & İbadet', sublabel: 'Manevi bağını güçlendir', color: '#6C63FF' },
  { id: 'spor', emoji: '🏃‍♂️', label: 'Fiziksel Zindelik & Atletizm', sublabel: 'Güçlen ve sınırlarını zorla', color: '#ff4757' },
  { id: 'egitim', emoji: '🎓', label: 'Akademik Başarı & Odaklanma', sublabel: 'Zihnini keskinleştir', color: '#2ed573' },
  { id: 'dil', emoji: '🌐', label: 'Yabancı Dil & Küresel İletişim', sublabel: 'Yeni diller fethet', color: '#1e90ff' },
  { id: 'kisisel-gelisim', emoji: '📚', label: 'Zihinsel Gelişim & Alışkanlık', sublabel: 'Karakterini inşa et', color: '#ffa502' },
  { id: 'lookmaxing', emoji: '✨', label: 'Kişisel Bakım, Duruş & Estetik', sublabel: 'En iyi görünümüne ulaş', color: '#ff6b81' },
  { id: 'futbol', emoji: '⚽', label: 'Futbol Taktiği & Kondisyonu', sublabel: 'Sahanın yıldızı ol', color: '#374151' },
  { id: 'basketbol', emoji: '🏀', label: 'Basketbol Kondisyonu & Şut', sublabel: 'Potaları fethet', color: '#ff7f50' },
];

// ─── Başlangıç / Varsayılan Görevler ──────────────────────────────────────────
export const QUESTS: Quest[] = [

  // ── DİN / MANEVİ DİSİPLİN ────────────────────────────────────────────────
  {
    id: 'din-1',
    title: '5 Vakit Namaz — Tam Huşu',
    description: 'Beş vakit namazı vaktinde ve huşuyla kıl. Her rekatta ne okuduğunu düşünerek namaz kıl.',
    location: 'din', difficulty: 4, duration: 40, dopamine: 50, calories: 0,
    scienceTag: 'Ruhsal dinginlik & Odaklanma', completed: false, locked: false,
  },
  {
    id: 'din-2',
    title: 'Sabah Namazı Zaferi',
    description: 'Sabah namazını vaktinde (fecir başlamadan) kalkarak cemaatle veya evde kıl. Uyku jihadını kazan!',
    location: 'din', difficulty: 5, duration: 30, dopamine: 60, calories: 0,
    scienceTag: 'İrade disiplini & Kortizol döngüsü', completed: false, locked: false,
  },
  {
    id: 'din-3',
    title: 'Kuran Tefekkürü — 10 Sayfa',
    description: 'Mealiyle birlikte yavaşça 10 sayfa oku. Her ayetin mesajı üzerinde en az 1 dakika düşün.',
    location: 'din', difficulty: 3, duration: 25, dopamine: 35, calories: 0,
    scienceTag: 'Bilişsel derinleşme & Meditasyon', completed: false, locked: false,
  },
  {
    id: 'din-4',
    title: 'Sabah-Akşam Zikirleri',
    description: 'Sabah ve akşam dualarını (Hisn-ül Müslim\'den) eksiksiz oku. Kalp huzurunun garantisi!',
    location: 'din', difficulty: 2, duration: 15, dopamine: 30, calories: 0,
    scienceTag: 'Parasempatik aktivasyon & Stres azaltma', completed: false, locked: false,
  },
  {
    id: 'din-5',
    title: 'Tesbih & Zikir Seansı',
    description: '100x Subhanallah, 100x Elhamdülillah, 100x Allahu Ekber, 100x Estağfirullah çek.',
    location: 'din', difficulty: 2, duration: 10, dopamine: 25, calories: 0,
    scienceTag: 'Parasempatik sinir sistemi aktivasyonu', completed: false, locked: false,
  },
  {
    id: 'din-6',
    title: 'Sadaka & İyilik Hareketi',
    description: 'Bugün bir muhtaca maddi veya manevi yardım et. Gülümseme de sadakadır.',
    location: 'din', difficulty: 3, duration: 10, dopamine: 40, calories: 0,
    scienceTag: 'Empati hormonu oksitosinin artışı', completed: false, locked: false,
  },
  {
    id: 'din-7',
    title: 'Sıfır Gıybet & Sıfır Yalan Günü',
    description: 'Bugün gıybet, kötü söz ve yalandan tamamen uzak dur. Dilini korumak ibadet sayılır.',
    location: 'din', difficulty: 5, duration: 60, dopamine: 55, calories: 0,
    scienceTag: 'İrade disiplini & Sosyal güven inşası', completed: false, locked: false,
  },
  {
    id: 'din-8',
    title: 'Dua & Münacat Seansı',
    description: 'İsteklerini ve şükürlerini Allah\'a içtenlikle ilet. En az 10 dakika huşuyla dua et.',
    location: 'din', difficulty: 2, duration: 10, dopamine: 30, calories: 0,
    scienceTag: 'Nörospiritual iyileşme & İç huzur', completed: false, locked: false,
  },
  {
    id: 'din-9',
    title: 'İslami Bilgi Okuma — 15 Dakika',
    description: 'Siyer, fıkıh veya tefsir kitabından 15 dakika okuyarak dini bilgini güçlendir.',
    location: 'din', difficulty: 2, duration: 15, dopamine: 25, calories: 0,
    scienceTag: 'Bilgi birikiği & Dini okuryazarlık', completed: false, locked: false,
  },
  {
    id: 'din-10',
    title: 'Cuma Namazı & Hutbe Notları',
    description: 'Cuma namazına erken git ve hutbeden 3 önemli noktayı not al.',
    location: 'din', difficulty: 3, duration: 60, dopamine: 45, calories: 0,
    scienceTag: 'Topluluk bilinci & Manevi şarj', completed: false, locked: true,
  },

  // ── SPOR / FİZİKSEL ZİNDELİK ─────────────────────────────────────────────
  {
    id: 'spor-1',
    title: 'Sabah Egzersizi — 100 Şınav + 100 Mekik',
    description: 'Setleri böl, gün içine yay. Sabah uyandığında ilk 30 dakikada bitir. Formuna dikkat!',
    location: 'spor', difficulty: 4, duration: 30, dopamine: 55, calories: 150,
    scienceTag: 'Kas hipertrofisi & Testosteron artışı', completed: false, locked: false,
  },
  {
    id: 'spor-2',
    title: '5 km Koşu — Tempo Korumalı',
    description: 'Dinlenme molası vermeden 5 km koş. Kilomotreyi takip et, kişisel rekoru kır!',
    location: 'spor', difficulty: 4, duration: 35, dopamine: 60, calories: 350,
    scienceTag: 'Kardiyovasküler kapasite & Endorfin', completed: false, locked: false,
  },
  {
    id: 'spor-3',
    title: 'Günlük Hidrasyon Protokolü — 3 Litre',
    description: 'Vücut ağırlığının 0.04 katı kadar su iç. Performans ve toparlanma için şart.',
    location: 'spor', difficulty: 2, duration: 5, dopamine: 20, calories: 0,
    scienceTag: 'Elektrolit dengesi & Hücresel performans', completed: false, locked: false,
  },
  {
    id: 'spor-4',
    title: 'Squat & Deadlift Günü',
    description: '4 set x 12 tekrar squat + 3 set x 10 tekrar deadlift. Bacak ve sırt gücünü inşa et.',
    location: 'spor', difficulty: 4, duration: 40, dopamine: 55, calories: 180,
    scienceTag: 'Çoklu eklem gücü & Hormon optimizasyonu', completed: false, locked: false,
  },
  {
    id: 'spor-5',
    title: 'Şeker & İşlenmiş Gıda Detoksu',
    description: 'Bugün hiç işlenmiş şeker, fast food veya asitli içecek tüketme. Vücudunu sıfırla.',
    location: 'spor', difficulty: 4, duration: 5, dopamine: 40, calories: 0,
    scienceTag: 'İnsülin duyarlılığı & Karaciğer dinlenmesi', completed: false, locked: false,
  },
  {
    id: 'spor-6',
    title: 'Mobilite & Esneme Rutini',
    description: 'Her büyük kas grubu için 30 saniyelik esneme. Sakatlık önleme ve toparlanma için zorunlu.',
    location: 'spor', difficulty: 2, duration: 15, dopamine: 25, calories: 40,
    scienceTag: 'Eklem mobilizasyonu & Ligaman sağlığı', completed: false, locked: false,
  },
  {
    id: 'spor-7',
    title: 'HIIT Antrenmanı — 20 Dakika',
    description: '20 sn maksimum eforu, 10 sn dinlenme. 8 farklı hareket. Yağ yakımını maximize et.',
    location: 'spor', difficulty: 5, duration: 20, dopamine: 65, calories: 280,
    scienceTag: 'Anaerobik metabolizma & EPOC etkisi', completed: false, locked: false,
  },
  {
    id: 'spor-8',
    title: 'Protein Hedefi — Günlük Takip',
    description: 'Vücut ağırlığının 2 katı kadar gram protein tüket. Kas sentezi için kritik.',
    location: 'spor', difficulty: 3, duration: 10, dopamine: 30, calories: 0,
    scienceTag: 'Protein sentezi & Miyofibril büyümesi', completed: false, locked: false,
  },
  {
    id: 'spor-9',
    title: 'Kalisteniki Akış — Pull-Up Serisi',
    description: '5 set pull-up, setler arasında 90 sn dinlen. Sırt ve biceps inşası.',
    location: 'spor', difficulty: 4, duration: 25, dopamine: 50, calories: 90,
    scienceTag: 'Relatif güç & Vücut kontrolü', completed: false, locked: false,
  },
  {
    id: 'spor-10',
    title: 'Soğuk Duş Seansı',
    description: 'Antrenman sonrası 2 dakika soğuk duş al. Toparlanma ve mental sertleşme için.',
    location: 'spor', difficulty: 3, duration: 5, dopamine: 35, calories: 0,
    scienceTag: 'Norepinefrin artışı & Kas iyileşmesi', completed: false, locked: true,
  },

  // ── EĞİTİM / AKADEMİK BAŞARI ─────────────────────────────────────────────
  {
    id: 'egitim-1',
    title: 'Derin Odaklanma — 2 Pomodoro Seansı',
    description: '25 dk çalış, 5 dk dinlen x 2. Telefonu uçak moduna al. Gerçek verimlilik burada başlar.',
    location: 'egitim', difficulty: 3, duration: 60, dopamine: 45, calories: 0,
    scienceTag: 'Deep Work kası & Prefrontal korteks', completed: false, locked: false,
  },
  {
    id: 'egitim-2',
    title: 'Akademik Makale Analizi',
    description: 'İlgi duyduğun alanda 1 araştırma makalesi oku ve abstract + bulgularını özetle.',
    location: 'egitim', difficulty: 3, duration: 20, dopamine: 35, calories: 0,
    scienceTag: 'Analitik düşünme & Eleştirel okuma', completed: false, locked: false,
  },
  {
    id: 'egitim-3',
    title: 'Feynman Tekniği ile Tekrar',
    description: 'Zorlandığın bir konuyu sanki 10 yaşındaki birine anlatır gibi basitleştirerek sesli anlat.',
    location: 'egitim', difficulty: 4, duration: 15, dopamine: 40, calories: 0,
    scienceTag: 'Kavramsal netlik & Uzun vadeli hafıza', completed: false, locked: false,
  },
  {
    id: 'egitim-4',
    title: 'Hata Analizi — 5 Yanlış Çöz',
    description: 'Daha önce yanlış yaptığın 5 soruyu veya konuyu baştan incele ve neden hata yaptığını yaz.',
    location: 'egitim', difficulty: 3, duration: 15, dopamine: 30, calories: 0,
    scienceTag: 'Hata analizi & Kalıcı öğrenme', completed: false, locked: false,
  },
  {
    id: 'egitim-5',
    title: 'Dijital Çalışma Minimalizmi',
    description: 'Çalışırken yalnızca ders sekmeleri açık olsun. Her dikkat dağıtıcıyı kapat.',
    location: 'egitim', difficulty: 2, duration: 5, dopamine: 20, calories: 0,
    scienceTag: 'Bilişsel yük azaltma & Yüksek verimlilik', completed: false, locked: false,
  },
  {
    id: 'egitim-6',
    title: 'Problem Seti — 10 Soru Çöz',
    description: 'Aktif öğrenme için en az 10 alıştırma sorusu çöz. Pasif okuma değil, aktif pratik!',
    location: 'egitim', difficulty: 3, duration: 30, dopamine: 35, calories: 0,
    scienceTag: 'Aktif geri çağırma & Uzaklık etkisi', completed: false, locked: false,
  },
  {
    id: 'egitim-7',
    title: 'Kavram Haritası Çizimi',
    description: 'Öğrendiğin bir konunun zihin haritasını elle çiz. Görselleştirme hafızayı pekiştirir.',
    location: 'egitim', difficulty: 2, duration: 15, dopamine: 25, calories: 0,
    scienceTag: 'Vizüospatyal öğrenme & Şema oluşturma', completed: false, locked: false,
  },
  {
    id: 'egitim-8',
    title: 'Akşam Tekrar Seansı — Flashcard',
    description: 'Gün içinde öğrendiklerini Anki veya elle yapılmış kartlarla gözden geçir.',
    location: 'egitim', difficulty: 2, duration: 20, dopamine: 25, calories: 0,
    scienceTag: 'Aralıklı tekrar & Ebbinghaus eğrisi', completed: false, locked: false,
  },
  {
    id: 'egitim-9',
    title: 'TED/Bilimsel Video — Aktif İzleme',
    description: 'Eğitici bir video izle, not al ve en az 3 yeni şey öğrendiğini kaydet.',
    location: 'egitim', difficulty: 2, duration: 20, dopamine: 25, calories: 0,
    scienceTag: 'Multimodal öğrenme & Kodlama çeşitliliği', completed: false, locked: false,
  },
  {
    id: 'egitim-10',
    title: 'Hedef Belirleme Oturumu',
    description: 'Haftanın akademik hedeflerini yaz, önceliklendir ve bir plana dönüştür.',
    location: 'egitim', difficulty: 2, duration: 10, dopamine: 20, calories: 0,
    scienceTag: 'Meta-biliş & Hedef belirleme psikolojisi', completed: false, locked: true,
  },

  // ── DİL / YABANCI DİL ────────────────────────────────────────────────────
  {
    id: 'dil-1',
    title: 'Kelime Dağarcığı — 20 Yeni Kelime',
    description: 'Yeni kelimeleri anlamları, örnek cümleleri ve zıt anlamlısıyla birlikte defterine yaz.',
    location: 'dil', difficulty: 2, duration: 15, dopamine: 30, calories: 0,
    scienceTag: 'Temporal lob aktivasyonu & Kelime hafızası', completed: false, locked: false,
  },
  {
    id: 'dil-2',
    title: 'Dinleme Pratiği — Podcast 20 Dk',
    description: 'Hedef dilde bir podcast dinle. Anlamadığın kelimeleri not al ve sonra araştır.',
    location: 'dil', difficulty: 3, duration: 20, dopamine: 30, calories: 0,
    scienceTag: 'İşitsel korteks aşinalığı & Şema tanıma', completed: false, locked: false,
  },
  {
    id: 'dil-3',
    title: 'Günlük Yazma — 10 Cümle',
    description: 'Bugünü ve yarın planlarını hedef dilde en az 10 cümleyle yaz. Yazarak öğrenirsin.',
    location: 'dil', difficulty: 3, duration: 10, dopamine: 35, calories: 0,
    scienceTag: 'Cümle üretimi & Aktif dil üretimi', completed: false, locked: false,
  },
  {
    id: 'dil-4',
    title: 'Shadowing — Sesli Okuma Tekniği',
    description: 'Yabancı dilde bir metni 15 dakika boyunca tonlamalara dikkat ederek sesli oku.',
    location: 'dil', difficulty: 3, duration: 15, dopamine: 30, calories: 0,
    scienceTag: 'Telaffuz kası & Prozodi geliştirme', completed: false, locked: false,
  },
  {
    id: 'dil-5',
    title: 'Gramer Kuralı Derinlemesi',
    description: 'Zorlandığın 1 gramer yapısını çalış, o yapıyla 10 özgün cümle kur.',
    location: 'dil', difficulty: 3, duration: 15, dopamine: 25, calories: 0,
    scienceTag: 'Dilbilgisi entegrasyonu & Otomatikleşme', completed: false, locked: false,
  },
  {
    id: 'dil-6',
    title: 'Yabancı Dilde Film/Dizi — 1 Bölüm',
    description: 'Hedef dilde altyazısız veya hedef dil altyazılı bir bölüm izle. Gülmek için dil öğren!',
    location: 'dil', difficulty: 2, duration: 45, dopamine: 30, calories: 0,
    scienceTag: 'Kültürel daldırma & Örtük öğrenme', completed: false, locked: false,
  },
  {
    id: 'dil-7',
    title: 'Konuşma Pratiği — 10 Dakika',
    description: 'Kendi kendine veya bir uygulama üzerinden (HelloTalk, Tandem) 10 dk konuş.',
    location: 'dil', difficulty: 4, duration: 10, dopamine: 40, calories: 0,
    scienceTag: 'Konuşma akıcılığı & Kaygı yönetimi', completed: false, locked: false,
  },
  {
    id: 'dil-8',
    title: 'Çeviri Egzersizi',
    description: 'Türkçe bir paragrafı hedef dile çevir, sonra geri çevir ve farkları incele.',
    location: 'dil', difficulty: 3, duration: 15, dopamine: 30, calories: 0,
    scienceTag: 'Semantik işleme & Eşdeğer arama', completed: false, locked: false,
  },
  {
    id: 'dil-9',
    title: 'Duolingo / Anki — 15 Dk Pratik',
    description: 'Düzenli uygulama kullanımı alışkanlık oluşturur. Aralıklı tekrar motorunu çalıştır.',
    location: 'dil', difficulty: 1, duration: 15, dopamine: 20, calories: 0,
    scienceTag: 'Gamification & Alışkanlık döngüsü', completed: false, locked: false,
  },
  {
    id: 'dil-10',
    title: 'Okuma Maratonu — 1 Sayfa Kitap',
    description: 'Hedef dilde bir kitaptan en az 1 sayfa oku. Bağlam içinde kelime öğrenmek üstündür.',
    location: 'dil', difficulty: 3, duration: 20, dopamine: 30, calories: 0,
    scienceTag: 'Bağlamsal öğrenme & Kelime tanıma', completed: false, locked: true,
  },

  // ── KİŞİSEL GELİŞİM ──────────────────────────────────────────────────────
  {
    id: 'gelisim-1',
    title: 'Kitap Okuma — 20 Sayfa',
    description: 'Kurgu dışı (tarih, felsefe, psikoloji, biyografi) bir kitaptan aktif not alarak oku.',
    location: 'kisisel-gelisim', difficulty: 3, duration: 25, dopamine: 30, calories: 0,
    scienceTag: 'Nöroplastisite & Kültürel sermaye artışı', completed: false, locked: false,
  },
  {
    id: 'gelisim-2',
    title: 'Günün En Zor Görevi Önce (Eat The Frog)',
    description: 'Yapılacaklar listendeki en zor ve önemli işi günün ilk saatinde tamamla.',
    location: 'kisisel-gelisim', difficulty: 4, duration: 45, dopamine: 45, calories: 0,
    scienceTag: 'Erteleme önleyici irade & Öz yeterlilik', completed: false, locked: false,
  },
  {
    id: 'gelisim-3',
    title: 'Dijital Detoks — Günlük 2 Saat Limiti',
    description: 'Sosyal medyada harcadığın toplam süreyi 2 saatin altında tut. Bilinçli yaşa.',
    location: 'kisisel-gelisim', difficulty: 4, duration: 60, dopamine: 40, calories: 0,
    scienceTag: 'Dopamin reseptör hassasiyet restorasyonu', completed: false, locked: false,
  },
  {
    id: 'gelisim-4',
    title: 'Günün Zihinsel Hasadı — Günlük',
    description: 'Bugün öğrendiğin en değerli dersi ve hissettiklerini günlüğüne yaz.',
    location: 'kisisel-gelisim', difficulty: 2, duration: 10, dopamine: 25, calories: 0,
    scienceTag: 'Uzun vadeli bellek konsolidasyonu & Öz farkındalık', completed: false, locked: false,
  },
  {
    id: 'gelisim-5',
    title: 'Erken Kalkma & Sabah Rutini',
    description: 'Erken uyan, yatağını topla ve ilk 30 dk telefona bakmadan güne başla.',
    location: 'kisisel-gelisim', difficulty: 3, duration: 30, dopamine: 35, calories: 0,
    scienceTag: 'Kortizol eğrisi & Güne zinde başlama', completed: false, locked: false,
  },
  {
    id: 'gelisim-6',
    title: 'Podcast — Liderlik & Başarı',
    description: '30 dakikalık bir liderlik, girişimcilik veya felsefe podcastı dinle ve 3 fikri not al.',
    location: 'kisisel-gelisim', difficulty: 2, duration: 30, dopamine: 25, calories: 0,
    scienceTag: 'Fikir çeşitliliği & Zihinsel esneklik', completed: false, locked: false,
  },
  {
    id: 'gelisim-7',
    title: 'Nefes & Meditasyon — 10 Dakika',
    description: '4-7-8 nefes tekniği veya bilinçli nefes meditasyonu. Stres hormonlarını düşür.',
    location: 'kisisel-gelisim', difficulty: 2, duration: 10, dopamine: 30, calories: 0,
    scienceTag: 'Parasempatik tonus & Kortizol düşürme', completed: false, locked: false,
  },
  {
    id: 'gelisim-8',
    title: 'Haftalık Plan & Revizyon',
    description: 'Geçen haftanı değerlendir ve bu hafta için öncelikli 3 hedef belirle.',
    location: 'kisisel-gelisim', difficulty: 2, duration: 15, dopamine: 25, calories: 0,
    scienceTag: 'Meta-biliş & Stratejik planlama', completed: false, locked: false,
  },
  {
    id: 'gelisim-9',
    title: 'Yeni Beceri — 25 Dakika Pratik',
    description: 'Gitar, satranç, kodlama, çizim... Herhangi bir yeni beceriye 25 dk zaman ayır.',
    location: 'kisisel-gelisim', difficulty: 3, duration: 25, dopamine: 35, calories: 0,
    scienceTag: 'Motor öğrenme & Beceri edinimi', completed: false, locked: false,
  },
  {
    id: 'gelisim-10',
    title: 'Şükür Listesi — 5 Madde',
    description: 'Bugün sahip olduğun 5 şey için içtenlikle şükret ve yaz. Pozitif bakış açısı inşa et.',
    location: 'kisisel-gelisim', difficulty: 1, duration: 5, dopamine: 20, calories: 0,
    scienceTag: 'Pozitif nöroplastisite & Mutluluk hormonu', completed: false, locked: true,
  },

  // ── LOOKMAXING / KİŞİSEL BAKIM ───────────────────────────────────────────
  {
    id: 'look-1',
    title: 'Gelişmiş Cilt Bakım Rutini',
    description: 'Cildini temizle, tonikle, nemlendirici ve SPF50+ güneş kremi uygula. Sabah & akşam.',
    location: 'lookmaxing', difficulty: 2, duration: 10, dopamine: 20, calories: 0,
    scienceTag: 'Dermatolojik yenilenme & UV koruması', completed: false, locked: false,
  },
  {
    id: 'look-2',
    title: 'Postür Düzeltme Egzersizleri',
    description: 'Duvar desteği ile omuz, sırt ve boyun postürünü düzelten 15 dk egzersiz yap.',
    location: 'lookmaxing', difficulty: 2, duration: 15, dopamine: 25, calories: 20,
    scienceTag: 'Omurga hizalaması & Özgüven algısı', completed: false, locked: false,
  },
  {
    id: 'look-3',
    title: 'Mewing & Çene Hattı Çalışması',
    description: 'Dilini tamamen damağına yapıştırarak doğru nefes al ve 10 dk mewing pratiği yap.',
    location: 'lookmaxing', difficulty: 1, duration: 10, dopamine: 15, calories: 0,
    scienceTag: 'Maksiller gelişim & Çene hattı belirginleştirme', completed: false, locked: false,
  },
  {
    id: 'look-4',
    title: 'Saç & Sakal / Kaş Bakımı',
    description: 'Saçını besle, sakal çizgilerini düzelt, kaşlarını şekillendir. Estetik bakım şart!',
    location: 'lookmaxing', difficulty: 2, duration: 15, dopamine: 25, calories: 0,
    scienceTag: 'Folikül bakımı & Estetik simetri', completed: false, locked: false,
  },
  {
    id: 'look-5',
    title: 'Kıyafet & Stil Koordinasyonu',
    description: 'Giyeceklerinin renk uyumuna ve vücut tipine uygunluğuna dikkat et. Ayakkabını temizle.',
    location: 'lookmaxing', difficulty: 2, duration: 10, dopamine: 20, calories: 0,
    scienceTag: 'Halo etkisi & Sosyal algı yönetimi', completed: false, locked: false,
  },
  {
    id: 'look-6',
    title: 'Yüz Egzersizleri — 10 Dakika',
    description: 'Jawline, cheekbone ve boyun kaslarını çalıştıran yüz egzersizleri uygula.',
    location: 'lookmaxing', difficulty: 1, duration: 10, dopamine: 15, calories: 0,
    scienceTag: 'Fasyal kas tonusu & Genç görünüm', completed: false, locked: false,
  },
  {
    id: 'look-7',
    title: 'Uyku Kalitesi Optimizasyonu',
    description: 'Gece 23:00\'dan önce uyu, oda ışığını kapat. Güzel görünmenin #1 sırrı uyku.',
    location: 'lookmaxing', difficulty: 3, duration: 5, dopamine: 30, calories: 0,
    scienceTag: 'Büyüme hormonu salınımı & Cilt yenilenmesi', completed: false, locked: false,
  },
  {
    id: 'look-8',
    title: 'Hidrasyon Cilt Protokolü',
    description: 'Bugün en az 2.5 litre su iç. Cilt nemlenmesi en ucuz anti-aging yöntemidir.',
    location: 'lookmaxing', difficulty: 2, duration: 5, dopamine: 20, calories: 0,
    scienceTag: 'Dermal hidrasyon & Elastin korunması', completed: false, locked: false,
  },
  {
    id: 'look-9',
    title: 'Vücut Dilini Analiz Et',
    description: 'Yüksek statüs vücut dili çalışmalarını araştır ve bunları bugün uygula.',
    location: 'lookmaxing', difficulty: 2, duration: 15, dopamine: 20, calories: 0,
    scienceTag: 'Nonverbal iletişim & Dominans sinyalleri', completed: false, locked: false,
  },
  {
    id: 'look-10',
    title: 'Parfüm & Koku Protokolü',
    description: 'Kaliteli bir parfümü doğru noktalara (nabız noktaları) uygula. Koku hafızada kalır.',
    location: 'lookmaxing', difficulty: 1, duration: 5, dopamine: 20, calories: 0,
    scienceTag: 'Olfaktör çekim & Güven artışı', completed: false, locked: true,
  },

  // ── FUTBOL ────────────────────────────────────────────────────────────────
  {
    id: 'futbol-1',
    title: 'Top Kontrolü & Juggling — 100 Tekrar',
    description: 'Sağ ve sol ayağını eşit kullanarak topu havada tut. Her gün artır!',
    location: 'futbol', difficulty: 3, duration: 15, dopamine: 35, calories: 90,
    scienceTag: 'Motor koordinasyon & Top hissi', completed: false, locked: false,
  },
  {
    id: 'futbol-2',
    title: 'İnterval Sprint Antrenmanı — 15 Dk',
    description: '30 sn maksimum depar, 30 sn yürüyüş. 15 dakika boyunca tekrarla.',
    location: 'futbol', difficulty: 4, duration: 15, dopamine: 45, calories: 180,
    scienceTag: 'Anaerobik eşik & Patlayıcı güç', completed: false, locked: false,
  },
  {
    id: 'futbol-3',
    title: 'Duvar Pası Çalışması — 200 Pas',
    description: 'İki ayakla dengeli, duvar karşısında serbest pas atışı. Çabuk dokunuşa odaklan.',
    location: 'futbol', difficulty: 3, duration: 15, dopamine: 30, calories: 80,
    scienceTag: 'Pas isabeti & Reaksiyon süresi', completed: false, locked: false,
  },
  {
    id: 'futbol-4',
    title: 'Taktik Analizi — Maç İzleme',
    description: 'Bir profesyonel maç izle ve en az 3 taktiksel hareketi not alarak analiz et.',
    location: 'futbol', difficulty: 2, duration: 90, dopamine: 25, calories: 0,
    scienceTag: 'Oyun zekası (IQ) & Konumlanma bilinci', completed: false, locked: false,
  },
  {
    id: 'futbol-5',
    title: 'Ayak Bileği Güçlendirme',
    description: 'Direnç bandıyla her iki ayak bileğine 3 set x 15 tekrar güçlendirme egzersizi.',
    location: 'futbol', difficulty: 2, duration: 10, dopamine: 20, calories: 30,
    scienceTag: 'Propriyosepsiyon & Ligaman sağlığı', completed: false, locked: false,
  },
  {
    id: 'futbol-6',
    title: 'Frikik & Şut Pratiği',
    description: 'Kaleye veya bir hedefe 50 şut at. Farklı açı ve mesafelerden dene.',
    location: 'futbol', difficulty: 3, duration: 20, dopamine: 40, calories: 100,
    scienceTag: 'Şut mekaniği & Kas hafızası', completed: false, locked: false,
  },
  {
    id: 'futbol-7',
    title: '1v1 Dribling Drilleri',
    description: 'Koni çevresinde 10 farklı dripling hareketi (makas, röveşata, step-over) pratiği.',
    location: 'futbol', difficulty: 3, duration: 20, dopamine: 35, calories: 110,
    scienceTag: 'Çeviklik & Top taşıma yetkinliği', completed: false, locked: false,
  },
  {
    id: 'futbol-8',
    title: 'Hız ve Çeviklik Merdiveni',
    description: 'Çeviklik merdiveniyle 8 farklı egzersiz, 3 set. Hız ve koordinasyon gelişir.',
    location: 'futbol', difficulty: 3, duration: 15, dopamine: 35, calories: 120,
    scienceTag: 'Nöromüsküler koordinasyon & Hız', completed: false, locked: false,
  },
  {
    id: 'futbol-9',
    title: 'Futbolcu Kondisyon Koşusu',
    description: 'Bir tam sahalık alan boyunca farklı tempolarla (kolay-hızlı-sprint) 30 dk koş.',
    location: 'futbol', difficulty: 4, duration: 30, dopamine: 45, calories: 250,
    scienceTag: 'Aerobik baz & Kondisyon dayanıklılığı', completed: false, locked: false,
  },
  {
    id: 'futbol-10',
    title: 'Zihinsel Hazırlık — Vizualizasyon',
    description: 'Gözleri kapatarak sahada en iyi halini hayal et. Sporcuların gizli silahı!',
    location: 'futbol', difficulty: 1, duration: 10, dopamine: 20, calories: 0,
    scienceTag: 'Motor imgelem & Mental performans', completed: false, locked: true,
  },

  // ── BASKETBOL ─────────────────────────────────────────────────────────────
  {
    id: 'bask-1',
    title: 'Dribbling Koordinasyon Drilleri',
    description: 'Çift topla veya bacak arasından yüksek tempolu top sürme, 15 dakika.',
    location: 'basketbol', difficulty: 3, duration: 15, dopamine: 35, calories: 100,
    scienceTag: 'Propriyoseptif top hakimiyeti & Çift el koordinasyonu', completed: false, locked: false,
  },
  {
    id: 'bask-2',
    title: 'Şut Mekaniği — 50 Başarılı Şut',
    description: 'Serbest atış çizgisinden, tam mekaniğe dikkat ederek 50 isabetli şut bul.',
    location: 'basketbol', difficulty: 3, duration: 20, dopamine: 40, calories: 80,
    scienceTag: 'Kas hafızası & Motor programlama', completed: false, locked: false,
  },
  {
    id: 'bask-3',
    title: 'Dikey Sıçrama & Patlayıcılık',
    description: '3 set x 10 tekrar Squat Jump + Box Jump. Potaya uzanmak için patlayıcı güç şart!',
    location: 'basketbol', difficulty: 4, duration: 15, dopamine: 40, calories: 110,
    scienceTag: 'Pliometrik güç & Tip II kas lifleri', completed: false, locked: false,
  },
  {
    id: 'bask-4',
    title: 'Defansif Kayma (Slide) Antrenmanı',
    description: 'Alçak stance\'da enlemesine 10 dk boyunca hızlı savunma adımları at.',
    location: 'basketbol', difficulty: 4, duration: 10, dopamine: 35, calories: 120,
    scienceTag: 'Lateral çeviklik & Kuadriseps dayanıklılığı', completed: false, locked: false,
  },
  {
    id: 'bask-5',
    title: 'NBA Analizi — Şut Mekaniği İzleme',
    description: 'NBA oyuncularının şut mekaniklerini yavaş çekimde izle ve notlar al.',
    location: 'basketbol', difficulty: 2, duration: 15, dopamine: 20, calories: 0,
    scienceTag: 'Görsel öğrenme & Model transferi', completed: false, locked: false,
  },
  {
    id: 'bask-6',
    title: 'Pick & Roll Hareket Pratiği',
    description: 'Bir partner veya koniyle pick & roll, drive-and-kick hareketlerini çalış.',
    location: 'basketbol', difficulty: 3, duration: 20, dopamine: 35, calories: 90,
    scienceTag: 'Takım hareketi & Boşluk okuma', completed: false, locked: false,
  },
  {
    id: 'bask-7',
    title: 'Lay-up Serisi — 30 Başarılı',
    description: 'Her iki elinizle değişimli lay-up at. Farklı açılardan ve hızlardan yaklaş.',
    location: 'basketbol', difficulty: 2, duration: 15, dopamine: 25, calories: 70,
    scienceTag: 'Amortisörlü temas & Lay-up koordinasyonu', completed: false, locked: false,
  },
  {
    id: 'bask-8',
    title: 'Kondisyon Koşuları — Suicide Runs',
    description: '3x suicide run (kısa-uzun-tam saha sprint dizisi). En ağır kondisyon testi.',
    location: 'basketbol', difficulty: 5, duration: 20, dopamine: 55, calories: 200,
    scienceTag: 'Anaerobik kapasite & Basketbol dayanıklılığı', completed: false, locked: false,
  },
  {
    id: 'bask-9',
    title: '3 Sayılık Bölge Şut Pratiği',
    description: 'Farklı 5 pozisyondan 3 sayılık bölgeden minimum 20 isabetli şut at.',
    location: 'basketbol', difficulty: 4, duration: 25, dopamine: 45, calories: 80,
    scienceTag: 'Uzun mesafe şut mekaniği & Bacak aktivasyonu', completed: false, locked: false,
  },
  {
    id: 'bask-10',
    title: 'Ribaund & İkinci Şut Pozisyonu',
    description: 'Ribaund pozisyonlanması ve ikinci şans sayısı alıştırmaları. Maçları bu kazandırır.',
    location: 'basketbol', difficulty: 3, duration: 15, dopamine: 30, calories: 90,
    scienceTag: 'Pozisyonlanma IQ\'su & Enerji avantajı', completed: false, locked: true,
  },
];

export const BADGES: Badge[] = [
  { id: 'first-quest', name: 'İlk Adım', icon: '🚀', description: 'İlk görevini başarıyla doğrula', unlocked: false, premium: false },
  { id: 'streak-3', name: 'Disiplin Yıldızı', icon: '🔥', description: '3 gün üst üste görev tamamla', unlocked: false, premium: false },
  { id: 'streak-7', name: 'Demir İrade', icon: '⚡', description: '7 gün üst üste görev tamamla', unlocked: false, premium: false },
  { id: 'level-5', name: 'Gelişim Ustası', icon: '👑', description: '5. Seviyeye ulaş', unlocked: false, premium: false },
  { id: 'level-10', name: 'Efsane Kahraman', icon: '💎', description: '10. Seviyeye ulaş', unlocked: false, premium: true },
  { id: 'verify-10', name: 'Güvenilir Kahraman', icon: '🛡️', description: '10 göreve kanıt notu yazarak doğrula', unlocked: false, premium: true },
  { id: 'all-categories', name: 'Çok Yönlü Savaşçı', icon: '🌟', description: 'Her kategoriden en az 1 görev tamamla', unlocked: false, premium: true },
];

export const MOCK_FRIENDS: Friend[] = [
  { id: '1', name: 'Yasir İğde', avatar: '', status: 'quest', currentQuest: '5 Vakit Namaz — Tam Huşu', level: 12, xp: 450, xpToNext: 1200, sentSupportToday: false },
  { id: '2', name: 'Ahmet Demir', avatar: '', status: 'online', level: 8, xp: 200, xpToNext: 800, sentSupportToday: false },
  { id: '3', name: 'Zeynep Kaya', avatar: '', status: 'quest', currentQuest: '20 Sayfa Felsefe Okuma', level: 15, xp: 900, xpToNext: 1500, sentSupportToday: false },
  { id: '4', name: 'Burak Çelik', avatar: '', status: 'offline', level: 5, xp: 120, xpToNext: 500, sentSupportToday: false },
  { id: '5', name: 'Mert Yılmaz', avatar: '', status: 'online', level: 9, xp: 350, xpToNext: 900, sentSupportToday: false },
  { id: '6', name: 'Emir Kara', avatar: '', status: 'quest', currentQuest: '5 km Koşu', level: 11, xp: 600, xpToNext: 1100, sentSupportToday: false },
];

export const WEEKLY_STATS: WeeklyStats[] = [
  { day: 'Pzt', quests: 3, xp: 120 },
  { day: 'Sal', quests: 2, xp: 80 },
  { day: 'Çar', quests: 4, xp: 180 },
  { day: 'Per', quests: 1, xp: 40 },
  { day: 'Cum', quests: 5, xp: 220 },
  { day: 'Cmt', quests: 3, xp: 150 },
  { day: 'Paz', quests: 0, xp: 0 },
];

// ─── Aşamalı Görev Üretici (Progression Engine) ───────────────────────────────
export function generateQuestsForDay(
  focus: LocationType,
  day: number
): Quest[] {
  const quests: Quest[] = [];

  // Din: Manevi Disiplin & İbadet
  if (focus === 'din') {
    quests.push({
      id: `ch-din-1-${day}`,
      title: '5 Vakit Namazı Huşuyla Kıl',
      description: 'Namazlarını kazaya bırakmadan, her rekatta okuduğunu düşünerek kıl.',
      location: 'din', difficulty: 4, duration: 40, dopamine: 50, calories: 0,
      scienceTag: 'Ruhsal dinginlik & Odaklanma', completed: false, locked: false, isChallenge: true
    });
    quests.push({
      id: `ch-din-2-${day}`,
      title: `Kuran Tefekkürü: En az ${5 + day} sayfa`,
      description: 'Mealiyle birlikte yavaşça oku ve okuduğun ayetlerin mesajı üzerinde derin düşün.',
      location: 'din', difficulty: 3, duration: 20, dopamine: 35, calories: 0,
      scienceTag: 'Bilişsel derinleşme & Manevi meditasyon', completed: false, locked: false, isChallenge: true
    });
    quests.push({
      id: `ch-din-3-${day}`,
      title: 'Sabah-Akşam Zikirleri & Tesbihat',
      description: 'Günün sabah ve akşam dualarını eksiksiz oku, 100 kere Estağfirullah çek.',
      location: 'din', difficulty: 2, duration: 15, dopamine: 30, calories: 0,
      scienceTag: 'Parasempatik aktivasyon & Kalp huzuru', completed: false, locked: false, isChallenge: true
    });
    quests.push({
      id: `ch-din-4-${day}`,
      title: 'Sadaka & Tebessüm Hareketi',
      description: 'Bugün bir muhtaca yardım et ya da insanlara içten bir tebessüm sun.',
      location: 'din', difficulty: 3, duration: 10, dopamine: 30, calories: 0,
      scienceTag: 'Empati + Oksitosin artışı', completed: false, locked: false, isChallenge: true
    });
    quests.push({
      id: `ch-din-5-${day}`,
      title: 'Ahlaki Muhafaza: Sıfır Gıybet & Yalan',
      description: 'Gıybet edilen ortamlardan uzak dur, yalan ve boş konuşmaktan tamamen kaçın.',
      location: 'din', difficulty: 5, duration: 60, dopamine: 55, calories: 0,
      scienceTag: 'İrade disiplini & Sosyal güven inşası', completed: false, locked: false, isChallenge: true
    });
    quests.push({
      id: `ch-din-6-${day}`,
      title: 'Dua & Münacat Seansı',
      description: 'İsteklerini ve şükürlerini içtenlikle ilet. 10+ dakika huşuyla dua et.',
      location: 'din', difficulty: 2, duration: 10, dopamine: 25, calories: 0,
      scienceTag: 'Nörospiritual iyileşme & İç huzur', completed: false, locked: false, isChallenge: true
    });
  }

  // Spor: Fiziksel Zindelik & Atletizm
  else if (focus === 'spor') {
    quests.push({
      id: `ch-spor-1-${day}`,
      title: `Günün Egzersizi: ${20 + day * 2} Şınav + ${25 + day * 2} Squat`,
      description: 'Setleri bölerek gün içine yayabilirsin. Düzgün formda yapmaya dikkat et!',
      location: 'spor', difficulty: 3, duration: 15, dopamine: 30, calories: 80,
      scienceTag: 'Kas hipertrofisi & Güç kazanımı', completed: false, locked: false, isChallenge: true
    });
    quests.push({
      id: `ch-spor-2-${day}`,
      title: 'Gelişmiş Hidrasyon — 3 Litre',
      description: 'Vücut kütlene ve antrenmanına göre bugün en az 3 litre su iç.',
      location: 'spor', difficulty: 2, duration: 5, dopamine: 20, calories: 0,
      scienceTag: 'Elektrolit dengesi & Performans', completed: false, locked: false, isChallenge: true
    });
    quests.push({
      id: `ch-spor-3-${day}`,
      title: `Dayanıklılık Koşusu: ${2 + Math.floor(day / 3)} km`,
      description: 'Açık havada temponu koruyarak koş. Bittiğinde 5 dk derin nefes al.',
      location: 'spor', difficulty: 4, duration: 30, dopamine: 55, calories: 250 + day * 10,
      scienceTag: 'Kardiyovasküler kapasite & Endorfin', completed: false, locked: false, isChallenge: true
    });
    quests.push({
      id: `ch-spor-4-${day}`,
      title: 'Postür ve Mobilite Çalışması',
      description: '15 dakika boyunca esneme ve eklem mobilizasyon hareketleri yap.',
      location: 'spor', difficulty: 2, duration: 15, dopamine: 25, calories: 40,
      scienceTag: 'Eklem sağlığı & İyileşme', completed: false, locked: false, isChallenge: true
    });
    quests.push({
      id: `ch-spor-5-${day}`,
      title: 'Şeker & İşlenmiş Gıda Detoksu',
      description: 'Bugün hiç işlenmiş şeker, hazır paketli gıda veya asitli içecek tüketme.',
      location: 'spor', difficulty: 4, duration: 5, dopamine: 40, calories: 0,
      scienceTag: 'İnsülin duyarlılığı & Karaciğer dinlenmesi', completed: false, locked: false, isChallenge: true
    });
    quests.push({
      id: `ch-spor-6-${day}`,
      title: `Protein Hedefi: ${120 + day * 2}g Protein`,
      description: 'Kas sentezi için günlük protein hedefini takip et ve ulaş.',
      location: 'spor', difficulty: 3, duration: 10, dopamine: 30, calories: 0,
      scienceTag: 'Protein sentezi & Miyofibril büyümesi', completed: false, locked: false, isChallenge: true
    });
  }

  // Eğitim: Akademik Başarı & Odaklanma
  else if (focus === 'egitim') {
    quests.push({
      id: `ch-egitim-1-${day}`,
      title: `Derin Odaklanma (Pomodoro): ${25 + day * 5} dk x 2 Seans`,
      description: 'Telefonu uçak moduna alıp tamamen odaklanarak bir ders veya proje üzerinde çalış.',
      location: 'egitim', difficulty: 3, duration: 60, dopamine: 45, calories: 0,
      scienceTag: 'Deep Work kası & Prefrontal korteks', completed: false, locked: false, isChallenge: true
    });
    quests.push({
      id: `ch-egitim-2-${day}`,
      title: 'Akademik Makale & Araştırma Okuması',
      description: 'İlgi duyduğun bir bilimsel alanda en az 1 araştırma makalesi oku, notlar çıkar.',
      location: 'egitim', difficulty: 3, duration: 20, dopamine: 35, calories: 0,
      scienceTag: 'Analitik düşünme & Eleştirel okuma', completed: false, locked: false, isChallenge: true
    });
    quests.push({
      id: `ch-egitim-3-${day}`,
      title: 'Günlük Hataları Analiz Etme',
      description: 'Bugün çözemediğin veya yanlış yaptığın 5 soruyu/konuyu baştan incele.',
      location: 'egitim', difficulty: 3, duration: 15, dopamine: 30, calories: 0,
      scienceTag: 'Hata analizi & Kalıcı öğrenme', completed: false, locked: false, isChallenge: true
    });
    quests.push({
      id: `ch-egitim-4-${day}`,
      title: 'Feynman Tekniği ile Anlatım',
      description: 'Bugün öğrendiğin zor bir konuyu sanki 10 yaşındaki birine anlatır gibi sesli anlat.',
      location: 'egitim', difficulty: 4, duration: 15, dopamine: 40, calories: 0,
      scienceTag: 'Kavramsal netlik & Zihinsel bütünleşme', completed: false, locked: false, isChallenge: true
    });
    quests.push({
      id: `ch-egitim-5-${day}`,
      title: 'Dijital Çalışma Minimalizmi',
      description: 'Çalışırken yalnızca ders sekmeleri açık olsun, sosyal medya bildirimlerini kapat.',
      location: 'egitim', difficulty: 2, duration: 5, dopamine: 20, calories: 0,
      scienceTag: 'Bilişsel yükü azaltma & Yüksek verimlilik', completed: false, locked: false, isChallenge: true
    });
    quests.push({
      id: `ch-egitim-6-${day}`,
      title: `Problem Seti: ${10 + day} Soru Çöz`,
      description: 'Aktif öğrenme için soru çöz. Pasif okuma değil, aktif pratik kalıcılaştırır.',
      location: 'egitim', difficulty: 3, duration: 30, dopamine: 35, calories: 0,
      scienceTag: 'Aktif geri çağırma & Aralıklı tekrar', completed: false, locked: false, isChallenge: true
    });
  }

  // Dil: Yabancı Dil & Küresel İletişim
  else if (focus === 'dil') {
    quests.push({
      id: `ch-dil-1-${day}`,
      title: `Kelime Dağarcığı: ${15 + Math.floor(day / 2)} Yeni Kelime`,
      description: 'Yeni kelimeleri anlamları, zıt anlamlısı ve örnek cümleleriyle birlikte yaz.',
      location: 'dil', difficulty: 2, duration: 15, dopamine: 30, calories: 0,
      scienceTag: 'Temporal lob aktivasyonu & Kelime hafızası', completed: false, locked: false, isChallenge: true
    });
    quests.push({
      id: `ch-dil-2-${day}`,
      title: 'Yabancı Dilde Dinleme Pratiği (20 Dk)',
      description: 'Hedef dilde podcast dinle veya altyazılı video izle, anlamadıklarını not al.',
      location: 'dil', difficulty: 3, duration: 20, dopamine: 30, calories: 0,
      scienceTag: 'İşitsel korteks aşinalığı & Prozodi', completed: false, locked: false, isChallenge: true
    });
    quests.push({
      id: `ch-dil-3-${day}`,
      title: 'Yabancı Dilde Günlük Yazma',
      description: 'Bugün ne yaptığını ve yarınki planlarını en az 10 cümleyle hedef dilde yaz.',
      location: 'dil', difficulty: 3, duration: 10, dopamine: 35, calories: 0,
      scienceTag: 'Cümle kurma & Aktif üretim', completed: false, locked: false, isChallenge: true
    });
    quests.push({
      id: `ch-dil-4-${day}`,
      title: 'Shadowing — Sesli Okuma Pratiği',
      description: 'Yabancı dilde bir metni 15 dakika boyunca sesli ve tonlamalara dikkat ederek oku.',
      location: 'dil', difficulty: 3, duration: 15, dopamine: 30, calories: 0,
      scienceTag: 'Telaffuz kası & Akıcılık', completed: false, locked: false, isChallenge: true
    });
    quests.push({
      id: `ch-dil-5-${day}`,
      title: 'Gramer Kuralı Analizi',
      description: 'Hedef dilde zorlandığın 1 gramer yapısını çalış ve o yapıyla 10 cümle kur.',
      location: 'dil', difficulty: 3, duration: 15, dopamine: 25, calories: 0,
      scienceTag: 'Dilbilgisi entegrasyonu & Otomatikleşme', completed: false, locked: false, isChallenge: true
    });
    quests.push({
      id: `ch-dil-6-${day}`,
      title: 'Konuşma Pratiği — 10 Dakika',
      description: 'Kendi kendine veya bir uygulama/partner aracılığıyla 10 dk hedef dilde konuş.',
      location: 'dil', difficulty: 4, duration: 10, dopamine: 40, calories: 0,
      scienceTag: 'Konuşma akıcılığı & Kaygı yönetimi', completed: false, locked: false, isChallenge: true
    });
  }

  // Kişisel Gelişim: Zihinsel Gelişim & Alışkanlık
  else if (focus === 'kisisel-gelisim') {
    quests.push({
      id: `ch-gelisim-1-${day}`,
      title: `Kitap Okuma Serüveni: En az ${15 + day} sayfa`,
      description: 'Kurgu dışı (tarih, felsefe, psikoloji vb.) bir kitaptan not alarak oku.',
      location: 'kisisel-gelisim', difficulty: 3, duration: 25, dopamine: 30, calories: 0,
      scienceTag: 'Nöroplastisite & Kültürel sermaye', completed: false, locked: false, isChallenge: true
    });
    quests.push({
      id: `ch-gelisim-2-${day}`,
      title: 'Günün En Zor Görevi (Eat That Frog)',
      description: 'Günün yapılacaklar listesindeki en zor ve önemli işi ilk sırada tamamla.',
      location: 'kisisel-gelisim', difficulty: 4, duration: 45, dopamine: 45, calories: 0,
      scienceTag: 'Procrastination önleyici irade', completed: false, locked: false, isChallenge: true
    });
    quests.push({
      id: `ch-gelisim-3-${day}`,
      title: 'Dijital Detoks — 2 Saat Limit',
      description: 'Bugün sosyal medyada geçirdiğin toplam süreyi 2 saatin altında tut.',
      location: 'kisisel-gelisim', difficulty: 4, duration: 60, dopamine: 40, calories: 0,
      scienceTag: 'Dopamin reseptör hassasiyet restorasyonu', completed: false, locked: false, isChallenge: true
    });
    quests.push({
      id: `ch-gelisim-4-${day}`,
      title: 'Günün Zihinsel Hasadı',
      description: 'Bugün öğrendiğin en değerli bilgiyi veya aldığın dersi günlüğüne kalıcı olarak not et.',
      location: 'kisisel-gelisim', difficulty: 2, duration: 5, dopamine: 20, calories: 0,
      scienceTag: 'Uzun vadeli bellek konsolidasyonu', completed: false, locked: false, isChallenge: true
    });
    quests.push({
      id: `ch-gelisim-5-${day}`,
      title: 'Erken Uyanma ve Sabah Rutini',
      description: 'Sabah erken uyan, yatağını topla ve ilk 30 dk ekrana bakmadan güne başla.',
      location: 'kisisel-gelisim', difficulty: 3, duration: 30, dopamine: 35, calories: 0,
      scienceTag: 'Kortizol eğrisi & Güne zinde başlama', completed: false, locked: false, isChallenge: true
    });
    quests.push({
      id: `ch-gelisim-6-${day}`,
      title: 'Nefes & Meditasyon Seansı',
      description: '4-7-8 nefes tekniği veya bilinçli nefes meditasyonu ile 10 dk dinlen.',
      location: 'kisisel-gelisim', difficulty: 2, duration: 10, dopamine: 30, calories: 0,
      scienceTag: 'Parasempatik tonus & Stres hormonu düşürme', completed: false, locked: false, isChallenge: true
    });
  }

  // Lookmaxing: Kişisel Bakım, Duruş & Estetik
  else if (focus === 'lookmaxing') {
    quests.push({
      id: `ch-look-1-${day}`,
      title: 'Gelişmiş Cilt Bakım Rutini',
      description: 'Cildini temizle, tonikle ve cilt tipine uygun nemlendirici + SPF50+ güneş kremi uygula.',
      location: 'lookmaxing', difficulty: 2, duration: 10, dopamine: 20, calories: 0,
      scienceTag: 'Dermatolojik yenilenme & Hijyen', completed: false, locked: false, isChallenge: true
    });
    quests.push({
      id: `ch-look-2-${day}`,
      title: 'Postür (Dik Duruş) Egzersizleri',
      description: 'Duvar desteği ile omuz ve sırt duruşunu düzelten 15 dakikalık postür egzersizi yap.',
      location: 'lookmaxing', difficulty: 2, duration: 15, dopamine: 25, calories: 20,
      scienceTag: 'Omurga hizalaması & Özgüven algısı', completed: false, locked: false, isChallenge: true
    });
    quests.push({
      id: `ch-look-3-${day}`,
      title: 'Mewing & Çene Hattı Egzersizi',
      description: 'Dilini tamamen damağına yapıştırarak doğru nefes al ve 10 dk yüz kaslarını çalıştır.',
      location: 'lookmaxing', difficulty: 1, duration: 10, dopamine: 15, calories: 0,
      scienceTag: 'Maksiller gelişim & Çene hattı belirginleştirme', completed: false, locked: false, isChallenge: true
    });
    quests.push({
      id: `ch-look-4-${day}`,
      title: 'Saç & Sakal / Kaş Bakımı',
      description: 'Saçlarını besle, sakal/saç çizgilerini düzelt ve kaşlarını şekillendir.',
      location: 'lookmaxing', difficulty: 2, duration: 15, dopamine: 25, calories: 0,
      scienceTag: 'Folikül bakımı & Estetik simetri', completed: false, locked: false, isChallenge: true
    });
    quests.push({
      id: `ch-look-5-${day}`,
      title: 'Dolap & Stil Optimizasyonu',
      description: 'Kıyafetlerinin renk uyumuna ve vücut tipine uygunluğuna dikkat et. Ayakkabını temizle.',
      location: 'lookmaxing', difficulty: 2, duration: 10, dopamine: 25, calories: 0,
      scienceTag: 'Sosyal algı & Halo etkisi', completed: false, locked: false, isChallenge: true
    });
    quests.push({
      id: `ch-look-6-${day}`,
      title: 'Uyku Kalitesi Yönetimi',
      description: 'Gece 23:00\'dan önce uyu ve oda karanlığını sağla. Uyku en iyi cilt bakımıdır.',
      location: 'lookmaxing', difficulty: 3, duration: 5, dopamine: 30, calories: 0,
      scienceTag: 'Büyüme hormonu salınımı & Cilt yenilenmesi', completed: false, locked: false, isChallenge: true
    });
  }

  // Futbol: Futbol Taktiği & Kondisyonu
  else if (focus === 'futbol') {
    quests.push({
      id: `ch-futbol-1-${day}`,
      title: `Top Kontrolü & Juggles: ${20 + day * 5} Tekrar`,
      description: 'Sağ ve sol ayağını dengeli kullanarak topu havada tutmaya çalış.',
      location: 'futbol', difficulty: 3, duration: 15, dopamine: 35, calories: 90,
      scienceTag: 'Motor koordinasyon & Top hissi', completed: false, locked: false, isChallenge: true
    });
    quests.push({
      id: `ch-futbol-2-${day}`,
      title: 'İnterval Sprint Antrenmanı',
      description: 'Sahada 30 sn depar, 30 sn tempolu yürüyüş şeklinde 15 dakika koş.',
      location: 'futbol', difficulty: 4, duration: 15, dopamine: 45, calories: 180,
      scienceTag: 'Anaerobik eşik & Patlayıcı güç', completed: false, locked: false, isChallenge: true
    });
    quests.push({
      id: `ch-futbol-3-${day}`,
      title: 'Duvar Pası Çalışması',
      description: 'Duvara karşı iki ayakla 200 tekrar pas atıp kontrol çalışması yap.',
      location: 'futbol', difficulty: 3, duration: 15, dopamine: 30, calories: 80,
      scienceTag: 'Pas isabeti & Reaksiyon süresi', completed: false, locked: false, isChallenge: true
    });
    quests.push({
      id: `ch-futbol-4-${day}`,
      title: 'Futbol Taktiği ve Analiz',
      description: 'Profesyonel bir maç analizini veya taktik tahtasını taktiksel gözle izle.',
      location: 'futbol', difficulty: 2, duration: 20, dopamine: 25, calories: 0,
      scienceTag: 'Oyun zekası (IQ) & Konumlanma bilinci', completed: false, locked: false, isChallenge: true
    });
    quests.push({
      id: `ch-futbol-5-${day}`,
      title: 'Ayak Bileği Mobilizasyon',
      description: 'Sakatlıkları önlemek için her iki ayak bileğine 3 set x 15 güçlendirme yap.',
      location: 'futbol', difficulty: 2, duration: 10, dopamine: 20, calories: 30,
      scienceTag: 'Propriyosepsiyon & Ligaman sağlığı', completed: false, locked: false, isChallenge: true
    });
    quests.push({
      id: `ch-futbol-6-${day}`,
      title: `Frikik & Şut Pratiği: ${30 + day * 2} Şut`,
      description: 'Kaleye veya hedefe farklı açı ve mesafelerden şut at.',
      location: 'futbol', difficulty: 3, duration: 20, dopamine: 40, calories: 100,
      scienceTag: 'Şut mekaniği & Kas hafızası', completed: false, locked: false, isChallenge: true
    });
  }

  // Basketbol: Basketbol Kondisyonu & Şut
  else if (focus === 'basketbol') {
    quests.push({
      id: `ch-bask-1-${day}`,
      title: 'Dribbling Koordinasyon Drilleri',
      description: 'Çift topla veya bacak arasından 15 dk boyunca yüksek tempoda top sür.',
      location: 'basketbol', difficulty: 3, duration: 15, dopamine: 35, calories: 100,
      scienceTag: 'Propriyoseptif top hakimiyeti', completed: false, locked: false, isChallenge: true
    });
    quests.push({
      id: `ch-bask-2-${day}`,
      title: `Şut Mekaniği & İsabet: ${30 + day * 2} Başarılı Şut`,
      description: 'Serbest atış çizgisinden veya orta mesafeden şut mekaniğine dikkat ederek isabet bul.',
      location: 'basketbol', difficulty: 3, duration: 20, dopamine: 40, calories: 80,
      scienceTag: 'Kas hafızası & Motor programlama', completed: false, locked: false, isChallenge: true
    });
    quests.push({
      id: `ch-bask-3-${day}`,
      title: 'Dikey Sıçrama & Patlayıcılık',
      description: '3 set x 10 tekrar Squat Jump ve Box Jump egzersizlerini patlayıcı güçle yap.',
      location: 'basketbol', difficulty: 4, duration: 15, dopamine: 40, calories: 110,
      scienceTag: 'Pliometrik güç & Tip II kas lifleri', completed: false, locked: false, isChallenge: true
    });
    quests.push({
      id: `ch-bask-4-${day}`,
      title: 'Defansif Kayma (Slide) Antrenmanı',
      description: 'Alçak duruş pozisyonunda 10 dk boyunca enlemesine savunma adımlarıyla geç.',
      location: 'basketbol', difficulty: 4, duration: 10, dopamine: 35, calories: 120,
      scienceTag: 'Lateral çeviklik & Kuadriseps dayanıklılığı', completed: false, locked: false, isChallenge: true
    });
    quests.push({
      id: `ch-bask-5-${day}`,
      title: 'NBA/EuroLeague Şut Analizi',
      description: 'Profesyonel oyuncuların şut mekaniklerini yavaş çekimde izle ve formunu karşılaştır.',
      location: 'basketbol', difficulty: 2, duration: 10, dopamine: 20, calories: 0,
      scienceTag: 'Görsel öğrenme & Model transferi', completed: false, locked: false, isChallenge: true
    });
    quests.push({
      id: `ch-bask-6-${day}`,
      title: 'Kondisyon Koşuları — Suicide Runs',
      description: '3x suicide run (kısa-uzun-tam saha sprint dizisi). En ağır basketbol kondisyon testi.',
      location: 'basketbol', difficulty: 5, duration: 20, dopamine: 55, calories: 200,
      scienceTag: 'Anaerobik kapasite & Basketbol dayanıklılığı', completed: false, locked: false, isChallenge: true
    });
  }

  return quests;
}
