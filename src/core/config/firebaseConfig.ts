export function initializeFirebase(): void {
  if (typeof window === 'undefined') return;
  console.info('[FirebaseConfig] Firebase initialization skipped in this build.');
}
