import { Model, type BaseModel } from '@/shared/BaseModel'

export type MaintenanceRequestStatus = 'pending' | 'approved' | 'rejected' | 'active' | 'inactive'
export type MaintenanceRequestType = 'turn_on' | 'turn_off'

export interface MaintenanceRequestData extends BaseModel {
  type: MaintenanceRequestType // 'turn_on' or 'turn_off'
  status: MaintenanceRequestStatus
  requestedBy: string // Admin user ID who initiated
  requestedByEmail: string
  requestedByName?: string
  approvedBy?: string // Admin user ID who approved (must be different from requestedBy)
  approvedByEmail?: string
  approvedByName?: string
  rejectionReason?: string
  estimatedEndTime?: Date // Optional estimated time when maintenance will end
  message?: string // Custom message to display to users
}

export class MaintenanceRequest extends Model implements MaintenanceRequestData {
  type: MaintenanceRequestType
  status: MaintenanceRequestStatus
  requestedBy: string
  requestedByEmail: string
  requestedByName?: string
  approvedBy?: string
  approvedByEmail?: string
  approvedByName?: string
  rejectionReason?: string
  estimatedEndTime?: Date
  message?: string

  constructor(data: Partial<MaintenanceRequestData> = {}) {
    super(data)
    this.type = data.type || 'turn_off'
    this.status = data.status || 'pending'
    this.requestedBy = data.requestedBy || ''
    this.requestedByEmail = data.requestedByEmail || ''
    this.requestedByName = data.requestedByName
    this.approvedBy = data.approvedBy
    this.approvedByEmail = data.approvedByEmail
    this.approvedByName = data.approvedByName
    this.rejectionReason = data.rejectionReason
    this.estimatedEndTime = data.estimatedEndTime
    this.message = data.message
  }

  /**
   * Create MaintenanceRequest instance from Firestore data
   */
  static fromFirestore(data: any): MaintenanceRequest {
    return new MaintenanceRequest({
      ...data,
      createdAt: data.createdAt ? new Date(data.createdAt) : undefined,
      updatedAt: data.updatedAt ? new Date(data.updatedAt) : undefined,
      estimatedEndTime: data.estimatedEndTime ? new Date(data.estimatedEndTime) : undefined
    })
  }
}

