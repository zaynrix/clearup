import { ref, type Ref } from 'vue'
import { BaseViewController } from '@/shared/BaseViewController'
import { emailController } from './EmailController'

/**
 * Home View Controller - Presentation Layer (Controller in MVC)
 * Handles landing page interactions and email form submission
 */
export class HomeViewController extends BaseViewController {
  private emailAddress: Ref<string> = ref('')

  /**
   * Set email address
   */
  setEmailAddress(email: string): void {
    this.emailAddress.value = email
  }

  /**
   * Get email address
   */
  get email(): string {
    return this.emailAddress.value
  }

  /**
   * Handle email form submission
   */
  async handleEmailSubmit(): Promise<boolean> {
    const email = this.emailAddress.value.trim()
    
    if (!email) {
      this.setError('Please enter your email address')
      return false
    }

    this.setLoading(true)
    this.clearError()

    try {
      const result = await emailController.submitEmail(email)
      
      if (result.success) {
        this.setLoading(false)
        return true
      } else {
        this.setError(result.error || 'Failed to submit. Please try again.')
        this.setLoading(false)
        return false
      }
    } catch (error) {
      this.setError('Failed to submit. Please try again.')
      this.setLoading(false)
      return false
    }
  }

  /**
   * Clear form
   */
  clearForm(): void {
    this.emailAddress.value = ''
    this.clearError()
  }
}

