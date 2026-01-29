/**
 * Base model interface that all models should extend
 */
export interface BaseModel {
  id: string
  createdAt?: Date
  updatedAt?: Date
}

/**
 * Base model class with common functionality
 */
export abstract class Model implements BaseModel {
  id: string
  createdAt?: Date
  updatedAt?: Date

  constructor(data: Partial<BaseModel> = {}) {
    this.id = data.id || ''
    this.createdAt = data.createdAt
    this.updatedAt = data.updatedAt
  }

  /**
   * Convert model to plain object for Firestore
   * Removes undefined values as Firestore doesn't allow them
   */
  toFirestore(): Record<string, any> {
    const data: Record<string, any> = {}
    
    // Copy all properties, filtering out undefined values
    for (const [key, value] of Object.entries(this)) {
      if (value !== undefined) {
        // Handle Date objects
        if (value instanceof Date) {
          data[key] = value.toISOString()
        } else {
          data[key] = value
        }
      }
    }
    
    // Always include createdAt and updatedAt if they exist
    if (this.createdAt) {
      data.createdAt = this.createdAt instanceof Date ? this.createdAt.toISOString() : this.createdAt
    }
    if (this.updatedAt) {
      data.updatedAt = this.updatedAt instanceof Date ? this.updatedAt.toISOString() : this.updatedAt
    }
    
    return data
  }

  /**
   * Create model from Firestore data
   * Subclasses should override this method
   */
  static fromFirestore(data: any): Model {
    throw new Error('fromFirestore must be implemented by subclass')
  }
}
