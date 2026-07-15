export interface ValidationError {
  field: string;
  message: string;
}

const RATE_LIMIT_KEY = 'lifequest_auth_rate_limit';
const RATE_LIMIT_WINDOW_MS = 60_000;
const MAX_ATTEMPTS = 5;

export function validateEmail(email: string): ValidationError | null {
  if (!email.trim()) return { field: 'email', message: 'E-posta zorunlu.' };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { field: 'email', message: 'Geçerli bir e-posta girin.' };
  return null;
}

export function validatePassword(password: string): ValidationError | null {
  if (!password) return { field: 'password', message: 'Şifre zorunlu.' };
  if (password.length < 6) return { field: 'password', message: 'Şifre en az 6 karakter olmalı.' };
  return null;
}

export function validatePasswordMatch(password: string, confirmPassword: string): ValidationError | null {
  if (!confirmPassword) return { field: 'confirmPassword', message: 'Şifre tekrarı zorunlu.' };
  if (password !== confirmPassword) return { field: 'confirmPassword', message: 'Şifreler eşleşmiyor.' };
  return null;
}

export function validateLoginForm(email: string, password: string): ValidationError[] {
  const errors: ValidationError[] = [];
  const emailError = validateEmail(email);
  const passwordError = validatePassword(password);
  if (emailError) errors.push(emailError);
  if (passwordError) errors.push(passwordError);
  return errors;
}

export function validateSignupForm(email: string, password: string, confirmPassword: string, username?: string): ValidationError[] {
  const errors: ValidationError[] = [];
  const emailError = validateEmail(email);
  const passwordError = validatePassword(password);
  const matchError = validatePasswordMatch(password, confirmPassword);
  if (emailError) errors.push(emailError);
  if (passwordError) errors.push(passwordError);
  if (matchError) errors.push(matchError);
  if (username && username.trim().length < 3) errors.push({ field: 'username', message: 'Kullanıcı adı en az 3 karakter olmalı.' });
  return errors;
}

export function formatAuthError(message?: string): string {
  if (!message) return 'Bir hata oluştu.';
  if (message.includes('Invalid login')) return 'E-posta veya şifre yanlış.';
  if (message.includes('already')) return 'Bu e-posta zaten kullanılıyor.';
  return message;
}

export function checkAuthRateLimit(): boolean {
  try {
    const now = Date.now();
    const raw = localStorage.getItem(RATE_LIMIT_KEY);
    const items = raw ? JSON.parse(raw) as number[] : [];
    const recent = items.filter(ts => now - ts < RATE_LIMIT_WINDOW_MS);
    if (recent.length >= MAX_ATTEMPTS) return false;
    return true;
  } catch {
    return true;
  }
}

export function recordAuthAttempt(): void {
  try {
    const now = Date.now();
    const raw = localStorage.getItem(RATE_LIMIT_KEY);
    const items = raw ? JSON.parse(raw) as number[] : [];
    const recent = items.filter(ts => now - ts < RATE_LIMIT_WINDOW_MS);
    recent.push(now);
    localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify(recent));
  } catch {
    // no-op
  }
}

export function getGuestProfile() {
  try {
    const raw = localStorage.getItem('lifequest_state');
    if (!raw) return null;
    const state = JSON.parse(raw);
    return state?.user || null;
  } catch {
    return null;
  }
}

export function getGuestQuests() {
  try {
    const raw = localStorage.getItem('lifequest_state');
    if (!raw) return [];
    const state = JSON.parse(raw);
    return Array.isArray(state?.quests) ? state.quests : [];
  } catch {
    return [];
  }
}

export function getPasswordStrength(password: string) {
  let score = 0;
  if (password.length >= 8) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;

  const map = [
    { label: 'Çok zayıf', color: 'weak' },
    { label: 'Zayıf', color: 'weak' },
    { label: 'Orta', color: 'medium' },
    { label: 'Güçlü', color: 'strong' },
    { label: 'Çok güçlü', color: 'strong' },
  ];

  return { score, label: map[Math.min(score, map.length - 1)].label, color: map[Math.min(score, map.length - 1)].color };
}

export function hasGuestProgress(): boolean {
  return Boolean(getGuestProfile() || getGuestQuests().length);
}
