import { BaseService } from '@/shared/BaseService'
import { emailService } from '@/features/home/services/EmailService'
import { whatsAppService } from '@/features/home/services/WhatsAppService'
import type { Booking } from '../models/Booking'

/**
 * Booking Notification Service
 * Handles sending notifications for booking events
 */
export class BookingNotificationService extends BaseService {
  /**
   * Send booking confirmation
   */
  async sendBookingConfirmation(booking: Booking): Promise<boolean> {
    try {
      const meetingDateTime = this.formatBookingDateTime(booking)
      const meetingLink = booking.meetingLink || ''

      if (booking.contactMethod === 'email') {
        return await this.sendEmailConfirmation(booking, meetingDateTime, meetingLink)
      } else {
        return await this.sendWhatsAppConfirmation(booking, meetingDateTime, meetingLink)
      }
    } catch (error) {
      this.handleError(error)
      return false
    }
  }

  /**
   * Send email confirmation
   */
  private async sendEmailConfirmation(
    booking: Booking,
    meetingDateTime: string,
    meetingLink: string
  ): Promise<boolean> {
    try {
      const subject = 'Meeting Booking Confirmation - ClearUP'
      const body = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #5B2096;">Meeting Booking Confirmation</h2>
          <p>Dear ${booking.userName},</p>
          <p>Your meeting has been successfully booked!</p>
          <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #5B2096;">Meeting Details:</h3>
            <p><strong>Date & Time:</strong> ${meetingDateTime}</p>
            <p><strong>Contact Email:</strong> ${booking.userEmail}</p>
            ${booking.userPhone ? `<p><strong>Phone:</strong> ${booking.userPhone}</p>` : ''}
            ${meetingLink ? `<p><strong>Meeting Link:</strong> <a href="${meetingLink}">${meetingLink}</a></p>` : ''}
            ${booking.notes ? `<p><strong>Notes:</strong> ${booking.notes}</p>` : ''}
          </div>
          <p>We look forward to meeting with you!</p>
          <p>Best regards,<br>The ClearUP Team</p>
        </div>
      `

      // Note: In production, integrate with actual email service
      await emailService.sendConfirmationEmail(booking.userEmail)
      console.log('Booking update email would be sent to:', booking.userEmail)
      console.log('Subject:', subject)
      console.log('Body:', body)

      return true
    } catch (error) {
      this.handleError(error)
      return false
    }
  }

  /**
   * Send WhatsApp confirmation
   */
  private async sendWhatsAppConfirmation(
    booking: Booking,
    meetingDateTime: string,
    meetingLink: string
  ): Promise<boolean> {
    try {
      const message = `🎉 Meeting Booking Confirmation

Dear ${booking.userName},

Your meeting has been successfully booked!

📅 Date & Time: ${meetingDateTime}
📧 Email: ${booking.userEmail}
${booking.userPhone ? `📱 Phone: ${booking.userPhone}\n` : ''}${meetingLink ? `🔗 Meeting Link: ${meetingLink}\n` : ''}${booking.notes ? `📝 Notes: ${booking.notes}\n` : ''}
We look forward to meeting with you!

Best regards,
The ClearUP Team`

      // Note: In production, integrate with actual WhatsApp API
      const phoneNumber = booking.userPhone || booking.userEmail
      await whatsAppService.sendMagic(phoneNumber)
      console.log('Booking update WhatsApp would be sent to:', phoneNumber)
      console.log('Message:', message)

      return true
    } catch (error) {
      this.handleError(error)
      return false
    }
  }

  /**
   * Send booking update notification
   */
  async sendBookingUpdate(
    booking: Booking,
    oldDate: Date,
    oldTime: string
  ): Promise<boolean> {
    try {
      const oldDateTime = this.formatDateTime(oldDate, oldTime)
      const newDateTime = this.formatBookingDateTime(booking)

      if (booking.contactMethod === 'email') {
        return await this.sendEmailUpdate(booking, oldDateTime, newDateTime)
      } else {
        return await this.sendWhatsAppUpdate(booking, oldDateTime, newDateTime)
      }
    } catch (error) {
      this.handleError(error)
      return false
    }
  }

  /**
   * Send email update notification
   */
  private async sendEmailUpdate(
    booking: Booking,
    oldDateTime: string,
    newDateTime: string
  ): Promise<boolean> {
    try {
      const subject = 'Meeting Time Updated - ClearUP'
      const body = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #5B2096;">Meeting Time Updated</h2>
          <p>Dear ${booking.userName},</p>
          <p>Your meeting time has been updated.</p>
          <div style="background: #fff3cd; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ffc107;">
            <p><strong>Previous Time:</strong> ${oldDateTime}</p>
          </div>
          <div style="background: #d4edda; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #28a745;">
            <p><strong>New Time:</strong> ${newDateTime}</p>
          </div>
          ${booking.meetingLink ? `<p><strong>Meeting Link:</strong> <a href="${booking.meetingLink}">${booking.meetingLink}</a></p>` : ''}
          <p>Please update your calendar accordingly.</p>
          <p>Best regards,<br>The ClearUP Team</p>
        </div>
      `

      // Note: In production, integrate with actual email service
      await emailService.sendConfirmationEmail(booking.userEmail)
      console.log('Booking update email would be sent to:', booking.userEmail)
      console.log('Subject:', subject)
      console.log('Body:', body)

      return true
    } catch (error) {
      this.handleError(error)
      return false
    }
  }

