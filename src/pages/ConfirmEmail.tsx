import { useEffect, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, MailCheck } from 'lucide-react';
import styles from './ConfirmEmail.module.css';

interface ConfirmEmailLocationState {
  email?: string;
}

export default function ConfirmEmail() {
  const navigate = useNavigate();
  const location = useLocation();
  const [message, setMessage] = useState('');

  const stateEmail = (location.state as ConfirmEmailLocationState | null)?.email;
  const storedEmail = typeof window !== 'undefined'
    ? window.localStorage.getItem('lifequest_pending_email_confirmation')
    : null;
  const email = stateEmail || storedEmail || '';

  useEffect(() => {
    if (!email) {
      navigate('/login', { replace: true });
    }
  }, [email, navigate]);

  const handleResend = () => {
    if (!email) return;
    window.localStorage.setItem('lifequest_pending_email_confirmation', email);
    setMessage('Onay e-postası tekrar hazırlanıyor. E-postanı kontrol et.');
  };

  const handleGoToLogin = () => {
    window.localStorage.removeItem('lifequest_pending_email_confirmation');
    navigate('/login', { replace: true });
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <button onClick={() => navigate('/', { replace: true })} className={styles.backBtn} title="Geri dön">
          <ArrowLeft size={20} />
        </button>

        <div className={styles.iconWrap}>
          <MailCheck size={36} />
        </div>

        <h1 className={styles.title}>E-posta adresini doğrula</h1>
        <p className={styles.subtitle}>
          Hesabını oluşturduk. Devam etmek için e-postana gelen onay bağlantısını açman gerekiyor.
        </p>

        {email && <div className={styles.emailBox}>{email}</div>}

        {message && <div className={styles.infoBox}>{message}</div>}

        <button type="button" className={styles.primaryBtn} onClick={handleGoToLogin}>
          Giriş sayfasına dön
        </button>

        <button type="button" className={styles.secondaryBtn} onClick={handleResend}>
          Onay mailini tekrar gönder
        </button>

        <p className={styles.helperText}>
          E-posta gelmediyse spam klasörünü de kontrol et. Onay tamamlandığında giriş yapabilirsin.
        </p>

        <Link to="/login" className={styles.link}>Zaten hesabın var mı? Giriş yap</Link>
      </div>
    </div>
  );
}
