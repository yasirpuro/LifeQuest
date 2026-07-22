/**
 * Firebase Client Configuration
 * Firebase Authentication + Firestore for LifeQuest
 */

import { 
  initializeApp, 
  getApps, 
  type FirebaseApp 
} from 'firebase/app';
import { 
  getAuth, 
  type Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence,
  type User,
  type UserCredential
} from 'firebase/auth';
import { 
  getFirestore, 
  type Firestore,
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  addDoc,
  serverTimestamp,
  enableIndexedDbPersistence,
  type DocumentData,
  type QueryDocumentSnapshot
} from 'firebase/firestore';
import { 
  getAnalytics, 
  type Analytics 
} from 'firebase/analytics';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Validate Firebase config
const isFirebaseConfigured = (): boolean => {
  return !!(
    firebaseConfig.apiKey &&
    firebaseConfig.authDomain &&
    firebaseConfig.projectId &&
    firebaseConfig.storageBucket &&
    firebaseConfig.messagingSenderId &&
    firebaseConfig.appId
  );
};

// Initialize Firebase
let app: FirebaseApp;
let auth: Auth;
let firestore: Firestore;
let analytics: Analytics | null = null;

if (getApps().length === 0) {
  if (!isFirebaseConfigured()) {
    console.error('Firebase configuration is missing or incomplete');
    console.error('Please check your .env.local file');
  } else {
    try {
      app = initializeApp(firebaseConfig);
      auth = getAuth(app);
      firestore = getFirestore(app);
      
      // Set auth persistence to LOCAL (persists across browser sessions)
      setPersistence(auth, browserLocalPersistence).catch((error) => {
        console.error('Auth persistence error:', error);
      });
      
      // Initialize Analytics only in browser environment
      if (typeof window !== 'undefined') {
        analytics = getAnalytics(app);
      }
      
      console.log('Firebase initialized successfully');
    } catch (error) {
      console.error('Firebase initialization error:', error);
    }
  }
} else {
  app = getApps()[0];
  auth = getAuth(app);
  firestore = getFirestore(app);
}

export { app, auth, firestore, analytics };
export { isFirebaseConfigured };
export { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence
};
export type { User, UserCredential };
export {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  addDoc,
  serverTimestamp,
  enableIndexedDbPersistence
};
export type { DocumentData, QueryDocumentSnapshot };
