/**
 * Base Controller for Business Logic Layer
 * This represents the Controller part of MVC in the Business Layer
 * Controllers orchestrate services and handle business logic flow
 */
export abstract class BaseController {
  /**
   * Handle controller errors
   */
  protected handleError(error: unknown): { success: false; error: string } {
    if (error instanceof Error) {
      return { success: false, error: error.message }
    }
    return { success: false, error: String(error) }
  }

  /**
   * Create success response
   */
  protected success<T>(data: T): { success: true; data: T } {
    return { success: true, data }
  }
}

