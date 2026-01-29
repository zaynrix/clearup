import { ref, type Ref } from 'vue'
import { BaseViewController } from '@/shared/BaseViewController'
import { homeContentController } from './HomeContentController'
import type { HomeContent } from '../models/HomeContent'

/**
 * Home Content View Controller - Presentation Layer (Controller in MVC)
 * Handles home content loading and state management
 */
export class HomeContentViewController extends BaseViewController {
  private homeContent: Ref<HomeContent | null> = ref(null)

  /**
   * Load home content from Firestore
   */
  async loadHomeContent(): Promise<void> {
    this.setLoading(true)
    this.clearError()

    try {
      const result = await homeContentController.getHomeContent()
      
      if (result.success && result.data) {
        this.homeContent.value = result.data
      } else {
        this.setError(result.error || 'Failed to load home content')
      }
    } catch (err) {
      this.setError(err instanceof Error ? err.message : 'Failed to load home content')
    } finally {
      this.setLoading(false)
    }
  }

  /**
   * Get home content
   */
  get content(): HomeContent | null {
    return this.homeContent.value
  }
}

