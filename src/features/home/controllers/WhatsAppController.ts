import { BaseController } from '@/shared/BaseController'
import { WhatsAppService } from '../services/WhatsAppService'

/**
 * WhatsApp Controller - Business Logic Layer (Controller in MVC)
 * Orchestrates WhatsApp-related business operations
 */
export class WhatsAppController extends BaseController {
  private whatsAppService: WhatsAppService

  constructor() {
    super()
    this.whatsAppService = new WhatsAppService()
  }

  /**
   * Send magic message to WhatsApp number
   */
  async sendMagic(
    phoneNumber: string
  ): Promise<{ success: boolean; data?: { message: string }; error?: string }> {
    try {
      const result = await this.whatsAppService.sendMagic(phoneNumber)
      
      if (result.success) {
        return this.success({ message: result.message || 'Message sent successfully!' })
      } else {
        return { success: false, error: result.error || 'Failed to send message' }
      }
    } catch (error) {
      return this.handleError(error)
    }
  }
}

export const whatsAppController = new WhatsAppController()



