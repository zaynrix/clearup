import { BaseService } from './BaseService'
import { RoleRepository } from '@/repositories/RoleRepository'
import { Role, type RoleData } from '@/models/Role'

/**
 * Role Service - Business Logic Layer (Model in MVC)
 * Contains business logic for role operations
 */
export class RoleService extends BaseService {
  private roleRepository: RoleRepository

  constructor() {
    super()
    this.roleRepository = new RoleRepository()
  }

  /**
   * Create a new role (admin only)
   */
  async createRole(data: Partial<RoleData>): Promise<Role> {
    if (!this.validate(data.name)) {
      throw new Error('Role name is required')
    }

    try {
      // Check if role already exists
      const existing = await this.roleRepository.findByName(data.name!)
      if (existing) {
        throw new Error('Role with this name already exists')
      }

      const role = new Role({
        ...data,
        createdAt: new Date(),
        updatedAt: new Date()
      })

      const id = await this.roleRepository.create(role)
      role.id = id
      return role
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * Get all roles
   */
  async getAllRoles(): Promise<Role[]> {
    try {
      return await this.roleRepository.findAll()
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * Get role by ID
   */
  async getRoleById(roleId: string): Promise<Role | null> {
    if (!this.validate(roleId)) {
      throw new Error('Role ID is required')
    }

    try {
      return await this.roleRepository.findById(roleId)
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * Get role by name
   */
  async getRoleByName(name: string): Promise<Role | null> {
    if (!this.validate(name)) {
      throw new Error('Role name is required')
    }

    try {
      return await this.roleRepository.findByName(name)
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * Update role
   */
  async updateRole(roleId: string, data: Partial<RoleData>): Promise<void> {
    if (!this.validate(roleId)) {
      throw new Error('Role ID is required')
    }

    try {
      await this.roleRepository.update(roleId, {
        ...data,
        updatedAt: new Date()
      } as Role)
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * Delete role
   */
  async deleteRole(roleId: string): Promise<void> {
    if (!this.validate(roleId)) {
      throw new Error('Role ID is required')
    }

    try {
      await this.roleRepository.delete(roleId)
    } catch (error) {
      throw this.handleError(error)
    }
  }
}

export const roleService = new RoleService()

