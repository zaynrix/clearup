import { BaseController } from '@/shared/BaseController'
import { bookingService } from '../services/BookingService'
import { bookingNotificationService } from '../services/BookingNotificationService'
import type { Booking, BookingData, AvailableDate } from '../models/Booking'

/**
 * Booking Controller - Business Logic Layer
 * Orchestrates booking-related operations
 */
export class BookingController extends BaseController {
  /**
   * Create a new booking
   */
  async createBooking(
    data: Partial<BookingData>
  ): Promise<{ success: boolean; data?: Booking; error?: string }> {
    try {
      // Generate meeting link
      const tempId = `temp-${Date.now()}`
      const meetingLink = bookingService.generateMeetingLink(tempId)
      
      const booking = await bookingService.createBooking({
        ...data,
        meetingLink,
        status: 'pending'
      })
      
      // Update with actual ID
      booking.meetingLink = bookingService.generateMeetingLink(booking.id)
      await bookingService.updateBooking(booking.id, {
        meetingLink: booking.meetingLink,
        status: 'confirmed'
      })
      
      // Send confirmation notification
      booking.meetingLink = bookingService.generateMeetingLink(booking.id)
      await bookingNotificationService.sendBookingConfirmation(booking)
      await bookingService.markConfirmationSent(booking.id)
      
      return this.success(booking)
    } catch (error) {
      return this.handleError(error)
    }
  }

  /**
   * Get booking by ID
   */
  async getBookingById(
    bookingId: string
  ): Promise<{ success: boolean; data?: Booking | null; error?: string }> {
    try {
      const booking = await bookingService.getBookingById(bookingId)
      return this.success(booking)
    } catch (error) {
      return this.handleError(error)
    }
  }

  /**
   * Get all bookings
   */
  async getAllBookings(): Promise<{ success: boolean; data?: Booking[]; error?: string }> {
    try {
      const bookings = await bookingService.getAllBookings()
      return this.success(bookings)
    } catch (error) {
      return this.handleError(error)
    }
  }

  /**
   * Get available dates with time slots
   */
  async getAvailableDates(
    startDate: Date,
    endDate: Date
  ): Promise<{ success: boolean; data?: AvailableDate[]; error?: string }> {
    try {
      const availableDates = await bookingService.getAvailableDates(startDate, endDate)
      return this.success(availableDates)
    } catch (error) {
      return this.handleError(error)
    }
  }

  /**
   * Get available time slots for a date
   */
  async getAvailableTimeSlots(
    date: Date
  ): Promise<{ success: boolean; data?: { time: string; available: boolean }[]; error?: string }> {
    try {
      const timeSlots = await bookingService.getAvailableTimeSlots(date)
      return this.success(timeSlots)
    } catch (error) {
      return this.handleError(error)
    }
  }

  /**
   * Update booking
   */
  async updateBooking(
    bookingId: string,
    data: Partial<BookingData>
  ): Promise<{ success: boolean; error?: string }> {
    try {
      await bookingService.updateBooking(bookingId, data)
      return { success: true }
    } catch (error) {
      return this.handleError(error)
    }
  }

  /**
   * Cancel booking
   */
  async cancelBooking(
    bookingId: string,
    cancelledBy: string,
    reason?: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      await bookingService.cancelBooking(bookingId, cancelledBy, reason)
      return { success: true }
    } catch (error) {
      return this.handleError(error)
    }
  }

  /**
   * Delete booking
   */
  async deleteBooking(bookingId: string): Promise<{ success: boolean; error?: string }> {
    try {
      await bookingService.deleteBooking(bookingId)
      return { success: true }
    } catch (error) {
      return this.handleError(error)
    }
  }

  /**
   * Get bookings needing reminders
   */
  async getBookingsNeedingReminders(): Promise<{ success: boolean; data?: Booking[]; error?: string }> {
    try {
      const bookings = await bookingService.getBookingsNeedingReminders()
      return this.success(bookings)
    } catch (error) {
      return this.handleError(error)
    }
  }
}

export const bookingController = new BookingController()

