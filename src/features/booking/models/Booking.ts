import { Model, type BaseModel } from '@/shared/BaseModel'

export type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed'
export type ContactMethod = 'email' | 'whatsapp'

export interface BookingData extends BaseModel {
  userName: string
  userEmail: string
  userPhone?: string
  meetingDate: Date | string
  meetingTime: string // Format: "HH:mm" (e.g., "14:30")
  timezone: string // User's timezone (e.g., "America/New_York")
  contactMethod: ContactMethod
  meetingLink?: string
  status: BookingStatus
  notes?: string
  reminderSent?: boolean
  confirmationSent?: boolean
  cancelledAt?: Date | string
  cancelledBy?: string // User ID who cancelled
  cancellationReason?: string
}

export class Booking extends Model implements BookingData {
  userName: string
  userEmail: string
  userPhone?: string
  meetingDate: Date | string
  meetingTime: string
  timezone: string
  contactMethod: ContactMethod
  meetingLink?: string
  status: BookingStatus
  notes?: string
  reminderSent?: boolean
  confirmationSent?: boolean
  cancelledAt?: Date | string
  cancelledBy?: string
  cancellationReason?: string

  constructor(data: Partial<BookingData> = {}) {
    super(data)
    this.userName = data.userName || ''
    this.userEmail = data.userEmail || ''
    this.userPhone = data.userPhone
    this.meetingDate = data.meetingDate ? new Date(data.meetingDate) : new Date()
    this.meetingTime = data.meetingTime || ''
    this.timezone = data.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone
    this.contactMethod = data.contactMethod || 'email'
    this.meetingLink = data.meetingLink
    this.status = data.status || 'pending'
    this.notes = data.notes
    this.reminderSent = data.reminderSent || false
    this.confirmationSent = data.confirmationSent || false
    this.cancelledAt = data.cancelledAt ? new Date(data.cancelledAt) : undefined
    this.cancelledBy = data.cancelledBy
    this.cancellationReason = data.cancellationReason
  }

  /**
   * Create Booking instance from Firestore data
   */
  static fromFirestore(data: any): Booking {
    const booking = new Booking({
      ...data,
      id: data.id || '', // Ensure ID is explicitly set
      createdAt: data.createdAt ? new Date(data.createdAt) : undefined,
      updatedAt: data.updatedAt ? new Date(data.updatedAt) : undefined,
      meetingDate: data.meetingDate ? new Date(data.meetingDate) : undefined,
      cancelledAt: data.cancelledAt ? new Date(data.cancelledAt) : undefined
    })
    // Ensure ID is set (in case it wasn't in the spread)
    if (data.id && !booking.id) {
      booking.id = data.id
    }
    return booking
  }

  /**
   * Get full datetime as Date object
   */
  getFullDateTime(): Date {
    const date = new Date(this.meetingDate)
    const [hours, minutes] = this.meetingTime.split(':').map(Number)
    date.setHours(hours || 0, minutes || 0, 0, 0)
    return date
  }

  /**
   * Check if booking is in the past
   */
  isPast(): boolean {
    return this.getFullDateTime() < new Date()
  }

  /**
   * Check if booking is within next 24 hours
   */
  isWithin24Hours(): boolean {
    const bookingTime = this.getFullDateTime()
    const now = new Date()
    const diff = bookingTime.getTime() - now.getTime()
    return diff > 0 && diff <= 24 * 60 * 60 * 1000
  }
}

export interface TimeSlot {
  time: string // Format: "HH:mm"
  available: boolean
  bookingId?: string
}

export interface AvailableDate {
  date: Date | string
  timeSlots: TimeSlot[]
}

