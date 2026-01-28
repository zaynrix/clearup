import {
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
  type QueryConstraint,
  type DocumentData,
  type QueryDocumentSnapshot
} from 'firebase/firestore'
import { db } from './config'

export class FirestoreService {
  /**
   * Get a single document by ID
   */
  async getDocument<T>(collectionName: string, documentId: string): Promise<T | null> {
    const docRef = doc(db, collectionName, documentId)
    const docSnap = await getDoc(docRef)
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as T
    }
    return null
  }

  /**
   * Get all documents from a collection
   */
  async getDocuments<T>(collectionName: string, constraints?: QueryConstraint[]): Promise<T[]> {
    const collectionRef = collection(db, collectionName)
    const q = constraints ? query(collectionRef, ...constraints) : collectionRef
    const querySnapshot = await getDocs(q)
    
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data()
    })) as T[]
  }

  /**
   * Create a new document
   */
  async createDocument<T extends DocumentData>(
    collectionName: string,
    documentId: string,
    data: T
  ): Promise<void> {
    const docRef = doc(db, collectionName, documentId)
    await setDoc(docRef, data)
  }

  /**
   * Create a document with auto-generated ID
   */
  async createDocumentWithAutoId<T extends DocumentData>(
    collectionName: string,
    data: T
  ): Promise<string> {
    const collectionRef = collection(db, collectionName)
    const docRef = doc(collectionRef)
    await setDoc(docRef, data)
    return docRef.id
  }

  /**
   * Update an existing document
   */
  async updateDocument<T extends DocumentData>(
    collectionName: string,
    documentId: string,
    data: Partial<T>
  ): Promise<void> {
    const docRef = doc(db, collectionName, documentId)
    await updateDoc(docRef, data as DocumentData)
  }

  /**
   * Delete a document
   */
  async deleteDocument(collectionName: string, documentId: string): Promise<void> {
    const docRef = doc(db, collectionName, documentId)
    await deleteDoc(docRef)
  }

  /**
   * Query builder helpers
   */
  where(field: string, operator: any, value: any) {
    return where(field, operator, value)
  }

  orderBy(field: string, direction?: 'asc' | 'desc') {
    return orderBy(field, direction)
  }

  limitTo(count: number) {
    return limit(count)
  }
}

export const firestoreService = new FirestoreService()

