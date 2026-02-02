import { BaseService } from '@/shared/BaseService'
import { emailService } from '@/features/home/services/EmailService'
import { whatsAppService } from '@/features/home/services/WhatsAppService'
import { generateICSFile, downloadICSFile } from '../utils/icsGenerator'
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
      const subject = `Meeting Confirmed - ${this.formatDate(booking.meetingDate)} at ${this.formatTime(booking.meetingTime)}`
      
      // Generate .ics file content
      const icsContent = generateICSFile(booking, 'ClearUP')
      
      const body = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #5B2096; margin-top: 0;">Meeting Booking Confirmation</h2>
          <p>Dear ${booking.userName},</p>
          <p>Your meeting has been confirmed!</p>
          
          <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #5B2096;">Meeting Details:</h3>
            <p style="font-size: 16px;"><strong>📅 Date:</strong> ${this.formatDate(booking.meetingDate)}</p>
            <p style="font-size: 16px;"><strong>🕐 Time:</strong> ${this.formatTime(booking.meetingTime)}</p>
            <p style="font-size: 16px;"><strong>📍 Location:</strong> Online (Google Meet)</p>
            ${booking.notes ? `<p style="font-size: 16px;"><strong>📝 Notes:</strong> ${booking.notes}</p>` : ''}
          </div>
          
          ${meetingLink ? `
          <div style="text-align: center; margin: 30px 0;">
            <a href="${meetingLink}" 
               style="display: inline-block; background-color: #5B2096; color: white; padding: 15px 30px; 
                      text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 16px;">
              Join Meeting
            </a>
          </div>
          <div style="background: #e8f4f8; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p style="margin: 0; font-size: 14px; color: #333;">
              <strong>Or copy this link:</strong><br>
              <a href="${meetingLink}" style="color: #5B2096; word-break: break-all;">${meetingLink}</a>
            </p>
          </div>
          ` : ''}
          
          <div style="background: #fff3cd; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #ffc107;">
            <p style="margin: 0; font-size: 14px;">
              <strong>📅 Add to Calendar:</strong> A calendar invite (.ics file) is attached to this email. 
              You can also download it from your booking confirmation page.
            </p>
          </div>
          
          <p style="margin-top: 30px;">If you need to reschedule, please contact us.</p>
          <p>Best regards,<br><strong>The ClearUP Team</strong></p>
        </div>
      `

      // Send email with custom sender configuration
      const emailResult = await emailService.sendBookingEmail(
        booking.userEmail,
        subject,
        body,
        icsContent
      )

      if (!emailResult.success) {
        console.error('Failed to send booking confirmation email:', emailResult.error)
        return false
      }

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
            <p style="text-decoration: line-through; margin: 0;"><strong>Previous Time:</strong> ${oldDateTime}</p>
          </div>
          <div style="background: #d4edda; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #28a745;">
            <p style="margin: 0;"><strong>New Time:</strong> ${newDateTime}</p>
          </div>
          ${booking.meetingLink ? `
          <div style="text-align: center; margin: 30px 0;">
            <a href="${booking.meetingLink}" 
               style="display: inline-block; background-color: #5B2096; color: white; padding: 15px 30px; 
                      text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 16px;">
              Join Meeting
            </a>
          </div>
          <div style="background: #e8f4f8; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p style="margin: 0; font-size: 14px; color: #333;">
              <strong>Meeting Link:</strong><br>
              <a href="${booking.meetingLink}" style="color: #5B2096; word-break: break-all;">${booking.meetingLink}</a>
            </p>
          </div>
          ` : ''}
          <p>Please update your calendar accordingly. An updated calendar invite has been sent to your email.</p>
          <p>Best regards,<br>The ClearUP Team</p>
        </div>
      `

      // Send email with custom sender configuration
      const emailResult = await emailService.sendBookingEmail(
        booking.userEmail,
        subject,
        body
      )

      if (!emailResult.success) {
        console.error('Failed to send booking update email:', emailResult.error)
        return false
      }

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

      // Send email with custom sender configuration
      const emailResult = await emailService.sendBookingEmail(
        booking.userEmail,
        subject,
        body
      )

      if (!emailResult.success) {
        console.error('Failed to send booking reminder email:', emailResult.error)
        return false
      }

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

  /**
   * Format date only
   */
  private formatDate(date: Date | string): string {
    const dateObj = typeof date === 'string' ? new Date(date) : date
    return dateObj.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  /**
   * Format time only
   */
  private formatTime(time: string): string {
    const timeParts = time.split(':')
    const hours = timeParts[0] ? parseInt(timeParts[0]) : 0
    const minutes = timeParts[1] ? parseInt(timeParts[1]) : 0
    const timeDate = new Date(2000, 0, 1, hours, minutes)
    return timeDate.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })
  }

  /**
   * Download .ics file for booking (for user to download)
   */
  downloadICSFile(booking: Booking): void {
    try {
      const icsContent = generateICSFile(booking, 'ClearUP')
      const filename = `meeting-${booking.id || Date.now()}.ics`
      downloadICSFile(icsContent, filename)
    } catch (error) {
      this.handleError(error)
    }
  }
}

export const bookingNotificationService = new BookingNotificationService()

