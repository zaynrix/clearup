import { BaseController } from '@/shared/BaseController'
import { bookingService } from '../services/BookingService'
import { bookingNotificationService } from '../services/BookingNotificationService'
import { googleCalendarService } from '../services/GoogleCalendarService'
import { googleCalendarConfig } from '@/shared/services/config'
import { firestoreService } from '@/shared/services'
import { getFunctions, httpsCallable } from 'firebase/functions'
import { app } from '@/shared/services/config'
import type { Booking, BookingData, AvailableDate } from '../models/Booking'

/**
 * Booking Controller - Business Logic Layer
 * Orchestrates booking-related operations
 */
export class BookingController extends BaseController {
  /**
   * Get first available admin with Google Calendar connected
   * Returns null if no admin is available
   * Uses public calendar_status collection (safe, no tokens exposed)
   */
  private async getAvailableAdminId(): Promise<string | null> {
    try {
      // Read from public calendar_status collection (safe, no tokens)
      const statusList = await firestoreService.getDocuments<any>('calendar_status')
      console.log('Found calendar status entries:', statusList.length, statusList)
      
      if (!statusList || statusList.length === 0) {
        console.warn('No calendar status entries found in Firestore')
        return null
      }

      // Find first admin with connected status
      const connectedStatus = statusList.find((status: any) => {
        const isConnected = status.isConnected === true && status.adminId
        console.log(`Status ${status.id}: isConnected=${status.isConnected}, adminId=${status.adminId}`)
        return isConnected
      })
      
      if (connectedStatus && connectedStatus.adminId) {
        console.log('Found connected admin:', connectedStatus.adminId)
        return connectedStatus.adminId
      }
      
      console.warn('No connected admin found in calendar status')
      return null
    } catch (error: any) {
      // Log error details for debugging
      console.error('Error getting available admin:', error)
      console.error('Error code:', error?.code)
      console.error('Error message:', error?.message)
      
      // Log errors (should not happen with public read access)
      console.warn('Error reading calendar status:', error)
      return null
    }
  }

  /**
   * Create a new booking
   */
  async createBooking(
    data: Partial<BookingData>
  ): Promise<{ success: boolean; data?: Booking; error?: string }> {
    try {
      // Get admin ID (use provided adminId or find first available admin with Google Calendar)
      let adminId = data.adminId
      if (!adminId) {
        adminId = await this.getAvailableAdminId() || undefined
      }

      // Create booking first
      const booking = await bookingService.createBooking({
        ...data,
        adminId,
        status: 'pending'
      })

      // Google Meet is required - try to create Google Meet event
      let meetLink: string | undefined
      let googleEventId: string | undefined
      let calendarLink: string | undefined

      if (!adminId) {
        // No admin available - cannot create Google Meet event
        // Delete the booking and return error
        console.error('No admin with Google Calendar connected found. Please ensure at least one admin has connected their Google Calendar in the admin dashboard.')
        await bookingService.deleteBooking(booking.id)
        return { 
          success: false, 
          error: 'No admin available with Google Calendar connected. Please ask an admin to connect their Google Calendar in the admin dashboard, or contact support.' 
        }
      }

      try {
        // Check if admin has Google Calendar connected (using public calendar_status)
        const isConnected = await googleCalendarService.isGoogleConnected(adminId)
        
        if (!isConnected) {
          // Admin not connected - cannot create Google Meet event
          // Delete the booking and return error
          await bookingService.deleteBooking(booking.id)
          return { 
            success: false, 
            error: 'Admin Google Calendar is not connected. Please contact support.' 
          }
        }

        // Get admin email from calendar_status collection (public-readable, works for guests)
        const calendarStatus = await firestoreService.getDocument<any>('calendar_status', adminId)
        const adminEmail = calendarStatus?.adminEmail || 'admin@clearup.com'

        // Calculate start and end times
        const startDateTime = booking.getFullDateTime()
        const endDateTime = new Date(startDateTime)
        endDateTime.setMinutes(endDateTime.getMinutes() + 30) // Default 30 minutes

        // Use Cloud Function to create Google Meet event (server-side, can access admin tokens)
        try {
          const functions = getFunctions(app)
          const createMeetEvent = httpsCallable(functions, 'createGoogleMeetEvent')

          const result = await createMeetEvent({
            adminId: adminId,
            summary: `Meeting with ${booking.userName}`,
            description: booking.notes || '',
            startDateTime: startDateTime.toISOString(),
            endDateTime: endDateTime.toISOString(),
            timezone: booking.timezone,
            userEmail: booking.userEmail,
            userName: booking.userName,
            adminEmail: adminEmail,
            notes: booking.notes
          })

          const data = result.data as {
            success: boolean
            meetLink?: string
            googleEventId?: string
            calendarLink?: string
            error?: string
          }

          if (!data.success || !data.meetLink) {
            throw new Error(data.error || 'Failed to create Google Meet link')
          }

          meetLink = data.meetLink
          googleEventId = data.googleEventId
          calendarLink = data.calendarLink || ''

          // Update booking with Google Calendar data
          await bookingService.updateBooking(booking.id, {
            meetingLink: meetLink,
            googleEventId: googleEventId,
            calendarLink: calendarLink,
            status: 'confirmed'
          })

          // Update booking object
          booking.meetingLink = meetLink
          booking.googleEventId = googleEventId
          booking.calendarLink = calendarLink

          // Send confirmation email via Cloud Function
          try {
            const functions = getFunctions(app)
            const sendEmail = httpsCallable(functions, 'sendBookingConfirmationEmail')

            // Format date for email
            const meetingDate = new Date(booking.meetingDate)
            const formattedDate = meetingDate.toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })

            await sendEmail({
              recipientEmail: booking.userEmail,
              recipientName: booking.userName,
              meetingDate: formattedDate,
              meetingTime: booking.meetingTime,
              meetingLink: meetLink,
              meetingReason: booking.notes || ''
            })

            console.log('✅ Confirmation email sent to:', booking.userEmail)
          } catch (emailError: any) {
            // Log error but don't fail the booking - email is optional
            console.error('❌ Failed to send confirmation email:', emailError)
            // Booking is still confirmed, just email wasn't sent
          }
        } catch (cloudFunctionError: any) {
          // Cloud Function error - check if it's a function not found error
          if (cloudFunctionError?.code === 'functions/not-found' || 
              cloudFunctionError?.message?.includes('not found')) {
            console.error('Cloud Function not deployed. Please deploy functions first.')
            await bookingService.deleteBooking(booking.id)
            return {
              success: false,
              error: 'Google Calendar service is not available. Please contact support or try again later.'
            }
          }
          throw cloudFunctionError
        }
      } catch (googleError: any) {
        // If Google Calendar creation fails, delete booking and return error
        console.error('Failed to create Google Meet event:', googleError)
        await bookingService.deleteBooking(booking.id)
        
        // Provide clearer error message
        let errorMessage = googleError?.message || 'Failed to create Google Meet event. Please try again or contact support.'
        
        // Handle specific Firebase Functions errors
        if (googleError?.code === 'functions/not-found') {
          errorMessage = 'Google Calendar service is not available. Please contact support.'
        } else if (googleError?.code === 'functions/failed-precondition') {
          errorMessage = 'Google Calendar is not properly configured. Please contact support.'
        } else if (googleError?.code === 'functions/unauthenticated') {
          errorMessage = 'Google Calendar authentication failed. Please ask an admin to reconnect their Google account.'
        }
        
        return { 
          success: false, 
          error: errorMessage
        }
      }

