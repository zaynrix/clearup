/**
 * Base Service class for Business Logic Layer
 * This represents the Model part of MVC in the Business Layer
 */
export abstract class BaseService {
  /**
   * Validate data before processing
   */
  protected validate(data: any): boolean {
    return data !== null && data !== undefined
  }

  /**
   * Handle errors consistently
   */
  protected handleError(error: unknown): Error {
    if (error instanceof Error) {
      return error
    }
    return new Error(String(error))
  }
}
