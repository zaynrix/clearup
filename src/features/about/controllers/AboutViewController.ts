import { BaseViewController } from '@/shared/BaseViewController'
import { aboutContentController } from './AboutContentController'
import type { AboutContent, TeamMember, FAQ } from '../models/AboutContent'

/**
 * About View Controller - Presentation Layer
 * Manages view state and user interactions for About page
 */
export class AboutViewController extends BaseViewController {
  private aboutContent: AboutContent | null = null

  /**
   * Load about content
   */
  async loadAboutContent(): Promise<void> {
    this.setLoading(true)
    this.clearError()

    try {
      const result = await aboutContentController.getAboutContent()
      if (result.success && result.data) {
        this.aboutContent = result.data
      } else {
        this.setError(result.error || 'Failed to load about content')
      }
    } catch (error) {
      this.setError('An unexpected error occurred')
    } finally {
      this.setLoading(false)
    }
  }

  /**
   * Get about content
   */
  getAboutContent(): AboutContent | null {
    return this.aboutContent
  }

  /**
   * Get team members
   */
  getTeamMembers(): TeamMember[] {
    return this.aboutContent?.teamMembers || []
  }

  /**
   * Get FAQs
   */
  getFAQs(): FAQ[] {
    return this.aboutContent?.faqs || []
  }
}

