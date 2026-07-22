import type { QuestPool } from '../types';

export const QUEST_POOL: QuestPool = {
  'din': {
    yeni: [
      {
        id: 'din-yeni-1',
        title: 'Günlük Şükür',
        description: 'Günün sonunda seni mutlu eden 3 şeyi düşün ve şükret.',
        scienceTag: 'Minnettarlık dopamin seviyesini dengeler.',
        baseDurationWeight: 15,
        difficulty: 'kolay' as any,
        dopamine: 20,
        calories: 0
      },
      {
        id: 'din-yeni-2',
        title: 'Sabah Duası',
        description: 'Güne başlarken niyetini belirle ve kısa bir dua et.',
        scienceTag: 'Güne niyetle başlamak psikolojik dayanıklılığı artırır.',
        baseDurationWeight: 20,
        difficulty: 'kolay' as any,
        dopamine: 25,
        calories: 0
      },
      {
        id: 'din-yeni-3',
        title: 'Temel Dini Bilgi',
        description: 'Dini temel kavramlardan birini oku ve öğren.',
        scienceTag: 'Yeni bilgi öğrenmek nöroplastisiteyi destekler.',
        baseDurationWeight: 25,
        difficulty: 'kolay' as any,
        dopamine: 30,
        calories: 0
      },
      {
        id: 'din-yeni-4',
        title: 'Kısa Meal Okuması',
        description: "Kuran-ı Kerim'den rastgele 3 ayetin mealini oku.",
        scienceTag: 'Derin okuma odaklanma süresini uzatır.',
        baseDurationWeight: 30,
        difficulty: 'orta' as any,
        dopamine: 35,
        calories: 0
      },
      {
        id: 'din-yeni-5',
        title: 'İyilik Yap',
        description: 'Bugün karşılıksız, küçük bir iyilik yap (Örn: Birine tebessüm et).',
        scienceTag: 'Pro-sosyal davranışlar oksitosin salgılatır.',
        baseDurationWeight: 10,
        difficulty: 'kolay' as any,
        dopamine: 15,
        calories: 0
      },
      {
        id: 'din-yeni-6',
        title: 'Estagfurullah Zikri',
        description: '100 defa tövbe istiğfar getir.',
        scienceTag: 'Tekrarlayan ritimler zihni sakinleştirir.',
        baseDurationWeight: 20,
        difficulty: 'kolay' as any,
        dopamine: 25,
        calories: 0
      },
      {
        id: 'din-yeni-7',
        title: 'Abdest Al',
        description: 'Sadece ferahlamak ve niyet için abdest al.',
        scienceTag: 'Su teması vagus sinirini uyarır, stresi azaltır.',
        baseDurationWeight: 15,
        difficulty: 'kolay' as any,
        dopamine: 20,
        calories: 0
      },
      {
        id: 'din-yeni-8',
        title: 'Tefekkür Yürüyüşü',
        description: '10 dakika boyunca dışarıda doğayı gözlemleyerek yürü.',
        scienceTag: 'Doğada bulunmak kortizol seviyesini düşürür.',
        baseDurationWeight: 25,
        difficulty: 'orta' as any,
        dopamine: 30,
        calories: 50
      },
      {
        id: 'din-yeni-9',
        title: 'Sadaka Niyeti',
        description: 'Sadaka niyetine bir kenara bozuk para ayır veya dijital bağış yap.',
        scienceTag: 'Vermek, beyinde ödül merkezini aktifleştirir.',
        baseDurationWeight: 10,
        difficulty: 'kolay' as any,
        dopamine: 15,
        calories: 0
      },
      {
        id: 'din-yeni-10',
        title: 'Peygamber Hayatından Bir Kıssa',
        description: 'Kısa bir siyer (peygamber hayatı) hikayesi oku.',
        scienceTag: 'Rol model hikayeleri ahlaki pusulayı güçlendirir.',
        baseDurationWeight: 20,
        difficulty: 'kolay' as any,
        dopamine: 25,
        calories: 0
      },
      {
        id: 'din-yeni-11',
        title: 'Cuma Sünneti',
        description: 'Tırnak kesmek veya güzel koku sürmek gibi bir sünneti uygula.',
        scienceTag: 'Kişisel bakım öz saygıyı artırır.',
        baseDurationWeight: 15,
        difficulty: 'kolay' as any,
        dopamine: 20,
        calories: 0
      },
      {
        id: 'din-yeni-12',
        title: 'Yatmadan Önce Muhasebe',
        description: 'Günün kısa bir manevi değerlendirmesini yap.',
        scienceTag: 'Öz-düşünüm (self-reflection) duygusal zekayı geliştirir.',
        baseDurationWeight: 15,
        difficulty: 'kolay' as any,
        dopamine: 20,
        calories: 0
      },
    ],
    orta: [
      {
        id: 'din-orta-1',
        title: '5 Vakit Namaz (Bilinçli)',
        description: 'Bugün 5 vakit namazı vaktinde kılmaya özen göster.',
        scienceTag: 'Düzenli ritüeller zaman yönetimini ve disiplini artırır.',
        baseDurationWeight: 40,
        difficulty: 'zor' as any,
        dopamine: 50,
        calories: 0
      },
      {
        id: 'din-orta-2',
        title: 'Yasin Suresi',
        description: 'Yasin suresini oku veya dinle.',
        scienceTag: 'Manevi metinler beyin dalgalarını rahatlama frekansına çeker.',
        baseDurationWeight: 30,
        difficulty: 'orta' as any,
        dopamine: 40,
        calories: 0
      },
      {
        id: 'din-orta-3',
        title: 'Tefsir Okuması',
        description: 'Belirli bir surenin tefsirini (açıklamasını) oku.',
        scienceTag: 'Derin bağlamsal öğrenme analitik düşünceyi geliştirir.',
        baseDurationWeight: 35,
        difficulty: 'orta' as any,
        dopamine: 45,
        calories: 0
      },
      {
        id: 'din-orta-4',
        title: 'İlmihal Araştırması',
        description: 'Fıkhi bir konuda kafana takılan bir soruyu araştır.',
        scienceTag: 'Soru odaklı öğrenme hafızada kalıcılığı artırır.',
        baseDurationWeight: 25,
        difficulty: 'orta' as any,
        dopamine: 30,
        calories: 0
      },
      {
        id: 'din-orta-5',
        title: 'Sabah & Akşam Zikirleri',
        description: 'Peygamberin günlük zikirlerini eksiksiz yap.',
        scienceTag: 'Rutin tekrarlar prefrontal korteksi güçlendirir.',
        baseDurationWeight: 30,
        difficulty: 'orta' as any,
        dopamine: 35,
        calories: 0
      },
      {
        id: 'din-orta-6',
        title: 'Kaza Namazı',
        description: 'En az bir günlük (5 vakit) kaza namazı kıl.',
        scienceTag: 'Geçmiş eksikleri telafi etmek psikolojik yükü hafifletir.',
        baseDurationWeight: 35,
        difficulty: 'zor' as any,
        dopamine: 45,
        calories: 0
      },
      {
        id: 'din-orta-7',
        title: 'Cami Cemaati',
        description: 'En az bir vakit namazı cemaatle kıl.',
        scienceTag: 'Sosyal-manevi birliktelik aidiyet hissini artırır.',
        baseDurationWeight: 30,
        difficulty: 'orta' as any,
        dopamine: 40,
        calories: 20
      },
      {
        id: 'din-orta-8',
        title: 'Oruç (Pzt/Prş)',
        description: 'Pazartesi veya Perşembe orucu tut (veya niyetlen).',
        scienceTag: 'Aralıklı açlık otofajiyi tetikler, zihni berraklaştırır.',
        baseDurationWeight: 40,
        difficulty: 'zor' as any,
        dopamine: 60,
        calories: 0
      },
      {
        id: 'din-orta-9',
        title: 'Ezbere Sure Tekrarı',
        description: 'Bildiğin sureleri hata yapmadan peş peşe oku.',
        scienceTag: 'Hafıza geri çağırma pratiği nöral ağları sağlamlaştırır.',
        baseDurationWeight: 20,
        difficulty: 'orta' as any,
        dopamine: 30,
        calories: 0
      },
      {
        id: 'din-orta-10',
        title: 'Hadis Ezberi',
        description: 'Riyazus Salihin veya benzeri bir kaynaktan 1 hadis ezberle.',
        scienceTag: 'Kısa ezberler kısa süreli hafıza kapasitesini genişletir.',
        baseDurationWeight: 25,
        difficulty: 'orta' as any,
        dopamine: 35,
        calories: 0
      },
      {
        id: 'din-orta-11',
        title: 'Öğle Tatili Maneviyatı',
        description: 'Öğle arasında 15 dakika dünya işlerinden uzaklaş ve tefekkür et.',
        scienceTag: 'Günün ortasında mola vermek tükenmişliği (burnout) engeller.',
        baseDurationWeight: 25,
        difficulty: 'orta' as any,
        dopamine: 30,
        calories: 0
      },
      {
        id: 'din-orta-12',
        title: 'Manevi Bir Sohbet Dinle',
        description: 'Kaliteli bir dini sohbet/podcast dinle (En az 20 dk).',
        scienceTag: 'İşitsel öğrenme farklı beyin bölgelerini aktive eder.',
        baseDurationWeight: 30,
        difficulty: 'orta' as any,
        dopamine: 40,
        calories: 0
      },
    ],
    ileri: [
      {
        id: 'din-ileri-1',
        title: 'Teheccüd Namazı',
        description: 'Gece uyanıp teheccüd namazı kıl.',
        scienceTag: 'Gece uykusunu bölüp irade kullanmak prefrontal kortekste üst düzey kontrol sağlar.',
        baseDurationWeight: 50,
        difficulty: 'epic' as any,
        dopamine: 80,
        calories: 0
      },
      {
        id: 'din-ileri-2',
        title: 'Kuran Hatmi İlerlemesi',
        description: 'Günde en az 1 cüz okuyarak hatmine devam et.',
        scienceTag: 'Uzun süreli tutarlılık dopamin reseptörlerini hassaslaştırır.',
        baseDurationWeight: 45,
        difficulty: 'zor' as any,
        dopamine: 60,
        calories: 0
      },
      {
        id: 'din-ileri-3',
        title: 'Riyazet / Dijital Oruç',
        description: 'Sosyal medyadan ve gereksiz dünya kelamından bugün tamamen uzak dur.',
        scienceTag: 'Dopamin detoksu reseptör duyarlılığını zirveye taşır.',
        baseDurationWeight: 55,
        difficulty: 'epic' as any,
        dopamine: 90,
        calories: 0
      },
      {
        id: 'din-ileri-4',
        title: 'Kuşluk (Duha) Namazı',
        description: 'Güneş doğduktan sonra kuşluk namazı kıl.',
        scienceTag: 'Sabahın erken saatlerindeki manevi ritüeller gün boyu stresi bloke eder.',
        baseDurationWeight: 30,
        difficulty: 'zor' as any,
        dopamine: 40,
        calories: 0
      },
      {
        id: 'din-ileri-5',
        title: 'Evvabin Namazı',
        description: 'Akşam ile yatsı arası nafile ibadete zaman ayır.',
        scienceTag: 'Akşam ritüelleri sirkadiyen ritmi uykuya hazırlar.',
        baseDurationWeight: 35,
        difficulty: 'zor' as any,
        dopamine: 45,
        calories: 0
      },
      {
        id: 'din-ileri-6',
        title: 'Arapça Kelime Çalışması',
        description: 'Kuran arapçasından 5 yeni kelimenin kökünü incele.',
        scienceTag: 'Dilbilimsel analiz sol beyin yarımküresini yoğun çalıştırır.',
        baseDurationWeight: 40,
        difficulty: 'zor' as any,
        dopamine: 55,
        calories: 0
      },
      {
        id: 'din-ileri-7',
        title: 'Esmaül Hüsna Ezberi',
        description: "Allah'ın isimlerinden 5 tanesini anlamlarıyla ezberle ve hayatına uyarla.",
        scienceTag: 'Derin anlamlandırma (semantic processing) hafızayı kalıcı kılar.',
        baseDurationWeight: 35,
        difficulty: 'zor' as any,
        dopamine: 50,
        calories: 0
      },
      {
        id: 'din-ileri-8',
        title: 'Manevi Danışmanlık',
        description: 'Kendisinden feyz aldığın ilim sahibi biriyle görüş veya eserini derinlemesine oku.',
        scienceTag: 'Mentorluk mekanizması üstbilişsel (metacognitive) gelişimi sağlar.',
        baseDurationWeight: 45,
        difficulty: 'zor' as any,
        dopamine: 60,
        calories: 0
      },
      {
        id: 'din-ileri-9',
        title: 'İnfak Zirvesi',
        description: 'Seni zorlayacak ama mutlu edecek bir infakta (maddi/manevi bağış) bulun.',
        scienceTag: 'Fedakarlık ego savunma mekanizmalarını kırar.',
        baseDurationWeight: 50,
        difficulty: 'epic' as any,
        dopamine: 75,
        calories: 0
      },
      {
        id: 'din-ileri-10',
        title: 'Sükut Orucu Pratiği',
        description: 'Belirli bir saat diliminde (örn: 2 saat) zaruri olmadıkça hiç konuşma.',
        scienceTag: 'Konuşmayı kısıtlamak içsel farkındalığı maksimuma çıkarır.',
        baseDurationWeight: 45,
        difficulty: 'epic' as any,
        dopamine: 70,
        calories: 0
      },
      {
        id: 'din-ileri-11',
        title: 'Nefis Muhasebesi (Derin)',
        description: 'Geçmiş 1 haftanın günah ve sevap haritasını kağıda dök.',
        scienceTag: 'Yazarak analiz yapmak travmaları ve hataları işlemlemeyi kolaylaştırır.',
        baseDurationWeight: 40,
        difficulty: 'zor' as any,
        dopamine: 50,
        calories: 0
      },
      {
        id: 'din-ileri-12',
        title: 'Nafile İbadet Kampı',
        description: 'Bugün farzlara ek olarak en az 12 rekat nafile namaz kıl.',
        scienceTag: 'Kapasite zorlamak fiziksel ve ruhsal eşiği (threshold) yükseltir.',
        baseDurationWeight: 50,
        difficulty: 'epic' as any,
        dopamine: 80,
        calories: 0
      },
    ],
  },
  'spor': {
    yeni: [
      {
        id: 'spor-yeni-1',
        title: 'Sabah Esnemesi',
        description: 'Güne başlarken 5 dakikalık tam vücut esneme rutini yap.',
        scienceTag: 'Sabah esnemesi kan akışını hızlandırır ve uyuşukluğu alır.',
        baseDurationWeight: 15,
        difficulty: 'kolay' as any,
        dopamine: 20,
        calories: 15
      },
      {
        id: 'spor-yeni-2',
        title: 'Hafif Yürüyüş',
        description: 'Dışarıda 15 dakika tempolu yürü.',
        scienceTag: 'Düşük tempolu kardiyo kalp sağlığını korur.',
        baseDurationWeight: 30,
        difficulty: 'kolay' as any,
        dopamine: 25,
        calories: 60
      },
      {
        id: 'spor-yeni-3',
        title: 'Su Hedefi',
        description: 'Bugün en az 2 litre su içmeyi tamamla.',
        scienceTag: 'Hidrasyon kas yorgunluğunu %20 oranında geciktirir.',
        baseDurationWeight: 15,
        difficulty: 'kolay' as any,
        dopamine: 15,
        calories: 0
      },
      {
        id: 'spor-yeni-4',
        title: 'Masa Başı Hareketleri',
        description: 'Oturduğun yerde boyun ve omuzlarını esnet.',
        scienceTag: 'Mikro hareketler duruş bozukluklarını önler.',
        baseDurationWeight: 10,
        difficulty: 'kolay' as any,
        dopamine: 15,
        calories: 10
      },
      {
        id: 'spor-yeni-5',
        title: 'Merdiven Tercihi',
        description: 'Bugün asansör yerine mutlaka merdiven kullan.',
        scienceTag: 'Günlük NEAT (egzersiz dışı aktivite) kalorisi yakımı sağlar.',
        baseDurationWeight: 15,
        difficulty: 'kolay' as any,
        dopamine: 20,
        calories: 40
      },
      {
        id: 'spor-yeni-6',
        title: 'Temel Squat (Çömelme)',
        description: 'Vücut ağırlığıyla 3 set 10 tekrar squat yap.',
        scienceTag: 'Bacak kasları vücudun en çok kalori yakan grubudur.',
        baseDurationWeight: 20,
        difficulty: 'orta' as any,
        dopamine: 30,
        calories: 30
      },
      {
        id: 'spor-yeni-7',
        title: 'Plank Denemesi',
        description: 'Maksimum dayanabileceğin süre kadar plank bekle.',
        scienceTag: 'İzometrik kasılma core (merkez) bölgesini stabilize eder.',
        baseDurationWeight: 15,
        difficulty: 'kolay' as any,
        dopamine: 25,
        calories: 15
      },
      {
        id: 'spor-yeni-8',
        title: 'Dans Et',
        description: 'Sevdiğin hareketli bir şarkıda 3 dakika özgürce dans et.',
        scienceTag: 'Ritmik hareket endorfin salınımını tetikler.',
        baseDurationWeight: 10,
        difficulty: 'kolay' as any,
        dopamine: 30,
        calories: 20
      },
      {
        id: 'spor-yeni-9',
        title: 'Denge Egzersizi',
        description: 'Her iki bacakta tek ayak üzerinde 30 saniye gözü kapalı bekle.',
        scienceTag: 'Propriyosepsiyon (beden farkındalığı) gelişir.',
        baseDurationWeight: 15,
        difficulty: 'kolay' as any,
        dopamine: 20,
        calories: 5
      },
      {
        id: 'spor-yeni-10',
        title: 'Duvar Oturuşu (Wall Sit)',
        description: 'Sırtını duvara yaslayarak 30 saniye dizlerin bükük bekle.',
        scienceTag: 'Quadriceps kaslarında laktik asit toleransını artırır.',
        baseDurationWeight: 15,
        difficulty: 'kolay' as any,
        dopamine: 20,
        calories: 20
      },
      {
        id: 'spor-yeni-11',
        title: 'Omuz Rotasyonları',
        description: 'Kollarını iki yana açıp öne ve arkaya 30 küçük daire çiz.',
        scienceTag: 'Rotator cuff (omuz) sakatlıklarını engeller.',
        baseDurationWeight: 10,
        difficulty: 'kolay' as any,
        dopamine: 15,
        calories: 10
      },
      {
        id: 'spor-yeni-12',
        title: 'Yatmadan Önce Rahatlama',
        description: 'Çocuk pozu (child pose) yaparak sırtını 1 dakika esnet.',
        scienceTag: 'Parasempatik sinir sistemini aktive ederek uykuya hazırlar.',
        baseDurationWeight: 15,
        difficulty: 'kolay' as any,
        dopamine: 20,
        calories: 5
      },
    ],
    orta: [
      {
        id: 'spor-orta-1',
        title: 'HIIT Kardiyo (15 Dk)',
        description: '15 dakikalık yüksek yoğunluklu interval antrenman yap.',
        scienceTag: 'HIIT, EPOC etkisiyle antrenman sonrası 24 saat kalori yaktırır.',
        baseDurationWeight: 35,
        difficulty: 'zor' as any,
        dopamine: 50,
        calories: 150
      },
      {
        id: 'spor-orta-2',
        title: 'Şınav Rutini',
        description: 'Maksimum tekrar sayına ulaşana kadar 3 set şınav çek.',
        scienceTag: 'Bileşik egzersizler üst vücut itiş gücünü artırır.',
        baseDurationWeight: 30,
        difficulty: 'orta' as any,
        dopamine: 40,
        calories: 50
      },
      {
        id: 'spor-orta-3',
        title: 'Core (Karın) Antrenmanı',
        description: 'Crunch, leg raise ve plank içeren 10 dakikalık karın serisi yap.',
        scienceTag: 'Güçlü core bölgesi postür bozukluklarını tedavi eder.',
        baseDurationWeight: 25,
        difficulty: 'orta' as any,
        dopamine: 35,
        calories: 60
      },
      {
        id: 'spor-orta-4',
        title: 'Hafif Koşu (Jogging)',
        description: 'Açık havada 20 dakika kesintisiz hafif tempoda koş.',
        scienceTag: 'Aerobik kapasite (VO2 Max) seviyesini iyileştirir.',
        baseDurationWeight: 40,
        difficulty: 'orta' as any,
        dopamine: 45,
        calories: 180
      },
      {
        id: 'spor-orta-5',
        title: 'Barfiks / Çekiş Pratiği',
        description: 'Gidebiliyorsan parka, gidemiyorsan masa altı çekiş (inverted row) yap.',
        scienceTag: 'Sırt kaslarını aktive etmek kamburluğu önler.',
        baseDurationWeight: 30,
        difficulty: 'zor' as any,
        dopamine: 50,
        calories: 40
      },
      {
        id: 'spor-orta-6',
        title: 'Mobilite Akışı',
        description: '15 dakikalık tüm eklem açıklıklarını zorlayan mobilite rutini yap.',
        scienceTag: 'Eklem sıvısını (sinovyal sıvı) hareketlendirir.',
        baseDurationWeight: 25,
        difficulty: 'orta' as any,
        dopamine: 35,
        calories: 30
      },
      {
        id: 'spor-orta-7',
        title: 'Direnç Bandı Çalışması',
        description: 'Direnç bandı ile omuz ve kol egzersizleri yap.',
        scienceTag: 'Tension (gerilim) altında kalma süresi kas hipertrofisini uyarır.',
        baseDurationWeight: 25,
        difficulty: 'orta' as any,
        dopamine: 35,
        calories: 40
      },
      {
        id: 'spor-orta-8',
        title: 'Lunge Yürüyüşü',
        description: 'Koridorda veya dışarıda 3 set 12 tekrar walking lunge yap.',
        scienceTag: 'Glute (kalça) ve bacak kaslarında asimetriyi düzeltir.',
        baseDurationWeight: 30,
        difficulty: 'zor' as any,
        dopamine: 45,
        calories: 70
      },
      {
        id: 'spor-orta-9',
        title: 'İp Atlama',
        description: '5 dakika boyunca takılsan da ip atlamaya devam et.',
        scienceTag: 'Göz-el-ayak koordinasyonunu ve ayak bileği gücünü artırır.',
        baseDurationWeight: 25,
        difficulty: 'orta' as any,
        dopamine: 40,
        calories: 80
      },
      {
        id: 'spor-orta-10',
        title: 'Soğuk Duş Terapisi',
        description: 'Antrenman sonrası 2 dakika tamamen soğuk duş al.',
        scienceTag: 'Soğuk şoku endorfin patlaması yaşatır ve kas iltihabını azaltır.',
        baseDurationWeight: 35,
        difficulty: 'zor' as any,
        dopamine: 60,
        calories: 0
      },
      {
        id: 'spor-orta-11',
        title: 'Bölgesel İzole Antrenman',
        description: 'Sadece zayıf hissettiğin bir kas grubuna (örn: kalf, ön kol) 10 dk odaklan.',
        scienceTag: 'Zayıf halkayı güçlendirmek kinetik zinciri tamamlar.',
        baseDurationWeight: 25,
        difficulty: 'orta' as any,
        dopamine: 35,
        calories: 40
      },
      {
        id: 'spor-orta-12',
        title: 'Dinamik Isınma Kompleksi',
        description: 'Antrenman öncesi statik değil, ter atacak kadar dinamik esne (animal flow vb).',
        scienceTag: 'Vücut ısısını 1-2 derece artırmak sakatlık riskini %40 düşürür.',
        baseDurationWeight: 20,
        difficulty: 'orta' as any,
        dopamine: 30,
        calories: 50
      },
    ],
    ileri: [
      {
        id: 'spor-ileri-1',
        title: 'Ağır Siklet Antrenmanı',
        description: 'Salonda veya evde ağır kilolarla temel (compound) hareketler gir.',
        scienceTag: 'Mekanik gerilim ve kas hasarı maksimum hipertrofi sağlar.',
        baseDurationWeight: 50,
        difficulty: 'epic' as any,
        dopamine: 70,
        calories: 300
      },
      {
        id: 'spor-ileri-2',
        title: 'Tempo Koşusu (5k/10k)',
        description: 'Kendi sınırlarını zorlayacağın 5 veya 10 kilometrelik bir tempo koşusu yap.',
        scienceTag: 'Laktat eşiğini yükseltir ve mental dayanıklılığı (grit) çelikleştirir.',
        baseDurationWeight: 60,
        difficulty: 'epic' as any,
        dopamine: 85,
        calories: 450
      },
      {
        id: 'spor-ileri-3',
        title: 'Calisthenics Kombinasyonu',
        description: 'Muscle-up, front lever veya handstand gibi zorlu hareketlere 20 dk çalış.',
        scienceTag: 'Sinir sistemi (CNS) adaptasyonu ile nöromüsküler kontrol zirveye çıkar.',
        baseDurationWeight: 45,
        difficulty: 'zor' as any,
        dopamine: 65,
        calories: 200
      },
      {
        id: 'spor-ileri-4',
        title: 'Süper Set Serisi',
        description: 'Antrenmanında zıt kas gruplarını (antagonist) hiç dinlenmeden art arda çalıştır.',
        scienceTag: 'Zaman verimliliğini artırırken metabolik stresi maksimize eder.',
        baseDurationWeight: 40,
        difficulty: 'zor' as any,
        dopamine: 60,
        calories: 250
      },
      {
        id: 'spor-ileri-5',
        title: 'Drop Set (Tükeniş)',
        description: 'Son setlerinde ağırlığı düşürerek kas tükenişine (failure) kadar git.',
        scienceTag: 'Tip 2X hızlı kasılan kas liflerini aktive eder.',
        baseDurationWeight: 35,
        difficulty: 'zor' as any,
        dopamine: 55,
        calories: 150
      },
      {
        id: 'spor-ileri-6',
        title: 'Patlayıcı Güç (Plyometrics)',
        description: 'Kutuya zıplama (box jump), alkışlı şınav gibi patlayıcı hareketler yap.',
        scienceTag: 'Güç üretme hızını (Rate of Force Development) artırır.',
        baseDurationWeight: 40,
        difficulty: 'zor' as any,
        dopamine: 50,
        calories: 180
      },
      {
        id: 'spor-ileri-7',
        title: 'Buz Banyosu / Derin Toparlanma',
        description: 'Yoğun antrenman sonrası buz banyosu veya aktif derin toparlanma (foam roller) seansı yap.',
        scienceTag: 'Miyofasyal gevşeme kas yapışıklıklarını (trigger points) çözer.',
        baseDurationWeight: 35,
        difficulty: 'orta' as any,
        dopamine: 50,
        calories: 0
      },
      {
        id: 'spor-ileri-8',
        title: '1 RM (Maksimum) Denemesi',
        description: 'Temel bir harekette (Deadlift/Bench) kaldırabileceğin maksimum kiloyu güvenle test et.',
        scienceTag: 'Merkezi sinir sistemini tam kapasite ateşler.',
        baseDurationWeight: 55,
        difficulty: 'epic' as any,
        dopamine: 90,
        calories: 100
      },
      {
        id: 'spor-ileri-9',
        title: 'Tabata Protokolü',
        description: '20 saniye %100 efor, 10 saniye dinlenme formatında 4 dakikalık cehennem turu yap.',
        scienceTag: 'Oksijen borçlanmasını tavan yaptırarak mitokondri sayısını artırır.',
        baseDurationWeight: 40,
        difficulty: 'zor' as any,
        dopamine: 60,
        calories: 120
      },
      {
        id: 'spor-ileri-10',
        title: 'Asimetrik Yük Taşıma',
        description: "Tek elde ağır dambıl ile yürü (Farmer's walk).",
        scienceTag: 'Kor stabilitesini anti-rotasyonel kuvvet uygulayarak ekstrem seviyeye taşır.',
        baseDurationWeight: 35,
        difficulty: 'zor' as any,
        dopamine: 55,
        calories: 140
      },
      {
        id: 'spor-ileri-11',
        title: 'Oksijen Kısıtlamalı İdman',
        description: 'Antrenman sonuna doğru nefes tutarak veya maske ile hafif kardiyo yap.',
        scienceTag: 'Hipoksik stres kırmızı kan hücresi üretimini teşvik eder.',
        baseDurationWeight: 45,
        difficulty: 'epic' as any,
        dopamine: 70,
        calories: 150
      },
      {
        id: 'spor-ileri-12',
        title: 'Agility (Çeviklik) Merdiveni',
        description: 'Yön değiştirme ve ayak çabukluğu drilleri yap.',
        scienceTag: 'Nöral ateşleme hızını ve ayak bileği reaksiyon süresini keskinleştirir.',
        baseDurationWeight: 35,
        difficulty: 'zor' as any,
        dopamine: 50,
        calories: 130
      },
    ],
  },
  'egitim': {
    yeni: [
      {
        id: 'egitim-yeni-1',
        title: 'Günlük Planlama',
        description: 'Bugün yapman gereken en önemli 3 görevi yaz ve öncelik sırasına koy.',
        scienceTag: 'Planlama prefrontal korteksi aktive eder ve stresi azaltır.',
        baseDurationWeight: 15,
        difficulty: 'kolay' as any,
        dopamine: 20,
        calories: 0
      },
      {
        id: 'egitim-yeni-2',
        title: 'Kısa Okuma Seansı',
        description: 'İlgilendiğin bir konuda 10 dakika boyunca odaklanarak oku.',
        scienceTag: 'Odaklanma egzersizi dikkat süresini uzatır.',
        baseDurationWeight: 20,
        difficulty: 'kolay' as any,
        dopamine: 25,
        calories: 0
      },
      {
        id: 'egitim-yeni-3',
        title: 'Not Alma Pratiği',
        description: 'Dinlediğin veya okuduğun bir şeyden 3 ana nokta not al.',
        scienceTag: 'Not alma hafıza konsolidasyonunu güçlendirir.',
        baseDurationWeight: 15,
        difficulty: 'kolay' as any,
        dopamine: 22,
        calories: 0
      },
      {
        id: 'egitim-yeni-4',
        title: 'Kelime Öğrenimi',
        description: 'Yeni bir kelime öğren ve anlamını bir cümle içinde kullan.',
        scienceTag: 'Kelime öğrenimi dil merkezlerini genişletir.',
        baseDurationWeight: 10,
        difficulty: 'kolay' as any,
        dopamine: 18,
        calories: 0
      },
      {
        id: 'egitim-yeni-5',
        title: 'Matematik Egzersizi',
        description: 'Zihinden 5 basit matematik işlemi çöz.',
        scienceTag: 'Mental aritmetik çalışma hafızasını geliştirir.',
        baseDurationWeight: 10,
        difficulty: 'kolay' as any,
        dopamine: 20,
        calories: 0
      },
      {
        id: 'egitim-yeni-6',
        title: 'Ders Programı İncelemesi',
        description: 'Ders programını kontrol et ve yarınki dersleri hazırla.',
        scienceTag: 'Önceden hazırlık anksiyeteyi azaltır.',
        baseDurationWeight: 15,
        difficulty: 'kolay' as any,
        dopamine: 22,
        calories: 0
      },
      {
        id: 'egitim-yeni-7',
        title: 'Özet Yazma',
        description: 'Bugün öğrendiğin bir konuyu 3 cümleyle özetle.',
        scienceTag: 'Özetleme bilgiyi işleme yeteneğini geliştirir.',
        baseDurationWeight: 15,
        difficulty: 'kolay' as any,
        dopamine: 24,
        calories: 0
      },
      {
        id: 'egitim-yeni-8',
        title: 'Çalışma Ortamı Düzenleme',
        description: 'Çalışma masanı düzenle ve dikkat dağıtıcıları kaldır.',
        scienceTag: 'Organize ortam odaklanmayı kolaylaştırır.',
        baseDurationWeight: 20,
        difficulty: 'kolay' as any,
        dopamine: 20,
        calories: 0
      },
      {
        id: 'egitim-yeni-9',
        title: 'Hedef Belirleme',
        description: 'Bu hafta için 1 küçük akademik hedef belir.',
        scienceTag: 'Hedef belirleme motivasyon ve yönlendirme sağlar.',
        baseDurationWeight: 10,
        difficulty: 'kolay' as any,
        dopamine: 25,
        calories: 0
      },
      {
        id: 'egitim-yeni-10',
        title: 'Ders Notlarını Gözden Geçirme',
        description: 'Son ders notlarını 10 dakika gözden geçir.',
        scienceTag: 'Tekrar nöral yolları güçlendirir.',
        baseDurationWeight: 15,
        difficulty: 'kolay' as any,
        dopamine: 23,
        calories: 0
      },
      {
        id: 'egitim-yeni-11',
        title: 'Soru Sorma Pratiği',
        description: 'Öğrendiğin bir konu hakkında kendine 3 soru sor.',
        scienceTag: 'Kritik düşünme becerilerini geliştirir.',
        baseDurationWeight: 15,
        difficulty: 'kolay' as any,
        dopamine: 24,
        calories: 0
      },
      {
        id: 'egitim-yeni-12',
        title: 'Dinlenme Planı',
        description: 'Çalışma molalarını planla ve mola sırasında ne yapacağını belirle.',
        scienceTag: 'Planlı molalar verimliliği artırır.',
        baseDurationWeight: 10,
        difficulty: 'kolay' as any,
        dopamine: 18,
        calories: 0
      },
    ],
    orta: [
      {
        id: 'egitim-orta-1',
        title: 'Pomodoro Tekniği',
        description: '25 dakika odaklı çalışma, 5 dakika mola formatında 2 seans yap.',
        scienceTag: 'Pomodoro teknikleri zaman yönetimi ve odaklanmayı optimize eder.',
        baseDurationWeight: 30,
        difficulty: 'orta' as any,
        dopamine: 40,
        calories: 0
      },
      {
        id: 'egitim-orta-2',
        title: 'Derin Çalışma Seansı',
        description: 'Telefonu kapat ve 45 dakika kesintisiz çalış.',
        scienceTag: 'Derin çalışma (Deep Work) üretkenliği 2 katına çıkarır.',
        baseDurationWeight: 45,
        difficulty: 'orta' as any,
        dopamine: 45,
        calories: 0
      },
      {
        id: 'egitim-orta-3',
        title: 'Hata Analizi',
        description: 'Yanlış yaptığın 5 soruyu analiz et ve nedenini anla.',
        scienceTag: 'Hata analizi kalıcı öğrenmeyi sağlar.',
        baseDurationWeight: 25,
        difficulty: 'orta' as any,
        dopamine: 38,
        calories: 0
      },
      {
        id: 'egitim-orta-4',
        title: 'Konu Özetleme',
        description: 'Öğrendiğin bir konuyu başkasına anlatır gibi özetle.',
        scienceTag: 'Feynman tekniği anlama derinliğini artırır.',
        baseDurationWeight: 30,
        difficulty: 'orta' as any,
        dopamine: 42,
        calories: 0
      },
      {
        id: 'egitim-orta-5',
        title: 'Zaman Yönetimi Analizi',
        description: 'Geçen haftanın zaman kullanımını analiz et ve verimsiz alanları belirle.',
        scienceTag: 'Zaman farkındalığı verimliliği artırır.',
        baseDurationWeight: 20,
        difficulty: 'orta' as any,
        dopamine: 35,
        calories: 0
      },
      {
        id: 'egitim-orta-6',
        title: 'Aktif Okuma',
        description: 'Bir metni okurken kenara notlar al ve sorular sor.',
        scienceTag: 'Aktif okuma bilgi tutma oranını %30 artırır.',
        baseDurationWeight: 35,
        difficulty: 'orta' as any,
        dopamine: 40,
        calories: 0
      },
      {
        id: 'egitim-orta-7',
        title: 'Çalışma Grubu',
        description: 'Bir arkadaşınla birlikte 30 dakika çalışma seansı yap.',
        scienceTag: 'Sosyal öğrenme motivasyon ve hesap verebilirlik sağlar.',
        baseDurationWeight: 30,
        difficulty: 'orta' as any,
        dopamine: 38,
        calories: 0
      },
      {
        id: 'egitim-orta-8',
        title: 'Mental Harita',
        description: 'Öğrendiğin bir konuyu mental harita şeklinde çiz.',
        scienceTag: 'Görsel organizasyon beynin bilgiyi işlemesini kolaylaştırır.',
        baseDurationWeight: 25,
        difficulty: 'orta' as any,
        dopamine: 36,
        calories: 0
      },
      {
        id: 'egitim-orta-9',
        title: 'Araştırma Projesi',
        description: 'İlgilendiğin bir konuda kısa bir araştırma yap.',
        scienceTag: 'Araştırma becerileri analitik düşünmeyi geliştirir.',
        baseDurationWeight: 40,
        difficulty: 'orta' as any,
        dopamine: 44,
        calories: 0
      },
      {
        id: 'egitim-orta-10',
        title: 'Dijital Detoks',
        description: 'Çalışma süresince sosyal medyadan tamamen uzak dur.',
        scienceTag: 'Dijital dikkat dağıtıcıları ortadan kaldırmak odaklanmayı artırır.',
        baseDurationWeight: 30,
        difficulty: 'orta' as any,
        dopamine: 38,
        calories: 0
      },
      {
        id: 'egitim-orta-11',
        title: 'Sınav Simülasyonu',
        description: 'Zaman kısıtlı altında 10 soru çöz.',
        scienceTag: 'Zaman baskısı altında performans geliştirir.',
        baseDurationWeight: 25,
        difficulty: 'orta' as any,
        dopamine: 42,
        calories: 0
      },
      {
        id: 'egitim-orta-12',
        title: 'Geri Bildirim İsteme',
        description: 'Çalışmanı bir öğretmene veya arkadaşına göster ve geri bildirim al.',
        scienceTag: 'Dış gözlem kör noktaları ortaya çıkarır.',
        baseDurationWeight: 20,
        difficulty: 'orta' as any,
        dopamine: 36,
        calories: 0
      },
    ],
    ileri: [
      {
        id: 'egitim-ileri-1',
        title: 'Uzun Süreli Derin Çalışma',
        description: '90 dakika kesintisiz, telefon kapalı derin çalışma seansı.',
        scienceTag: 'Uzun süreli derin çalışma nöral plastisiteyi maksimize eder.',
        baseDurationWeight: 90,
        difficulty: 'zor' as any,
        dopamine: 65,
        calories: 0
      },
      {
        id: 'egitim-ileri-2',
        title: 'Akademik Makale Okuma',
        description: 'Bir akademik makaleyi oku ve metodolojisini analiz et.',
        scienceTag: 'Akademik okuma analitik düşünme becerilerini geliştirir.',
        baseDurationWeight: 60,
        difficulty: 'zor' as any,
        dopamine: 60,
        calories: 0
      },
      {
        id: 'egitim-ileri-3',
        title: 'Karmaşık Problem Çözme',
        description: 'Çok adımlı bir matematik veya mantık problemi çöz.',
        scienceTag: 'Karmaşık problem çözme üstbilişsel yetenekleri geliştirir.',
        baseDurationWeight: 45,
        difficulty: 'zor' as any,
        dopamine: 58,
        calories: 0
      },
      {
        id: 'egitim-ileri-4',
        title: 'Öğretme Pratiği',
        description: 'Öğrendiğin bir konuyu başkasına öğret.',
        scienceTag: 'Öğretme öğrenmenin en etkili yoludur (Protégé Effect).',
        baseDurationWeight: 50,
        difficulty: 'zor' as any,
        dopamine: 62,
        calories: 0
      },
      {
        id: 'egitim-ileri-5',
        title: 'Araştırma Projesi',
        description: 'Bir konuda derinlemesine araştırma yap ve rapor hazırla.',
        scienceTag: 'Araştırma süreci bilgi sentezleme becerilerini geliştirir.',
        baseDurationWeight: 60,
        difficulty: 'zor' as any,
        dopamine: 64,
        calories: 0
      },
      {
        id: 'egitim-ileri-6',
        title: 'Kritik Analiz',
        description: 'Bir makaleyi veya tezi eleştirel bir gözle analiz et.',
        scienceTag: 'Kritik analiz mantıksal akıl yürütmeyi güçlendirir.',
        baseDurationWeight: 45,
        difficulty: 'zor' as any,
        dopamine: 56,
        calories: 0
      },
      {
        id: 'egitim-ileri-7',
        title: 'Sınav Stratejisi',
        description: 'Gelecek sınav için kapsamlı bir çalışma planı hazırla.',
        scienceTag: 'Stratejik planlama sınav performansını %25 artırır.',
        baseDurationWeight: 40,
        difficulty: 'zor' as any,
        dopamine: 54,
        calories: 0
      },
      {
        id: 'egitim-ileri-8',
        title: 'Bilgi Entegrasyonu',
        description: 'Farklı konulardan öğrendiğin bilgileri birleştir.',
        scienceTag: 'Bilgi entegrasyonu yaratıcı düşünmeyi teşvik eder.',
        baseDurationWeight: 50,
        difficulty: 'zor' as any,
        dopamine: 58,
        calories: 0
      },
      {
        id: 'egitim-ileri-9',
        title: 'Zorlu Sınav Simülasyonu',
        description: 'Gerçek sınav koşullarında tam sınav simülasyonu yap.',
        scienceTag: 'Simülasyon sınav anksiyetesini azaltır.',
        baseDurationWeight: 90,
        difficulty: 'epic' as any,
        dopamine: 70,
        calories: 0
      },
      {
        id: 'egitim-ileri-10',
        title: 'Akademik Sunum',
        description: 'Bir konuda akademik bir sunum hazırla.',
        scienceTag: 'Sunum hazırlama iletişim ve organizasyon becerilerini geliştirir.',
        baseDurationWeight: 60,
        difficulty: 'epic' as any,
        dopamine: 68,
        calories: 0
      },
      {
        id: 'egitim-ileri-11',
        title: 'Derinlemesine Araştırma',
        description: 'Bir konuda literatür taraması yap ve kaynakları analiz et.',
        scienceTag: 'Literatür taraması akademik titizliği geliştirir.',
        baseDurationWeight: 75,
        difficulty: 'epic' as any,
        dopamine: 72,
        calories: 0
      },
      {
        id: 'egitim-ileri-12',
        title: 'Yaratıcı Problem Çözme',
        description: 'Standart olmayan yollarla bir problem çöz.',
        scienceTag: 'Yaratıcı problem çözme nöral esnekliği artırır.',
        baseDurationWeight: 60,
        difficulty: 'epic' as any,
        dopamine: 75,
        calories: 0
      },
    ],
  },
  'dil': {
    yeni: [
      {
        id: 'dil-yeni-1',
        title: 'Kelime Kartları',
        description: '5 yeni kelime öğren ve anlamını ezberle.',
        scienceTag: 'Kelime öğrenimi hafıza palastisitesini tetikler.',
        baseDurationWeight: 15,
        difficulty: 'kolay' as any,
        dopamine: 20,
        calories: 0
      },
      {
        id: 'dil-yeni-2',
        title: 'Kısa Dinleme',
        description: '5 dakikalık bir dil öğrenme videosu dinle.',
        scienceTag: 'Dinleme egzersizi işitsel işlemeyi geliştirir.',
        baseDurationWeight: 10,
        difficulty: 'kolay' as any,
        dopamine: 18,
        calories: 0
      },
      {
        id: 'dil-yeni-3',
        title: 'Basit Cümle Yazma',
        description: 'Öğrendiğin kelimelerle 3 basit cümle yaz.',
        scienceTag: 'Cümle yapısı gramer becerilerini pekiştirir.',
        baseDurationWeight: 15,
        difficulty: 'kolay' as any,
        dopamine: 22,
        calories: 0
      },
      {
        id: 'dil-yeni-4',
        title: 'Telaffuz Pratiği',
        description: '5 kelimenin telaffuzunu tekrar et.',
        scienceTag: 'Telaffuz pratiği motor korteksi aktive eder.',
        baseDurationWeight: 10,
        difficulty: 'kolay' as any,
        dopamine: 19,
        calories: 0
      },
      {
        id: 'dil-yeni-5',
        title: 'Dil Uygulaması',
        description: 'Dil öğrenme uygulamasında 1 seviye tamamla.',
        scienceTag: 'Gamified öğrenme dopamin salınımını artırır.',
        baseDurationWeight: 15,
        difficulty: 'kolay' as any,
        dopamine: 25,
        calories: 0
      },
      {
        id: 'dil-yeni-6',
        title: 'Şarkı Dinleme',
        description: 'Hedef dilinde bir şarkı dinle ve kelimeleri yakalamaya çalış.',
        scienceTag: 'Müzik dil öğreniminde hafıza tutmayı artırır.',
        baseDurationWeight: 10,
        difficulty: 'kolay' as any,
        dopamine: 21,
        calories: 0
      },
      {
        id: 'dil-yeni-7',
        title: 'Kelimeleri Tekrar Et',
        description: 'Dün öğrendiğin kelimeleri tekrar et.',
        scienceTag: 'Spaced repetition uzun süreli hafızayı güçlendirir.',
        baseDurationWeight: 10,
        difficulty: 'kolay' as any,
        dopamine: 18,
        calories: 0
      },
      {
        id: 'dil-yeni-8',
        title: 'Altyazılı İzleme',
        description: 'Hedef dilinde altyazılı bir video izle.',
        scienceTag: 'Görsel-işitsel öğrenme çoklu modaliteyi aktive eder.',
        baseDurationWeight: 20,
        difficulty: 'kolay' as any,
        dopamine: 24,
        calories: 0
      },
      {
        id: 'dil-yeni-9',
        title: 'Kendi Kendine Konuşma',
        description: 'Hedef dilinde kendine 5 cümle söyle.',
        scienceTag: 'Kendi kendine konuşma konuşma özgüvenini artırır.',
        baseDurationWeight: 10,
        difficulty: 'kolay' as any,
        dopamine: 20,
        calories: 0
      },
      {
        id: 'dil-yeni-10',
        title: 'Günlük Kelime Hedefi',
        description: 'Bugün 1 yeni kelime öğren.',
        scienceTag: 'Küçük adımlar tutarlılığı sağlar.',
        baseDurationWeight: 5,
        difficulty: 'kolay' as any,
        dopamine: 15,
        calories: 0
      },
      {
        id: 'dil-yeni-11',
        title: 'Dil Podcast',
        description: 'Hedef dilinde kısa bir podcast dinle.',
        scienceTag: 'Podcast doğal dil akışına maruz kalma sağlar.',
        baseDurationWeight: 15,
        difficulty: 'kolay' as any,
        dopamine: 22,
        calories: 0
      },
      {
        id: 'dil-yeni-12',
        title: 'Kelime Oyunu',
        description: 'Dil öğrenme oyununda 5 dakika oyna.',
        scienceTag: 'Oyunlaştırma öğrenme motivasyonunu artırır.',
        baseDurationWeight: 10,
        difficulty: 'kolay' as any,
        dopamine: 23,
        calories: 0
      },
    ],
    orta: [
      {
        id: 'dil-orta-1',
        title: 'Konuşma Pratiği',
        description: 'Hedef dilinde 10 dakika konuşma pratiği yap.',
        scienceTag: 'Konuşma pratiği dil üretim becerilerini geliştirir.',
        baseDurationWeight: 30,
        difficulty: 'orta' as any,
        dopamine: 40,
        calories: 0
      },
      {
        id: 'dil-orta-2',
        title: 'Okuma Parçası',
        description: 'Hedef dilinde kısa bir metin oku ve anla.',
        scienceTag: 'Okuma pratiği kelime hazinesini genişletir.',
        baseDurationWeight: 25,
        difficulty: 'orta' as any,
        dopamine: 38,
        calories: 0
      },
      {
        id: 'dil-orta-3',
        title: 'Dinleme Egzersizi',
        description: '15 dakikalık bir dil öğrenme videosu dinle.',
        scienceTag: 'Dinleme becerisi işitsel işlemeyi güçlendirir.',
        baseDurationWeight: 20,
        difficulty: 'orta' as any,
        dopamine: 36,
        calories: 0
      },
      {
        id: 'dil-orta-4',
        title: 'Yazma Pratiği',
        description: 'Hedef dilinde 100 kelimelik bir paragraf yaz.',
        scienceTag: 'Yazma pratiği gramer ve kelime kullanımını pekiştirir.',
        baseDurationWeight: 30,
        difficulty: 'orta' as any,
        dopamine: 42,
        calories: 0
      },
      {
        id: 'dil-orta-5',
        title: 'Kelime Ezberi',
        description: '20 yeni kelime öğren ve anlamını ezberle.',
        scienceTag: 'Kelime ezberi hafıza kapasitesini artırır.',
        baseDurationWeight: 25,
        difficulty: 'orta' as any,
        dopamine: 38,
        calories: 0
      },
      {
        id: 'dil-orta-6',
        title: 'Dil Değişimi',
        description: 'Hedef dilini konuşan biriyle 5 dakika konuş.',
        scienceTag: 'Gerçek iletişim dil akışını hızlandırır.',
        baseDurationWeight: 20,
        difficulty: 'orta' as any,
        dopamine: 45,
        calories: 0
      },
      {
        id: 'dil-orta-7',
        title: 'Gramer Çalışması',
        description: 'Zorlandığın bir gramer kuralını çalış.',
        scienceTag: 'Gramer çalışması dil yapısını anlama sağlar.',
        baseDurationWeight: 25,
        difficulty: 'orta' as any,
        dopamine: 36,
        calories: 0
      },
      {
        id: 'dil-orta-8',
        title: 'Film İzleme',
        description: 'Hedef dilinde altyazılı bir film izle.',
        scienceTag: 'Film izleme doğal dil kullanımına maruz kalma sağlar.',
        baseDurationWeight: 45,
        difficulty: 'orta' as any,
        dopamine: 44,
        calories: 0
      },
      {
        id: 'dil-orta-9',
        title: 'Ses Kaydı',
        description: 'Kendi sesini kaydet ve dinleyerek hatalarını tespit et.',
        scienceTag: 'Ses kaydı telaffuz düzeltmesinde etkilidir.',
        baseDurationWeight: 15,
        difficulty: 'orta' as any,
        dopamine: 38,
        calories: 0
      },
      {
        id: 'dil-orta-10',
        title: 'Hikaye Okuma',
        description: 'Hedef dilinde kısa bir hikaye oku.',
        scienceTag: 'Hikaye okuma bağlam anlama becerisini geliştirir.',
        baseDurationWeight: 30,
        difficulty: 'orta' as any,
        dopamine: 40,
        calories: 0
      },
      {
        id: 'dil-orta-11',
        title: 'Kelime Listesi',
        description: 'Öğrendiğin kelimeleri kategorize ederek liste yap.',
        scienceTag: 'Kelime organizasyonu hafıza geri çağırmayı kolaylaştırır.',
        baseDurationWeight: 20,
        difficulty: 'orta' as any,
        dopamine: 34,
        calories: 0
      },
      {
        id: 'dil-orta-12',
        title: 'Dil Oyunu',
        description: 'Dil öğrenme oyununda 15 dakika oyna.',
        scienceTag: 'Oyunlaştırma öğrenme sürecini eğlenceli hale getirir.',
        baseDurationWeight: 20,
        difficulty: 'orta' as any,
        dopamine: 37,
        calories: 0
      },
    ],
    ileri: [
      {
        id: 'dil-ileri-1',
        title: 'Uzun Konuşma',
        description: 'Hedef dilinde 20 dakika kesintisiz konuş.',
        scienceTag: 'Uzun konuşma akıcılığı ve akışı geliştirir.',
        baseDurationWeight: 45,
        difficulty: 'zor' as any,
        dopamine: 55,
        calories: 0
      },
      {
        id: 'dil-ileri-2',
        title: 'Makale Okuma',
        description: 'Hedef dilinde bir makale oku ve analiz et.',
        scienceTag: 'Akademik okuma üst seviye kelime hazinesi sağlar.',
        baseDurationWeight: 40,
        difficulty: 'zor' as any,
        dopamine: 52,
        calories: 0
      },
      {
        id: 'dil-ileri-3',
        title: 'Yazma Projesi',
        description: 'Hedef dilinde 300 kelimelik bir yazı yaz.',
        scienceTag: 'Uzun yazma gramer ve kelime kullanımını pekiştirir.',
        baseDurationWeight: 50,
        difficulty: 'zor' as any,
        dopamine: 58,
        calories: 0
      },
      {
        id: 'dil-ileri-4',
        title: 'Sözlü Sunum',
        description: 'Hedef dilinde 5 dakikalık bir sunum hazırla ve yap.',
        scienceTag: 'Sunum pratiği konuşma özgüvenini artırır.',
        baseDurationWeight: 45,
        difficulty: 'zor' as any,
        dopamine: 60,
        calories: 0
      },
      {
        id: 'dil-ileri-5',
        title: 'Debate Pratiği',
        description: 'Hedef dilinde bir konu hakkında tartış.',
        scienceTag: 'Debate eleştirel düşünme ve hızlı yanıt becerilerini geliştirir.',
        baseDurationWeight: 40,
        difficulty: 'zor' as any,
        dopamine: 56,
        calories: 0
      },
      {
        id: 'dil-ileri-6',
        title: 'Kitap Okuma',
        description: 'Hedef dilinde bir kitap bölümü oku.',
        scienceTag: 'Kitap okuma derin okuma becerilerini geliştirir.',
        baseDurationWeight: 60,
        difficulty: 'zor' as any,
        dopamine: 54,
        calories: 0
      },
      {
        id: 'dil-ileri-7',
        title: 'Sözlü Çeviri',
        description: 'Anadilinden hedef dile sözlü çeviri yap.',
        scienceTag: 'Sözlü çeviri dil işleme hızını artırır.',
        baseDurationWeight: 35,
        difficulty: 'zor' as any,
        dopamine: 50,
        calories: 0
      },
      {
        id: 'dil-ileri-8',
        title: 'Podcast Yapma',
        description: 'Hedef dilinde kısa bir podcast kaydı yap.',
        scienceTag: 'Podcast yapma konuşma ve içerik üretme becerilerini geliştirir.',
        baseDurationWeight: 45,
        difficulty: 'zor' as any,
        dopamine: 58,
        calories: 0
      },
      {
        id: 'dil-ileri-9',
        title: 'Tam Film İzleme',
        description: 'Hedef dilinde altyazısız bir film izle.',
        scienceTag: 'Altyazısız izleme doğal dil anlama becerisini zorlar.',
        baseDurationWeight: 90,
        difficulty: 'epic' as any,
        dopamine: 70,
        calories: 0
      },
      {
        id: 'dil-ileri-10',
        title: 'Yaratıcı Yazma',
        description: 'Hedef dilinde kısa bir hikaye yaz.',
        scienceTag: 'Yaratıcı yazma kelime kullanımını genişletir.',
        baseDurationWeight: 60,
        difficulty: 'epic' as any,
        dopamine: 68,
        calories: 0
      },
      {
        id: 'dil-ileri-11',
        title: 'Sözlü Görüşme',
        description: 'Hedef dilini konuşan biriyle 15 dakika görüş.',
        scienceTag: 'Gerçek görüşme pratik dil kullanımını sağlar.',
        baseDurationWeight: 30,
        difficulty: 'epic' as any,
        dopamine: 72,
        calories: 0
      },
      {
        id: 'dil-ileri-12',
        title: 'Dil İmmersion',
        description: '1 saat boyunca sadece hedef dil kullan.',
        scienceTag: 'Tam immersion dil öğrenimini hızlandırır.',
        baseDurationWeight: 60,
        difficulty: 'epic' as any,
        dopamine: 75,
        calories: 0
      },
    ],
  },
  'kisisel-gelisim': {
    yeni: [
      {
        id: 'kisisel-gelisim-yeni-1',
        title: 'Günlük Şükür',
        description: 'Günün sonunda seni mutlu eden 3 şeyi düşün ve şükret.',
        scienceTag: 'Minnettarlık dopamin seviyesini dengeler.',
        baseDurationWeight: 15,
        difficulty: 'kolay' as any,
        dopamine: 20,
        calories: 0
      },
      {
        id: 'kisisel-gelisim-yeni-2',
        title: 'Derin Nefes',
        description: '5 dakika boyunca derin nefes egzersizi yap.',
        scienceTag: 'Derin nefes parasempatik sinir sistemini aktive eder.',
        baseDurationWeight: 10,
        difficulty: 'kolay' as any,
        dopamine: 18,
        calories: 0
      },
      {
        id: 'kisisel-gelisim-yeni-3',
        title: 'Kısa Meditasyon',
        description: '5 dakikalık mindfulness meditasyonu yap.',
        scienceTag: 'Meditasyon kortikal kalınlığı artırır.',
        baseDurationWeight: 10,
        difficulty: 'kolay' as any,
        dopamine: 22,
        calories: 0
      },
      {
        id: 'kisisel-gelisim-yeni-4',
        title: 'Hedef Yazma',
        description: 'Bu hafta için 1 küçük hedef belir ve yaz.',
        scienceTag: 'Hedef belirleme motivasyon ve yönlendirme sağlar.',
        baseDurationWeight: 10,
        difficulty: 'kolay' as any,
        dopamine: 24,
        calories: 0
      },
      {
        id: 'kisisel-gelisim-yeni-5',
        title: 'Pozitif Onaylama',
        description: 'Kendine 3 pozitif onaylama cümlesi söyle.',
        scienceTag: 'Pozitif onaylama özgüveni artırır.',
        baseDurationWeight: 5,
        difficulty: 'kolay' as any,
        dopamine: 19,
        calories: 0
      },
      {
        id: 'kisisel-gelisim-yeni-6',
        title: 'Düzenleme',
        description: 'Çalışma alanını 10 dakika düzenle.',
        scienceTag: 'Organize ortam stresi azaltır.',
        baseDurationWeight: 15,
        difficulty: 'kolay' as any,
        dopamine: 20,
        calories: 0
      },
      {
        id: 'kisisel-gelisim-yeni-7',
        title: 'Kendiyle Konuşma',
        description: 'Kendine nazikçe konuş ve motive et.',
        scienceTag: 'Pozitif iç konuşma öz şefkatini geliştirir.',
        baseDurationWeight: 5,
        difficulty: 'kolay' as any,
        dopamine: 18,
        calories: 0
      },
      {
        id: 'kisisel-gelisim-yeni-8',
        title: 'Su İçme',
        description: 'Bugün 2 litre su iç.',
        scienceTag: 'Hidrasyon bilişsel performansı artırır.',
        baseDurationWeight: 0,
        difficulty: 'kolay' as any,
        dopamine: 15,
        calories: 0
      },
      {
        id: 'kisisel-gelisim-yeni-9',
        title: 'Yürüyüş',
        description: '10 dakika yürüyüş yap.',
        scienceTag: 'Yürüyüş endorfin salınımını tetikler.',
        baseDurationWeight: 15,
        difficulty: 'kolay' as any,
        dopamine: 25,
        calories: 50
      },
      {
        id: 'kisisel-gelisim-yeni-10',
        title: 'Dijital Detoks',
        description: '1 saat boyunca telefon kullanma.',
        scienceTag: 'Dijital detoks anksiyeteyi azaltır.',
        baseDurationWeight: 60,
        difficulty: 'kolay' as any,
        dopamine: 22,
        calories: 0
      },
      {
        id: 'kisisel-gelisim-yeni-11',
        title: 'Gülme',
        description: 'Komik bir video izle veya bir arkadaşınla konuş.',
        scienceTag: 'Gülme stres hormonlarını azaltır.',
        baseDurationWeight: 10,
        difficulty: 'kolay' as any,
        dopamine: 28,
        calories: 0
      },
      {
        id: 'kisisel-gelisim-yeni-12',
        title: 'Uyku Planı',
        description: 'Yarın için uyku planı yap.',
        scienceTag: 'Uyku planı uyku kalitesini artırır.',
        baseDurationWeight: 5,
        difficulty: 'kolay' as any,
        dopamine: 16,
        calories: 0
      },
    ],
    orta: [
      {
        id: 'kisisel-gelisim-orta-1',
        title: 'Günlük Yazma',
        description: 'Günün hislerini ve düşüncelerini 10 dakika yaz.',
        scienceTag: 'Günlük yazma duygusal düzenlemeyi sağlar.',
        baseDurationWeight: 15,
        difficulty: 'orta' as any,
        dopamine: 35,
        calories: 0
      },
      {
        id: 'kisisel-gelisim-orta-2',
        title: 'Uzun Meditasyon',
        description: '15 dakikalık mindfulness meditasyonu yap.',
        scienceTag: 'Uzun meditasyon dikkat süresini uzatır.',
        baseDurationWeight: 20,
        difficulty: 'orta' as any,
        dopamine: 38,
        calories: 0
      },
      {
        id: 'kisisel-gelisim-orta-3',
        title: 'Kendini Analiz Et',
        description: 'Son haftayı analiz et ve gelişim alanlarını belirle.',
        scienceTag: 'Öz farkındalık kişisel gelişimin temelidir.',
        baseDurationWeight: 20,
        difficulty: 'orta' as any,
        dopamine: 36,
        calories: 0
      },
      {
        id: 'kisisel-gelisim-orta-4',
        title: 'Hedef Planlama',
        description: 'Bu ay için 3 hedef belir ve plan yap.',
        scienceTag: 'Hedef planlama motivasyonu sürdürür.',
        baseDurationWeight: 25,
        difficulty: 'orta' as any,
        dopamine: 40,
        calories: 0
      },
      {
        id: 'kisisel-gelisim-orta-5',
        title: 'Stres Yönetimi',
        description: 'Stres yönetimi tekniği öğren ve uygula.',
        scienceTag: 'Stres yönetimi kortizol seviyelerini düşürür.',
        baseDurationWeight: 20,
        difficulty: 'orta' as any,
        dopamine: 34,
        calories: 0
      },
      {
        id: 'kisisel-gelisim-orta-6',
        title: 'Sosyal Bağlantı',
        description: 'Bir arkadaşınla derinlemesine konuş.',
        scienceTag: 'Sosyal bağlantı oksitosin salınımını tetikler.',
        baseDurationWeight: 30,
        difficulty: 'orta' as any,
        dopamine: 42,
        calories: 0
      },
      {
        id: 'kisisel-gelisim-orta-7',
        title: 'Egzersiz',
        description: '20 dakika egzersiz yap.',
        scienceTag: 'Egzersiz endorfin ve dopamin salınımını artırır.',
        baseDurationWeight: 25,
        difficulty: 'orta' as any,
        dopamine: 45,
        calories: 150
      },
      {
        id: 'kisisel-gelisim-orta-8',
        title: 'Kitap Okuma',
        description: 'Kişisel gelişim kitabından 15 dakika oku.',
        scienceTag: 'Kitap okuma bilişsel esnekliği geliştirir.',
        baseDurationWeight: 20,
        difficulty: 'orta' as any,
        dopamine: 36,
        calories: 0
      },
      {
        id: 'kisisel-gelisim-orta-9',
        title: 'Dijital Minimalizm',
        description: 'Sosyal medya kullanımını 30 dakika ile sınırla.',
        scienceTag: 'Dijital minimalizm odaklanmayı artırır.',
        baseDurationWeight: 30,
        difficulty: 'orta' as any,
        dopamine: 32,
        calories: 0
      },
      {
        id: 'kisisel-gelisim-orta-10',
        title: 'Kendine Zaman',
        description: '30 dakika boyunca sadece kendine zaman ayır.',
        scienceTag: 'Kendine zaman ayırmak mental sağlığı destekler.',
        baseDurationWeight: 30,
        difficulty: 'orta' as any,
        dopamine: 38,
        calories: 0
      },
      {
        id: 'kisisel-gelisim-orta-11',
        title: 'Olumlu Alışkanlık',
        description: 'Yeni bir olumlu alışkanlık başlat.',
        scienceTag: 'Alışkanlık oluşumu nöral yolları güçlendirir.',
        baseDurationWeight: 15,
        difficulty: 'orta' as any,
        dopamine: 34,
        calories: 0
      },
      {
        id: 'kisisel-gelisim-orta-12',
        title: 'Rahatlama Tekniği',
        description: 'PMR (Progressive Muscle Relaxation) tekniği uygula.',
        scienceTag: 'PMR kas gerginliğini azaltır.',
        baseDurationWeight: 15,
        difficulty: 'orta' as any,
        dopamine: 30,
        calories: 0
      },
    ],
    ileri: [
      {
        id: 'kisisel-gelisim-ileri-1',
        title: 'Derin Meditasyon',
        description: '30 dakikalık mindfulness meditasyonu yap.',
        scienceTag: 'Derin meditasyon nöral plastisiteyi artırır.',
        baseDurationWeight: 45,
        difficulty: 'zor' as any,
        dopamine: 55,
        calories: 0
      },
      {
        id: 'kisisel-gelisim-ileri-2',
        title: 'Günlük Analizi',
        description: 'Son ayı analiz et ve detaylı değerlendirme yap.',
        scienceTag: 'Derin analiz kişisel farkındalığı maksimize eder.',
        baseDurationWeight: 40,
        difficulty: 'zor' as any,
        dopamine: 52,
        calories: 0
      },
      {
        id: 'kisisel-gelisim-ileri-3',
        title: 'Uzun Vadeli Hedef',
        description: '1 yıllık hedef belir ve detaylı plan yap.',
        scienceTag: 'Uzun vadeli hedefler yön ve amaç sağlar.',
        baseDurationWeight: 45,
        difficulty: 'zor' as any,
        dopamine: 58,
        calories: 0
      },
      {
        id: 'kisisel-gelisim-ileri-4',
        title: 'Stres Yönetimi Master',
        description: 'Gelişmiş stres yönetimi tekniklerini öğren ve uygula.',
        scienceTag: 'İleri seviye stres yönetimi kortizolü optimize eder.',
        baseDurationWeight: 35,
        difficulty: 'zor' as any,
        dopamine: 50,
        calories: 0
      },
      {
        id: 'kisisel-gelisim-ileri-5',
        title: 'Sosyal Gelişim',
        description: 'Sosyal becerilerini geliştirmek için pratik yap.',
        scienceTag: 'Sosyal beceri gelişimi ilişki kalitesini artırır.',
        baseDurationWeight: 40,
        difficulty: 'zor' as any,
        dopamine: 54,
        calories: 0
      },
      {
        id: 'kisisel-gelisim-ileri-6',
        title: 'Yoğun Egzersiz',
        description: '45 dakika yoğun egzersiz yap.',
        scienceTag: 'Yoğun egzersiz BDNF salınımını tetikler.',
        baseDurationWeight: 50,
        difficulty: 'zor' as any,
        dopamine: 60,
        calories: 300
      },
      {
        id: 'kisisel-gelisim-ileri-7',
        title: 'Derin Okuma',
        description: 'Kişisel gelişim kitabından 30 dakika derin okuma.',
        scienceTag: 'Derin okuma bilişsel derinliği artırır.',
        baseDurationWeight: 35,
        difficulty: 'zor' as any,
        dopamine: 48,
        calories: 0
      },
      {
        id: 'kisisel-gelisim-ileri-8',
        title: 'Dijital Detoks Haftası',
        description: '1 hafta boyunca sosyal medyadan uzak dur.',
        scienceTag: 'Uzun dijital detoks dopamin reseptörlerini resetler.',
        baseDurationWeight: 0,
        difficulty: 'zor' as any,
        dopamine: 65,
        calories: 0
      },
      {
        id: 'kisisel-gelisim-ileri-9',
        title: 'Retreat',
        description: '1 günlük kişisel retreat planla ve uygula.',
        scienceTag: 'Retreat mental yenilenmeyi hızlandırır.',
        baseDurationWeight: 60,
        difficulty: 'epic' as any,
        dopamine: 70,
        calories: 0
      },
      {
        id: 'kisisel-gelisim-ileri-10',
        title: 'Alışkanlık Sistemi',
        description: 'Kapsamlı bir alışkanlık sistemi oluştur.',
        scienceTag: 'Sistemik yaklaşım tutarlılığı sağlar.',
        baseDurationWeight: 45,
        difficulty: 'epic' as any,
        dopamine: 68,
        calories: 0
      },
      {
        id: 'kisisel-gelisim-ileri-11',
        title: 'Koçluk',
        description: 'Bir koç ile çalışma seansı yap.',
        scienceTag: 'Profesyonel koçluk gelişimi hızlandırır.',
        baseDurationWeight: 60,
        difficulty: 'epic' as any,
        dopamine: 72,
        calories: 0
      },
      {
        id: 'kisisel-gelisim-ileri-12',
        title: 'Kendini Yenileme',
        description: 'Kapsamlı bir kendini yenileme programı uygula.',
        scienceTag: 'Kendini yenileme nöral reset sağlar.',
        baseDurationWeight: 90,
        difficulty: 'epic' as any,
        dopamine: 75,
        calories: 0
      },
    ],
  },
  'lookmaxing': {
    yeni: [
      {
        id: 'lookmaxing-yeni-1',
        title: 'Cilt Temizliği',
        description: 'Sabah ve akşam yüzünü yıka.',
        scienceTag: 'Düzenli cilt temizliği akne oluşumunu azaltır.',
        baseDurationWeight: 10,
        difficulty: 'kolay' as any,
        dopamine: 18,
        calories: 0
      },
      {
        id: 'lookmaxing-yeni-2',
        title: 'Su İçme',
        description: 'Bugün 2 litre su iç.',
        scienceTag: 'Hidrasyon cilt elastikiyetini artırır.',
        baseDurationWeight: 0,
        difficulty: 'kolay' as any,
        dopamine: 15,
        calories: 0
      },
      {
        id: 'lookmaxing-yeni-3',
        title: 'Güneş Kremi',
        description: 'Güneş kremi sür.',
        scienceTag: 'Güneş kremi cilt yaşlanmasını yavaşlatır.',
        baseDurationWeight: 5,
        difficulty: 'kolay' as any,
        dopamine: 16,
        calories: 0
      },
      {
        id: 'lookmaxing-yeni-4',
        title: 'Diş Fırçalama',
        description: 'Sabah ve akşam dişlerini fırçala.',
        scienceTag: 'Düzenli diş fırçalama ağız sağlığını korur.',
        baseDurationWeight: 10,
        difficulty: 'kolay' as any,
        dopamine: 17,
        calories: 0
      },
      {
        id: 'lookmaxing-yeni-5',
        title: 'Saç Yıkama',
        description: 'Saçlarını yıka ve şekillendir.',
        scienceTag: 'Temiz saç görünümü iyileştirir.',
        baseDurationWeight: 20,
        difficulty: 'kolay' as any,
        dopamine: 20,
        calories: 0
      },
      {
        id: 'lookmaxing-yeni-6',
        title: 'Tırnak Bakımı',
        description: 'Tırnaklarını kes ve temizle.',
        scienceTag: 'Tırnak bakımı hijyeni sağlar.',
        baseDurationWeight: 10,
        difficulty: 'kolay' as any,
        dopamine: 16,
        calories: 0
      },
      {
        id: 'lookmaxing-yeni-7',
        title: 'Düz Duruş',
        description: 'Düz duruş pratiği yap.',
        scienceTag: 'İyi duruş görünümü ve özgüveni artırır.',
        baseDurationWeight: 5,
        difficulty: 'kolay' as any,
        dopamine: 18,
        calories: 0
      },
      {
        id: 'lookmaxing-yeni-8',
        title: 'Göz Kremi',
        description: 'Göz kremi sür.',
        scienceTag: 'Göz kremi göz altı morluklarını azaltır.',
        baseDurationWeight: 5,
        difficulty: 'kolay' as any,
        dopamine: 17,
        calories: 0
      },
      {
        id: 'lookmaxing-yeni-9',
        title: 'Nemlendirici',
        description: 'Yüzüne nemlendirici sür.',
        scienceTag: 'Nemlendirici cilt bariyerini güçlendirir.',
        baseDurationWeight: 5,
        difficulty: 'kolay' as any,
        dopamine: 16,
        calories: 0
      },
      {
        id: 'lookmaxing-yeni-10',
        title: 'Saç Şekillendirme',
        description: 'Saçını şekillendir.',
        scienceTag: 'Şekilli saç görünümü iyileştirir.',
        baseDurationWeight: 10,
        difficulty: 'kolay' as any,
        dopamine: 19,
        calories: 0
      },
      {
        id: 'lookmaxing-yeni-11',
        title: 'Ağız Bakımı',
        description: 'Ağız gargarası yap.',
        scienceTag: 'Ağız bakımı nefes tazelemesini sağlar.',
        baseDurationWeight: 5,
        difficulty: 'kolay' as any,
        dopamine: 15,
        calories: 0
      },
      {
        id: 'lookmaxing-yeni-12',
        title: 'Yüz Masajı',
        description: 'Yüzüne kısa masaj yap.',
        scienceTag: 'Yüz masajı kan dolaşımını artırır.',
        baseDurationWeight: 10,
        difficulty: 'kolay' as any,
        dopamine: 20,
        calories: 0
      },
    ],
    orta: [
      {
        id: 'lookmaxing-orta-1',
        title: 'Cilt Bakım Rutini',
        description: '3 adımlı cilt bakım rutini uygula (temizleme, tonik, nemlendirici).',
        scienceTag: 'Kapsamlı cilt bakımı cilt sağlığını optimize eder.',
        baseDurationWeight: 20,
        difficulty: 'orta' as any,
        dopamine: 35,
        calories: 0
      },
      {
        id: 'lookmaxing-orta-2',
        title: 'Egzersiz',
        description: '20 dakika egzersiz yap.',
        scienceTag: 'Egzersiz cilt kan dolaşımını artırır.',
        baseDurationWeight: 25,
        difficulty: 'orta' as any,
        dopamine: 40,
        calories: 150
      },
      {
        id: 'lookmaxing-orta-3',
        title: 'Saç Maskesi',
        description: 'Saç maskesi uygula.',
        scienceTag: 'Saç maskesi saç kalitesini iyileştirir.',
        baseDurationWeight: 30,
        difficulty: 'orta' as any,
        dopamine: 32,
        calories: 0
      },
      {
        id: 'lookmaxing-orta-4',
        title: 'Yüz Maskesi',
        description: 'Yüz maskesi uygula.',
        scienceTag: 'Yüz maskesi cilt beslemesini sağlar.',
        baseDurationWeight: 20,
        difficulty: 'orta' as any,
        dopamine: 34,
        calories: 0
      },
      {
        id: 'lookmaxing-orta-5',
        title: 'Diş Beyazlatma',
        description: 'Diş beyazlatma ürünü kullan.',
        scienceTag: 'Diş beyazlatma gülüş estetiğini iyileştirir.',
        baseDurationWeight: 15,
        difficulty: 'orta' as any,
        dopamine: 30,
        calories: 0
      },
      {
        id: 'lookmaxing-orta-6',
        title: 'Duruş Egzersizi',
        description: '15 dakika duruş egzersizi yap.',
        scienceTag: 'Duruş egzersizi vücut hizalamasını düzeltir.',
        baseDurationWeight: 20,
        difficulty: 'orta' as any,
        dopamine: 32,
        calories: 0
      },
      {
        id: 'lookmaxing-orta-7',
        title: 'Göz Bakımı',
        description: 'Göz bakım rutini uygula.',
        scienceTag: 'Göz bakımı göz sağlığını korur.',
        baseDurationWeight: 15,
        difficulty: 'orta' as any,
        dopamine: 28,
        calories: 0
      },
      {
        id: 'lookmaxing-orta-8',
        title: 'Vücut Losyonu',
        description: 'Vücut losyonu sür.',
        scienceTag: 'Vücut losyonu cilt nemini korur.',
        baseDurationWeight: 10,
        difficulty: 'orta' as any,
        dopamine: 26,
        calories: 0
      },
      {
        id: 'lookmaxing-orta-9',
        title: 'Saç Kesimi',
        description: 'Saçını kestir veya şekillendir.',
        scienceTag: 'Düzenli saç kesimi görünümü taze tutar.',
        baseDurationWeight: 30,
        difficulty: 'orta' as any,
        dopamine: 36,
        calories: 0
      },
      {
        id: 'lookmaxing-orta-10',
        title: 'Peeling',
        description: 'Yüz peelingi uygula.',
        scienceTag: 'Peeling ölü hücreleri temizler.',
        baseDurationWeight: 15,
        difficulty: 'orta' as any,
        dopamine: 30,
        calories: 0
      },
      {
        id: 'lookmaxing-orta-11',
        title: 'Tırnak Bakımı',
        description: 'Manikür yap.',
        scienceTag: 'Manikür el estetiğini iyileştirir.',
        baseDurationWeight: 25,
        difficulty: 'orta' as any,
        dopamine: 32,
        calories: 0
      },
      {
        id: 'lookmaxing-orta-12',
        title: 'Güneş Kremi',
        description: 'Günde 2 kez güneş kremi sür.',
        scienceTag: 'Düzenli güneş kremi kullanımı koruma sağlar.',
        baseDurationWeight: 10,
        difficulty: 'orta' as any,
        dopamine: 28,
        calories: 0
      },
    ],
    ileri: [
      {
        id: 'lookmaxing-ileri-1',
        title: 'Profesyonel Cilt Bakımı',
        description: 'Profesyonel cilt bakımı randevusu al veya evde kapsamlı bakım yap.',
        scienceTag: 'Profesyonel bakım cilt sağlığını maksimize eder.',
        baseDurationWeight: 60,
        difficulty: 'zor' as any,
        dopamine: 55,
        calories: 0
      },
      {
        id: 'lookmaxing-ileri-2',
        title: 'Yoğun Egzersiz',
        description: '45 dakika yoğun egzersiz yap.',
        scienceTag: 'Yoğun egzersiz vücut kompozisyonunu iyileştirir.',
        baseDurationWeight: 50,
        difficulty: 'zor' as any,
        dopamine: 60,
        calories: 300
      },
      {
        id: 'lookmaxing-ileri-3',
        title: 'Saç Tedavisi',
        description: 'Saç tedavisi veya kapsamlı saç bakımı uygula.',
        scienceTag: 'Saç tedavisi saç kalitesini restore eder.',
        baseDurationWeight: 45,
        difficulty: 'zor' as any,
        dopamine: 50,
        calories: 0
      },
      {
        id: 'lookmaxing-ileri-4',
        title: 'Diş Tedavisi',
        description: 'Diş tedavisi veya profesyonel temizlik randevusu al.',
        scienceTag: 'Profesyonel diş bakımı ağız sağlığını optimize eder.',
        baseDurationWeight: 60,
        difficulty: 'zor' as any,
        dopamine: 52,
        calories: 0
      },
      {
        id: 'lookmaxing-ileri-5',
        title: 'Vücut Şekillendirme',
        description: 'Vücut şekillendirme egzersizleri yap.',
        scienceTag: 'Vücut şekillendirme kas tonusunu artırır.',
        baseDurationWeight: 40,
        difficulty: 'zor' as any,
        dopamine: 54,
        calories: 200
      },
      {
        id: 'lookmaxing-ileri-6',
        title: 'Güzellik Uzmanı',
        description: 'Güzellik uzmanı ile görüş.',
        scienceTag: 'Profesyonel danışmanlık kişiselleştirilmiş bakım sağlar.',
        baseDurationWeight: 45,
        difficulty: 'zor' as any,
        dopamine: 56,
        calories: 0
      },
      {
        id: 'lookmaxing-ileri-7',
        title: 'Cilt Analizi',
        description: 'Cilt analizi yaptır ve kişiselleştirilmiş bakım planı oluştur.',
        scienceTag: 'Cilt analizi hedefli bakım sağlar.',
        baseDurationWeight: 30,
        difficulty: 'zor' as any,
        dopamine: 48,
        calories: 0
      },
      {
        id: 'lookmaxing-ileri-8',
        title: 'Beslenme Planı',
        description: 'Cilt ve vücut sağlığı için beslenme planı oluştur.',
        scienceTag: 'Beslenme planı içten dışa güzellik sağlar.',
        baseDurationWeight: 40,
        difficulty: 'zor' as any,
        dopamine: 50,
        calories: 0
      },
      {
        id: 'lookmaxing-ileri-9',
        title: 'Güzellik Haftası',
        description: '1 hafta boyunca kapsamlı güzellük rutini uygula.',
        scienceTag: 'Kapsamlı rutin kalıcı sonuçlar sağlar.',
        baseDurationWeight: 0,
        difficulty: 'epic' as any,
        dopamine: 70,
        calories: 0
      },
      {
        id: 'lookmaxing-ileri-10',
        title: 'Stylist Danışmanlığı',
        description: 'Stylist ile görüş ve kişisel stil oluştur.',
        scienceTag: 'Profesyonel stil danışmanlığı görünümü optimize eder.',
        baseDurationWeight: 60,
        difficulty: 'epic' as any,
        dopamine: 68,
        calories: 0
      },
      {
        id: 'lookmaxing-ileri-11',
        title: 'Güzellik Ürünleri',
        description: 'Yüksek kaliteli güzellik ürünleri araştır ve satın al.',
        scienceTag: 'Kaliteli ürünler bakım verimliliğini artırır.',
        baseDurationWeight: 45,
        difficulty: 'epic' as any,
        dopamine: 65,
        calories: 0
      },
      {
        id: 'lookmaxing-ileri-12',
        title: 'Kapsamlı Bakım',
        description: 'Vücut, yüz ve saç için kapsamlı bakım rutini uygula.',
        scienceTag: 'Kapsamlı bakım bütünsel görünüm sağlar.',
        baseDurationWeight: 90,
        difficulty: 'epic' as any,
        dopamine: 75,
        calories: 0
      },
    ],
  },
  'futbol': {
    yeni: [
      {
        id: 'futbol-yeni-1',
        title: 'Top Kontrolü',
        description: '10 dakika top kontrolü pratiği yap.',
        scienceTag: 'Top kontrolü motor koordinasyonunu geliştirir.',
        baseDurationWeight: 15,
        difficulty: 'kolay' as any,
        dopamine: 20,
        calories: 100
      },
      {
        id: 'futbol-yeni-2',
        title: 'Pas Pratiği',
        description: '15 dakika pas pratiği yap.',
        scienceTag: 'Pas pratiği el-göz koordinasyonunu artırır.',
        baseDurationWeight: 20,
        difficulty: 'kolay' as any,
        dopamine: 22,
        calories: 100
      },
      {
        id: 'futbol-yeni-3',
        title: 'Şut Pratiği',
        description: '10 dakika şut pratiği yap.',
        scienceTag: 'Şut pratiği bacak gücünü geliştirir.',
        baseDurationWeight: 15,
        difficulty: 'kolay' as any,
        dopamine: 24,
        calories: 100
      },
      {
        id: 'futbol-yeni-4',
        title: 'Dribbling',
        description: '10 dakika dribbling pratiği yap.',
        scienceTag: 'Dribbling ayak koordinasyonunu geliştirir.',
        baseDurationWeight: 15,
        difficulty: 'kolay' as any,
        dopamine: 23,
        calories: 100
      },
      {
        id: 'futbol-yeni-5',
        title: 'Isınma',
        description: '10 dakika futbol isınma hareketleri yap.',
        scienceTag: 'Isınma sakatlanma riskini azaltır.',
        baseDurationWeight: 15,
        difficulty: 'kolay' as any,
        dopamine: 18,
        calories: 50
      },
      {
        id: 'futbol-yeni-6',
        title: 'Futbol Maçı İzle',
        description: 'Bir futbol maçı izle ve taktikleri analiz et.',
        scienceTag: 'Maç izleme oyun zekasını geliştirir.',
        baseDurationWeight: 45,
        difficulty: 'kolay' as any,
        dopamine: 25,
        calories: 0
      },
      {
        id: 'futbol-yeni-7',
        title: 'Kafa Vuruşu',
        description: '5 dakika kafa vuruşu pratiği yap.',
        scienceTag: 'Kafa vuruşu zamanlama yeteneğini geliştirir.',
        baseDurationWeight: 10,
        difficulty: 'kolay' as any,
        dopamine: 21,
        calories: 50
      },
      {
        id: 'futbol-yeni-8',
        title: 'Kondisyon',
        description: '10 dakika koşu yap.',
        scienceTag: 'Kondisyon kardiyovasküler sağlığı iyileştirir.',
        baseDurationWeight: 15,
        difficulty: 'kolay' as any,
        dopamine: 26,
        calories: 100
      },
      {
        id: 'futbol-yeni-9',
        title: 'Kaleci Pratiği',
        description: '10 dakika kaleci refleksleri pratiği yap.',
        scienceTag: 'Kaleci pratiği refleksleri hızlandırır.',
        baseDurationWeight: 15,
        difficulty: 'kolay' as any,
        dopamine: 22,
        calories: 100
      },
      {
        id: 'futbol-yeni-10',
        title: 'Futbol Ekipmanı',
        description: 'Futbol ekipmanını kontrol et ve hazırla.',
        scienceTag: 'Ekipman hazırlığı performansı optimize eder.',
        baseDurationWeight: 10,
        difficulty: 'kolay' as any,
        dopamine: 16,
        calories: 0
      },
      {
        id: 'futbol-yeni-11',
        title: 'Futbol Video Analizi',
        description: 'Futbol videosu izle ve teknikleri öğren.',
        scienceTag: 'Video analizi öğrenmeyi hızlandırır.',
        baseDurationWeight: 20,
        difficulty: 'kolay' as any,
        dopamine: 24,
        calories: 0
      },
      {
        id: 'futbol-yeni-12',
        title: 'Futbol Esneme',
        description: '10 dakika futbol esneme hareketleri yap.',
        scienceTag: 'Esneme esnekliği artırır.',
        baseDurationWeight: 15,
        difficulty: 'kolay' as any,
        dopamine: 18,
        calories: 50
      },
    ],
    orta: [
      {
        id: 'futbol-orta-1',
        title: 'Kombine Pratik',
        description: '20 dakika kombine futbol pratiği yap.',
        scienceTag: 'Kombine pratiği tüm becerileri geliştirir.',
        baseDurationWeight: 30,
        difficulty: 'orta' as any,
        dopamine: 40,
        calories: 200
      },
      {
        id: 'futbol-orta-2',
        title: 'Taktik Pratiği',
        description: '20 dakika taktik pratiği yap.',
        scienceTag: 'Taktik pratiği oyun zekasını geliştirir.',
        baseDurationWeight: 30,
        difficulty: 'orta' as any,
        dopamine: 38,
        calories: 150
      },
      {
        id: 'futbol-orta-3',
        title: 'Koşu Antrenmanı',
        description: '20 dakika koşu antrenmanı yap.',
        scienceTag: 'Koşu kondisyonu artırır.',
        baseDurationWeight: 25,
        difficulty: 'orta' as any,
        dopamine: 42,
        calories: 200
      },
      {
        id: 'futbol-orta-4',
        title: 'Köşe Vuruşu',
        description: '15 dakika köşe vuruşu pratiği yap.',
        scienceTag: 'Köşe vuruşu teknik hassasiyeti geliştirir.',
        baseDurationWeight: 20,
        difficulty: 'orta' as any,
        dopamine: 36,
        calories: 150
      },
      {
        id: 'futbol-orta-5',
        title: 'Serbest Vuruş',
        description: '15 dakika serbest vuruş pratiği yap.',
        scienceTag: 'Serbest vuruş teknik ustalığı geliştirir.',
        baseDurationWeight: 20,
        difficulty: 'orta' as any,
        dopamine: 38,
        calories: 150
      },
      {
        id: 'futbol-orta-6',
        title: 'Defans Pratiği',
        description: '20 dakika defans pratiği yap.',
        scienceTag: 'Defans pratiği pozisyon alma yeteneğini geliştirir.',
        baseDurationWeight: 25,
        difficulty: 'orta' as any,
        dopamine: 40,
        calories: 200
      },
      {
        id: 'futbol-orta-7',
        title: 'Hücum Pratiği',
        description: '20 dakika hücum pratiği yap.',
        scienceTag: 'Hücum pratiği gol atma yeteneğini geliştirir.',
        baseDurationWeight: 25,
        difficulty: 'orta' as any,
        dopamine: 42,
        calories: 200
      },
      {
        id: 'futbol-orta-8',
        title: 'Futbol Maçı',
        description: '30 dakikalık futbol maçı oyna.',
        scienceTag: 'Maç deneyimi pratik becerileri pekiştirir.',
        baseDurationWeight: 35,
        difficulty: 'orta' as any,
        dopamine: 45,
        calories: 250
      },
      {
        id: 'futbol-orta-9',
        title: 'Futbol Analizi',
        description: 'Bir futbol maçı analiz et.',
        scienceTag: 'Maç analizi taktiksel anlama sağlar.',
        baseDurationWeight: 30,
        difficulty: 'orta' as any,
        dopamine: 36,
        calories: 0
      },
      {
        id: 'futbol-orta-10',
        title: 'Futbol Drills',
        description: '25 dakika futbol drills yap.',
        scienceTag: 'Drills teknik mükemmelliği pekiştirir.',
        baseDurationWeight: 30,
        difficulty: 'orta' as any,
        dopamine: 40,
        calories: 200
      },
      {
        id: 'futbol-orta-11',
        title: 'Futbol Güç Antrenmanı',
        description: '20 dakika futbol güç antrenmanı yap.',
        scienceTag: 'Güç antrenmanı performansı artırır.',
        baseDurationWeight: 25,
        difficulty: 'orta' as any,
        dopamine: 38,
        calories: 200
      },
      {
        id: 'futbol-orta-12',
        title: 'Futbol Soğuma',
        description: '15 dakika futbol soğuma hareketleri yap.',
        scienceTag: 'Soğuma kas iyileşmesini hızlandırır.',
        baseDurationWeight: 20,
        difficulty: 'orta' as any,
        dopamine: 32,
        calories: 100
      },
    ],
    ileri: [
      {
        id: 'futbol-ileri-1',
        title: 'Yoğun Antrenman',
        description: '45 dakika yoğun futbol antrenmanı yap.',
        scienceTag: 'Yoğun antrenman performansı maksimize eder.',
        baseDurationWeight: 60,
        difficulty: 'zor' as any,
        dopamine: 55,
        calories: 400
      },
      {
        id: 'futbol-ileri-2',
        title: 'Taktik Analizi',
        description: 'Derinlemesine taktik analizi yap.',
        scienceTag: 'Taktik analizi oyun zekasını maksimize eder.',
        baseDurationWeight: 45,
        difficulty: 'zor' as any,
        dopamine: 52,
        calories: 0
      },
      {
        id: 'futbol-ileri-3',
        title: 'Futbol Maçı',
        description: '60 dakikalık futbol maçı oyna.',
        scienceTag: 'Uzun maç dayanıklılığı geliştirir.',
        baseDurationWeight: 70,
        difficulty: 'zor' as any,
        dopamine: 60,
        calories: 500
      },
      {
        id: 'futbol-ileri-4',
        title: 'Teknik Mükemmellik',
        description: '30 dakika teknik mükemmellik pratiği yap.',
        scienceTag: 'Teknik mükemmellik ustalığı sağlar.',
        baseDurationWeight: 40,
        difficulty: 'zor' as any,
        dopamine: 50,
        calories: 300
      },
      {
        id: 'futbol-ileri-5',
        title: 'Futbol Kampı',
        description: '1 günlük futbol kampına katıl.',
        scienceTag: 'Futbol kampı kapsamlı gelişim sağlar.',
        baseDurationWeight: 0,
        difficulty: 'zor' as any,
        dopamine: 58,
        calories: 0
      },
      {
        id: 'futbol-ileri-6',
        title: 'Futbol Turnuvası',
        description: 'Bir futbol turnuvasına katıl.',
        scienceTag: 'Turnuva deneyimi rekabet yeteneğini geliştirir.',
        baseDurationWeight: 0,
        difficulty: 'zor' as any,
        dopamine: 65,
        calories: 0
      },
      {
        id: 'futbol-ileri-7',
        title: 'Futbol Koçluğu',
        description: 'Profesyonel futbol koçu ile çalış.',
        scienceTag: 'Profesyonel koçluk gelişimi hızlandırır.',
        baseDurationWeight: 60,
        difficulty: 'zor' as any,
        dopamine: 56,
        calories: 0
      },
      {
        id: 'futbol-ileri-8',
        title: 'Futbol Video Analizi',
        description: 'Kendi performansını video ile analiz et.',
        scienceTag: 'Video analizi kör noktaları ortaya çıkarır.',
        baseDurationWeight: 45,
        difficulty: 'zor' as any,
        dopamine: 48,
        calories: 0
      },
      {
        id: 'futbol-ileri-9',
        title: 'Futbol Haftası',
        description: '1 hafta boyunca yoğun futbol antrenmanı yap.',
        scienceTag: 'Yoğun hafta kalıcı gelişim sağlar.',
        baseDurationWeight: 0,
        difficulty: 'epic' as any,
        dopamine: 70,
        calories: 0
      },
      {
        id: 'futbol-ileri-10',
        title: 'Futbol Turnuvası Hazırlığı',
        description: 'Turnuva için kapsamlı hazırlık yap.',
        scienceTag: 'Hazırlık performansı optimize eder.',
        baseDurationWeight: 60,
        difficulty: 'epic' as any,
        dopamine: 68,
        calories: 0
      },
      {
        id: 'futbol-ileri-11',
        title: 'Futbol Yetenek Testi',
        description: 'Futbol yetenek testine katıl.',
        scienceTag: 'Yetenek testi seviyeni belirler.',
        baseDurationWeight: 45,
        difficulty: 'epic' as any,
        dopamine: 65,
        calories: 0
      },
      {
        id: 'futbol-ileri-12',
        title: 'Futbol Kariyer Planı',
        description: 'Futbol kariyer planı oluştur.',
        scienceTag: 'Kariyer planı yön ve amaç sağlar.',
        baseDurationWeight: 60,
        difficulty: 'epic' as any,
        dopamine: 72,
        calories: 0
      },
    ],
  },
  'basketbol': {
    yeni: [
      {
        id: 'basketbol-yeni-1',
        title: 'Top Kontrolü',
        description: '10 dakika top kontrolü pratiği yap.',
        scienceTag: 'Top kontrolü el koordinasyonunu geliştirir.',
        baseDurationWeight: 15,
        difficulty: 'kolay' as any,
        dopamine: 20,
        calories: 100
      },
      {
        id: 'basketbol-yeni-2',
        title: 'Pas Pratiği',
        description: '15 dakika pas pratiği yap.',
        scienceTag: 'Pas pratiği el-göz koordinasyonunu artırır.',
        baseDurationWeight: 20,
        difficulty: 'kolay' as any,
        dopamine: 22,
        calories: 100
      },
      {
        id: 'basketbol-yeni-3',
        title: 'Şut Pratiği',
        description: '10 dakika şut pratiği yap.',
        scienceTag: 'Şut pratiği kol gücünü geliştirir.',
        baseDurationWeight: 15,
        difficulty: 'kolay' as any,
        dopamine: 24,
        calories: 100
      },
      {
        id: 'basketbol-yeni-4',
        title: 'Dribbling',
        description: '10 dakika dribbling pratiği yap.',
        scienceTag: 'Dribbling el koordinasyonunu geliştirir.',
        baseDurationWeight: 15,
        difficulty: 'kolay' as any,
        dopamine: 23,
        calories: 100
      },
      {
        id: 'basketbol-yeni-5',
        title: 'Isınma',
        description: '10 dakika basketbol isınma hareketleri yap.',
        scienceTag: 'Isınma sakatlanma riskini azaltır.',
        baseDurationWeight: 15,
        difficulty: 'kolay' as any,
        dopamine: 18,
        calories: 50
      },
      {
        id: 'basketbol-yeni-6',
        title: 'Basketbol Maçı İzle',
        description: 'Bir basketbol maçı izle ve taktikleri analiz et.',
        scienceTag: 'Maç izleme oyun zekasını geliştirir.',
        baseDurationWeight: 45,
        difficulty: 'kolay' as any,
        dopamine: 25,
        calories: 0
      },
      {
        id: 'basketbol-yeni-7',
        title: 'Ribaut Pratiği',
        description: '5 dakika ribaut pratiği yap.',
        scienceTag: 'Ribaut pratiği zamanlama yeteneğini geliştirir.',
        baseDurationWeight: 10,
        difficulty: 'kolay' as any,
        dopamine: 21,
        calories: 50
      },
      {
        id: 'basketbol-yeni-8',
        title: 'Kondisyon',
        description: '10 dakika koşu yap.',
        scienceTag: 'Kondisyon kardiyovasküler sağlığı iyileştirir.',
        baseDurationWeight: 15,
        difficulty: 'kolay' as any,
        dopamine: 26,
        calories: 100
      },
      {
        id: 'basketbol-yeni-9',
        title: 'Savunma Pratiği',
        description: '10 dakika savunma pratiği yap.',
        scienceTag: 'Savunma pratiği refleksleri hızlandırır.',
        baseDurationWeight: 15,
        difficulty: 'kolay' as any,
        dopamine: 22,
        calories: 100
      },
      {
        id: 'basketbol-yeni-10',
        title: 'Basketbol Ekipmanı',
        description: 'Basketbol ekipmanını kontrol et ve hazırla.',
        scienceTag: 'Ekipman hazırlığı performansı optimize eder.',
        baseDurationWeight: 10,
        difficulty: 'kolay' as any,
        dopamine: 16,
        calories: 0
      },
      {
        id: 'basketbol-yeni-11',
        title: 'Basketbol Video Analizi',
        description: 'Basketbol videosu izle ve teknikleri öğren.',
        scienceTag: 'Video analizi öğrenmeyi hızlandırır.',
        baseDurationWeight: 20,
        difficulty: 'kolay' as any,
        dopamine: 24,
        calories: 0
      },
      {
        id: 'basketbol-yeni-12',
        title: 'Basketbol Esneme',
        description: '10 dakika basketbol esneme hareketleri yap.',
        scienceTag: 'Esneme esnekliği artırır.',
        baseDurationWeight: 15,
        difficulty: 'kolay' as any,
        dopamine: 18,
        calories: 50
      },
    ],
    orta: [
      {
        id: 'basketbol-orta-1',
        title: 'Kombine Pratik',
        description: '20 dakika kombine basketbol pratiği yap.',
        scienceTag: 'Kombine pratiği tüm becerileri geliştirir.',
        baseDurationWeight: 30,
        difficulty: 'orta' as any,
        dopamine: 40,
        calories: 200
      },
      {
        id: 'basketbol-orta-2',
        title: 'Taktik Pratiği',
        description: '20 dakika taktik pratiği yap.',
        scienceTag: 'Taktik pratiği oyun zekasını geliştirir.',
        baseDurationWeight: 30,
        difficulty: 'orta' as any,
        dopamine: 38,
        calories: 150
      },
      {
        id: 'basketbol-orta-3',
        title: 'Koşu Antrenmanı',
        description: '20 dakika koşu antrenmanı yap.',
        scienceTag: 'Koşu kondisyonu artırır.',
        baseDurationWeight: 25,
        difficulty: 'orta' as any,
        dopamine: 42,
        calories: 200
      },
      {
        id: 'basketbol-orta-4',
        title: '3 Şut Pratiği',
        description: '15 dakika 3 şut pratiği yap.',
        scienceTag: '3 şut teknik hassasiyeti geliştirir.',
        baseDurationWeight: 20,
        difficulty: 'orta' as any,
        dopamine: 36,
        calories: 150
      },
      {
        id: 'basketbol-orta-5',
        title: 'Serbest Atış',
        description: '15 dakika serbest atış pratiği yap.',
        scienceTag: 'Serbest atış teknik ustalığı geliştirir.',
        baseDurationWeight: 20,
        difficulty: 'orta' as any,
        dopamine: 38,
        calories: 150
      },
      {
        id: 'basketbol-orta-6',
        title: 'Savunma Pratiği',
        description: '20 dakika savunma pratiği yap.',
        scienceTag: 'Savunma pratiği pozisyon alma yeteneğini geliştirir.',
        baseDurationWeight: 25,
        difficulty: 'orta' as any,
        dopamine: 40,
        calories: 200
      },
      {
        id: 'basketbol-orta-7',
        title: 'Hücum Pratiği',
        description: '20 dakika hücum pratiği yap.',
        scienceTag: 'Hücum pratiği sayı atma yeteneğini geliştirir.',
        baseDurationWeight: 25,
        difficulty: 'orta' as any,
        dopamine: 42,
        calories: 200
      },
      {
        id: 'basketbol-orta-8',
        title: 'Basketbol Maçı',
        description: '30 dakikalık basketbol maçı oyna.',
        scienceTag: 'Maç deneyimi pratik becerileri pekiştirir.',
        baseDurationWeight: 35,
        difficulty: 'orta' as any,
        dopamine: 45,
        calories: 250
      },
      {
        id: 'basketbol-orta-9',
        title: 'Basketbol Analizi',
        description: 'Bir basketbol maçı analiz et.',
        scienceTag: 'Maç analizi taktiksel anlama sağlar.',
        baseDurationWeight: 30,
        difficulty: 'orta' as any,
        dopamine: 36,
        calories: 0
      },
      {
        id: 'basketbol-orta-10',
        title: 'Basketbol Drills',
        description: '25 dakika basketbol drills yap.',
        scienceTag: 'Drills teknik mükemmelliği pekiştirir.',
        baseDurationWeight: 30,
        difficulty: 'orta' as any,
        dopamine: 40,
        calories: 200
      },
      {
        id: 'basketbol-orta-11',
        title: 'Basketbol Güç Antrenmanı',
        description: '20 dakika basketbol güç antrenmanı yap.',
        scienceTag: 'Güç antrenmanı performansı artırır.',
        baseDurationWeight: 25,
        difficulty: 'orta' as any,
        dopamine: 38,
        calories: 200
      },
      {
        id: 'basketbol-orta-12',
        title: 'Basketbol Soğuma',
        description: '15 dakika basketbol soğuma hareketleri yap.',
        scienceTag: 'Soğuma kas iyileşmesini hızlandırır.',
        baseDurationWeight: 20,
        difficulty: 'orta' as any,
        dopamine: 32,
        calories: 100
      },
    ],
    ileri: [
      {
        id: 'basketbol-ileri-1',
        title: 'Yoğun Antrenman',
        description: '45 dakika yoğun basketbol antrenmanı yap.',
        scienceTag: 'Yoğun antrenman performansı maksimize eder.',
        baseDurationWeight: 60,
        difficulty: 'zor' as any,
        dopamine: 55,
        calories: 400
      },
      {
        id: 'basketbol-ileri-2',
        title: 'Taktik Analizi',
        description: 'Derinlemesine taktik analizi yap.',
        scienceTag: 'Taktik analizi oyun zekasını maksimize eder.',
        baseDurationWeight: 45,
        difficulty: 'zor' as any,
        dopamine: 52,
        calories: 0
      },
      {
        id: 'basketbol-ileri-3',
        title: 'Basketbol Maçı',
        description: '60 dakikalık basketbol maçı oyna.',
        scienceTag: 'Uzun maç dayanıklılığı geliştirir.',
        baseDurationWeight: 70,
        difficulty: 'zor' as any,
        dopamine: 60,
        calories: 500
      },
      {
        id: 'basketbol-ileri-4',
        title: 'Teknik Mükemmellik',
        description: '30 dakika teknik mükemmellik pratiği yap.',
        scienceTag: 'Teknik mükemmellik ustalığı sağlar.',
        baseDurationWeight: 40,
        difficulty: 'zor' as any,
        dopamine: 50,
        calories: 300
      },
      {
        id: 'basketbol-ileri-5',
        title: 'Basketbol Kampı',
        description: '1 günlük basketbol kampına katıl.',
        scienceTag: 'Basketbol kampı kapsamlı gelişim sağlar.',
        baseDurationWeight: 0,
        difficulty: 'zor' as any,
        dopamine: 58,
        calories: 0
      },
      {
        id: 'basketbol-ileri-6',
        title: 'Basketbol Turnuvası',
        description: 'Bir basketbol turnuvasına katıl.',
        scienceTag: 'Turnuva deneyimi rekabet yeteneğini geliştirir.',
        baseDurationWeight: 0,
        difficulty: 'zor' as any,
        dopamine: 65,
        calories: 0
      },
      {
        id: 'basketbol-ileri-7',
        title: 'Basketbol Koçluğu',
        description: 'Profesyonel basketbol koçu ile çalış.',
        scienceTag: 'Profesyonel koçluk gelişimi hızlandırır.',
        baseDurationWeight: 60,
        difficulty: 'zor' as any,
        dopamine: 56,
        calories: 0
      },
      {
        id: 'basketbol-ileri-8',
        title: 'Basketbol Video Analizi',
        description: 'Kendi performansını video ile analiz et.',
        scienceTag: 'Video analizi kör noktaları ortaya çıkarır.',
        baseDurationWeight: 45,
        difficulty: 'zor' as any,
        dopamine: 48,
        calories: 0
      },
      {
        id: 'basketbol-ileri-9',
        title: 'Basketbol Haftası',
        description: '1 hafta boyunca yoğun basketbol antrenmanı yap.',
        scienceTag: 'Yoğun hafta kalıcı gelişim sağlar.',
        baseDurationWeight: 0,
        difficulty: 'epic' as any,
        dopamine: 70,
        calories: 0
      },
      {
        id: 'basketbol-ileri-10',
        title: 'Basketbol Turnuvası Hazırlığı',
        description: 'Turnuva için kapsamlı hazırlık yap.',
        scienceTag: 'Hazırlık performansı optimize eder.',
        baseDurationWeight: 60,
        difficulty: 'epic' as any,
        dopamine: 68,
        calories: 0
      },
      {
        id: 'basketbol-ileri-11',
        title: 'Basketbol Yetenek Testi',
        description: 'Basketbol yetenek testine katıl.',
        scienceTag: 'Yetenek testi seviyeni belirler.',
        baseDurationWeight: 45,
        difficulty: 'epic' as any,
        dopamine: 65,
        calories: 0
      },
      {
        id: 'basketbol-ileri-12',
        title: 'Basketbol Kariyer Planı',
        description: 'Basketbol kariyer planı oluştur.',
        scienceTag: 'Kariyer planı yön ve amaç sağlar.',
        baseDurationWeight: 60,
        difficulty: 'epic' as any,
        dopamine: 72,
        calories: 0
      },
    ],
  },
};
