import { BaseRepository } from './BaseRepository'
import { MaintenanceRequest, type MaintenanceRequestData } from '@/features/admin/models/MaintenanceRequest'
import { firestoreService } from '@/shared/services'

/**
 * Maintenance Request Repository - Data Access Layer (Model in MVC)
 * Handles all database operations for MaintenanceRequest entities
 */
export class MaintenanceRequestRepository extends BaseRepository<MaintenanceRequest> {
  constructor() {
    super('maintenance_requests', MaintenanceRequest)
  }

  /**
   * Get the current active maintenance request
   */
  async getActiveRequest(): Promise<MaintenanceRequest | null> {
    try {
      const requests = await this.query(
        firestoreService.where('status', '==', 'active'),
        firestoreService.orderBy('createdAt', 'desc'),
        firestoreService.limitTo(1)
      )
      return requests.length > 0 ? requests[0] : null
    } catch (error) {
      // If index doesn't exist, fetch all and filter/sort in memory
      console.warn('Index not found, fetching all and filtering in memory:', error)
      const allRequests = await this.findAll()
      const activeRequests = allRequests
        .filter(req => req.status === 'active')
        .sort((a, b) => {
          const aTime = a.createdAt ? (a.createdAt instanceof Date ? a.createdAt.getTime() : new Date(a.createdAt).getTime()) : 0
          const bTime = b.createdAt ? (b.createdAt instanceof Date ? b.createdAt.getTime() : new Date(b.createdAt).getTime()) : 0
          return bTime - aTime
        })
      return activeRequests.length > 0 ? activeRequests[0] : null
    }
  }

  /**
   * Get pending requests
   */
  async getPendingRequests(): Promise<MaintenanceRequest[]> {
    try {
      return await this.query(
        firestoreService.where('status', '==', 'pending'),
        firestoreService.orderBy('createdAt', 'desc')
      )
    } catch (error) {
      // If index doesn't exist, fetch all and filter/sort in memory
      console.warn('Index not found, fetching all and filtering in memory:', error)
      const allRequests = await this.findAll()
      return allRequests
        .filter(req => req.status === 'pending')
        .sort((a, b) => {
          const aTime = a.createdAt ? (a.createdAt instanceof Date ? a.createdAt.getTime() : new Date(a.createdAt).getTime()) : 0
          const bTime = b.createdAt ? (b.createdAt instanceof Date ? b.createdAt.getTime() : new Date(b.createdAt).getTime()) : 0
          return bTime - aTime
        })
    }
  }

  /**
   * Get all requests (for history)
   */
  async getAllRequests(limit: number = 50): Promise<MaintenanceRequest[]> {
    try {
      return await this.query(
        firestoreService.orderBy('createdAt', 'desc'),
        firestoreService.limitTo(limit)
      )
    } catch (error) {
      console.warn('Failed to order maintenance requests, fetching without order:', error)
      const allRequests = await this.findAll()
      return allRequests
        .sort((a, b) => {
          const aTime = a.createdAt ? (a.createdAt instanceof Date ? a.createdAt.getTime() : new Date(a.createdAt).getTime()) : 0
          const bTime = b.createdAt ? (b.createdAt instanceof Date ? b.createdAt.getTime() : new Date(b.createdAt).getTime()) : 0
          return bTime - aTime
        })
        .slice(0, limit)
    }
  }

  /**
   * Check if maintenance mode is currently active
   */
  async isMaintenanceModeActive(): Promise<boolean> {
    const activeRequest = await this.getActiveRequest()
    return activeRequest !== null && activeRequest.type === 'turn_off'
  }
}

export const maintenanceRequestRepository = new MaintenanceRequestRepository()

