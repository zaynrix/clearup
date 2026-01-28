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
   */
  toFirestore(): Record<string, any> {
    return {
      ...this,
      createdAt: this.createdAt?.toISOString(),
      updatedAt: this.updatedAt?.toISOString()
    }
  }

  /**
   * Create model from Firestore data
   * Subclasses should override this method
   */
  static fromFirestore(data: any): Model {
    throw new Error('fromFirestore must be implemented by subclass')
  }
}

