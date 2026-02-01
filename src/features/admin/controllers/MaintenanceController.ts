import { BaseController } from '@/shared/BaseController'
import { maintenanceService } from '../services/MaintenanceService'
import type { MaintenanceRequest, MaintenanceRequestType } from '../models/MaintenanceRequest'
import { authService } from '@/features/auth/services/AuthService'
import { userService } from '@/features/auth/services/UserService'

/**
 * Maintenance Controller - Business Logic Layer (Controller in MVC)
 * Orchestrates maintenance mode operations
 */
export class MaintenanceController extends BaseController {
  /**
   * Check if maintenance mode is active
   */
  async isMaintenanceModeActive(): Promise<{ success: boolean; data?: boolean; error?: string }> {
    try {
      const isActive = await maintenanceService.isMaintenanceModeActive()
      return this.success(isActive)
    } catch (error) {
      return this.handleError(error)
    }
  }

  /**
   * Get current active maintenance request
   */
  async getActiveMaintenanceRequest(): Promise<{ success: boolean; data?: MaintenanceRequest | null; error?: string }> {
    try {
      const request = await maintenanceService.getActiveMaintenanceRequest()
      return this.success(request)
    } catch (error) {
      return this.handleError(error)
    }
  }

  /**
   * Get pending maintenance requests
   */
  async getPendingRequests(): Promise<{ success: boolean; data?: MaintenanceRequest[]; error?: string }> {
    try {
      const currentUser = authService.getCurrentUser()
      if (!currentUser) {
        return this.error('Authentication required')
      }

      const isAdmin = await userService.isAdmin(currentUser.uid)
      if (!isAdmin) {
        return this.error('Admin access required')
      }

      const requests = await maintenanceService.getPendingRequests()
      return this.success(requests)
    } catch (error) {
      return this.handleError(error)
    }
  }

  /**
   * Get all maintenance requests (history)
   */
  async getAllRequests(limit: number = 50): Promise<{ success: boolean; data?: MaintenanceRequest[]; error?: string }> {
    try {
      const currentUser = authService.getCurrentUser()
      if (!currentUser) {
        return this.error('Authentication required')
      }

      const isAdmin = await userService.isAdmin(currentUser.uid)
      if (!isAdmin) {
        return this.error('Admin access required')
      }

      const requests = await maintenanceService.getAllRequests(limit)
      return this.success(requests)
    } catch (error) {
      return this.handleError(error)
    }
  }

  /**
   * Create a maintenance request
   */
  async createMaintenanceRequest(
    type: MaintenanceRequestType,
    estimatedEndTime?: Date,
    message?: string
  ): Promise<{ success: boolean; data?: MaintenanceRequest; error?: string }> {
    try {
      const currentUser = authService.getCurrentUser()
      if (!currentUser) {
        return this.error('Authentication required')
      }

      const isAdmin = await userService.isAdmin(currentUser.uid)
      if (!isAdmin) {
        return this.error('Admin access required')
      }

      const request = await maintenanceService.createMaintenanceRequest(
        type,
        currentUser.uid,
        estimatedEndTime,
        message
      )
      return this.success(request)
    } catch (error) {
      return this.handleError(error)
    }
  }

  /**
   * Approve a maintenance request
   */
  async approveMaintenanceRequest(
    requestId: string
  ): Promise<{ success: boolean; data?: MaintenanceRequest; error?: string }> {
    try {
      const currentUser = authService.getCurrentUser()
      if (!currentUser) {
        return this.error('Authentication required')
      }

      const isAdmin = await userService.isAdmin(currentUser.uid)
      if (!isAdmin) {
        return this.error('Admin access required')
      }

      const request = await maintenanceService.approveMaintenanceRequest(
        requestId,
        currentUser.uid
      )
      return this.success(request)
    } catch (error) {
      return this.handleError(error)
    }
  }

  /**
   * Reject a maintenance request
   */
  async rejectMaintenanceRequest(
    requestId: string,
    reason?: string
  ): Promise<{ success: boolean; data?: MaintenanceRequest; error?: string }> {
    try {
      const currentUser = authService.getCurrentUser()
      if (!currentUser) {
        return this.error('Authentication required')
      }

      const isAdmin = await userService.isAdmin(currentUser.uid)
      if (!isAdmin) {
        return this.error('Admin access required')
      }

      const request = await maintenanceService.rejectMaintenanceRequest(
        requestId,
        currentUser.uid,
        reason
      )
      return this.success(request)
    } catch (error) {
      return this.handleError(error)
    }
  }

  /**
   * Cancel a maintenance request
   */
  async cancelMaintenanceRequest(
    requestId: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const currentUser = authService.getCurrentUser()
      if (!currentUser) {
        return this.error('Authentication required')
      }

      const isAdmin = await userService.isAdmin(currentUser.uid)
      if (!isAdmin) {
        return this.error('Admin access required')
      }

      await maintenanceService.cancelMaintenanceRequest(requestId, currentUser.uid)
      return this.success(undefined)
    } catch (error) {
      return this.handleError(error)
    }
  }
}

export const maintenanceController = new MaintenanceController()

