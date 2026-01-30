import { BaseService } from '@/shared/BaseService'
import { RoleRepository } from '@/shared/repositories/RoleRepository'
import { Role, type RoleData } from '../models/Role'
import { UserRepository } from '@/shared/repositories/UserRepository'
import { authService } from '@/shared/services'

/**
 * Role Service - Business Logic Layer (Model in MVC)
 * Contains business logic for role operations
 */
export class RoleService extends BaseService {
  private roleRepository: RoleRepository
  private userRepository: UserRepository

  constructor() {
    super()
    this.roleRepository = new RoleRepository()
    this.userRepository = new UserRepository()
  }

  /**
   * Check if current user is admin
   */
  private async isAdmin(userId?: string): Promise<boolean> {
    try {
      const currentUserId = userId || authService.getCurrentUser()?.uid
      if (!currentUserId) return false

      const user = await this.userRepository.findById(currentUserId)
      return user?.role === 'admin'
    } catch (error) {
      return false
    }
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
   * Update role (admin only)
   */
  async updateRole(roleId: string, data: Partial<RoleData>, adminUserId?: string): Promise<void> {
    if (!this.validate(roleId)) {
      throw new Error('Role ID is required')
    }

    // Verify admin
    const isAdminUser = await this.isAdmin(adminUserId)
    if (!isAdminUser) {
      throw new Error('Only admins can update roles')
    }

    // Check if role name is being changed and if it conflicts with existing role
    if (data.name) {
      const existing = await this.roleRepository.findByName(data.name)
      if (existing && existing.id !== roleId) {
        throw new Error('Role with this name already exists')
      }
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
   * Delete role (admin only)
   */
  async deleteRole(roleId: string, adminUserId?: string): Promise<void> {
    if (!this.validate(roleId)) {
      throw new Error('Role ID is required')
    }

    // Verify admin
    const isAdminUser = await this.isAdmin(adminUserId)
    if (!isAdminUser) {
      throw new Error('Only admins can delete roles')
    }

    // Check if role exists
    const role = await this.roleRepository.findById(roleId)
    if (!role) {
      throw new Error('Role not found')
    }

    // Prevent deletion of system roles (admin, user)
    if (role.name === 'admin' || role.name === 'user') {
      throw new Error('Cannot delete system roles (admin, user)')
    }

    try {
      await this.roleRepository.delete(roleId)
    } catch (error) {
      throw this.handleError(error)
    }
  }
}

export const roleService = new RoleService()


