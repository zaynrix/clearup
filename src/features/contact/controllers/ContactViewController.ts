import { BaseViewController } from '@/shared/BaseViewController'
import { contactContentController } from './ContactContentController'
import type { ContactContent, ContactMessage, ContactInfo } from '../models/ContactMessage'

/**
 * Contact View Controller - Presentation Layer
 * Manages view state and user interactions for Contact page
 */
export class ContactViewController extends BaseViewController {
  private contactContent: ContactContent | null = null
  private submitSuccess: boolean = false
  private submitError: string | null = null

  /**
   * Load contact page content
   */
  async loadContactContent(): Promise<void> {
    this.setLoading(true)
    this.clearError()

    try {
      const result = await contactContentController.getContactContent()
      if (result.success && result.data) {
        this.contactContent = result.data
      } else {
        this.setError(result.error || 'Failed to load contact content')
      }
    } catch (error) {
      this.setError('An unexpected error occurred')
    } finally {
      this.setLoading(false)
    }
  }

  /**
   * Submit contact form
   */
  async submitContactForm(formData: {
    name: string
    email: string
    subject: string
    message: string
  }): Promise<{ success: boolean; error?: string }> {
    this.submitSuccess = false
    this.submitError = null

    try {
      const result = await contactContentController.submitMessage(formData)
      
      if (result.success) {
        this.submitSuccess = true
        return { success: true }
      } else {
        this.submitError = result.error || 'Failed to send message'
        return { success: false, error: this.submitError }
      }
    } catch (error) {
      this.submitError = 'An unexpected error occurred'
      return { success: false, error: this.submitError }
    }
  }

  /**
   * Get contact content
   */
  getContactContent(): ContactContent | null {
    return this.contactContent
  }

  /**
   * Get contact info
   */
  getContactInfo(): ContactInfo | null {
    return this.contactContent?.contactInfo || null
  }

  /**
   * Get header title
   */
  getHeaderTitle(): string {
    return this.contactContent?.headerTitle || 'Ready To Elevate Your Brand ?'
  }

  /**
   * Get header subtitle
   */
  getHeaderSubtitle(): string {
    return this.contactContent?.headerSubtitle || 'Contact us today for a free consultation and quote'
  }

  /**
   * Get form title
   */
  getFormTitle(): string {
    return this.contactContent?.formTitle || 'Send us a Message'
  }

  /**
   * Get info title
   */
  getInfoTitle(): string {
    return this.contactContent?.infoTitle || 'Contact Information'
  }

  /**
   * Check if form submission was successful
   */
  isSubmitSuccess(): boolean {
    return this.submitSuccess
  }

  /**
   * Get form submission error
   */
  getSubmitError(): string | null {
    return this.submitError
  }

  /**
   * Reset form state
   */
  resetFormState(): void {
    this.submitSuccess = false
    this.submitError = null
  }
}

