# Manual Test Scenarios - Hybrid Calibration

**Purpose:** Measure WHAT happens (metrics) + WHY it happens (feelings)

**Core Principle:** Don't play randomly. Test specific scenarios and document feelings.

---

## 🎯 TEST SENARYOLARI

### SENARYO 1: Single Task Drop-off
**Amaç:** Minimum engagement test

**Adımlar:**
1. Uygulamayı aç
2. 1 görev tamamla
3. Çık

**Sorular:**
- Şu an ne hissettim?
- Devam etme isteğim var mı?
- Neden?

**Not Al:**
- [ ] "Burada sıkıldım"
- [ ] "Burada hızlandım" 
- [ ] "Burada bırakmak istedim"

---

### SENARYO 2: Momentum Test
**Amaç:** Session chain etkisi test

**Adımlar:**
1. Uygulamayı aç
2. 3 görev üst üste tamamla
3. Hook mesajını gör
4. Devam et/bırak

**Sorular:**
- Momentum hissi var mı?
- Hook mesajı etkili mi?
- 4. görev yapma isteği?

**Not Al:**
- [ ] "Hook beni tetikledi"
- [ ] "Hook görmezden geldim"
- [ ] "Momentum hissi yok"

---

### SENARYO 3: Jackpot Impact
**Amaç:** Reward gerçekten tetikliyor mu?

**Adımlar:**
1. Jackpot al (veya simüle et)
2. Ödülü gör
3. Devam et/bırak

**Sorular:**
- Jackpot sonrası devam ettin mi?
- Ödül hissi ne kadar sürdü?
- Bir sonraki görevi yapmak istedin mi?

**Not Al:**
- [ ] "Jackpot beni motive etti"
- [ ] "Jackpot sonrası bıraktım"
- [ ] "Ödül hissi kısa sürdü"

---

### SENARYO 4: Near Miss Reaction
**Amaç:** Emotional variety test

**Adımlar:**
1. Near miss yaşa (veya simüle et)
2. Tepkini not al

**Sorular:**
- Sinir mi oldun, motive mi?
- "Bir daha dene" hissi?
- Sistem adaletli mi geldi?

**Not Al:**
- [ ] "Sinir oldum"
- [ ] "Motive oldum"
- [ ] "Adaletli hissettirdi"

---

### SENARYO 5: Streak Loss Recovery
**Amaç:** Fail state etkisi test

**Adımlar:**
1. Streak kaybet (veya simüle et)
2. UI mesajını gör
3. Geri dönme isteği?

**Sorular:**
- Geri dönmek istedin mi?
- UI mesajı etkili mi?
- "Yeni seri başlat" hissi?

**Not Al:**
- [ ] "Geri dönmek istedim"
- [ ] "UI mesajı motive etti"
- [ ] "Tamamen bırakmak istedim"

---

### SENARYO 6: Identity Impact
**Amaç:** Identity layer gerçekten çalışıyor mu?

**Adımlar:**
1. Identity reward al (veya simüle et)
2. Mesajı oku
3. Kendine sor: "Ben disiplinli biriyim?"

**Sorular:**
- Identity mesajı hissettirdi mi?
- Kendini bu şekilde tanımladın mı?
- Anlam dopamini hissi?

**Not Al:**
- [ ] "Kendimi böyle tanımladım"
- [ ] "Sadece bir mesaj gibi geldi"
- [ ] "Anlam hissi yok"

---

### SENARYO 7: Predictability Test
**Amaç:** Pattern detection test

**Adımlar:**
1. 5 görev üst üste yap
2. Her görev sonrası not al
3. Şunu sor: "Ne olacağını tahmin edebiliyor muyum?"

**Sorular:**
- Sistem tahmin edilebilir mi?
- Sürpriz elementi var mı?
- Pattern yakaladın mı?

**Not Al:**
- [ ] "Tahmin edilebilir"
- [ ] "Sürprizler var"
- [ ] "Pattern yakaladım"

---

### SENARYO 8: Premium Perception
**Amaç:** Premium hissediliyor mu?

**Adımlar:**
1. Premium modu aç/kapat
2. Farkı hisset

**Sorular:**
- Fark hissediliyor mu?
- Aura/glow etkili mi?
- "Özel hissettim"?

**Not Al:**
- [ ] "Fark hissettim"
- [ ] "Çok da fark yok"
- [ ] "Premium hissi var"

---

## 📊 METRIK KILAVUZU

### Tasks Per Session
- **Formül:** totalTasks / totalSessions
- **Hedef:** > 3.0
- **Anlamı:** Kullanıcı session başına kaç görev yapıyor?

### Continuation Rate
- **Formül:** sessionHooksClicked / totalRewards
- **Hedef:** > 40%
- **Anlamı:** Hook sonrası devam etme oranı

### Reward Impact Score
- **Formül:** tasksAfterReward / tasksBeforeReward
- **Hedef:** > 1.2
- **Anlamı:** Reward gerçekten tetikliyor mu?

### Average Session Length
- **Formül:** totalSessionLength / totalSessions
- **Hedef:** > 5 dakika
- **Anlamı:** Session süresi

### Drop-off Point
- **Formül:** average(tasks when session ends)
- **Hedef:** Kaçıncı görevde bırakıyorlar?
- **Anlamı:** En kritik nokta

---

## 🧠 NOT ALMA FORMATI

Her test için:

```
TARİH: [YYYY-MM-DD]
SENARYO: [Senaryo Adı]
GÖREV SAYISI: [X]
SÜRE: [X dakika]

HİS:
[Detaylı his açıklaması]

DEVAM ETME İSTEĞİ: [1-10]
[1 = hiç, 10 = çok]

NEDEN:
[Detaylı neden açıklaması]

KRİTİK NOKTA:
"Burada sıkıldım" / "Burada hızlandım" / "Burada bırakmak istedim"
```

---

## 🔍 ANALİZ SORULARI

Test sonrası kendine sor:

1. **Hangi event en çok motive etti?**
   - [ ] Reward
   - [ ] Identity
   - [ ] Skill level up
   - [ ] Session hook

2. **Hangi noktada bırakmak istedin?**
   - [ ] 1. görev sonrası
   - [ ] 3. görev sonrası
   - [ ] Reward sonrası
   - [ ] Hiç

3. **Sistem tahmin edilebilir mi?**
   - [ ] Evet, çok
   - [ ] Hayır, sürprizler var
   - [ ] Kısmen

4. **Premium hissediliyor mu?**
   - [ ] Evet, açık fark
   - [ ] Hayır, fark yok
   - [ ] Kısmen

5. **Kendini nasıl tanımladın?**
   - [ ] "Disiplinli biriyim"
   - [ ] "Odaklı biriyim"
   - [ ] "Sürekli biriyim"
   - [ ] Hiçbiri

---

## 🚀 SONRAKİ ADIMLAR

1. **Veri Topla:** En az 10 session test et
2. **Desenleri Bul:** Hangi noktalarda bırakılıyor?
3. **Kalibre:** Weak points'i güçlendir
4. **Tekrar Test Et:** İyileşme var mı?

**Unutma:** Başarıyı belirleyen şey kod değil → insan gerçekten devam ediyor mu?
