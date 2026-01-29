import { BaseRepository } from './BaseRepository'
import { Role, type RoleData } from '@/features/admin/models/Role'
import { firestoreService } from '@/shared/services'

/**
 * Role Repository - Data Access Layer (Model in MVC)
 * Handles all database operations for Role entities
 */
export class RoleRepository extends BaseRepository<Role> {
  constructor() {
    super('roles', Role)
  }

  /**
   * Find role by name
   */
  async findByName(name: string): Promise<Role | null> {
    const roles = await this.query(
      firestoreService.where('name', '==', name)
    )
    return roles.length > 0 ? (roles[0] ?? null) : null
  }
}

export const roleRepository = new RoleRepository()

