import { BaseService } from '@/shared/BaseService'
import { firestoreService } from '@/shared/services'
import type { ContactMessage, ContactContent, ContactInfo } from '../models/ContactMessage'

export type { ContactMessage, ContactContent, ContactInfo }

const DEFAULT_CONTACT_INFO: ContactInfo = {
  instagram: 'clear-up00',
  instagramUrl: 'https://instagram.com/clear-up00',
  email: 'info@ClearUP.com',
  linkedin: 'Clear Up',
  linkedinUrl: 'https://linkedin.com/company/clearup',
  whatsapp: '+9708888888',
  whatsappUrl: 'https://wa.me/9708888888'
}

const DEFAULT_CONTACT_CONTENT: ContactContent = {
  headerTitle: 'Ready To Elevate Your Brand ?',
  headerSubtitle: 'Contact us today for a free consultation and quote',
  formTitle: 'Send us a Message',
  infoTitle: 'Contact Information',
  contactInfo: DEFAULT_CONTACT_INFO
}

const CONTENT_COLLECTION = 'contactContent'
const MESSAGES_COLLECTION = 'contactMessages'
const CONTENT_DOCUMENT_ID = 'main'

export class ContactService extends BaseService {
  /**
   * Generate a unique ID
   */
  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }

  /**
   * Get contact page content
   */
  async getContactContent(): Promise<ContactContent> {
    try {
      const content = await firestoreService.getDocument<ContactContent>(
        CONTENT_COLLECTION,
        CONTENT_DOCUMENT_ID
      )
      return content || { ...DEFAULT_CONTACT_CONTENT }
    } catch (error) {
      this.handleError(error)
      // Return default content if fetch fails
      return { ...DEFAULT_CONTACT_CONTENT }
    }
  }

  /**
   * Save contact page content (admin only)
   */
  async saveContactContent(content: ContactContent): Promise<void> {
    try {
      const existing = await firestoreService.getDocument<ContactContent>(
        CONTENT_COLLECTION,
        CONTENT_DOCUMENT_ID
      )

      if (existing) {
        await firestoreService.updateDocument(CONTENT_COLLECTION, CONTENT_DOCUMENT_ID, content)
      } else {
        await firestoreService.createDocument(CONTENT_COLLECTION, CONTENT_DOCUMENT_ID, content)
      }
    } catch (error) {
      this.handleError(error)
      throw error
    }
  }

  /**
   * Submit a contact message
   */
  async submitContactMessage(message: Omit<ContactMessage, 'id' | 'createdAt' | 'status'>): Promise<ContactMessage> {
    try {
      const newMessage: ContactMessage = {
        ...message,
        id: this.generateId(),
        createdAt: new Date(),
        status: 'pending'
      }

      await firestoreService.createDocument(
        MESSAGES_COLLECTION,
        newMessage.id!,
        {
          ...newMessage,
          createdAt: newMessage.createdAt?.toISOString()
        }
      )

      return newMessage
    } catch (error) {
      this.handleError(error)
      throw error
    }
  }

  /**
   * Get all contact messages (admin only)
   */
  async getContactMessages(): Promise<ContactMessage[]> {
    try {
      const messages = await firestoreService.getCollection<ContactMessage>(MESSAGES_COLLECTION)
      return messages.sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0
        return dateB - dateA
      })
    } catch (error) {
      this.handleError(error)
      throw error
    }
  }

  /**
   * Update message status (admin only)
   */
  async updateMessageStatus(messageId: string, status: ContactMessage['status']): Promise<void> {
    try {
      await firestoreService.updateDocument(MESSAGES_COLLECTION, messageId, { status })
    } catch (error) {
      this.handleError(error)
      throw error
    }
  }

  /**
   * Delete a contact message (admin only)
   */
  async deleteContactMessage(messageId: string): Promise<void> {
    try {
      await firestoreService.deleteDocument(MESSAGES_COLLECTION, messageId)
    } catch (error) {
      this.handleError(error)
      throw error
    }
  }
}

