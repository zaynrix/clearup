import { BaseController } from '@/shared/BaseController'
import { legalContentService, type LegalContent } from '../services/LegalContentService'

/**
 * Legal Content Controller - Business Logic Layer (Controller in MVC)
 * Orchestrates legal content operations
 */
export class LegalContentController extends BaseController {
  /**
   * Get legal content
   */
  async getLegalContent(): Promise<{ success: boolean; data?: LegalContent; error?: string }> {
    try {
      const content = await legalContentService.getLegalContent()
      return this.success(content)
    } catch (error) {
      return this.handleError(error)
    }
  }

  /**
   * Update legal content
   */
  async updateLegalContent(
    content: Partial<LegalContent>
  ): Promise<{ success: boolean; data?: LegalContent; error?: string }> {
    try {
      await legalContentService.updateLegalContent(content)
      const updatedContent = await legalContentService.getLegalContent()
      return this.success(updatedContent)
    } catch (error) {
      return this.handleError(error)
    }
  }

  /**
   * Reset legal content to defaults
   */
  async resetLegalContent(): Promise<{ success: boolean; error?: string }> {
    try {
      await legalContentService.resetToDefaults()
      return this.success({})
    } catch (error) {
      return this.handleError(error)
    }
  }
}

export const legalContentController = new LegalContentController()


