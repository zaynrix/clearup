import { BaseViewController } from '@/shared/BaseViewController'
import { servicesContentController } from './ServicesContentController'
import type { ServicesContent, WhyChooseFeature } from '../models/ServicesContent'

/**
 * Services View Controller - Presentation Layer
 * Manages view state and user interactions for Services page
 */
export class ServicesViewController extends BaseViewController {
  private servicesContent: ServicesContent | null = null

  /**
   * Load services content
   */
  async loadServicesContent(): Promise<void> {
    this.setLoading(true)
    this.clearError()

    try {
      const result = await servicesContentController.getServicesContent()
      if (result.success && result.data) {
        this.servicesContent = result.data
      } else {
        this.setError(result.error || 'Failed to load services content')
      }
    } catch (error) {
      this.setError('An unexpected error occurred')
    } finally {
      this.setLoading(false)
    }
  }

  /**
   * Get services content
   */
  getServicesContent(): ServicesContent | null {
    return this.servicesContent
  }

  /**
   * Get why choose features
   */
  getWhyChooseFeatures(): WhyChooseFeature[] {
    return this.servicesContent?.whyChooseFeatures || []
  }
}

