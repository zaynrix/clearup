import { BaseService } from '@/shared/BaseService'
import { firestoreService } from '@/shared/services'
import { Booking, type BookingData, type TimeSlot, type AvailableDate } from '../models/Booking'
import { availabilityService } from './AvailabilityService'

const COLLECTION_NAME = 'bookings'

// Default available time slots (9 AM to 5 PM, every 30 minutes)
const DEFAULT_TIME_SLOTS = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
  '15:00', '15:30', '16:00', '16:30', '17:00'
]

/**
 * Booking Service - Business Logic Layer
 * Handles CRUD operations for bookings
 */
export class BookingService extends BaseService {
  /**
   * Create a new booking
   */
  async createBooking(data: Partial<BookingData>): Promise<Booking> {
    try {
      const booking = new Booking({
        ...data,
        createdAt: new Date(),
        updatedAt: new Date()
      })

      const bookingId = await firestoreService.createDocumentWithAutoId<BookingData>(
        COLLECTION_NAME,
        booking.toFirestore()
      )

      booking.id = bookingId
      return booking
    } catch (error) {
      this.handleError(error)
      throw error
    }
  }

  /**
   * Get booking by ID
   */
  async getBookingById(bookingId: string): Promise<Booking | null> {
    try {
      const data = await firestoreService.getDocument<BookingData>(COLLECTION_NAME, bookingId)
      return data ? Booking.fromFirestore({ ...data, id: bookingId }) : null
    } catch (error) {
      this.handleError(error)
      throw error
    }
  }

  /**
   * Get all bookings
   */
  async getAllBookings(): Promise<Booking[]> {
    try {
      const bookings = await firestoreService.getDocuments<BookingData>(
        COLLECTION_NAME,
        [firestoreService.orderBy('meetingDate', 'asc')]
      )
      return bookings.map(booking => Booking.fromFirestore(booking))
    } catch (error) {
      this.handleError(error)
      throw error
    }
  }

  /**
   * Get bookings for a specific date range
   */
  async getBookingsByDateRange(startDate: Date, endDate: Date): Promise<Booking[]> {
    try {
      // Get all bookings and filter by date range
      const allBookings = await this.getAllBookings()
      return allBookings.filter(booking => {
        const bookingDate = new Date(booking.meetingDate)
        return bookingDate >= startDate && bookingDate <= endDate
      })
    } catch (error) {
      this.handleError(error)
      throw error
    }
  }

  /**
   * Get bookings for a specific date
   */
  async getBookingsByDate(date: Date): Promise<Booking[]> {
    try {
      // Get all bookings and filter by date
      const allBookings = await this.getAllBookings()
      const dateStr = date.toISOString().split('T')[0]
      
      return allBookings.filter(booking => {
        const bookingDateStr = new Date(booking.meetingDate).toISOString().split('T')[0]
        return bookingDateStr === dateStr && booking.status !== 'cancelled'
      })
    } catch (error) {
      this.handleError(error)
      throw error
    }
  }

  /**
   * Get available time slots for a specific date
   */
  async getAvailableTimeSlots(date: Date): Promise<TimeSlot[]> {
    try {
      const bookings = await this.getBookingsByDate(date)
      const bookedTimes = new Set(bookings.map(b => b.meetingTime))
      
      // Check blocked slots from availability service
      const blockedSlots = await availabilityService.getAvailabilityByDate(date)
      const blockedTimes = new Set(blockedSlots.filter(a => a.isBlocked).map(a => a.timeSlot))
      
      return DEFAULT_TIME_SLOTS.map(time => ({
        time,
        available: !bookedTimes.has(time) && !blockedTimes.has(time),
        bookingId: bookings.find(b => b.meetingTime === time)?.id
      }))
    } catch (error) {
      this.handleError(error)
      throw error
    }
  }

