import { BaseService } from '@/shared/BaseService'
import { firestoreService } from '@/shared/services/firestoreService'
import { type LegalContent, defaultLegalContent } from '../models/LegalContent'

const COLLECTION_NAME = 'site_content'
const DOCUMENT_ID = 'legal'

/**
 * Legal Content Service - Business Logic Layer
 * Handles CRUD operations for legal content (Privacy Policy, Terms of Service, Cookie Policy)
 */
export class LegalContentService extends BaseService {
  /**
   * Get legal content from Firestore
   */
  async getLegalContent(): Promise<LegalContent> {
    try {
      const doc = await firestoreService.getDocument(COLLECTION_NAME, DOCUMENT_ID)
      
      if (doc) {
        return {
          privacyPolicy: doc.privacyPolicy || defaultLegalContent.privacyPolicy,
          termsOfService: doc.termsOfService || defaultLegalContent.termsOfService,
          cookiePolicy: doc.cookiePolicy || defaultLegalContent.cookiePolicy
        }
      }
      
      return defaultLegalContent
    } catch (error) {
      console.error('Error fetching legal content:', error)
      return defaultLegalContent
    }
  }

  /**
   * Update legal content in Firestore
   */
  async updateLegalContent(content: Partial<LegalContent>): Promise<void> {
    try {
      const existingContent = await this.getLegalContent()
      const updatedContent = {
        ...existingContent,
        ...content
      }
      
      await firestoreService.setDocument(COLLECTION_NAME, DOCUMENT_ID, updatedContent)
    } catch (error) {
      console.error('Error updating legal content:', error)
      throw error
    }
  }

  /**
   * Reset legal content to defaults
   */
  async resetToDefaults(): Promise<void> {
    try {
      await firestoreService.setDocument(COLLECTION_NAME, DOCUMENT_ID, defaultLegalContent)
    } catch (error) {
      console.error('Error resetting legal content:', error)
      throw error
    }
  }
}

export const legalContentService = new LegalContentService()

