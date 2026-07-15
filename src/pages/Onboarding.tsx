import { useState, useRef } from 'react';
import { Camera, Upload, ArrowRight, ArrowLeft, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../features/auth/authContext';
import { useQuest } from '../features/quests/questContext';
import type { LocationType } from '../types';
import styles from './Onboarding.module.css';

interface FocusOption {
  id: LocationType;
  emoji: string;
  label: string;
  sub: string;
  color: string;
}

const FOCUS_OPTIONS: FocusOption[] = [
  { id: 'din', emoji: '🕌', label: 'Manevi Disiplin', sub: 'Namaz, tefekkür ve zikir', color: '#6C63FF' },
  { id: 'spor', emoji: '🏃‍♂️', label: 'Fiziksel Zindelik', sub: 'Şınav, squat, koşu ve su', color: '#ff4757' },
  { id: 'egitim', emoji: '🎓', label: 'Akademik Başarı', sub: 'Pomodoro, makale ve odak', color: '#2ed573' },
  { id: 'dil', emoji: '🌐', label: 'Yabancı Dil', sub: 'Kelime, dinleme ve gramer', color: '#1e90ff' },
  { id: 'kisisel-gelisim', emoji: '📚', label: 'Zihinsel Gelişim', sub: 'Kitap okuma ve alışkanlık', color: '#ffa502' },
  { id: 'lookmaxing', emoji: '✨', label: 'Kişisel Bakım', sub: 'Cilt, mewing ve postür', color: '#ff6b81' },
  { id: 'futbol', emoji: '⚽', label: 'Futbol Taktiği', sub: 'Top kontrolü ve kondisyon', color: '#888888' },
  { id: 'basketbol', emoji: '🏀', label: 'Basketbol Şut', sub: 'Dribbling ve şut mekaniği', color: '#ff7f50' },
];

export default function Onboarding() {
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [avatar, setAvatar] = useState<string | null>(null);
  const [focus, setFocus] = useState<LocationType>('din');
  const [duration, setDuration] = useState<number>(14);

  const fileRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { updateUserProfile } = useAuth();
  const { setSelectedLocation, completeOnboarding, startChallenge } = useQuest();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setAvatar(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleNext = () => {
    if (step === 0 && !avatar) return;
    if (step === 1 && !name.trim()) return;
    if (step < 2) {
      setStep(step + 1);
      return;
    }
    updateUserProfile({ name, bio, avatar });
    startChallenge(focus, duration);
    setSelectedLocation(focus);
    completeOnboarding();
    navigate('/dashboard');
  };

  const canProceed = () => {
    if (step === 0) return !!avatar;
    if (step === 1) return !!name.trim();
    if (step === 2) return true;
    return false;
  };

  return (
    <div className={styles.container}>
      <div className={styles.bgOrbs}>
        <div className={styles.orb1} />
        <div className={styles.orb2} />
      </div>

      <div className={styles.progress}>
        {[0, 1, 2].map(i => (
          <div key={i} className={`${styles.dot} ${i <= step ? styles.dotActive : ''}`} />
        ))}
      </div>

      {step === 0 && (
        <div className={styles.step}>
          <Sparkles size={32} className={styles.stepIcon} />
          <h1 className={styles.title}>Profilini Oluştur</h1>
          <p className={styles.subtitle}>Bir profil fotoğrafı ekle</p>

          <div className={styles.avatarUpload} onClick={() => fileRef.current?.click()}>
            {avatar ? (
              <img src={avatar} alt="Avatar" className={styles.avatarImg} />
            ) : (
              <div className={styles.avatarPlaceholder}>
                <Camera size={32} />
                <span>Foto Ekle</span>
              </div>
            )}
          </div>

          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className={styles.fileInput}
            onChange={handleFileSelect}
          />

          <button className={styles.uploadBtn} onClick={() => fileRef.current?.click()}>
            <Upload size={16} />
            {avatar ? 'Değiştir' : 'Galeriden Seç'}
          </button>
        </div>
      )}

      {step === 1 && (
        <div className={styles.step}>
          <h1 className={styles.title}>Seni Tanıyalım</h1>
          <p className={styles.subtitle}>İsim ve biyografini gir</p>

          <div className={styles.form}>
            <input
              type="text"
              placeholder="Adın"
              value={name}
              onChange={e => setName(e.target.value)}
              className={styles.input}
              maxLength={30}
              autoFocus
            />
            <textarea
              placeholder="Biyografi (opsiyonel)"
              value={bio}
              onChange={e => setBio(e.target.value)}
              className={styles.textarea}
              maxLength={120}
              rows={3}
            />
            <span className={styles.charCount}>{bio.length}/120</span>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className={styles.step}>
          <h1 className={styles.title}>Serüvenini Ayarla</h1>
          <p className={styles.subtitle}>Disiplin için odak alanını ve süreyi seç</p>

          <div style={{ alignSelf: 'flex-start', fontSize: '13px', fontWeight: 700, marginBottom: '8px', color: '#6C63FF' }}>
            🎯 Odaklanmak İstediğin Alan:
          </div>

          <div className={styles.locations}>
            {FOCUS_OPTIONS.map(opt => (
              <button
                key={opt.id}
                type="button"
                className={`${styles.locationCard} ${focus === opt.id ? styles.locationActive : ''}`}
                style={{
                  borderColor: focus === opt.id ? opt.color : undefined,
                  boxShadow: focus === opt.id ? `0 0 15px ${opt.color}33` : undefined,
                }}
                onClick={() => setFocus(opt.id)}
              >
                <span className={styles.locEmoji}>{opt.emoji}</span>
                <div className={styles.locText}>
                  <span className={styles.locLabel}>{opt.label}</span>
                  <span className={styles.locSub}>{opt.sub}</span>
                </div>
              </button>
            ))}
          </div>

          <div style={{ alignSelf: 'flex-start', fontSize: '13px', fontWeight: 700, marginTop: '20px', marginBottom: '8px', color: '#6C63FF' }}>
            ⏳ Meydan Okuma Süresi:
          </div>

          <div className={styles.durationSelect}>
            {([14, 30, 60] as number[]).map(d => (
              <button
                key={d}
                type="button"
                className={`${styles.durationBtn} ${duration === d ? styles.durationActive : ''}`}
                onClick={() => setDuration(d)}
              >
                {d} Günlük
              </button>
            ))}
          </div>
        </div>
      )}

      <div className={styles.navButtons}>
        {step > 0 && (
          <button className={styles.backBtn} onClick={() => setStep(step - 1)}>
            <ArrowLeft size={18} />
            Geri
          </button>
        )}
        <button
          className={`btn-primary ${styles.nextBtn}`}
          onClick={handleNext}
          disabled={!canProceed()}
          style={{ opacity: canProceed() ? 1 : 0.4 }}
        >
          {step === 2 ? 'Maceraya Başla! 🚀' : 'Devam'}
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
}

