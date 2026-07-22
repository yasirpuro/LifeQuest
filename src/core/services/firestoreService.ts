/**
 * Firestore Service
 * Handles Firestore database operations with offline persistence
 */

import { 
  firestore, 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  addDoc,
  serverTimestamp,
  enableIndexedDbPersistence,
  type DocumentData
} from '../../shared/api/firebase';

export interface FirestoreDocument {
  id: string;
  createdAt: any;
  updatedAt: any;
}

class FirestoreService {
  private persistenceEnabled: boolean = false;

  constructor() {
    this.initializePersistence();
  }

  private async initializePersistence(): Promise<void> {
    try {
      await enableIndexedDbPersistence(firestore);
      this.persistenceEnabled = true;
      console.log('Firestore offline persistence enabled');
    } catch (error: any) {
      if (error.code === 'failed-precondition') {
        console.warn('Multiple tabs open, persistence can only be enabled in one tab at a time');
      } else if (error.code === 'unimplemented') {
        console.warn('The current browser does not support persistence');
      } else {
        console.error('Persistence initialization error:', error);
      }
    }
  }

  /**
   * Get document by ID
   */
  async getDocument(collectionName: string, docId: string): Promise<DocumentData | null> {
    try {
      const docRef = doc(firestore, collectionName, docId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return { id: docSnap.id, ...(docSnap.data() as DocumentData) };
      }
      return null;
    } catch (error) {
      console.error(`Error getting document ${docId} from ${collectionName}:`, error);
      throw error;
    }
  }

  /**
   * Get all documents from collection
   */
  async getCollection(collectionName: string): Promise<DocumentData[]> {
    try {
      const querySnapshot = await getDocs(collection(firestore, collectionName));
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...(doc.data() as DocumentData) }));
    } catch (error) {
      console.error(`Error getting collection ${collectionName}:`, error);
      throw error;
    }
  }

  /**
   * Query collection with filters
   */
  async queryCollection(
    collectionName: string,
    whereClause: { field: string; operator: string; value: any }[],
    orderByClause?: { field: string; direction: 'asc' | 'desc' },
    limitCount?: number
  ): Promise<DocumentData[]> {
    try {
      let q: any = collection(firestore, collectionName);
      
      whereClause.forEach(clause => {
        q = query(q, where(clause.field, clause.operator as any, clause.value));
      });

      if (orderByClause) {
        q = query(q, orderBy(orderByClause.field, orderByClause.direction));
      }

      if (limitCount) {
        q = query(q, limit(limitCount));
      }

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...(doc.data() as DocumentData) }));
    } catch (error) {
      console.error(`Error querying collection ${collectionName}:`, error);
      throw error;
    }
  }

  /**
   * Create document
   */
  async createDocument(collectionName: string, data: DocumentData): Promise<string> {
    try {
      const docRef = await addDoc(collection(firestore, collectionName), {
        ...data,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      console.log(`Document created in ${collectionName} with ID: ${docRef.id}`);
      return docRef.id;
    } catch (error) {
      console.error(`Error creating document in ${collectionName}:`, error);
      throw error;
    }
  }

  /**
   * Create document with specific ID
   */
  async createDocumentWithId(collectionName: string, docId: string, data: DocumentData): Promise<void> {
    try {
      await setDoc(doc(firestore, collectionName, docId), {
        ...data,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      console.log(`Document created in ${collectionName} with ID: ${docId}`);
    } catch (error) {
      console.error(`Error creating document ${docId} in ${collectionName}:`, error);
      throw error;
    }
  }

  async updateDocument(collectionName: string, docId: string, data: Partial<DocumentData>): Promise<void> {
    try {
      await setDoc(doc(firestore, collectionName, docId), {
        ...data,
        updatedAt: serverTimestamp()
      }, { merge: true });
      console.log(`Document ${docId} updated/upserted in ${collectionName}`);
    } catch (error) {
      console.error(`Error updating/upserting document ${docId} in ${collectionName}:`, error);
      throw error;
    }
  }

  /**
   * Delete document
   */
  async deleteDocument(collectionName: string, docId: string): Promise<void> {
    try {
      await deleteDoc(doc(firestore, collectionName, docId));
      console.log(`Document ${docId} deleted from ${collectionName}`);
    } catch (error) {
      console.error(`Error deleting document ${docId} from ${collectionName}:`, error);
      throw error;
    }
  }

  /**
   * Check if offline persistence is enabled
   */
  isPersistenceEnabled(): boolean {
    return this.persistenceEnabled;
  }

  /**
   * Get user profile
   */
  async getUserProfile(userId: string): Promise<DocumentData | null> {
    return this.getDocument('profiles', userId);
  }

  /**
   * Create or update user profile
   */
  async upsertUserProfile(userId: string, profileData: DocumentData): Promise<void> {
    const existing = await this.getUserProfile(userId);
    
    if (existing) {
      await this.updateDocument('profiles', userId, profileData);
    } else {
      await this.createDocumentWithId('profiles', userId, profileData);
    }
  }

  /**
   * Get user skills
   */
  async getUserSkills(userId: string): Promise<DocumentData[]> {
    return this.queryCollection('skills', [
      { field: 'userId', operator: '==', value: userId }
    ]);
  }

  /**
   * Get user quests
   */
  async getUserQuests(userId: string, limitCount: number = 10): Promise<DocumentData[]> {
    return this.queryCollection(
      'quests',
      [{ field: 'userId', operator: '==', value: userId }],
      { field: 'createdAt', direction: 'desc' },
      limitCount
    );
  }

  /**
   * Get user rewards
   */
  async getUserRewards(userId: string, limitCount: number = 10): Promise<DocumentData[]> {
    return this.queryCollection(
      'rewards',
      [{ field: 'userId', operator: '==', value: userId }],
      { field: 'createdAt', direction: 'desc' },
      limitCount
    );
  }

  /**
   * Get user subscription
   */
  async getUserSubscription(userId: string): Promise<DocumentData | null> {
    const subscriptions = await this.queryCollection('subscriptions', [
      { field: 'userId', operator: '==', value: userId }
    ], { field: 'createdAt', direction: 'desc' }, 1);
    
    return subscriptions.length > 0 ? subscriptions[0] : null;
  }

  /**
   * Log analytics event
   */
  async logAnalyticsEvent(eventData: DocumentData): Promise<void> {
    try {
      await this.createDocument('analytics_events', eventData);
    } catch (error) {
      console.error('Error logging analytics event:', error);
      // Don't throw error for analytics logging
    }
  }
}

export const firestoreService = new FirestoreService();
