import { useState, useRef } from 'react';
import { Camera, Upload, ArrowRight, ArrowLeft, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../hooks/useApp';
import { LOCATIONS } from '../data/quests';
import type { LocationType } from '../types';
import styles from './Onboarding.module.css';

export default function Onboarding() {
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [avatar, setAvatar] = useState<string | null>(null);
  const [selectedLoc, setSelectedLoc] = useState<LocationType | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { setUser, setSelectedLocation, completeOnboarding } = useApp();

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
    if (!selectedLoc) return;
    setUser({ name, bio, avatar });
    setSelectedLocation(selectedLoc);
    completeOnboarding();
    navigate('/dashboard');
  };

  const canProceed = () => {
    if (step === 0) return !!avatar;
    if (step === 1) return !!name.trim();
    if (step === 2) return !!selectedLoc;
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
          <h1 className={styles.title}>Profilini Olustur</h1>
          <p className={styles.subtitle}>Bir profil fotosu ekle</p>

          <div
            className={styles.avatarUpload}
            onClick={() => fileRef.current?.click()}
          >
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

          <button
            className={styles.uploadBtn}
            onClick={() => fileRef.current?.click()}
          >
            <Upload size={16} />
            {avatar ? 'Degistir' : 'Galeriden Sec'}
          </button>
        </div>
      )}

      {step === 1 && (
        <div className={styles.step}>
          <h1 className={styles.title}>Seni Taniyalim</h1>
          <p className={styles.subtitle}>Isim ve biyografini gir</p>

          <div className={styles.form}>
            <input
              type="text"
              placeholder="Adin"
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
          <h1 className={styles.title}>Bugun ne yapiyorsun?</h1>
          <p className={styles.subtitle}>Mekanini sec, gorevler gelsin!</p>

          <div className={styles.locations}>
            {LOCATIONS.map(loc => (
              <button
                key={loc.id}
                className={`${styles.locationCard} ${selectedLoc === loc.id ? styles.locationActive : ''}`}
                style={{
                  borderColor: selectedLoc === loc.id ? loc.color : undefined,
                  boxShadow: selectedLoc === loc.id ? `0 0 20px ${loc.color}30` : undefined,
                }}
                onClick={() => setSelectedLoc(loc.id)}
              >
                <span className={styles.locEmoji}>{loc.emoji}</span>
                <div className={styles.locText}>
                  <span className={styles.locLabel}>{loc.label}</span>
                  <span className={styles.locSub}>{loc.sublabel}</span>
                </div>
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
          {step === 2 ? 'Basla!' : 'Devam'}
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
}