      // Send confirmation notification
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
      const existingBooking = await bookingService.getBookingById(bookingId)
      if (!existingBooking) {
        return { success: false, error: 'Booking not found' }
      }

      // If date/time is being updated and booking has Google Calendar event, update it
      if ((data.meetingDate || data.meetingTime) && existingBooking.googleEventId && existingBooking.adminId) {
        try {
          const isConnected = await googleCalendarService.isGoogleConnected(existingBooking.adminId)
          if (isConnected) {
            // Calculate new start and end times
            const newDate = data.meetingDate ? new Date(data.meetingDate) : new Date(existingBooking.meetingDate)
            const newTime = data.meetingTime || existingBooking.meetingTime
            const [hours, minutes] = newTime.split(':').map(Number)
            const startDateTime = new Date(newDate)
            startDateTime.setHours(hours || 0, minutes || 0, 0, 0)
            const endDateTime = new Date(startDateTime)
            endDateTime.setMinutes(endDateTime.getMinutes() + 30)

            // Update Google Calendar event
            await googleCalendarService.updateGoogleMeetEvent(
              existingBooking.adminId,
              existingBooking.googleEventId,
              {
                startDateTime: startDateTime.toISOString(),
                endDateTime: endDateTime.toISOString()
              }
            )
          }
        } catch (googleError) {
          console.warn('Failed to update Google Calendar event:', googleError)
          // Continue with booking update even if Google Calendar update fails
        }
      }

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
      const booking = await bookingService.getBookingById(bookingId)
      if (!booking) {
        return { success: false, error: 'Booking not found' }
      }

      // Delete Google Calendar event if it exists
      if (booking.googleEventId && booking.adminId) {
        try {
          const isConnected = await googleCalendarService.isGoogleConnected(booking.adminId)
          if (isConnected) {
            await googleCalendarService.deleteGoogleMeetEvent(booking.adminId, booking.googleEventId)
          }
        } catch (googleError) {
          console.warn('Failed to delete Google Calendar event:', googleError)
          // Continue with cancellation even if Google Calendar deletion fails
        }
      }

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
      // Get booking before deletion to check for Google Calendar event
      const booking = await bookingService.getBookingById(bookingId)
      if (!booking) {
        return { success: false, error: 'Booking not found' }
      }

      // Delete Google Calendar event if it exists
      if (booking.googleEventId && booking.adminId) {
        try {
          const isConnected = await googleCalendarService.isGoogleConnected(booking.adminId)
          if (isConnected) {
            await googleCalendarService.deleteGoogleMeetEvent(booking.adminId, booking.googleEventId)
          }
        } catch (googleError) {
          console.warn('Failed to delete Google Calendar event:', googleError)
          // Continue with deletion even if Google Calendar deletion fails
        }
      }

      // Delete the booking
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

