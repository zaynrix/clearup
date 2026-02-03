import { BaseController } from '@/shared/BaseController'
import { emailService, type EmailSubmission } from '../services/EmailService'

/**
 * Email Controller - Business Logic Layer (Controller in MVC)
 * Orchestrates email-related business operations
 */
export class EmailController extends BaseController {
  /**
   * Submit email and send confirmation
   */
  async submitEmail(
    email: string
  ): Promise<{ success: boolean; data?: { submissionId: string; message: string }; error?: string }> {
    try {
      // Store email in Firestore
      const result = await emailService.submitEmail(email)
      
      if (result.success && result.submissionId) {
        // Send confirmation email
        const emailResult = await emailService.sendConfirmationEmail(email)
        
        if (emailResult.success) {
          // Mark confirmation as sent
          await emailService.markConfirmationSent(result.submissionId)
        }
        
        return this.success({
          submissionId: result.submissionId,
          message: 'Thank you! We have received your email. Please check your inbox for a confirmation email.'
        })
      } else {
        return { success: false, error: result.error || 'Failed to submit email' }
      }
    } catch (error) {
      return this.handleError(error)
    }
  }

  /**
   * Get all email submissions
   */
  async getSubmissions(): Promise<{ success: boolean; data?: EmailSubmission[]; error?: string }> {
    try {
      const submissions = await emailService.getSubmissions()
      return this.success(submissions)
    } catch (error) {
      return this.handleError(error)
    }
  }
}

export const emailController = new EmailController()



