import { BaseRepository } from './BaseRepository'
import { firestoreService } from '@/shared/services'
import type { AboutContent } from '@/features/about/models/AboutContent'

/**
 * About Content Repository - Data Access Layer
 * Handles all database operations for About Content
 */
export class AboutContentRepository extends BaseRepository<any> {
  constructor() {
    super('aboutContent', null as any) // AboutContent is an interface, not a class
  }

  /**
   * Get the single about content document
   */
  async getAboutContent(): Promise<AboutContent | null> {
    const docs = await this.query()
    if (docs.length > 0 && docs[0]) {
      return docs[0] as AboutContent
    }
    return null
  }

  /**
   * Create or update about content
   */
  async saveAboutContent(content: AboutContent): Promise<void> {
    const existing = await this.getAboutContent()
    if (existing && 'id' in existing && existing.id && typeof existing.id === 'string') {
      // Update existing
      await firestoreService.updateDocument('aboutContent', existing.id, content)
    } else {
      // Create new
      await firestoreService.createDocument('aboutContent', 'main', content)
    }
  }
}

