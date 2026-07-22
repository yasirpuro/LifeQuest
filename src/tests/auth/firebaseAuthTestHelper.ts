/**
 * Firebase Auth Test Helper
 * Test ortamında Firebase Authentication işlemleri için helper fonksiyonlar
 */

import { firebaseAuthService } from '../../core/services/firebaseAuthService';
import { firestoreService } from '../../core/services/firestoreService';

export interface TestUser {
  uid: string;
  email: string;
  password: string;
}

let currentTestUser: TestUser | null = null;

/**
 * Test kullanıcısı oluştur
 * Firebase Auth + Firestore profile oluşturur
 */
export async function createTestUser(email?: string, password?: string): Promise<TestUser> {
  const testEmail = email || `test-${Date.now()}@lifequest.test`;
  const testPassword = password || 'TestPassword123!';
  
  try {
    // Firebase Auth ile kayıt ol
    const userCredential = await firebaseAuthService.signUp(testEmail, testPassword);
    const uid = userCredential.user.uid;
    
    // Firestore'da profile oluştur
    await firestoreService.createDocumentWithId('profiles', uid, {
      email: testEmail,
      level: 1,
      xp: 0,
      streak: 0,
      isPremium: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    
    // Test user objesini kaydet
    currentTestUser = {
      uid,
      email: testEmail,
      password: testPassword
    };
    
    console.log('Test user created:', currentTestUser);
    return currentTestUser;
  } catch (error) {
    console.error('Error creating test user:', error);
    throw error;
  }
}

/**
 * Test kullanıcısı ile giriş yap
 */
export async function loginTestUser(email: string, password: string): Promise<TestUser> {
  try {
    const userCredential = await firebaseAuthService.signIn(email, password);
    const uid = userCredential.user.uid;
    
    currentTestUser = {
      uid,
      email,
      password
    };
    
    console.log('Test user logged in:', currentTestUser);
    return currentTestUser;
  } catch (error) {
    console.error('Error logging in test user:', error);
    throw error;
  }
}

/**
 * Çıkış yap
 */
export async function logoutTestUser(): Promise<void> {
  try {
    await firebaseAuthService.signOut();
    currentTestUser = null;
    console.log('Test user logged out');
  } catch (error) {
    console.error('Error logging out test user:', error);
    throw error;
  }
}

/**
 * Test oturumunu temizle
 * Firebase Auth + Firestore verilerini siler
 */
export async function clearTestSession(): Promise<void> {
  if (!currentTestUser) {
    console.log('No test user to clear');
    return;
  }
  
  try {
    // Firestore'dan profile sil
    await firestoreService.deleteDocument('profiles', currentTestUser.uid);
    
    // Firebase Auth'dan çıkış yap
    await firebaseAuthService.signOut();
    
    // Test user objesini temizle
    currentTestUser = null;
    
    console.log('Test session cleared');
  } catch (error) {
    console.error('Error clearing test session:', error);
    throw error;
  }
}

/**
 * Mevcut test kullanıcısını al
 */
export function getCurrentTestUser(): TestUser | null {
  return currentTestUser;
}

/**
 * Test kullanıcısının Firestore'da profile olup olmadığını kontrol et
 */
export async function checkTestUserProfile(): Promise<boolean> {
  if (!currentTestUser) {
    return false;
  }
  
  try {
    const profile = await firestoreService.getDocument('profiles', currentTestUser.uid);
    return profile !== null;
  } catch (error) {
    console.error('Error checking test user profile:', error);
    return false;
  }
}

/**
 * Test kullanıcısının auth state'ini kontrol et
 */
export function checkTestUserAuthState(): boolean {
  return firebaseAuthService.isAuthenticated();
}

/**
 * Test için random email oluştur
 */
export function generateTestEmail(): string {
  return `test-${Date.now()}-${Math.random().toString(36).substring(7)}@lifequest.test`;
}

/**
 * Test için random password oluştur
 */
export function generateTestPassword(): string {
  const length = 12;
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
  let password = '';
  for (let i = 0; i < length; i++) {
    password += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return password;
}
