import { Model, type BaseModel } from '@/shared/BaseModel'

export interface ActivityLogData extends BaseModel {
  userId: string
  userEmail: string
  userName?: string
  action: string // e.g., 'update_home_content', 'create_user', 'delete_user'
  resource: string // e.g., 'home_content', 'user'
  resourceId?: string
  changes?: Record<string, any> // Before/after values or change details
  metadata?: Record<string, any> // Additional context
}

export class ActivityLog extends Model implements ActivityLogData {
  userId: string
  userEmail: string
  userName?: string
  action: string
  resource: string
  resourceId?: string
  changes?: Record<string, any>
  metadata?: Record<string, any>

  constructor(data: Partial<ActivityLogData> = {}) {
    super(data)
    this.userId = data.userId || ''
    this.userEmail = data.userEmail || ''
    this.userName = data.userName
    this.action = data.action || ''
    this.resource = data.resource || ''
    this.resourceId = data.resourceId
    this.changes = data.changes
    this.metadata = data.metadata
  }

  /**
   * Create ActivityLog instance from Firestore data
   */
  static fromFirestore(data: any): ActivityLog {
    return new ActivityLog({
      ...data,
      createdAt: data.createdAt ? new Date(data.createdAt) : undefined,
      updatedAt: data.updatedAt ? new Date(data.updatedAt) : undefined
    })
  }
}



