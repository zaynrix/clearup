import { BaseController } from '@/shared/BaseController'
import { AboutContentService, type AboutContent, type TeamMember, type FAQ, type StatCard } from '../services/AboutContentService'

const aboutContentService = new AboutContentService()

/**
 * About Content Controller - Business Logic Layer
 * Orchestrates about content operations
 */
export class AboutContentController extends BaseController {
  /**
   * Get about content
   */
  async getAboutContent(): Promise<{ success: boolean; data?: AboutContent; error?: string }> {
    try {
      const content = await aboutContentService.getAboutContent()
      return this.success(content)
    } catch (error) {
      return this.handleError(error)
    }
  }

  /**
   * Update about content
   */
  async updateAboutContent(
    content: Partial<AboutContent>,
    userId?: string
  ): Promise<{ success: boolean; data?: AboutContent; error?: string }> {
    try {
      const currentContent = await aboutContentService.getAboutContent()
      const updatedContent = { ...currentContent, ...content }
      
      if (!userId) {
        return { success: false, error: 'User ID is required' }
      }

      await aboutContentService.saveAboutContent(updatedContent, userId)
      const savedContent = await aboutContentService.getAboutContent()
      return this.success(savedContent)
    } catch (error) {
      return this.handleError(error)
    }
  }

  /**
   * Add team member
   */
  async addTeamMember(
    member: Omit<TeamMember, 'id'>,
    userId: string
  ): Promise<{ success: boolean; data?: TeamMember; error?: string }> {
    try {
      const newMember = await aboutContentService.addTeamMember(member, userId)
      return this.success(newMember)
    } catch (error) {
      return this.handleError(error)
    }
  }

  /**
   * Update team member
   */
  async updateTeamMember(
    memberId: string,
    updates: Partial<TeamMember>,
    userId: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      await aboutContentService.updateTeamMember(memberId, updates, userId)
      return this.success({})
    } catch (error) {
      return this.handleError(error)
    }
  }

  /**
   * Delete team member
   */
  async deleteTeamMember(
    memberId: string,
    userId: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      await aboutContentService.deleteTeamMember(memberId, userId)
      return this.success({})
    } catch (error) {
      return this.handleError(error)
    }
  }

  /**
   * Add FAQ
   */
  async addFAQ(
    faq: Omit<FAQ, 'id'>,
    userId: string
  ): Promise<{ success: boolean; data?: FAQ; error?: string }> {
    try {
      const newFAQ = await aboutContentService.addFAQ(faq, userId)
      return this.success(newFAQ)
    } catch (error) {
      return this.handleError(error)
    }
  }

  /**
   * Update FAQ
   */
  async updateFAQ(
    faqId: string,
    updates: Partial<FAQ>,
    userId: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      await aboutContentService.updateFAQ(faqId, updates, userId)
      return this.success({})
    } catch (error) {
      return this.handleError(error)
    }
  }

  /**
   * Delete FAQ
   */
  async deleteFAQ(
    faqId: string,
    userId: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      await aboutContentService.deleteFAQ(faqId, userId)
      return this.success({})
    } catch (error) {
      return this.handleError(error)
    }
  }

  /**
   * Add stat card
   */
  async addStatCard(
    statCard: Omit<StatCard, 'id'>,
    userId: string
  ): Promise<{ success: boolean; data?: StatCard; error?: string }> {
    try {
      const newStatCard = await aboutContentService.addStatCard(statCard, userId)
      return this.success(newStatCard)
    } catch (error) {
      return this.handleError(error)
    }
  }

  /**
   * Update stat card
   */
  async updateStatCard(
    statCardId: string,
    updates: Partial<StatCard>,
    userId: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      await aboutContentService.updateStatCard(statCardId, updates, userId)
      return this.success({})
    } catch (error) {
      return this.handleError(error)
    }
  }

  /**
   * Delete stat card
   */
  async deleteStatCard(
    statCardId: string,
    userId: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      await aboutContentService.deleteStatCard(statCardId, userId)
      return this.success({})
    } catch (error) {
      return this.handleError(error)
    }
  }
}

export const aboutContentController = new AboutContentController()

