import { BaseController } from './BaseController'
import { whatsAppService } from '../services/WhatsAppService'

/**
 * WhatsApp Controller - Business Logic Layer (Controller in MVC)
 * Orchestrates WhatsApp-related business operations
 */
export class WhatsAppController extends BaseController {
  /**
   * Send magic message to WhatsApp
   */
  async sendMagic(phoneNumber: string): Promise<{ success: boolean; message?: string; error?: string }> {
    try {
      const result = await whatsAppService.sendMagic(phoneNumber)
      return this.success(result)
    } catch (error) {
      return this.handleError(error)
    }
  }

  /**
   * Get all WhatsApp leads
   */
  async getLeads(): Promise<{ success: boolean; data?: any[]; error?: string }> {
    try {
      const leads = await whatsAppService.getLeads()
      return this.success(leads)
    } catch (error) {
      return this.handleError(error)
    }
  }
}
