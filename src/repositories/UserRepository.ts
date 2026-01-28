import { BaseRepository } from './BaseRepository'
import { User, type UserData } from '@/models/User'
import { firestoreService } from '@/services/firebase'

/**
 * User Repository - Data Access Layer (Model in MVC)
 * Handles all database operations for User entities
 */
export class UserRepository extends BaseRepository<User> {
  constructor() {
    super('users', User)
  }

  /**
   * Find user by email
   */
  async findByEmail(email: string): Promise<User | null> {
    const users = await this.query(
      firestoreService.where('email', '==', email)
    )
    return users.length > 0 ? (users[0] ?? null) : null
  }

  /**
   * Find users by role
   */
  async findByRole(role: string): Promise<User[]> {
    return await this.query(
      firestoreService.where('role', '==', role)
    )
  }
}

export const userRepository = new UserRepository()

