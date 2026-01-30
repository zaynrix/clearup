import { BaseController } from '@/shared/BaseController'
import { ServicesContentService, type ServicesContent, type WhyChooseFeature } from '../services/ServicesContentService'

const servicesContentService = new ServicesContentService()

/**
 * Services Content Controller - Business Logic Layer
 * Orchestrates services content operations
 */
export class ServicesContentController extends BaseController {
  /**
   * Get services content
   */
  async getServicesContent(): Promise<{ success: boolean; data?: ServicesContent; error?: string }> {
    try {
      const content = await servicesContentService.getServicesContent()
      return this.success(content)
    } catch (error) {
      return this.handleError(error)
    }
  }

  /**
   * Update services content
   */
  async updateServicesContent(
    content: Partial<ServicesContent>,
    userId?: string
  ): Promise<{ success: boolean; data?: ServicesContent; error?: string }> {
    try {
      const currentContent = await servicesContentService.getServicesContent()
      
      // Deep merge to preserve arrays (especially whyChooseFeatures)
      const updatedContent: ServicesContent = {
        ...currentContent,
        ...content,
        // Preserve whyChooseFeatures if not provided in update, or merge if provided
        whyChooseFeatures: content.whyChooseFeatures !== undefined 
          ? content.whyChooseFeatures 
          : currentContent.whyChooseFeatures || []
      }
      
      if (!userId) {
        return { success: false, error: 'User ID is required' }
      }

      await servicesContentService.saveServicesContent(updatedContent, userId)
      const savedContent = await servicesContentService.getServicesContent()
      return this.success(savedContent)
    } catch (error) {
      return this.handleError(error)
    }
  }

  /**
   * Add why choose feature
   */
  async addWhyChooseFeature(
    feature: Omit<WhyChooseFeature, 'id'>,
    userId: string
  ): Promise<{ success: boolean; data?: WhyChooseFeature; error?: string }> {
    try {
      const newFeature = await servicesContentService.addWhyChooseFeature(feature, userId)
      return this.success(newFeature)
    } catch (error) {
      return this.handleError(error)
    }
  }

  /**
   * Update why choose feature
   */
  async updateWhyChooseFeature(
    featureId: string,
    updates: Partial<WhyChooseFeature>,
    userId: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      await servicesContentService.updateWhyChooseFeature(featureId, updates, userId)
      return this.success({})
    } catch (error) {
      return this.handleError(error)
    }
  }

  /**
   * Delete why choose feature
   */
  async deleteWhyChooseFeature(
    featureId: string,
    userId: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      await servicesContentService.deleteWhyChooseFeature(featureId, userId)
      return this.success({})
    } catch (error) {
      return this.handleError(error)
    }
  }
}

export const servicesContentController = new ServicesContentController()

