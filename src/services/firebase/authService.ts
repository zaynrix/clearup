import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  type User,
  type UserCredential
} from 'firebase/auth'
import { auth } from './config'

export class AuthService {
  /**
   * Sign in with email and password
   */
  async signIn(email: string, password: string): Promise<UserCredential> {
    return await signInWithEmailAndPassword(auth, email, password)
  }

  /**
   * Sign up with email and password
   */
  async signUp(email: string, password: string): Promise<UserCredential> {
    return await createUserWithEmailAndPassword(auth, email, password)
  }

  /**
   * Sign out current user
   */
  async signOut(): Promise<void> {
    return await signOut(auth)
  }

  /**
   * Get current user
   */
  getCurrentUser(): User | null {
    return auth.currentUser
  }

  /**
   * Listen to auth state changes
   */
  onAuthStateChange(callback: (user: User | null) => void): () => void {
    return onAuthStateChanged(auth, callback)
  }
}

export const authService = new AuthService()

