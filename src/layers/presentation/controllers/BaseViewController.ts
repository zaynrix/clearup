import { ref, type Ref } from 'vue'

/**
 * Base View Controller for Presentation Layer
 * Handles common view controller functionality like loading and error states
 */
export abstract class BaseViewController {
  protected loading: Ref<boolean> = ref(false)
  protected error: Ref<string | null> = ref(null)

  /**
   * Set loading state
   */
  protected setLoading(value: boolean): void {
    this.loading.value = value
  }

  /**
   * Set error message
   */
  protected setError(message: string): void {
    this.error.value = message
  }

  /**
   * Clear error message
   */
  protected clearError(): void {
    this.error.value = null
  }

  /**
   * Get loading state
   */
  get isLoading(): boolean {
    return this.loading.value
  }

  /**
   * Get error message
   */
  get errorMessage(): string | null {
    return this.error.value
  }
}
