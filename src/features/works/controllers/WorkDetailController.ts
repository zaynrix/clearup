import { BaseController } from '@/shared/BaseController'
import { workDetailService } from '../services/WorkDetailService'
import type { WorkDetail } from '../models/WorkDetail'

export interface WorkDetailResult {
  success: boolean
  data?: WorkDetail
  error?: string
}

export interface OtherWorksResult {
  success: boolean
  data?: WorkDetail[]
  error?: string
}

/**
 * Work Detail Controller - Presentation Layer (Controller in MVC)
 * Handles work detail page logic
 */
export class WorkDetailController extends BaseController {
  /**
   * Get work detail by ID
   */
  async getWorkDetail(workId: string): Promise<WorkDetailResult> {
    try {
      const work = await workDetailService.getWorkDetail(workId)
      if (!work) {
        return this.error('Work not found')
      }
      return this.success(work)
    } catch (error) {
      console.error('Error fetching work detail:', error)
      return this.handleError(error)
    }
  }

  /**
   * Get other works (excluding current work)
   */
  async getOtherWorks(excludeWorkId: string): Promise<OtherWorksResult> {
    try {
      const works = await workDetailService.getOtherWorks(excludeWorkId)
      return this.success(works)
    } catch (error) {
      console.error('Error fetching other works:', error)
      return this.handleError(error)
    }
  }
}
