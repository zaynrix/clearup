import { ref, onUnmounted } from 'vue'
import { siteSettingsService, type SiteSettings } from '@/features/admin/services/SiteSettingsService'

const DEFAULT_SETTINGS: SiteSettings = {
  disabledSections: [],
  maintenanceMode: false,
  maintenanceMessage: 'This section is temporarily unavailable.'
}

// Global reactive state for site settings (shared across all components)
const siteSettings = ref<SiteSettings>(DEFAULT_SETTINGS)
const settingsLoaded = ref(false)
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
      if (settings) {
        siteSettings.value = settings
      } else {
        // If no settings found, use defaults (empty disabledSections = no maintenance)
        siteSettings.value = DEFAULT_SETTINGS
      }
      // Mark as loaded - maintenance will only show if page is explicitly disabled
      settingsLoaded.value = true
    })
    isSubscribed = true
  }

  /**
   * Check if a section is disabled
   * Only returns true if settings have been loaded and section is explicitly disabled
   */
  const isSectionDisabled = (sectionId: string): boolean => {
    // Don't disable sections until settings are loaded
    if (!settingsLoaded.value) {
      return false
    }
    return siteSettings.value.disabledSections?.includes(sectionId) || false
  }

  /**
   * Check if a page is disabled
   * Default: false (show normal screen)
   * Only returns true if settings are loaded AND page is explicitly in disabledSections
   */
  const isPageDisabled = (pageId: string): boolean => {
    // Default: Always show normal screen until settings are loaded
    if (!settingsLoaded.value) {
      return false
    }
    // Only show maintenance if page is explicitly in the disabledSections array
    // Default settings have empty array, so maintenance won't show by default
    const disabledSections = siteSettings.value.disabledSections || []
    return disabledSections.includes(pageId)
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
    settingsLoaded,
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

