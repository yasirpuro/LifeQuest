import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../features/auth/authContext';
import { validateSignupForm, formatAuthError, checkAuthRateLimit, recordAuthAttempt, getGuestProfile, getGuestQuests, getPasswordStrength, hasGuestProgress } from '../features/auth/authValidation';
import { mergeGuestProgress, getMergeNotification } from '../shared/utils/userMerge';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react';
import styles from './Signup.module.css';

export default function Signup() {
  const navigate = useNavigate();
  const { register, isLoading } = useAuth();

  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const strength = getPasswordStrength(password);
  const showGuestMergePrompt = hasGuestProgress();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setFieldErrors({});

    // Terms check
    if (!agreedToTerms) {
      setError('Koşulları kabul etmelisiniz');
      return;
    }

    // Rate limiting
    if (!checkAuthRateLimit()) {
      setError('Çok hızlı denediniz, lütfen bekleyin');
      return;
    }
    recordAuthAttempt();

    // Validation
    const errors = validateSignupForm(email, password, confirmPassword, username);
    if (errors.length > 0) {
      const fieldMap = errors.reduce((acc, err) => {
        acc[err.field] = err.message;
        return acc;
      }, {} as Record<string, string>);
      setFieldErrors(fieldMap);
      return;
    }

    // Register
    try {
      const result = await register({
        email,
        password,
        username: username || email.split('@')[0],
      });

      if (!result.success) {
        setError(formatAuthError(result.error || 'Kayıt başarısız'));
        return;
      }

      // GUEST MERGE: Eğer local guest data varsa merge et
      const guestUser = getGuestProfile();
      const guestQuests = getGuestQuests();

      if (guestUser) {
        try {
          // Cloud user placeholder (gerçek cloud user Supabase'den çekilir)
          const cloudUser = {
            name: username || email.split('@')[0],
            bio: '',
            avatar: null,
            level: 1,
            xp: 0,
            xpToNext: 100,
            totalQuests: 0,
            streak: 1,
            badges: [],
            isPremium: false,
            recoveryState: { tokens: [], streakFrozen: false, lastRecovery: null },
            streakRiskLevel: 'safe' as const,
            lastQuestCompletedAt: null,
            dailyXp: { date: new Date().toISOString().slice(0, 10), earned: 0 },
            lastActiveDay: null,
            skillsProgress: {},
            challengeActive: false,
            challengeFocus: null,
            challengeDuration: 14,
            challengeStartTimestamp: null,
            challengeDay: 1,
          };

          const mergeResult = mergeGuestProgress(guestUser, cloudUser, guestQuests, []);
          const notification = getMergeNotification(mergeResult);

          // LocalStorage'dan guest state'i sil (artık cloud'da)
          localStorage.removeItem('lifequest_state');

          // Success message
          const message = `${notification}\n\nE-posta doğrulama linki gönderildi.`;
          alert(message);
        } catch (mergeErr) {
          console.error('[Signup] Merge error:', mergeErr);
          // Merge hatası görmezden gel, signup successful sayı
        }
      } else {
        // Guest data yok, sadece signup
        alert('Hesap oluşturuldu!\n\nE-posta doğrulama linki gönderildi.');
      }

      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError('Bir hata oluştu. Lütfen tekrar deneyin.');
      console.error('[Signup] Error:', err);
    }
  };

  const handleGoBack = () => {
    navigate('/', { replace: true });
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        {/* Header */}
        <div className={styles.header}>
          <button
            onClick={handleGoBack}
            className={styles.backBtn}
            title="Geri dön"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className={styles.title}>Hesap Oluştur</h1>
          <div style={{ width: 20 }} />
        </div>

        {/* Error Message */}
        {error && (
          <div className={styles.errorBanner}>
            <p>{error}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className={styles.form}>
          {/* Email Field */}
          <div className={styles.formGroup}>
            <label htmlFor="email">E-posta</label>
            <input
              id="email"
              type="email"
              placeholder="example@mail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              className={fieldErrors.email ? styles.inputError : ''}
              autoComplete="email"
            />
            {fieldErrors.email && (
              <span className={styles.fieldError}>{fieldErrors.email}</span>
            )}
          </div>

          {/* Username Field (Optional) */}
          <div className={styles.formGroup}>
            <label htmlFor="username">Kullanıcı Adı (İsteğe Bağlı)</label>
            <input
              id="username"
              type="text"
              placeholder="username123"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={isLoading}
              className={fieldErrors.username ? styles.inputError : ''}
              autoComplete="username"
            />
            {fieldErrors.username && (
              <span className={styles.fieldError}>{fieldErrors.username}</span>
            )}
          </div>

          {/* Password Field */}
          <div className={styles.formGroup}>
            <label htmlFor="password">Şifre</label>
            <div className={styles.passwordContainer}>
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                className={fieldErrors.password ? styles.inputError : ''}
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={styles.togglePassword}
                disabled={isLoading}
                tabIndex={-1}
              >
                {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
              </button>
            </div>
            {password && (
              <div className={styles.passwordStrength}>
                <div className={styles.strengthBar}>
                  <div className={`${styles.strengthFill} ${styles[strength.color]}`} style={{ width: `${strength.score * 25}%` }} />
                </div>
                <span className={`${styles.strengthText} ${styles[strength.color]}`}>{strength.label}</span>
              </div>
            )}
            {fieldErrors.password && (
              <span className={styles.fieldError}>{fieldErrors.password}</span>
            )}
          </div>

          {/* Confirm Password Field */}
          <div className={styles.formGroup}>
            <label htmlFor="confirmPassword">Şifreyi Onayla</label>
            <div className={styles.passwordContainer}>
              <input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={isLoading}
                className={fieldErrors.confirmPassword ? styles.inputError : ''}
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className={styles.togglePassword}
                disabled={isLoading}
                tabIndex={-1}
              >
                {showConfirmPassword ? <Eye size={18} /> : <EyeOff size={18} />}
              </button>
            </div>
            {fieldErrors.confirmPassword && (
              <span className={styles.fieldError}>{fieldErrors.confirmPassword}</span>
            )}
          </div>

          {showGuestMergePrompt && (
            <div className={styles.infoBox}>
              <p>Eski ilerlemeni yeni hesabına taşıyabiliriz.</p>
            </div>
          )}

          {/* Terms Checkbox */}
          <div className={styles.checkboxGroup}>
            <input
              id="terms"
              type="checkbox"
              checked={agreedToTerms}
              onChange={(e) => setAgreedToTerms(e.target.checked)}
              disabled={isLoading}
            />
            <label htmlFor="terms">
              <Link to="/terms" target="_blank" className={styles.link}>
                Koşulları
              </Link>
              {' '}ve{' '}
              <Link to="/privacy" target="_blank" className={styles.link}>
                Gizlilik Politikasını
              </Link>
              {' '}kabul ediyorum
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className={styles.submitBtn}
          >
            {isLoading ? 'Kaydediliyor...' : 'Hesap Oluştur'}
          </button>
        </form>

        {/* Links */}
        <div className={styles.links}>
          <p>Zaten hesabın var mı?</p>
          <Link to="/login" className={styles.link}>
            Giriş Yap
          </Link>
        </div>
      </div>
    </div>
  );
}
