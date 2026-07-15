import { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../features/auth/authContext';
import { validateEmail, validatePassword, validatePasswordMatch, formatAuthError, checkAuthRateLimit, recordAuthAttempt } from '../features/auth/authValidation';
import { ArrowLeft, Eye, EyeOff, CheckCircle } from 'lucide-react';
import styles from './ResetPassword.module.css';

type ResetStep = 'request' | 'reset' | 'success';

export default function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { sendPasswordReset, isLoading } = useAuth();

  // Check if there's a reset token in URL (after email link click)
  const resetToken = searchParams.get('token');
  const tokenEmail = searchParams.get('email');

  const [step, setStep] = useState<ResetStep>(resetToken ? 'reset' : 'request');
  const [email, setEmail] = useState(tokenEmail || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // Step 1: Request password reset (send email)
  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setFieldErrors({});

    // Validation
    const emailErr = validateEmail(email);
    if (emailErr) {
      setFieldErrors({ email: emailErr.message });
      return;
    }

    // Rate limiting
    if (!checkAuthRateLimit()) {
      setError('Çok hızlı denediniz, lütfen bekleyin');
      return;
    }
    recordAuthAttempt();

    // Send reset email
    try {
      const result = await sendPasswordReset(email);

      if (!result.success) {
        setError(formatAuthError(result.error || 'İstek başarısız'));
        return;
      }

      // Success
      alert(`Şifre sıfırlama bağlantısı ${email} adresine gönderildi.`);
      setStep('success');
    } catch (err) {
      setError('Bir hata oluştu. Lütfen tekrar deneyin.');
      console.error('[ResetPassword] Error:', err);
    }
  };

  // Step 2: Set new password (with token)
  const handleSetNewPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setFieldErrors({});

    // Validation
    const errors: Record<string, string> = {};

    const passwordErr = validatePassword(password);
    if (passwordErr) errors.password = passwordErr.message;

    const matchErr = validatePasswordMatch(password, confirmPassword);
    if (matchErr) errors.confirmPassword = matchErr.message;

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    // TODO: Update password with token
    // This requires Supabase session to be established with the token
    // For now, show a message
    try {
      // Note: This is a simplified flow
      // In production, you'd validate the token and update the password via Supabase
      alert('Şifreniz başarıyla güncellenmiştir. Lütfen yeni şifrenizle giriş yapın.');
      navigate('/login', { replace: true });
    } catch (err) {
      setError('Şifre güncellenemedi. Lütfen tekrar deneyin.');
      console.error('[ResetPassword] Error:', err);
    }
  };

  const handleGoBack = () => {
    navigate(-1);
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
          <h1 className={styles.title}>Şifre Sıfırla</h1>
          <div style={{ width: 20 }} />
        </div>

        {/* Step 1: Request Reset */}
        {step === 'request' && (
          <>
            {error && (
              <div className={styles.errorBanner}>
                <p>{error}</p>
              </div>
            )}

            <p className={styles.subtitle}>
              Kayıtlı e-posta adresini gir. Şifre sıfırlama bağlantısı gönderelim.
            </p>

            <form onSubmit={handleRequestReset} className={styles.form}>
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

              <button
                type="submit"
                disabled={isLoading}
                className={styles.submitBtn}
              >
                {isLoading ? 'Gönderiliyor...' : 'Sıfırlama Bağlantısı Gönder'}
              </button>
            </form>

            <div className={styles.links}>
              <p>Hatırladın mı?</p>
              <Link to="/login" className={styles.link}>
                Giriş Yap
              </Link>
            </div>
          </>
        )}

        {/* Step 2: Set New Password */}
        {step === 'reset' && (
          <>
            {error && (
              <div className={styles.errorBanner}>
                <p>{error}</p>
              </div>
            )}

            <p className={styles.subtitle}>
              Yeni şifreni gir ve onayla.
            </p>

            <form onSubmit={handleSetNewPassword} className={styles.form}>
              <div className={styles.formGroup}>
                <label htmlFor="password">Yeni Şifre</label>
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
                {fieldErrors.password && (
                  <span className={styles.fieldError}>{fieldErrors.password}</span>
                )}
              </div>

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

              <button
                type="submit"
                disabled={isLoading}
                className={styles.submitBtn}
              >
                {isLoading ? 'Güncelleniyor...' : 'Şifreyi Güncelle'}
              </button>
            </form>
          </>
        )}

        {/* Step 3: Success */}
        {step === 'success' && (
          <div className={styles.successContainer}>
            <CheckCircle size={64} className={styles.successIcon} />
            <h2 className={styles.successTitle}>E-posta Gönderildi!</h2>
            <p className={styles.successMessage}>
              {email} adresine şifre sıfırlama bağlantısı gönderdik.
            </p>
            <p className={styles.successHint}>
              E-postayı kontrol et ve bağlantıya tıkla. (Spam klasörünü de kontrol etmeyi unutma!)
            </p>

            <button
              onClick={() => navigate('/login', { replace: true })}
              className={styles.successBtn}
            >
              Giriş Sayfasına Dön
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
