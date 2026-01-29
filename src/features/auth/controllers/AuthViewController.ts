import { ref, type Ref } from 'vue'
import { BaseViewController } from '@/shared/BaseViewController'
import { authController } from './AuthController'
import type { User } from '../models/User'
import type { UserCredential } from 'firebase/auth'

/**
 * Auth View Controller - Presentation Layer (Controller in MVC)
 * Handles authentication-related UI interactions and state management
 */
export class AuthViewController extends BaseViewController {
  private currentUser: Ref<User | null> = ref(null)

  /**
   * Register a new user
   */
  async register(email: string, password: string, displayName?: string): Promise<boolean> {
    this.setLoading(true)
    this.clearError()

    try {
      const result = await authController.register(email, password, displayName)
      
      if (result.success && result.data) {
        // Fetch user profile after registration
        await this.loadCurrentUser()
        return true
      } else {
        this.setError(result.error || 'Registration failed')
        return false
      }
    } catch (err) {
      this.setError(err instanceof Error ? err.message : 'An unexpected error occurred')
      return false
    } finally {
      this.setLoading(false)
    }
  }

  /**
   * Login user
   */
  async login(email: string, password: string): Promise<boolean> {
    this.setLoading(true)
    this.clearError()

    try {
      const result = await authController.login(email, password)
      
      if (result.success && result.data) {
        // Fetch user profile after login
        await this.loadCurrentUser()
        return true
      } else {
        this.setError(result.error || 'Login failed')
        return false
      }
    } catch (err) {
      this.setError(err instanceof Error ? err.message : 'An unexpected error occurred')
      return false
    } finally {
      this.setLoading(false)
    }
  }

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    this.setLoading(true)
    this.clearError()

    try {
      const result = await authController.logout()
      
      if (result.success) {
        this.currentUser.value = null
      } else {
        this.setError(result.error || 'Logout failed')
      }
    } catch (err) {
      this.setError(err instanceof Error ? err.message : 'An unexpected error occurred')
    } finally {
      this.setLoading(false)
    }
  }

  /**
   * Load current user profile
   */
  async loadCurrentUser(): Promise<void> {
    try {
      const result = await authController.getCurrentUserProfile()
      
      if (result.success) {
        this.currentUser.value = result.data || null
      }
    } catch (err) {
      this.setError(err instanceof Error ? err.message : 'Failed to load user profile')
    }
  }

  /**
   * Get current user
   */
  get user(): User | null {
    return this.currentUser.value
  }
}


