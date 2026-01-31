import { BaseViewController } from '@/shared/BaseViewController'
import { legalContentController } from './LegalContentController'
import type { LegalContent } from '../models/LegalContent'

/**
 * Legal View Controller - Presentation Layer
 * Manages view state for legal pages
 */
export class LegalViewController extends BaseViewController {
  private legalContent: LegalContent | null = null

  /**
   * Load legal content
   */
  async loadLegalContent(): Promise<void> {
    this.setLoading(true)
    this.clearError()
    
    try {
      const result = await legalContentController.getLegalContent()
      
      if (result.success && result.data) {
        this.legalContent = result.data
      } else {
        this.setError(result.error || 'Failed to load legal content')
      }
    } catch (error) {
      this.setError(error instanceof Error ? error.message : 'An unexpected error occurred')
    } finally {
      this.setLoading(false)
    }
  }

  /**
   * Get legal content
   */
  getLegalContent(): LegalContent | null {
    return this.legalContent
  }

  /**
   * Get privacy policy
   */
  getPrivacyPolicy() {
    return this.legalContent?.privacyPolicy || null
  }

  /**
   * Get terms of service
   */
  getTermsOfService() {
    return this.legalContent?.termsOfService || null
  }

  /**
   * Get cookie policy
   */
  getCookiePolicy() {
    return this.legalContent?.cookiePolicy || null
  }
}

