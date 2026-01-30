import { BaseService } from '@/shared/BaseService'
import { UserRepository } from '@/shared/repositories/UserRepository'
import { authService } from '@/features/auth/services/AuthService'
import { User, type UserData } from '@/features/auth/models/User'
import { activityLogService } from './ActivityLogService'
import type { UserCredential } from 'firebase/auth'

/**
 * User Service - Business Logic Layer (Model in MVC)
 * Contains business logic for admin user operations
 */
export class AdminUserService extends BaseService {
  private userRepository: UserRepository

  constructor() {
    super()
    this.userRepository = new UserRepository()
  }

  /**
   * Create a new user (admin only)
   */
  async createUser(
    email: string,
    password: string,
    displayName: string,
    role: string = 'user',
    adminUserId: string
  ): Promise<UserCredential> {
    if (!this.validate(email) || !this.validate(password)) {
      throw new Error('Email and password are required')
    }

    // Verify admin
    const isAdminUser = await this.isAdmin(adminUserId)
    if (!isAdminUser) {
      throw new Error('Only admins can create users')
    }

    try {
      // Create auth user
      const userCredential = await authService.signUp(email, password)

      // Create user document in Firestore
      const userData: Partial<UserData> = {
        email,
        displayName,
        role
      }

      if (userCredential.user.uid) {
        await this.userRepository.create({
          id: userCredential.user.uid,
          ...userData
        } as User)

        // Log activity
        const adminUser = await this.userRepository.findById(adminUserId)
        await activityLogService.logActivity({
          userId: adminUserId,
          userEmail: adminUser?.email || '',
          userName: adminUser?.displayName,
          action: 'create_user',
          resource: 'user',
          resourceId: userCredential.user.uid,
          changes: {
            email,
            displayName,
            role
          }
        })
      }

      return userCredential
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * Get all users (admin only)
   */
  async getAllUsers(): Promise<User[]> {
    try {
      return await this.userRepository.findAll()
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * Update user details (admin only)
   */
  async updateUser(
    userId: string,
    data: Partial<UserData>,
    adminUserId: string
  ): Promise<void> {
    if (!this.validate(userId)) {
      throw new Error('User ID is required')
    }

    // Verify admin
    const isAdminUser = await this.isAdmin(adminUserId)
    if (!isAdminUser) {
      throw new Error('Only admins can update users')
    }

    try {
      const user = await this.userRepository.findById(userId)
      if (!user) {
        throw new Error('User not found')
      }

      // Check if email is being changed and if it conflicts with existing user
      if (data.email && data.email !== user.email) {
        const existing = await this.userRepository.findByEmail(data.email)
        if (existing && existing.id !== userId) {
          throw new Error('User with this email already exists')
        }
      }

      const oldData = {
        email: user.email,
        displayName: user.displayName,
        role: user.role
      }

      await this.userRepository.update(userId, {
        ...data,
        updatedAt: new Date()
      } as User)

      // Log activity
      const adminUser = await this.userRepository.findById(adminUserId)
      const changes: Record<string, any> = {}
      
      if (data.email && data.email !== oldData.email) {
        changes.email = { before: oldData.email, after: data.email }
      }
      if (data.displayName !== undefined && data.displayName !== oldData.displayName) {
        changes.displayName = { before: oldData.displayName, after: data.displayName }
      }
      if (data.role && data.role !== oldData.role) {
        changes.role = { before: oldData.role, after: data.role }
      }

      if (Object.keys(changes).length > 0) {
        await activityLogService.logActivity({
          userId: adminUserId,
          userEmail: adminUser?.email || '',
          userName: adminUser?.displayName,
          action: 'update_user',
          resource: 'user',
          resourceId: userId,
          changes
        })
      }
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * Update user role (admin only)
   */
  async updateUserRole(
    userId: string,
    newRole: string,
    adminUserId: string
  ): Promise<void> {
    if (!this.validate(userId) || !this.validate(newRole)) {
      throw new Error('User ID and role are required')
    }

    // Verify admin
    const isAdminUser = await this.isAdmin(adminUserId)
    if (!isAdminUser) {
      throw new Error('Only admins can update user roles')
    }

    try {
      const user = await this.userRepository.findById(userId)
      if (!user) {
        throw new Error('User not found')
      }

      const oldRole = user.role
      await this.userRepository.update(userId, { role: newRole } as User)

      // Log activity
      const adminUser = await this.userRepository.findById(adminUserId)
      await activityLogService.logActivity({
        userId: adminUserId,
        userEmail: adminUser?.email || '',
        userName: adminUser?.displayName,
        action: 'update_user_role',
        resource: 'user',
        resourceId: userId,
        changes: {
          oldRole,
          newRole,
          userEmail: user.email
        }
      })
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * Delete user (admin only)
   */
  async deleteUser(userId: string, adminUserId: string): Promise<void> {
    if (!this.validate(userId)) {
      throw new Error('User ID is required')
    }

    // Verify admin
    const isAdminUser = await this.isAdmin(adminUserId)
    if (!isAdminUser) {
      throw new Error('Only admins can delete users')
    }

    try {
      const user = await this.userRepository.findById(userId)
      if (!user) {
        throw new Error('User not found')
      }

      await this.userRepository.delete(userId)

      // Log activity
      const adminUser = await this.userRepository.findById(adminUserId)
      await activityLogService.logActivity({
        userId: adminUserId,
        userEmail: adminUser?.email || '',
        userName: adminUser?.displayName,
        action: 'delete_user',
        resource: 'user',
        resourceId: userId,
        changes: {
          deletedUserEmail: user.email,
          deletedUserRole: user.role
        }
      })
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * Reset user password (admin only) - sends password reset email
   */
  async resetUserPassword(userEmail: string, adminUserId: string): Promise<void> {
    if (!this.validate(userEmail)) {
      throw new Error('User email is required')
    }

    // Verify admin
    const isAdminUser = await this.isAdmin(adminUserId)
    if (!isAdminUser) {
      throw new Error('Only admins can reset user passwords')
    }

    try {
      // Check if user exists
      const user = await this.userRepository.findByEmail(userEmail)
      if (!user) {
        throw new Error('User not found')
      }

      await authService.sendPasswordResetEmail(userEmail)

      // Log activity
      const adminUser = await this.userRepository.findById(adminUserId)
      await activityLogService.logActivity({
        userId: adminUserId,
        userEmail: adminUser?.email || '',
        userName: adminUser?.displayName,
        action: 'reset_user_password',
        resource: 'user',
        resourceId: user.id,
        changes: {
          userEmail: user.email,
          action: 'password_reset_email_sent'
        }
      })
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * Check if user is admin
   */
  async isAdmin(userId?: string): Promise<boolean> {
    try {
      const currentUserId = userId || authService.getCurrentUser()?.uid
      if (!currentUserId) return false

      const user = await this.userRepository.findById(currentUserId)
      return user?.role === 'admin'
    } catch (error) {
      return false
    }
  }
}

export const adminUserService = new AdminUserService()

