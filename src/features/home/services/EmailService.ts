import { BaseService } from '@/shared/BaseService'
import { firestoreService } from '@/shared/services'

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
}

export const emailService = new EmailService()


