import { ref, type Ref } from 'vue'

/**
 * Base View Controller for Presentation Layer
 * This represents the Controller part of MVC in the Presentation Layer
 * Handles view state and user interactions
 */
export abstract class BaseViewController {
  protected loading: Ref<boolean> = ref(false)
  protected error: Ref<string | null> = ref(null)

  /**
   * Set loading state
   */
  setLoading(value: boolean): void {
    this.loading.value = value
  }

  /**
   * Set error message
   */
  setError(message: string | null): void {
    this.error.value = message
  }

  /**
   * Clear error
   */
  clearError(): void {
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

