import { BaseController } from '@/shared/BaseController'
import { homeContentService, type HomeContent } from '../services/HomeContentService'

/**
 * Home Content Controller - Business Logic Layer (Controller in MVC)
 * Orchestrates home content operations
 */
export class HomeContentController extends BaseController {
  /**
   * Get home content
   */
  async getHomeContent(): Promise<{ success: boolean; data?: HomeContent; error?: string }> {
    try {
      const content = await homeContentService.getHomeContent()
      return this.success(content)
    } catch (error) {
      return this.handleError(error)
    }
  }

  /**
   * Update home content
   */
  async updateHomeContent(
    content: Partial<HomeContent>,
    userId?: string
  ): Promise<{ success: boolean; data?: HomeContent; error?: string }> {
    try {
      await homeContentService.updateHomeContent(content, userId)
      const updatedContent = await homeContentService.getHomeContent()
      return this.success(updatedContent)
    } catch (error) {
      return this.handleError(error)
    }
  }

  /**
   * Reset home content to defaults
   */
  async resetHomeContent(userId?: string): Promise<{ success: boolean; error?: string }> {
    try {
      await homeContentService.resetToDefaults(userId)
      return this.success({})
    } catch (error) {
      return this.handleError(error)
    }
  }
}

export const homeContentController = new HomeContentController()

