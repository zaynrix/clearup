import { ref, onUnmounted } from 'vue'
import { siteSettingsService, type SiteSettings } from '@/features/admin/services/SiteSettingsService'

const DEFAULT_SETTINGS: SiteSettings = {
  disabledSections: [],
  maintenanceMode: false,
  maintenanceMessage: 'This section is temporarily unavailable.'
}

// Global reactive state for site settings (shared across all components)
const siteSettings = ref<SiteSettings>(DEFAULT_SETTINGS)
let unsubscribe: (() => void) | null = null
let isSubscribed = false

/**
 * Composable for accessing real-time site settings
 * Automatically subscribes to Firestore updates and provides reactive data
 */
export function useSiteSettings() {
  // Subscribe to real-time updates if not already subscribed
  if (!isSubscribed) {
    unsubscribe = siteSettingsService.subscribeToSiteSettings((settings) => {
      siteSettings.value = settings
    })
    isSubscribed = true
  }

  /**
   * Check if a section is disabled
   */
  const isSectionDisabled = (sectionId: string): boolean => {
    return siteSettings.value.disabledSections?.includes(sectionId) || false
  }

  /**
   * Check if a page is disabled
   */
  const isPageDisabled = (pageId: string): boolean => {
    return siteSettings.value.disabledSections?.includes(pageId) || false
  }

  /**
   * Cleanup function (called when component unmounts)
   * Note: We keep the subscription active globally to share state across components
   * Only unsubscribe when the app is closed
   */
  const cleanup = () => {
    // Don't unsubscribe here - we want to keep the subscription active
    // The subscription will be cleaned up when the app closes
  }

  return {
    siteSettings,
    isSectionDisabled,
    isPageDisabled,
    cleanup
  }
}

/**
 * Cleanup function to be called when the app unmounts
 */
export function cleanupSiteSettingsSubscription() {
  if (unsubscribe) {
    unsubscribe()
    unsubscribe = null
    isSubscribed = false
  }
}

