import { BaseController } from '@/shared/BaseController'
import { UserService } from '../services/UserService'
import type { User } from '../models/User'
import type { UserCredential } from 'firebase/auth'

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
      return this.handleError(error)
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
      return this.handleError(error)
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

