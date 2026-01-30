import { BaseController } from '@/shared/BaseController'
import { adminUserService } from '../services/UserService'
import type { User } from '@/features/auth/models/User'
import type { UserCredential } from 'firebase/auth'

/**
 * User Controller - Business Logic Layer (Controller in MVC)
 * Orchestrates admin user-related business operations
 */
export class AdminUserController extends BaseController {
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
      const userCredential = await adminUserService.createUser(email, password, displayName, role, adminUserId)
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
      const users = await adminUserService.getAllUsers()
      return this.success(users)
    } catch (error) {
      return this.handleError(error)
    }
  }

  /**
   * Update user details (admin only)
   */
  async updateUser(
    userId: string,
    data: Partial<User>,
    adminUserId: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      await adminUserService.updateUser(userId, data, adminUserId)
      return { success: true }
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
      await adminUserService.updateUserRole(userId, newRole, adminUserId)
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
      await adminUserService.deleteUser(userId, adminUserId)
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
      await adminUserService.resetUserPassword(userEmail, adminUserId)
      return { success: true }
    } catch (error) {
      return this.handleError(error)
    }
  }
}

export const adminUserController = new AdminUserController()


