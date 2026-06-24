import { useState } from 'react';
import { Shield, X } from 'lucide-react';
import styles from './VerificationModal.module.css';

interface Props {
  questTitle: string;
  placeholder: string;
  onConfirm: (note: string) => void;
  onClose: () => void;
}

export default function VerificationModal({ questTitle, placeholder, onConfirm, onClose }: Props) {
  const [note, setNote] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!note.trim()) return;
    onConfirm(note);
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <button className={styles.close} onClick={onClose}>
          <X size={20} />
        </button>

        <div className={styles.shield}>
          <Shield size={40} />
        </div>

        <h2 className={styles.title}>Görevi Doğrula</h2>
        <p className={styles.subtitle}>
          Bu görevi tamamladığınızdan emin olmak için kısa bir açıklama veya kanıt notu yazın:
        </p>

        <p className={styles.questTitle}>{questTitle}</p>

        <form onSubmit={handleSubmit} className={styles.form}>
          <textarea
            className={styles.textarea}
            placeholder={placeholder}
            value={note}
            onChange={e => setNote(e.target.value)}
            required
            autoFocus
          />


          <div className={styles.actions}>
            <button type="button" className={styles.cancelBtn} onClick={onClose}>
              İptal
            </button>
            <button type="submit" className={styles.confirmBtn} disabled={!note.trim()}>
              Doğrula & XP Kazan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
