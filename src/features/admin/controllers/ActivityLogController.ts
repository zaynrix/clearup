import { BaseController } from '@/shared/BaseController'
import { activityLogService } from '../services/ActivityLogService'
import type { ActivityLog } from '../models/ActivityLog'

/**
 * Activity Log Controller - Business Logic Layer (Controller in MVC)
 * Orchestrates activity log operations
 */
export class ActivityLogController extends BaseController {
  /**
   * Get logs by user ID
   */
  async getLogsByUserId(
    userId: string,
    limit: number = 50
  ): Promise<{ success: boolean; data?: ActivityLog[]; error?: string }> {
    try {
      const logs = await activityLogService.getLogsByUserId(userId, limit)
      return this.success(logs)
    } catch (error) {
      return this.handleError(error)
    }
  }

  /**
   * Get logs by resource
   */
  async getLogsByResource(
    resource: string,
    limit: number = 50
  ): Promise<{ success: boolean; data?: ActivityLog[]; error?: string }> {
    try {
      const logs = await activityLogService.getLogsByResource(resource, limit)
      return this.success(logs)
    } catch (error) {
      return this.handleError(error)
    }
  }

  /**
   * Get recent logs (admin only)
   */
  async getRecentLogs(
    limit: number = 100
  ): Promise<{ success: boolean; data?: ActivityLog[]; error?: string }> {
    try {
      const logs = await activityLogService.getRecentLogs(limit)
      return this.success(logs)
    } catch (error) {
      return this.handleError(error)
    }
  }
}

export const activityLogController = new ActivityLogController()


