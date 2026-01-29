import { ref, type Ref } from 'vue'
import { BaseViewController } from '@/shared/BaseViewController'
import { whatsAppController } from './WhatsAppController'

/**
 * Home View Controller - Presentation Layer (Controller in MVC)
 * Handles landing page interactions and WhatsApp form submission
 */
export class HomeViewController extends BaseViewController {
  private whatsappNumber: Ref<string> = ref('')

  /**
   * Set WhatsApp number
   */
  setWhatsAppNumber(number: string): void {
    this.whatsappNumber.value = number
  }

  /**
   * Get WhatsApp number
   */
  get phoneNumber(): string {
    return this.whatsappNumber.value
  }

  /**
   * Handle WhatsApp form submission
   */
  async handleWhatsAppSubmit(): Promise<boolean> {
    const number = this.whatsappNumber.value.trim()
    
    if (!number) {
      this.setError('Please enter your WhatsApp number')
      return false
    }

    this.setLoading(true)
    this.clearError()

    try {
      const result = await whatsAppController.sendMagic(number)
      
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
    this.whatsappNumber.value = ''
    this.clearError()
  }
}

