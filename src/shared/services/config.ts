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

// Validate Firebase configuration in development
if (import.meta.env.DEV) {
  const hasPlaceholderValues = 
    firebaseConfig.apiKey === 'your-api-key' ||
    firebaseConfig.authDomain === 'your-project.firebaseapp.com' ||
    firebaseConfig.projectId === 'your-project-id' ||
    firebaseConfig.storageBucket === 'your-project.appspot.com' ||
    firebaseConfig.messagingSenderId === 'your-sender-id' ||
    firebaseConfig.appId === 'your-app-id'
  
  if (hasPlaceholderValues) {
    console.warn('⚠️ Firebase configuration appears to be using placeholder values.')
    console.warn('Please set up your Firebase environment variables in a .env file.')
    console.warn('See FIREBASE_SETUP.md for instructions.')
  }
}

// Validate Firebase configuration in production
if (import.meta.env.PROD) {
  const hasPlaceholderValues = 
    firebaseConfig.apiKey === 'your-api-key' ||
    firebaseConfig.authDomain === 'your-project.firebaseapp.com' ||
    firebaseConfig.projectId === 'your-project-id' ||
    firebaseConfig.storageBucket === 'your-project.appspot.com' ||
    firebaseConfig.messagingSenderId === 'your-sender-id' ||
    firebaseConfig.appId === 'your-app-id'
  
  if (hasPlaceholderValues) {
    console.error('❌ Firebase configuration is missing!')
    console.error('Please set up GitHub Secrets for Firebase environment variables.')
    console.error('See DEPLOYMENT.md section 5 for instructions.')
  }
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

