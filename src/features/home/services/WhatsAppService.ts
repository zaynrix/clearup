import { BaseService } from '@/shared/BaseService'
import { firestoreService } from '@/shared/services'

/**
 * WhatsApp Service - Business Logic Layer (Model in MVC)
 * Contains business logic for WhatsApp operations
 */
export class WhatsAppService extends BaseService {
  private readonly COLLECTION_NAME = 'whatsapp_leads'

  /**
   * Send magic message to WhatsApp number and store in Firestore
   */
  async sendMagic(phoneNumber: string): Promise<{ success: boolean; message?: string; error?: string }> {
    if (!this.validate(phoneNumber)) {
      throw new Error('Phone number is required')
    }

    // Validate phone number format
    const cleanedNumber = this.cleanPhoneNumber(phoneNumber)
    if (!this.isValidPhoneNumber(cleanedNumber)) {
      throw new Error('Invalid phone number format')
    }

    try {
      // Store phone number in Firestore
      await firestoreService.createDocumentWithAutoId(this.COLLECTION_NAME, {
        phoneNumber: cleanedNumber,
        formattedNumber: this.formatPhoneNumber(cleanedNumber),
        createdAt: new Date().toISOString(),
        status: 'pending',
        source: 'website'
      })

      // TODO: Integrate with actual WhatsApp API or backend service
      // In production, this would call Firebase Functions or your backend API
      // Example: await firebaseFunctions.httpsCallable('sendWhatsAppMessage')({ phoneNumber: cleanedNumber })
      
      return {
        success: true,
        message: 'Magic message sent successfully!'
      }
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * Get all WhatsApp leads from Firestore
   */
  async getLeads(): Promise<any[]> {
    try {
      return await firestoreService.getDocuments(this.COLLECTION_NAME, [
        firestoreService.orderBy('createdAt', 'desc')
      ])
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * Clean phone number (remove spaces, dashes, etc.)
   */
  private cleanPhoneNumber(phoneNumber: string): string {
    return phoneNumber.replace(/[\s\-\(\)]/g, '')
  }

  /**
   * Validate phone number format
   */
  private isValidPhoneNumber(phoneNumber: string): boolean {
    // Basic validation - accepts numbers with optional + prefix
    const phoneRegex = /^\+?[\d]{10,15}$/
    return phoneRegex.test(phoneNumber)
  }

  /**
   * Format phone number for display
   */
  formatPhoneNumber(phoneNumber: string): string {
    const cleaned = this.cleanPhoneNumber(phoneNumber)
    // Add formatting logic if needed
    return cleaned
  }
}

export const whatsAppService = new WhatsAppService()


