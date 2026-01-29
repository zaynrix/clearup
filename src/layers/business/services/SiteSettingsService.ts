import { BaseService } from './BaseService'
import { firestoreService } from '@/shared/services'
import type { SiteSettings } from '@/features/admin/models/SiteSettings'

export type { SiteSettings }

const COLLECTION_NAME = 'site_settings'
const DOCUMENT_ID = 'main'

const DEFAULT_SETTINGS: SiteSettings = {
  disabledSections: [],
  maintenanceMode: false,
  maintenanceMessage: 'This section is temporarily unavailable.'
}

/**
 * Site Settings Service - Business Logic Layer (Model in MVC)
 * Manages site-wide settings like disabled sections and maintenance mode
 */
export class SiteSettingsService extends BaseService {
  /**
   * Get site settings
   */
  async getSiteSettings(): Promise<SiteSettings> {
    try {
      const settings = await firestoreService.getDocument<SiteSettings>(
        COLLECTION_NAME,
        DOCUMENT_ID
      )
      return settings || DEFAULT_SETTINGS
    } catch (error: any) {
      // If it's a permissions error, log it but return defaults
      // This allows the app to continue working even if settings can't be fetched
      if (error?.code === 'permission-denied' || error?.message?.includes('permission')) {
        console.warn('Site settings permission denied. Using default settings. Make sure Firestore rules allow public reads for site_settings collection.')
        return DEFAULT_SETTINGS
      }
      console.error('Error fetching site settings:', error)
      return DEFAULT_SETTINGS
    }
  }

  /**
   * Update site settings
   */
  async updateSiteSettings(settings: Partial<SiteSettings>): Promise<void> {
    try {
      const existingSettings = await this.getSiteSettings()
      const updatedSettings = { ...existingSettings, ...settings, updatedAt: new Date().toISOString() }
      
      const existingDoc = await firestoreService.getDocument(COLLECTION_NAME, DOCUMENT_ID)
      if (!existingDoc) {
        await firestoreService.createDocument(COLLECTION_NAME, DOCUMENT_ID, {
          ...updatedSettings,
          createdAt: new Date().toISOString()
        })
      } else {
        await firestoreService.updateDocument(COLLECTION_NAME, DOCUMENT_ID, updatedSettings)
      }
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * Toggle section disabled state
   */
  async toggleSection(sectionId: string, disabled: boolean): Promise<void> {
    try {
      const settings = await this.getSiteSettings()
      let disabledSections = [...(settings.disabledSections || [])]
      
      if (disabled) {
        // Add section to disabled list if not already there
        if (!disabledSections.includes(sectionId)) {
          disabledSections.push(sectionId)
        }
      } else {
        // Remove section from disabled list
        disabledSections = disabledSections.filter(id => id !== sectionId)
      }
      
      await this.updateSiteSettings({ disabledSections })
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * Check if a section is disabled
   */
  async isSectionDisabled(sectionId: string): Promise<boolean> {
    try {
      const settings = await this.getSiteSettings()
      return settings.disabledSections?.includes(sectionId) || false
    } catch (error) {
      console.error('Error checking section status:', error)
      return false
    }
  }
}

export const siteSettingsService = new SiteSettingsService()

