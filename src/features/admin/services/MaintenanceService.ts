import { BaseService } from '@/shared/BaseService'
import { MaintenanceRequestRepository } from '@/shared/repositories/MaintenanceRequestRepository'
import { MaintenanceRequest, type MaintenanceRequestData, type MaintenanceRequestType } from '../models/MaintenanceRequest'
import { UserRepository } from '@/shared/repositories/UserRepository'
import { activityLogService } from './ActivityLogService'
import { authService } from '@/features/auth/services/AuthService'

/**
 * Maintenance Service - Business Logic Layer (Model in MVC)
 * Contains business logic for maintenance mode operations
 */
export class MaintenanceService extends BaseService {
  private maintenanceRequestRepository: MaintenanceRequestRepository
  private userRepository: UserRepository

  constructor() {
    super()
    this.maintenanceRequestRepository = new MaintenanceRequestRepository()
    this.userRepository = new UserRepository()
  }

  /**
   * Check if maintenance mode is currently active
   */
  async isMaintenanceModeActive(): Promise<boolean> {
    try {
      return await this.maintenanceRequestRepository.isMaintenanceModeActive()
    } catch (error) {
      console.error('Error checking maintenance mode:', error)
      return false
    }
  }

  /**
   * Get current active maintenance request
   */
  async getActiveMaintenanceRequest(): Promise<MaintenanceRequest | null> {
    try {
      return await this.maintenanceRequestRepository.getActiveRequest()
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * Get all pending maintenance requests
   */
  async getPendingRequests(): Promise<MaintenanceRequest[]> {
    try {
      return await this.maintenanceRequestRepository.getPendingRequests()
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * Get all maintenance requests (for history)
   */
  async getAllRequests(limit: number = 50): Promise<MaintenanceRequest[]> {
    try {
      return await this.maintenanceRequestRepository.getAllRequests(limit)
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * Create a new maintenance request
   * Requires admin authentication
   */
  async createMaintenanceRequest(
    type: MaintenanceRequestType,
    userId: string,
    estimatedEndTime?: Date,
    message?: string
  ): Promise<MaintenanceRequest> {
    if (!this.validate(userId)) {
      throw new Error('User ID is required')
    }

    try {
      // Get user info
      const user = await this.userRepository.findById(userId)
      if (!user) {
        throw new Error('User not found')
      }

      // Check if there's already a pending request of the same type
      const pendingRequests = await this.getPendingRequests()
      const existingPending = pendingRequests.find(
        req => req.type === type && req.status === 'pending'
      )
      if (existingPending) {
        throw new Error(`A pending ${type === 'turn_off' ? 'turn off' : 'turn on'} request already exists`)
      }

      // Check if maintenance is already in the requested state
      if (type === 'turn_off') {
        const isActive = await this.isMaintenanceModeActive()
        if (isActive) {
          throw new Error('Maintenance mode is already active')
        }
      } else {
        const isActive = await this.isMaintenanceModeActive()
        if (!isActive) {
          throw new Error('Maintenance mode is not active')
        }
      }

      // Create the request
      const request = new MaintenanceRequest({
        type,
        status: 'pending',
        requestedBy: userId,
        requestedByEmail: user.email || '',
        requestedByName: user.displayName,
        estimatedEndTime,
        message
      })

      const requestId = await this.maintenanceRequestRepository.create(request)
      request.id = requestId

      // Log the activity
      await activityLogService.logActivity({
        userId,
        userEmail: user.email || '',
        userName: user.displayName,
        action: `create_maintenance_request`,
        resource: 'maintenance_request',
        resourceId: requestId,
        changes: { type, status: 'pending' }
      })

      return request
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * Approve a maintenance request
   * Requires a different admin than the one who requested
   */
  async approveMaintenanceRequest(
    requestId: string,
    approverUserId: string
  ): Promise<MaintenanceRequest> {
    if (!this.validate(requestId) || !this.validate(approverUserId)) {
      throw new Error('Request ID and approver user ID are required')
    }

    try {
      // Get the request
      const request = await this.maintenanceRequestRepository.findById(requestId)
      if (!request) {
        throw new Error('Maintenance request not found')
      }

      if (request.status !== 'pending') {
        throw new Error(`Cannot approve request with status: ${request.status}`)
      }

      // Check that approver is different from requester
      if (request.requestedBy === approverUserId) {
        throw new Error('Cannot approve your own maintenance request')
      }

      // Get approver info
      const approver = await this.userRepository.findById(approverUserId)
      if (!approver) {
        throw new Error('Approver user not found')
      }

      // Update request status
      await this.maintenanceRequestRepository.update(requestId, {
        status: 'active',
        approvedBy: approverUserId,
        approvedByEmail: approver.email || '',
        approvedByName: approver.displayName
      } as Partial<MaintenanceRequest>)

      // Get updated request
      const updatedRequest = await this.maintenanceRequestRepository.findById(requestId)
      if (!updatedRequest) {
        throw new Error('Failed to retrieve updated request')
      }

      // Log the activity
      await activityLogService.logActivity({
        userId: approverUserId,
        userEmail: approver.email || '',
        userName: approver.displayName,
        action: `approve_maintenance_request`,
        resource: 'maintenance_request',
        resourceId: requestId,
        changes: { 
          status: 'active',
          type: updatedRequest.type,
          requestedBy: request.requestedBy
        }
      })

      return updatedRequest
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * Reject a maintenance request
   */
  async rejectMaintenanceRequest(
    requestId: string,
    rejectorUserId: string,
    reason?: string
  ): Promise<MaintenanceRequest> {
    if (!this.validate(requestId) || !this.validate(rejectorUserId)) {
      throw new Error('Request ID and rejector user ID are required')
    }

    try {
      // Get the request
      const request = await this.maintenanceRequestRepository.findById(requestId)
      if (!request) {
        throw new Error('Maintenance request not found')
      }

      if (request.status !== 'pending') {
        throw new Error(`Cannot reject request with status: ${request.status}`)
      }

      // Get rejector info
      const rejector = await this.userRepository.findById(rejectorUserId)
      if (!rejector) {
        throw new Error('Rejector user not found')
      }

      // Update request status
      await this.maintenanceRequestRepository.update(requestId, {
        status: 'rejected',
        approvedBy: rejectorUserId,
        approvedByEmail: rejector.email || '',
        approvedByName: rejector.displayName,
        rejectionReason: reason
      } as Partial<MaintenanceRequest>)

      // Get updated request
      const updatedRequest = await this.maintenanceRequestRepository.findById(requestId)
      if (!updatedRequest) {
        throw new Error('Failed to retrieve updated request')
      }

      // Log the activity
      await activityLogService.logActivity({
        userId: rejectorUserId,
        userEmail: rejector.email || '',
        userName: rejector.displayName,
        action: `reject_maintenance_request`,
        resource: 'maintenance_request',
        resourceId: requestId,
        changes: { 
          status: 'rejected',
          type: updatedRequest.type,
          reason
        }
      })

      return updatedRequest
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * Cancel a pending maintenance request (by the requester)
   */
  async cancelMaintenanceRequest(
    requestId: string,
    userId: string
  ): Promise<void> {
    if (!this.validate(requestId) || !this.validate(userId)) {
      throw new Error('Request ID and user ID are required')
    }

    try {
      // Get the request
      const request = await this.maintenanceRequestRepository.findById(requestId)
      if (!request) {
        throw new Error('Maintenance request not found')
      }

      if (request.requestedBy !== userId) {
        throw new Error('Only the requester can cancel the request')
      }

      if (request.status !== 'pending') {
        throw new Error(`Cannot cancel request with status: ${request.status}`)
      }

      // Delete the request
      await this.maintenanceRequestRepository.delete(requestId)

      // Log the activity
      const user = await this.userRepository.findById(userId)
      if (user) {
        await activityLogService.logActivity({
          userId,
          userEmail: user.email || '',
          userName: user.displayName,
          action: `cancel_maintenance_request`,
          resource: 'maintenance_request',
          resourceId: requestId
        })
      }
    } catch (error) {
      throw this.handleError(error)
    }
  }
}

export const maintenanceService = new MaintenanceService()

