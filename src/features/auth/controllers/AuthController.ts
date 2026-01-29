import { BaseController } from '@/shared/BaseController'
import { UserService } from '../services/UserService'
import type { User } from '../models/User'
import type { UserCredential } from 'firebase/auth'
import { FirebaseError } from 'firebase/app'

/**
 * Auth Controller - Business Logic Layer (Controller in MVC)
 * Orchestrates authentication-related business operations
 */
export class AuthController extends BaseController {
  private userService: UserService

  constructor() {
    super()
    this.userService = new UserService()
  }

  /**
   * Get user-friendly error message from Firebase error
   */
  private getFirebaseErrorMessage(error: unknown): string {
    if (error instanceof FirebaseError) {
      switch (error.code) {
        case 'auth/invalid-credential':
        case 'auth/wrong-password':
        case 'auth/user-not-found':
          return 'Invalid email or password. Please check your credentials and try again.'
        case 'auth/invalid-email':
          return 'Invalid email address. Please enter a valid email.'
        case 'auth/user-disabled':
          return 'This account has been disabled. Please contact support.'
        case 'auth/too-many-requests':
          return 'Too many failed login attempts. Please try again later.'
        case 'auth/network-request-failed':
          return 'Network error. Please check your internet connection and try again.'
        case 'auth/email-already-in-use':
          return 'This email is already registered. Please use a different email or try logging in.'
        case 'auth/weak-password':
          return 'Password is too weak. Please use a stronger password.'
        case 'auth/operation-not-allowed':
          return 'This sign-in method is not enabled. Please contact support.'
        default:
          return error.message || 'An authentication error occurred. Please try again.'
      }
    }
    if (error instanceof Error) {
      return error.message
    }
    return String(error)
  }

  /**
   * Register a new user
   */
  async register(
    email: string,
    password: string,
    displayName?: string
  ): Promise<{ success: boolean; data?: UserCredential; error?: string }> {
    try {
      const userCredential = await this.userService.register(email, password, displayName)
      return this.success(userCredential)
    } catch (error) {
      const errorMessage = this.getFirebaseErrorMessage(error)
      return { success: false, error: errorMessage }
    }
  }

  /**
   * Login user
   */
  async login(
    email: string,
    password: string
  ): Promise<{ success: boolean; data?: UserCredential; error?: string }> {
    try {
      const userCredential = await this.userService.login(email, password)
      return this.success(userCredential)
    } catch (error) {
      const errorMessage = this.getFirebaseErrorMessage(error)
      return { success: false, error: errorMessage }
    }
  }

  /**
   * Logout user
   */
  async logout(): Promise<{ success: boolean; error?: string }> {
    try {
      await this.userService.logout()
      return { success: true }
    } catch (error) {
      return this.handleError(error)
    }
  }

  /**
   * Get current user profile
   */
  async getCurrentUserProfile(): Promise<{ success: boolean; data?: User | null; error?: string }> {
    try {
      const user = await this.userService.getCurrentUserProfile()
      return this.success(user)
    } catch (error) {
      return this.handleError(error)
    }
  }
}

export const authController = new AuthController()