  /**
   * Send WhatsApp update notification
   */
  private async sendWhatsAppUpdate(
    booking: Booking,
    oldDateTime: string,
    newDateTime: string
  ): Promise<boolean> {
    try {
      const message = `📅 Meeting Time Updated

Dear ${booking.userName},

Your meeting time has been updated.

⏰ Previous Time: ${oldDateTime}
✅ New Time: ${newDateTime}
${booking.meetingLink ? `🔗 Meeting Link: ${booking.meetingLink}\n` : ''}
Please update your calendar accordingly.

Best regards,
The ClearUP Team`

      // Note: In production, integrate with actual WhatsApp API
      const phoneNumber = booking.userPhone || booking.userEmail
      await whatsAppService.sendMagic(phoneNumber)
      console.log('Booking update WhatsApp would be sent to:', phoneNumber)
      console.log('Message:', message)

      return true
    } catch (error) {
      this.handleError(error)
      return false
    }
  }

  /**
   * Send booking reminder
   */
  async sendBookingReminder(booking: Booking): Promise<boolean> {
    try {
      const meetingDateTime = this.formatBookingDateTime(booking)

      if (booking.contactMethod === 'email') {
        return await this.sendEmailReminder(booking, meetingDateTime)
      } else {
        return await this.sendWhatsAppReminder(booking, meetingDateTime)
      }
    } catch (error) {
      this.handleError(error)
      return false
    }
  }

  /**
   * Send email reminder
   */
  private async sendEmailReminder(
    booking: Booking,
    meetingDateTime: string
  ): Promise<boolean> {
    try {
      const subject = 'Meeting Reminder - ClearUP'
      const body = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #5B2096;">Meeting Reminder</h2>
          <p>Dear ${booking.userName},</p>
          <p>This is a friendly reminder that you have a meeting scheduled:</p>
          <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #5B2096;">Meeting Details:</h3>
            <p><strong>Date & Time:</strong> ${meetingDateTime}</p>
            ${booking.meetingLink ? `<p><strong>Meeting Link:</strong> <a href="${booking.meetingLink}">${booking.meetingLink}</a></p>` : ''}
          </div>
          <p>We look forward to meeting with you!</p>
          <p>Best regards,<br>The ClearUP Team</p>
        </div>
      `

      // Note: In production, integrate with actual email service
      await emailService.sendConfirmationEmail(booking.userEmail)
      console.log('Booking update email would be sent to:', booking.userEmail)
      console.log('Subject:', subject)
      console.log('Body:', body)

      return true
    } catch (error) {
      this.handleError(error)
      return false
    }
  }

  /**
   * Send WhatsApp reminder
   */
  private async sendWhatsAppReminder(
    booking: Booking,
    meetingDateTime: string
  ): Promise<boolean> {
    try {
      const message = `⏰ Meeting Reminder

Dear ${booking.userName},

This is a friendly reminder that you have a meeting scheduled:

📅 Date & Time: ${meetingDateTime}
${booking.meetingLink ? `🔗 Meeting Link: ${booking.meetingLink}\n` : ''}
We look forward to meeting with you!

Best regards,
The ClearUP Team`

      // Note: In production, integrate with actual WhatsApp API
      const phoneNumber = booking.userPhone || booking.userEmail
      await whatsAppService.sendMagic(phoneNumber)
      console.log('Booking update WhatsApp would be sent to:', phoneNumber)
      console.log('Message:', message)

      return true
    } catch (error) {
      this.handleError(error)
      return false
    }
  }

  /**
   * Format booking date and time
   */
  private formatBookingDateTime(booking: Booking): string {
    return this.formatDateTime(new Date(booking.meetingDate), booking.meetingTime)
  }

  /**
   * Format date and time
   */
  private formatDateTime(date: Date, time: string): string {
    const dateStr = date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
    const timeParts = time.split(':')
    const hours = timeParts[0] ? parseInt(timeParts[0]) : 0
    const minutes = timeParts[1] ? parseInt(timeParts[1]) : 0
    const timeDate = new Date(2000, 0, 1, hours, minutes)
    const timeStr = timeDate.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })
    return `${dateStr} at ${timeStr}`
  }
}

export const bookingNotificationService = new BookingNotificationService()

