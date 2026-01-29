import { initializeApp, type FirebaseApp } from 'firebase/app'
import { getAuth, setPersistence, browserLocalPersistence, type Auth } from 'firebase/auth'
import { getFirestore, type Firestore } from 'firebase/firestore'
import { getStorage, type FirebaseStorage } from 'firebase/storage'
import { getAnalytics, type Analytics } from 'firebase/analytics'

// Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'your-api-key',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'your-project.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'your-project-id',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'your-project.appspot.com',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || 'your-sender-id',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || 'your-app-id',
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || undefined
}

// Initialize Firebase
let app: FirebaseApp
let auth: Auth
let db: Firestore
let storage: FirebaseStorage
let analytics: Analytics | null = null

try {
  app = initializeApp(firebaseConfig)
  auth = getAuth(app)
  db = getFirestore(app)
  storage = getStorage(app)
  
  // Set persistent authentication (stay logged in until logout)
  if (typeof window !== 'undefined') {
    setPersistence(auth, browserLocalPersistence).catch((error) => {
      console.warn('Firebase Auth persistence error:', error)
    })
    
    // Initialize Analytics only in browser environment and if measurementId is provided
    if (firebaseConfig.measurementId) {
      try {
        analytics = getAnalytics(app)
      } catch (error) {
        console.warn('Firebase Analytics initialization error:', error)
      }
    }
  }
} catch (error) {
  console.error('Firebase initialization error:', error)
  throw error
}

export { app, auth, db, storage, analytics }
export type { FirebaseApp, Auth, Firestore, FirebaseStorage, Analytics }

