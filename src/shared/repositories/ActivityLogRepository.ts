import { BaseRepository } from './BaseRepository'
import { ActivityLog, type ActivityLogData } from '@/features/admin/models/ActivityLog'
import { firestoreService } from '@/shared/services'

/**
 * Activity Log Repository - Data Access Layer (Model in MVC)
 * Handles all database operations for ActivityLog entities
 */
export class ActivityLogRepository extends BaseRepository<ActivityLog> {
  constructor() {
    super('activity_logs', ActivityLog)
  }

  /**
   * Find logs by user ID
   */
  async findByUserId(userId: string, limit: number = 50): Promise<ActivityLog[]> {
    return await this.query(
      firestoreService.where('userId', '==', userId),
      firestoreService.orderBy('createdAt', 'desc'),
      firestoreService.limitTo(limit)
    )
  }

  /**
   * Find logs by resource
   */
  async findByResource(resource: string, limit: number = 50): Promise<ActivityLog[]> {
    return await this.query(
      firestoreService.where('resource', '==', resource),
      firestoreService.orderBy('createdAt', 'desc'),
      firestoreService.limitTo(limit)
    )
  }

  /**
   * Get recent logs
   */
  async getRecent(limit: number = 100): Promise<ActivityLog[]> {
    try {
      // Use Timestamp for ordering - Firestore stores dates as Timestamps
      // We'll order by createdAt field which should be stored as ISO string or Timestamp
      return await this.query(
        firestoreService.orderBy('createdAt', 'desc'),
        firestoreService.limitTo(limit)
      )
    } catch (error) {
      // If ordering fails (e.g., no index), try without ordering
      console.warn('Failed to order activity logs by createdAt, fetching without order:', error)
      const allLogs = await this.findAll()
      // Sort manually by createdAt
      return allLogs
        .sort((a, b) => {
          const aTime = a.createdAt ? (a.createdAt instanceof Date ? a.createdAt.getTime() : new Date(a.createdAt).getTime()) : 0
          const bTime = b.createdAt ? (b.createdAt instanceof Date ? b.createdAt.getTime() : new Date(b.createdAt).getTime()) : 0
          return bTime - aTime
        })
        .slice(0, limit)
    }
  }
}

export const activityLogRepository = new ActivityLogRepository()

