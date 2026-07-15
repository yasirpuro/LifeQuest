import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../features/auth/authContext';
import { validateLoginForm, formatAuthError, checkAuthRateLimit, recordAuthAttempt } from '../features/auth/authValidation';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react';
import styles from './Login.module.css';

export default function Login() {
  const navigate = useNavigate();
  const { login, isLoading } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setFieldErrors({});

    // Rate limiting
    if (!checkAuthRateLimit()) {
      setError('Çok hızlı denediniz, lütfen bekleyin');
      return;
    }
    recordAuthAttempt();

    // Validation
    const errors = validateLoginForm(email, password);
    if (errors.length > 0) {
      const fieldMap = errors.reduce((acc, err) => {
        acc[err.field] = err.message;
        return acc;
      }, {} as Record<string, string>);
      setFieldErrors(fieldMap);
      return;
    }

    // Login
    try {
      const result = await login({ email, password });

      if (!result.success) {
        setError(formatAuthError(result.error || 'Giriş başarısız'));
        return;
      }

      // Success
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError('Bir hata oluştu. Lütfen tekrar deneyin.');
      console.error('[Login] Error:', err);
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
          <h1 className={styles.title}>Giriş Yap</h1>
          <div style={{ width: 20 }} /> {/* Spacer for centering */}
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
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={styles.togglePassword}
                disabled={isLoading}
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {fieldErrors.password && (
              <span className={styles.fieldError}>{fieldErrors.password}</span>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className={styles.submitBtn}
          >
            {isLoading ? 'Giriliyor...' : 'Giriş Yap'}
          </button>
        </form>

        {/* Links */}
        <div className={styles.links}>
          <Link to="/reset-password" className={styles.link}>
            Şifremi unuttum
          </Link>
          <span className={styles.separator}>•</span>
          <Link to="/signup" className={styles.link}>
            Hesap oluştur
          </Link>
        </div>

        {/* Guest CTA */}
        <div className={styles.guestCTA}>
          <p>Henüz karar vermedim</p>
          <button
            type="button"
            onClick={handleGoBack}
            className={styles.guestBtn}
          >
            Konuk Olarak Devam Et
          </button>
        </div>
      </div>
    </div>
  );
}
