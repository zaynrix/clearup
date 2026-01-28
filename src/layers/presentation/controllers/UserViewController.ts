import { ref, type Ref } from 'vue'
import { BaseViewController } from './BaseViewController'
import { userController } from '@/layers/business/controllers/UserController'
import type { User } from '@/models/User'
import type { UserCredential } from 'firebase/auth'

/**
 * User View Controller - Presentation Layer (Controller in MVC)
 * Handles user-related UI interactions and state management
 */
export class UserViewController extends BaseViewController {
  private currentUser: Ref<User | null> = ref(null)

  /**
   * Register a new user
   */
  async register(email: string, password: string, displayName?: string): Promise<boolean> {
    this.setLoading(true)
    this.clearError()

    try {
      const result = await userController.register(email, password, displayName)
      
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
      const result = await userController.login(email, password)
      
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
      const result = await userController.logout()
      
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
      const result = await userController.getCurrentUserProfile()
      
      if (result.success) {
        this.currentUser.value = result.data || null
      }
    } catch (err) {
      this.setError(err instanceof Error ? err.message : 'Failed to load user profile')
    }
  }

  /**
   * Update user profile
   */
  async updateProfile(data: Partial<User>): Promise<boolean> {
    if (!this.currentUser.value) {
      this.setError('No user logged in')
      return false
    }

    this.setLoading(true)
    this.clearError()

    try {
      const result = await userController.updateProfile(this.currentUser.value.id, data)
      
      if (result.success) {
        await this.loadCurrentUser()
        return true
      } else {
        this.setError(result.error || 'Update failed')
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
   * Get current user
   */
  get user(): User | null {
    return this.currentUser.value
  }
}

