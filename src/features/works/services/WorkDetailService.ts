import { BaseService } from '@/shared/BaseService'
import { HomeContentService } from '@/features/home/services/HomeContentService'
import type { WorkDetail } from '../models/WorkDetail'

/**
 * Work Detail Service - Business Logic Layer
 * Manages work detail data
 */
export class WorkDetailService extends BaseService {
  private homeContentService: HomeContentService

  constructor() {
    super()
    this.homeContentService = new HomeContentService()
  }

  /**
   * Get work detail by ID
   */
  async getWorkDetail(workId: string): Promise<WorkDetail | null> {
    try {
      const homeContent = await this.homeContentService.getHomeContent()
      const work = homeContent.realResultsCases.find(c => c.id === workId)
      return work || null
    } catch (error) {
      console.error('Error fetching work detail:', error)
      return null
    }
  }

  /**
   * Get all other works (excluding current work)
   */
  async getOtherWorks(excludeWorkId: string): Promise<WorkDetail[]> {
    try {
      const homeContent = await this.homeContentService.getHomeContent()
      return homeContent.realResultsCases.filter(c => c.id !== excludeWorkId)
    } catch (error) {
      console.error('Error fetching other works:', error)
      return []
    }
  }
}

export const workDetailService = new WorkDetailService()
