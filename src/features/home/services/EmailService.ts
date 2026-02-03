import { BaseService } from '@/shared/BaseService'
import { firestoreService } from '@/shared/services'
import { emailConfig } from '@/shared/services/config'

export interface EmailSubmission {
  id?: string
  email: string
  createdAt: string
  status: 'pending' | 'confirmed' | 'sent'
  confirmationEmailSent: boolean
  source: 'website'
}

/**
 * Email Service - Business Logic Layer (Model in MVC)
 * Contains business logic for email operations
 */
export class EmailService extends BaseService {
  private readonly COLLECTION_NAME = 'email_submissions'

  /**
   * Validate email format
   */
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  /**
   * Submit email and store in Firestore
   */
  async submitEmail(email: string): Promise<{ success: boolean; submissionId?: string; error?: string }> {
    if (!this.validate(email)) {
      throw new Error('Email is required')
    }

    const trimmedEmail = email.trim().toLowerCase()
    
    if (!this.isValidEmail(trimmedEmail)) {
      throw new Error('Invalid email format')
    }

    try {
      // Check if email already exists
      const existingEmails = await firestoreService.getDocuments<EmailSubmission>(
        this.COLLECTION_NAME,
        [firestoreService.where('email', '==', trimmedEmail)]
      )

      if (existingEmails.length > 0) {
        // Email already exists, update the existing record
        const existing = existingEmails[0]
        if (existing && existing.id) {
          await firestoreService.updateDocument(this.COLLECTION_NAME, existing.id, {
            createdAt: new Date().toISOString(),
            status: 'pending'
          })
          return {
            success: true,
            submissionId: existing.id
          }
        }
      }

      // Create new email submission
      const submissionId = await firestoreService.createDocumentWithAutoId<EmailSubmission>(
        this.COLLECTION_NAME,
        {
          email: trimmedEmail,
          createdAt: new Date().toISOString(),
          status: 'pending',
          confirmationEmailSent: false,
          source: 'website'
        }
      )

      return {
        success: true,
        submissionId
      }
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * Get all email submissions from Firestore
   */
  async getSubmissions(): Promise<EmailSubmission[]> {
    try {
      const submissions = await firestoreService.getDocuments<EmailSubmission>(
        this.COLLECTION_NAME,
        [firestoreService.orderBy('createdAt', 'desc')]
      )
      return submissions
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * Mark confirmation email as sent
   */
  async markConfirmationSent(submissionId: string): Promise<void> {
    try {
      await firestoreService.updateDocument(this.COLLECTION_NAME, submissionId, {
        confirmationEmailSent: true,
        status: 'confirmed'
      })
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * Send confirmation email
   * Note: This is a placeholder. In production, you would integrate with:
   * - Firebase Functions + SendGrid
   * - Firebase Functions + Mailgun
   * - Firebase Functions + Nodemailer
   * - Or your own backend API
   */
  async sendConfirmationEmail(email: string): Promise<{ success: boolean; error?: string }> {
    try {
      // TODO: Integrate with actual email service
      // Example with Firebase Functions:
      // const sendEmail = firebaseFunctions.httpsCallable('sendConfirmationEmail')
      // await sendEmail({ email, subject: 'Thank you for your interest!', template: 'confirmation' })
      
      // For now, we'll just log it
      console.log('Sending confirmation email to:', email)
      
      // In production, this would be:
      // 1. Call Firebase Function or backend API
      // 2. Send email via SendGrid/Mailgun/etc.
      // 3. Return success/error
      
      return {
        success: true
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to send email'
      }
    }
  }

  /**
   * Send booking email with custom sender configuration using Hostinger SMTP
   * @param to Recipient email address
   * @param subject Email subject
   * @param body HTML email body
   * @param icsContent Optional .ics file content for calendar attachment
   */
  async sendBookingEmail(
    to: string,
    subject: string,
    body: string,
    icsContent?: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      // Email payload with Hostinger SMTP configuration
      const emailPayload = {
        // SMTP Configuration (from config.ts)
        smtp: {
          host: emailConfig.host,
          port: emailConfig.port,
          secure: emailConfig.secure,
          user: emailConfig.user,
          password: emailConfig.password
        },
        // Email content
        from: {
          name: emailConfig.from.name,
          email: emailConfig.from.email
        },
        replyTo: emailConfig.replyTo,
        to: to,
        subject: subject,
        html: body,
        attachments: icsContent ? [{
          filename: 'meeting.ics',
          content: icsContent,
          contentType: 'text/calendar'
        }] : []
      }

      // Check if API endpoint is configured (for backend/Firebase Functions)
      if (emailConfig.apiEndpoint) {
        try {
          const response = await fetch(emailConfig.apiEndpoint, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(emailPayload)
          })

          if (!response.ok) {
            const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
            throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`)
          }

          const result = await response.json()
          return {
            success: result.success !== false,
            error: result.error
          }
        } catch (apiError) {
          console.error('Error calling email API:', apiError)
          return {
            success: false,
            error: apiError instanceof Error ? apiError.message : 'Failed to send email via API'
          }
        }
      }

      // Fallback: Log email details (for development/testing)
      // In production, you MUST configure emailConfig.apiEndpoint
      console.warn('⚠️ Email API endpoint not configured. Email not sent.')
      console.log('Email would be sent with configuration:')
      console.log('SMTP Host:', emailPayload.smtp.host)
      console.log('SMTP Port:', emailPayload.smtp.port)
      console.log('From:', emailPayload.from.name, `<${emailPayload.from.email}>`)
      console.log('Reply-To:', emailPayload.replyTo)
      console.log('To:', emailPayload.to)
      console.log('Subject:', emailPayload.subject)
      console.log('Body length:', emailPayload.html.length, 'characters')
      if (icsContent) {
        console.log('ICS file attached, length:', icsContent.length, 'characters')
      }
      
      return {
        success: true
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to send email'
      }
    }
  }
}

export const emailService = new EmailService()


