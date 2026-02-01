import { Model, type BaseModel } from '@/shared/BaseModel'

export interface AvailabilityData extends BaseModel {
  date: Date | string // Date in YYYY-MM-DD format
  timeSlot: string // Time in HH:mm format (e.g., "14:30")
  isBlocked: boolean // true = busy/unavailable, false = available
  reason?: string // Optional reason for blocking
  blockedBy?: string // User ID who blocked this slot
}

export class Availability extends Model implements AvailabilityData {
  date: Date | string
  timeSlot: string
  isBlocked: boolean
  reason?: string
  blockedBy?: string

  constructor(data: Partial<AvailabilityData> = {}) {
    super(data)
    this.date = data.date ?? new Date().toISOString().split('T')[0]
    this.timeSlot = data.timeSlot || ''
    this.isBlocked = data.isBlocked || false
    this.reason = data.reason
    this.blockedBy = data.blockedBy
  }

  static fromFirestore(data: any): Availability {
    return new Availability({
      ...data,
      createdAt: data.createdAt ? new Date(data.createdAt) : undefined,
      updatedAt: data.updatedAt ? new Date(data.updatedAt) : undefined
    })
  }
}

