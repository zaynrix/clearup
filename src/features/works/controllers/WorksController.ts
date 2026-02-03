import { BaseController } from '@/shared/BaseController'
import { HomeContentService } from '@/features/home/services/HomeContentService'
import type { HomeContent } from '@/features/home/models/HomeContent'

export interface WorksResult {
  success: boolean
  data?: HomeContent
  error?: string
}

/**
 * Works Controller - Presentation Layer (Controller in MVC)
 * Handles works page logic and data fetching
 */
export class WorksController extends BaseController {
  private homeContentService: HomeContentService

  constructor() {
    super()
    this.homeContentService = new HomeContentService()
  }

  /**
   * Get all works (real results cases) from home content
   */
  async getWorks(): Promise<WorksResult> {
    try {
      const homeContent = await this.homeContentService.getHomeContent()
      return this.success(homeContent)
    } catch (error) {
      console.error('Error fetching works:', error)
      return this.handleError(error)
    }
  }
}
