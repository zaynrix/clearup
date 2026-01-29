import { BaseService } from '@/shared/BaseService'
import { UserRepository } from '@/shared/repositories/UserRepository'
import { authService } from './AuthService'
import { User, type UserData } from '../models/User'
import type { UserCredential } from 'firebase/auth'

/**
 * User Service - Business Logic Layer (Model in MVC)
 * Contains business logic for user operations
 */
export class UserService extends BaseService {
  private userRepository: UserRepository

  constructor() {
    super()
    this.userRepository = new UserRepository()
  }

  /**
   * Register a new user
   */
  async register(email: string, password: string, displayName?: string): Promise<UserCredential> {
    if (!this.validate(email) || !this.validate(password)) {
      throw new Error('Email and password are required')
    }

    try {
      // Create auth user
      const userCredential = await authService.signUp(email, password)
      
      // Create user document in Firestore
      const userData: Partial<UserData> = {
        email,
        role: 'user'
      }
      
      // Only include displayName if it's provided (not undefined)
      if (displayName) {
        userData.displayName = displayName
      }
      
      if (userCredential.user.uid) {
        await this.userRepository.create({
          id: userCredential.user.uid,
          ...userData
        } as User)
      }

      return userCredential
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * Login user
   */
  async login(email: string, password: string): Promise<UserCredential> {
    if (!this.validate(email) || !this.validate(password)) {
      throw new Error('Email and password are required')
    }

    try {
      return await authService.signIn(email, password)
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    try {
      await authService.signOut()
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * Get current user profile
   */
  async getCurrentUserProfile(): Promise<User | null> {
    try {
      const firebaseUser = authService.getCurrentUser()
      if (!firebaseUser) return null

      const user = await this.userRepository.findById(firebaseUser.uid)
      return user
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * Update user profile
   */
  async updateProfile(userId: string, data: Partial<UserData>): Promise<void> {
    if (!this.validate(userId)) {
      throw new Error('User ID is required')
    }

    try {
      await this.userRepository.update(userId, data as User)
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * Get user by ID
   */
  async getUserById(userId: string): Promise<User | null> {
    if (!this.validate(userId)) {
      throw new Error('User ID is required')
    }

    try {
      return await this.userRepository.findById(userId)
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * Check if current user is admin
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

export const userService = new UserService()

