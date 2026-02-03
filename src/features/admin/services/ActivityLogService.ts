import { BaseService } from '@/shared/BaseService'
import { ActivityLogRepository } from '@/shared/repositories/ActivityLogRepository'
import { ActivityLog, type ActivityLogData } from '../models/ActivityLog'

/**
 * Activity Log Service - Business Logic Layer (Model in MVC)
 * Contains business logic for activity log operations
 */
export class ActivityLogService extends BaseService {
  private activityLogRepository: ActivityLogRepository

  constructor() {
    super()
    this.activityLogRepository = new ActivityLogRepository()
  }

  /**
   * Create an activity log entry
   */
  async logActivity(data: Partial<ActivityLogData>): Promise<void> {
    if (!this.validate(data.userId) || !this.validate(data.action) || !this.validate(data.resource)) {
      console.warn('Activity log skipped - missing required fields:', { userId: data.userId, action: data.action, resource: data.resource })
      return
    }

    try {
      const log = new ActivityLog({
        ...data,
        createdAt: new Date(),
        updatedAt: new Date()
      })

      const logId = await this.activityLogRepository.create(log)
      console.log('Activity log created successfully:', logId, data.action)
    } catch (error) {
      // Don't throw error for logging failures - just log to console
      console.error('Failed to log activity:', error)
      console.error('Activity log data:', data)
    }
  }

  /**
   * Get logs by user ID
   */
  async getLogsByUserId(userId: string, limit: number = 50): Promise<ActivityLog[]> {
    if (!this.validate(userId)) {
      throw new Error('User ID is required')
    }

    try {
      return await this.activityLogRepository.findByUserId(userId, limit)
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * Get logs by resource
   */
  async getLogsByResource(resource: string, limit: number = 50): Promise<ActivityLog[]> {
    if (!this.validate(resource)) {
      throw new Error('Resource is required')
    }

    try {
      return await this.activityLogRepository.findByResource(resource, limit)
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * Get recent logs (admin only)
   */
  async getRecentLogs(limit: number = 100): Promise<ActivityLog[]> {
    try {
      return await this.activityLogRepository.getRecent(limit)
    } catch (error) {
      throw this.handleError(error)
    }
  }
}

export const activityLogService = new ActivityLogService()



