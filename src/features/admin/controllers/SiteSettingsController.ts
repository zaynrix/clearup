import { BaseController } from '@/shared/BaseController'
import { siteSettingsService, type SiteSettings } from '../services/SiteSettingsService'

/**
 * Site Settings Controller - Business Logic Layer (Controller in MVC)
 * Orchestrates site settings operations
 */
export class SiteSettingsController extends BaseController {
  /**
   * Get site settings
   */
  async getSiteSettings(): Promise<{ success: boolean; data?: SiteSettings; error?: string }> {
    try {
      const settings = await siteSettingsService.getSiteSettings()
      return this.success(settings)
    } catch (error) {
      return this.handleError(error)
    }
  }

  /**
   * Update site settings
   */
  async updateSiteSettings(settings: Partial<SiteSettings>): Promise<{ success: boolean; error?: string }> {
    try {
      await siteSettingsService.updateSiteSettings(settings)
      return { success: true }
    } catch (error) {
      return this.handleError(error)
    }
  }

  /**
   * Toggle section disabled state
   */
  async toggleSection(sectionId: string, disabled: boolean): Promise<{ success: boolean; error?: string }> {
    try {
      await siteSettingsService.toggleSection(sectionId, disabled)
      return { success: true }
    } catch (error) {
      return this.handleError(error)
    }
  }
}

export const siteSettingsController = new SiteSettingsController()

