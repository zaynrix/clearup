import { BaseRepository } from './BaseRepository'
import { firestoreService } from '@/shared/services'
import type { ServicesContent } from '@/features/services/models/ServicesContent'

/**
 * Services Content Repository - Data Access Layer (Model in MVC)
 * Handles all database operations for ServicesContent entities
 */
export class ServicesContentRepository extends BaseRepository<any> {
  constructor() {
    super('servicesContent', null as any) // ServicesContent is an interface, not a class
  }

  /**
   * Get the single services content document
   */
  async getServicesContent(): Promise<ServicesContent | null> {
    const docs = await this.query()
    if (docs.length > 0 && docs[0]) {
      return docs[0] as ServicesContent
    }
    return null
  }

  /**
   * Create or update services content
   */
  async saveServicesContent(content: ServicesContent): Promise<void> {
    const existing = await this.getServicesContent()
    if (existing && 'id' in existing && existing.id && typeof existing.id === 'string') {
      // Update existing
      await firestoreService.updateDocument('servicesContent', existing.id, content)
    } else {
      // Create new
      await firestoreService.createDocument('servicesContent', 'main', content)
    }
  }
}

