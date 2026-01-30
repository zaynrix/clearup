import { BaseService } from '@/shared/BaseService'
import { AboutContentRepository } from '@/shared/repositories/AboutContentRepository'
import { ActivityLogRepository } from '@/shared/repositories/ActivityLogRepository'
import { UserRepository } from '@/shared/repositories/UserRepository'
import { ActivityLog } from '@/features/admin/models/ActivityLog'
import { firestoreService } from '@/shared/services'
import type { AboutContent, TeamMember, FAQ, StatCard } from '../models/AboutContent'

export type { AboutContent, TeamMember, FAQ, StatCard }

const DEFAULT_ABOUT_CONTENT: AboutContent = {
  whoWeAreTitle: 'Who We Are',
  whoWeAreDescription: 'We redesign your marketing system to run it self',
  statCards: [],
  videoUrl: '',
  videoFileUrl: '',
  videoType: 'none',
  ctaButtonText: 'Book a Meeting',
  ctaButtonLink: '',
  teamTitle: 'Our Team',
  teamSubtitle: 'Who is Nextcent suitable for?',
  teamMembers: [],
  faqTitle: 'Frequently Asked Questions',
  faqs: []
}

const COLLECTION_NAME = 'aboutContent'
const DOCUMENT_ID = 'main'

export class AboutContentService extends BaseService {
  private repository: AboutContentRepository
  private activityLogRepository: ActivityLogRepository
  private userRepository: UserRepository

  constructor() {
    super()
    this.repository = new AboutContentRepository()
    this.activityLogRepository = new ActivityLogRepository()
    this.userRepository = new UserRepository()
  }

