import { BaseService } from '@/shared/BaseService'
import { ServicesContentRepository } from '@/shared/repositories/ServicesContentRepository'
import { ActivityLogRepository } from '@/shared/repositories/ActivityLogRepository'
import { UserRepository } from '@/shared/repositories/UserRepository'
import { ActivityLog } from '@/features/admin/models/ActivityLog'
import { firestoreService } from '@/shared/services'
import type { ServicesContent, WhyChooseFeature } from '../models/ServicesContent'

export type { ServicesContent, WhyChooseFeature }

const DEFAULT_SERVICES_CONTENT: ServicesContent = {
  whyChooseTitle: 'Why Choose Clear Up',
  whyChooseSubtitle: 'Creative thinking, fast execution, and results-driven content built for modern brands.',
  whyChooseFeatures: []
}

const COLLECTION_NAME = 'servicesContent'
const DOCUMENT_ID = 'main'

export class ServicesContentService extends BaseService {
  private repository: ServicesContentRepository
  private activityLogRepository: ActivityLogRepository
  private userRepository: UserRepository

  constructor() {
    super()
    this.repository = new ServicesContentRepository()
    this.activityLogRepository = new ActivityLogRepository()
    this.userRepository = new UserRepository()
  }

  /**
   * Generate a unique ID
   */
  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`
  }

  /**
   * Get services content
   */
  async getServicesContent(): Promise<ServicesContent> {
    try {
      const content = await firestoreService.getDocument<ServicesContent>(
        COLLECTION_NAME,
        DOCUMENT_ID
      )
      
      // Ensure whyChooseFeatures is always an array
      const result = content || { ...DEFAULT_SERVICES_CONTENT }
      if (!result.whyChooseFeatures || !Array.isArray(result.whyChooseFeatures)) {
        result.whyChooseFeatures = []
      }
      
      // Debug log
      console.log('ServicesContentService.getServicesContent:', {
        hasContent: !!content,
        featuresCount: result.whyChooseFeatures?.length || 0,
        features: result.whyChooseFeatures
      })
      
      return result
    } catch (error) {
      this.handleError(error)
      throw error
    }
  }

  /**
   * Save services content
   */
  async saveServicesContent(
    content: ServicesContent,
    userId: string
  ): Promise<void> {
    try {
      const existing = await firestoreService.getDocument<ServicesContent>(
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
            action: 'update_services_content',
            resource: 'services_content',
            resourceId: DOCUMENT_ID,
            metadata: { section: 'services' }
          })
        )
      }
    } catch (error) {
      this.handleError(error)
      throw error
    }
  }

  /**
   * Add why choose feature
   */
  async addWhyChooseFeature(
    feature: Omit<WhyChooseFeature, 'id'>,
    userId: string
  ): Promise<WhyChooseFeature> {
    try {
      const content = await this.getServicesContent()
      const newFeature: WhyChooseFeature = {
        ...feature,
        id: this.generateId(),
        order: content.whyChooseFeatures.length
      }
      
      content.whyChooseFeatures.push(newFeature)
      await this.saveServicesContent(content, userId)

      return newFeature
    } catch (error) {
      this.handleError(error)
      throw error
    }
  }

  /**
   * Update why choose feature
   */
  async updateWhyChooseFeature(
    featureId: string,
    updates: Partial<WhyChooseFeature>,
    userId: string
  ): Promise<void> {
    try {
      const content = await this.getServicesContent()
      const index = content.whyChooseFeatures.findIndex(f => f.id === featureId)
      
      if (index === -1) {
        throw new Error('Feature not found')
      }

      const currentFeature = content.whyChooseFeatures[index]
      if (!currentFeature) {
        throw new Error('Feature not found')
      }

      const updatedFeature: WhyChooseFeature = {
        ...currentFeature,
        ...updates,
        title: updates.title ?? currentFeature.title,
        description: updates.description ?? currentFeature.description
      }

      content.whyChooseFeatures[index] = updatedFeature
      await this.saveServicesContent(content, userId)
    } catch (error) {
      this.handleError(error)
      throw error
    }
  }

  /**
   * Delete why choose feature
   */
  async deleteWhyChooseFeature(featureId: string, userId: string): Promise<void> {
    try {
      const content = await this.getServicesContent()
      content.whyChooseFeatures = content.whyChooseFeatures.filter(f => f.id !== featureId)
      await this.saveServicesContent(content, userId)
    } catch (error) {
      this.handleError(error)
      throw error
    }
  }
}

