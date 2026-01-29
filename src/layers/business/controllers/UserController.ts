import { BaseController } from './BaseController'
import { UserService } from '../services/UserService'
import type { User } from '@/models/User'
import type { UserCredential } from 'firebase/auth'

/**
 * User Controller - Business Logic Layer (Controller in MVC)
 * Orchestrates user-related business operations
 */
export class UserController extends BaseController {
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

  /**
   * Update user profile
   */
  async updateProfile(
    userId: string,
    data: Partial<User>
  ): Promise<{ success: boolean; error?: string }> {
    try {
      await this.userService.updateProfile(userId, data)
      return { success: true }
    } catch (error) {
      return this.handleError(error)
    }
  }

  /**
   * Get user by ID
   */
  async getUserById(userId: string): Promise<{ success: boolean; data?: User | null; error?: string }> {
    try {
      const user = await this.userService.getUserById(userId)
      return this.success(user)
    } catch (error) {
      return this.handleError(error)
    }
  }

  /**
   * Check if user is admin
   */
  async isAdmin(userId?: string): Promise<{ success: boolean; data?: boolean; error?: string }> {
    try {
      const isAdmin = await this.userService.isAdmin(userId)
      return this.success(isAdmin)
    } catch (error) {
      return this.handleError(error)
    }
  }

  /**
   * Create a new user (admin only)
   */
  async createUser(
    email: string,
    password: string,
    displayName: string,
    role: string,
    adminUserId: string
  ): Promise<{ success: boolean; data?: UserCredential; error?: string }> {
    try {
      const userCredential = await this.userService.createUser(email, password, displayName, role, adminUserId)
      return this.success(userCredential)
    } catch (error) {
      return this.handleError(error)
    }
  }

  /**
   * Get all users (admin only)
   */
  async getAllUsers(): Promise<{ success: boolean; data?: User[]; error?: string }> {
    try {
      const users = await this.userService.getAllUsers()
      return this.success(users)
    } catch (error) {
      return this.handleError(error)
    }
  }

  /**
   * Update user role (admin only)
   */
  async updateUserRole(
    userId: string,
    newRole: string,
    adminUserId: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      await this.userService.updateUserRole(userId, newRole, adminUserId)
      return { success: true }
    } catch (error) {
      return this.handleError(error)
    }
  }

  /**
   * Delete user (admin only)
   */
  async deleteUser(
    userId: string,
    adminUserId: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      await this.userService.deleteUser(userId, adminUserId)
      return { success: true }
    } catch (error) {
      return this.handleError(error)
    }
  }

  /**
   * Reset user password (admin only)
   */
  async resetUserPassword(
    userEmail: string,
    adminUserId: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      await this.userService.resetUserPassword(userEmail, adminUserId)
      return { success: true }
    } catch (error) {
      return this.handleError(error)
    }
  }
}

export const userController = new UserController()

