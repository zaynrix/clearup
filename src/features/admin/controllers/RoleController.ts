import { BaseController } from '@/shared/BaseController'
import { roleService } from '../services/RoleService'
import type { Role, RoleData } from '../models/Role'

/**
 * Role Controller - Business Logic Layer (Controller in MVC)
 * Orchestrates role-related business operations
 */
export class RoleController extends BaseController {
  /**
   * Create a new role (admin only)
   */
  async createRole(
    data: Partial<RoleData>
  ): Promise<{ success: boolean; data?: Role; error?: string }> {
    try {
      const role = await roleService.createRole(data)
      return this.success(role)
    } catch (error) {
      return this.handleError(error)
    }
  }

  /**
   * Get all roles
   */
  async getAllRoles(): Promise<{ success: boolean; data?: Role[]; error?: string }> {
    try {
      const roles = await roleService.getAllRoles()
      return this.success(roles)
    } catch (error) {
      return this.handleError(error)
    }
  }

  /**
   * Get role by ID
   */
  async getRoleById(roleId: string): Promise<{ success: boolean; data?: Role | null; error?: string }> {
    try {
      const role = await roleService.getRoleById(roleId)
      return this.success(role)
    } catch (error) {
      return this.handleError(error)
    }
  }

  /**
   * Update role (admin only)
   */
  async updateRole(
    roleId: string,
    data: Partial<RoleData>,
    adminUserId?: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      await roleService.updateRole(roleId, data, adminUserId)
      return { success: true }
    } catch (error) {
      return this.handleError(error)
    }
  }

  /**
   * Delete role (admin only)
   */
  async deleteRole(roleId: string, adminUserId?: string): Promise<{ success: boolean; error?: string }> {
    try {
      await roleService.deleteRole(roleId, adminUserId)
      return { success: true }
    } catch (error) {
      return this.handleError(error)
    }
  }
}

export const roleController = new RoleController()