  /**
   * Get available dates with time slots for a date range
   */
  async getAvailableDates(startDate: Date, endDate: Date): Promise<AvailableDate[]> {
    try {
      const bookings = await this.getBookingsByDateRange(startDate, endDate)
      const bookingsByDate = new Map<string, Booking[]>()
      
      bookings.forEach(booking => {
        const dateKey = new Date(booking.meetingDate).toISOString().split('T')[0]
        if (!bookingsByDate.has(dateKey)) {
          bookingsByDate.set(dateKey, [])
        }
        bookingsByDate.get(dateKey)!.push(booking)
      })
      
      const availableDates: AvailableDate[] = []
      const currentDate = new Date(startDate)
      
      while (currentDate <= endDate) {
        const dateKey = currentDate.toISOString().split('T')[0]
        const dateBookings = bookingsByDate.get(dateKey) || []
        const bookedTimes = new Set(dateBookings.map(b => b.meetingTime))
        
        availableDates.push({
          date: new Date(currentDate),
          timeSlots: DEFAULT_TIME_SLOTS.map(time => ({
            time,
            available: !bookedTimes.has(time),
            bookingId: dateBookings.find(b => b.meetingTime === time)?.id
          }))
        })
        
        currentDate.setDate(currentDate.getDate() + 1)
      }
      
      return availableDates
    } catch (error) {
      this.handleError(error)
      throw error
    }
  }

  /**
   * Update booking
   */
  async updateBooking(bookingId: string, data: Partial<BookingData>): Promise<void> {
    try {
      const updateData: Partial<BookingData> = {
        ...data,
        updatedAt: new Date()
      }
      
      await firestoreService.updateDocument(COLLECTION_NAME, bookingId, updateData)
    } catch (error) {
      this.handleError(error)
      throw error
    }
  }

  /**
   * Cancel booking
   */
  async cancelBooking(bookingId: string, cancelledBy: string, reason?: string): Promise<void> {
    try {
      await firestoreService.updateDocument(COLLECTION_NAME, bookingId, {
        status: 'cancelled',
        cancelledAt: new Date(),
        cancelledBy,
        cancellationReason: reason,
        updatedAt: new Date()
      })
    } catch (error) {
      this.handleError(error)
      throw error
    }
  }

  /**
   * Delete booking
   */
  async deleteBooking(bookingId: string): Promise<void> {
    try {
      await firestoreService.deleteDocument(COLLECTION_NAME, bookingId)
    } catch (error) {
      this.handleError(error)
      throw error
    }
  }

  /**
   * Get bookings that need reminders (within next 24 hours)
   */
  async getBookingsNeedingReminders(): Promise<Booking[]> {
    try {
      const now = new Date()
      const tomorrow = new Date(now)
      tomorrow.setDate(tomorrow.getDate() + 1)
      
      const bookings = await this.getBookingsByDateRange(now, tomorrow)
      
      return bookings.filter(booking => {
        if (booking.status !== 'confirmed' || booking.reminderSent) {
          return false
        }
        return booking.isWithin24Hours()
      })
    } catch (error) {
      this.handleError(error)
      throw error
    }
  }

  /**
   * Mark reminder as sent
   */
  async markReminderSent(bookingId: string): Promise<void> {
    try {
      await firestoreService.updateDocument(COLLECTION_NAME, bookingId, {
        reminderSent: true,
        updatedAt: new Date()
      })
    } catch (error) {
      this.handleError(error)
      throw error
    }
  }

  /**
   * Mark confirmation as sent
   */
  async markConfirmationSent(bookingId: string): Promise<void> {
    try {
      await firestoreService.updateDocument(COLLECTION_NAME, bookingId, {
        confirmationSent: true,
        updatedAt: new Date()
      })
    } catch (error) {
      this.handleError(error)
      throw error
    }
  }

  /**
   * Generate unique meeting link
   */
  generateMeetingLink(bookingId: string): string {
    // In a real implementation, this would generate a unique meeting link
    // For now, we'll use a simple format
    const baseUrl = window.location.origin
    return `${baseUrl}/meeting/${bookingId}`
  }
}

export const bookingService = new BookingService()