  /**
   * Generate a unique ID
   */
  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }

  /**
   * Get about content
   */
  async getAboutContent(): Promise<AboutContent> {
    try {
      const content = await firestoreService.getDocument<AboutContent>(
        COLLECTION_NAME,
        DOCUMENT_ID
      )
      return content || { ...DEFAULT_ABOUT_CONTENT }
    } catch (error) {
      this.handleError(error)
      throw error
    }
  }

  /**
   * Save about content
   */
  async saveAboutContent(
    content: AboutContent,
    userId: string
  ): Promise<void> {
    try {
      const existing = await firestoreService.getDocument<AboutContent>(
        COLLECTION_NAME,
        DOCUMENT_ID
      )

      if (existing) {
        await firestoreService.updateDocument(COLLECTION_NAME, DOCUMENT_ID, content)
      } else {
        await firestoreService.createDocument(COLLECTION_NAME, DOCUMENT_ID, content)
      }

      // Log activity
      const user = await this.userRepository.findById(userId)
      if (user) {
        await this.activityLogRepository.create(
          new ActivityLog({
            userId,
            userEmail: user.email || '',
            userName: user.displayName,
            action: 'update_about_content',
            resource: 'about_content',
            resourceId: DOCUMENT_ID,
            metadata: { section: 'about' }
          })
        )
      }
    } catch (error) {
      this.handleError(error)
      throw error
    }
  }

  /**
   * Add team member
   */
  async addTeamMember(
    member: Omit<TeamMember, 'id'>,
    userId: string
  ): Promise<TeamMember> {
    try {
      const content = await this.getAboutContent()
      const newMember: TeamMember = {
        ...member,
        id: this.generateId(),
        order: content.teamMembers.length
      }
      
      content.teamMembers.push(newMember)
      await this.saveAboutContent(content, userId)

      return newMember
    } catch (error) {
      this.handleError(error)
      throw error
    }
  }

  /**
   * Update team member
   */
  async updateTeamMember(
    memberId: string,
    updates: Partial<TeamMember>,
    userId: string
  ): Promise<void> {
    try {
      const content = await this.getAboutContent()
      const index = content.teamMembers.findIndex(m => m.id === memberId)
      
      if (index === -1) {
        throw new Error('Team member not found')
      }

      const currentMember = content.teamMembers[index]
      if (!currentMember) {
        throw new Error('Team member not found')
      }

      const updatedMember: TeamMember = {
        ...currentMember,
        ...updates,
        name: updates.name ?? currentMember.name,
        role: updates.role ?? currentMember.role
      }

      content.teamMembers[index] = updatedMember
      await this.saveAboutContent(content, userId)
    } catch (error) {
      this.handleError(error)
      throw error
    }
  }

  /**
   * Delete team member
   */
  async deleteTeamMember(memberId: string, userId: string): Promise<void> {
    try {
      const content = await this.getAboutContent()
      content.teamMembers = content.teamMembers.filter(m => m.id !== memberId)
      await this.saveAboutContent(content, userId)
    } catch (error) {
      this.handleError(error)
      throw error
    }
  }

  /**
   * Add FAQ
   */
  async addFAQ(
    faq: Omit<FAQ, 'id'>,
    userId: string
  ): Promise<FAQ> {
    try {
      const content = await this.getAboutContent()
      const newFAQ: FAQ = {
        ...faq,
        id: this.generateId(),
        order: content.faqs.length
      }
      
      content.faqs.push(newFAQ)
      await this.saveAboutContent(content, userId)

      return newFAQ
    } catch (error) {
      this.handleError(error)
      throw error
    }
  }

  /**
   * Update FAQ
   */
  async updateFAQ(
    faqId: string,
    updates: Partial<FAQ>,
    userId: string
  ): Promise<void> {
    try {
      const content = await this.getAboutContent()
      const index = content.faqs.findIndex(f => f.id === faqId)
      
      if (index === -1) {
        throw new Error('FAQ not found')
      }

      const currentFAQ = content.faqs[index]
      if (!currentFAQ) {
        throw new Error('FAQ not found')
      }

      const updatedFAQ: FAQ = {
        ...currentFAQ,
        ...updates,
        question: updates.question ?? currentFAQ.question,
        answer: updates.answer ?? currentFAQ.answer
      }

      content.faqs[index] = updatedFAQ
      await this.saveAboutContent(content, userId)
    } catch (error) {
      this.handleError(error)
      throw error
    }
  }

  /**
   * Delete FAQ
   */
  async deleteFAQ(faqId: string, userId: string): Promise<void> {
    try {
      const content = await this.getAboutContent()
      content.faqs = content.faqs.filter(f => f.id !== faqId)
      await this.saveAboutContent(content, userId)
    } catch (error) {
      this.handleError(error)
      throw error
    }
  }

  /**
   * Add stat card
   */
  async addStatCard(
    statCard: Omit<StatCard, 'id'>,
    userId: string
  ): Promise<StatCard> {
    try {
      const content = await this.getAboutContent()
      const newStatCard: StatCard = {
        ...statCard,
        id: this.generateId(),
        order: content.statCards.length
      }
      
      content.statCards.push(newStatCard)
      await this.saveAboutContent(content, userId)

      return newStatCard
    } catch (error) {
      this.handleError(error)
      throw error
    }
  }

  /**
   * Update stat card
   */
  async updateStatCard(
    statCardId: string,
    updates: Partial<StatCard>,
    userId: string
  ): Promise<void> {
    try {
      const content = await this.getAboutContent()
      const index = content.statCards.findIndex(s => s.id === statCardId)
      
      if (index === -1) {
        throw new Error('Stat card not found')
      }

      const currentStatCard = content.statCards[index]
      if (!currentStatCard) {
        throw new Error('Stat card not found')
      }

      const updatedStatCard: StatCard = {
        ...currentStatCard,
        ...updates,
        title: updates.title ?? currentStatCard.title,
        value: updates.value ?? currentStatCard.value,
        description: updates.description ?? currentStatCard.description
      }

      content.statCards[index] = updatedStatCard
      await this.saveAboutContent(content, userId)
    } catch (error) {
      this.handleError(error)
      throw error
    }
  }

  /**
   * Delete stat card
   */
  async deleteStatCard(statCardId: string, userId: string): Promise<void> {
    try {
      const content = await this.getAboutContent()
      content.statCards = content.statCards.filter(s => s.id !== statCardId)
      await this.saveAboutContent(content, userId)
    } catch (error) {
      this.handleError(error)
      throw error
    }
  }
}

