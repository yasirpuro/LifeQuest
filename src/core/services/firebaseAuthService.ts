/**
 * Firebase Authentication Service
 * Handles user authentication with Firebase Auth
 */

import { 
  auth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  type User,
  type UserCredential
} from '../../shared/api/firebase';

export interface AuthUser {
  uid: string;
  email: string | null;
  emailVerified: boolean;
  displayName: string | null;
  photoURL: string | null;
}

class FirebaseAuthService {
  private currentUser: User | null = null;
  private authStateListeners: Array<(user: AuthUser | null) => void> = [];

  constructor() {
    // Delay auth initialization to ensure Firebase is ready
    setTimeout(() => {
      try {
        // Listen to auth state changes
        onAuthStateChanged(auth, (user) => {
          this.currentUser = user;
          this.notifyAuthStateListeners(user);
        });
      } catch (error) {
        console.error('Firebase Auth initialization error:', error);
      }
    }, 100);
  }

  private notifyAuthStateListeners(user: User | null): void {
    const authUser = user ? this.formatUser(user) : null;
    this.authStateListeners.forEach(listener => listener(authUser));
  }

  private formatUser(user: User): AuthUser {
    return {
      uid: user.uid,
      email: user.email,
      emailVerified: user.emailVerified,
      displayName: user.displayName,
      photoURL: user.photoURL
    };
  }

  /**
   * Sign up with email and password
   */
  async signUp(email: string, password: string): Promise<UserCredential> {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log('User signed up successfully:', userCredential.user.uid);
      return userCredential;
    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
    }
  }

  /**
   * Sign in with email and password
   */
  async signIn(email: string, password: string): Promise<UserCredential> {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log('User signed in successfully:', userCredential.user.uid);
      return userCredential;
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  }

  /**
   * Sign out
   */
  async signOut(): Promise<void> {
    try {
      await signOut(auth);
      console.log('User signed out successfully');
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  }

  /**
   * Get current user
   */
  getCurrentUser(): AuthUser | null {
    if (!this.currentUser) return null;
    return this.formatUser(this.currentUser);
  }

  /**
   * Get current Firebase user
   */
  getFirebaseUser(): User | null {
    return this.currentUser;
  }

  /**
   * Subscribe to auth state changes
   */
  onAuthStateChange(callback: (user: AuthUser | null) => void): () => void {
    this.authStateListeners.push(callback);
    
    // Return unsubscribe function
    return () => {
      const index = this.authStateListeners.indexOf(callback);
      if (index > -1) {
        this.authStateListeners.splice(index, 1);
      }
    };
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return this.currentUser !== null;
  }
}

export const firebaseAuthService = new FirebaseAuthService();
