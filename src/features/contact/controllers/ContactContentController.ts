import { BaseController } from '@/shared/BaseController'
import { ContactService, type ContactMessage, type ContactContent } from '../services/ContactService'

const contactService = new ContactService()

/**
 * Contact Content Controller - Business Logic Layer
 * Orchestrates contact operations
 */
export class ContactContentController extends BaseController {
  /**
   * Get contact page content
   */
  async getContactContent(): Promise<{ success: boolean; data?: ContactContent; error?: string }> {
    try {
      const content = await contactService.getContactContent()
      return this.success(content)
    } catch (error) {
      return this.handleError(error)
    }
  }

  /**
   * Update contact page content (admin only)
   */
  async updateContactContent(
    content: Partial<ContactContent>
  ): Promise<{ success: boolean; data?: ContactContent; error?: string }> {
    try {
      const currentContent = await contactService.getContactContent()
      const updatedContent = { ...currentContent, ...content }
      
      await contactService.saveContactContent(updatedContent)
      const savedContent = await contactService.getContactContent()
      return this.success(savedContent)
    } catch (error) {
      return this.handleError(error)
    }
  }

  /**
   * Submit a contact message
   */
  async submitMessage(
    message: Omit<ContactMessage, 'id' | 'createdAt' | 'status'>
  ): Promise<{ success: boolean; data?: ContactMessage; error?: string }> {
    try {
      // Validate message
      if (!message.name || message.name.trim() === '') {
        return { success: false, error: 'Name is required' }
      }
      if (!message.email || message.email.trim() === '') {
        return { success: false, error: 'Email is required' }
      }
      if (!this.isValidEmail(message.email)) {
        return { success: false, error: 'Invalid email format' }
      }
      if (!message.subject || message.subject.trim() === '') {
        return { success: false, error: 'Subject is required' }
      }
      if (!message.message || message.message.trim() === '') {
        return { success: false, error: 'Message is required' }
      }

      const newMessage = await contactService.submitContactMessage(message)
      return this.success(newMessage)
    } catch (error) {
      return this.handleError(error)
    }
  }

  /**
   * Get all contact messages (admin only)
   */
  async getMessages(): Promise<{ success: boolean; data?: ContactMessage[]; error?: string }> {
    try {
      const messages = await contactService.getContactMessages()
      return this.success(messages)
    } catch (error) {
      return this.handleError(error)
    }
  }

  /**
   * Update message status (admin only)
   */
  async updateMessageStatus(
    messageId: string,
    status: ContactMessage['status']
  ): Promise<{ success: boolean; error?: string }> {
    try {
      await contactService.updateMessageStatus(messageId, status)
      return this.success({})
    } catch (error) {
      return this.handleError(error)
    }
  }

  /**
   * Delete a contact message (admin only)
   */
  async deleteMessage(messageId: string): Promise<{ success: boolean; error?: string }> {
    try {
      await contactService.deleteContactMessage(messageId)
      return this.success({})
    } catch (error) {
      return this.handleError(error)
    }
  }

  /**
   * Validate email format
   */
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }
}

export const contactContentController = new ContactContentController()

