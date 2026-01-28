import { firestoreService } from '@/services/firebase'
import { Model, type BaseModel } from '@/models/BaseModel'

/**
 * Interface for model classes with static fromFirestore method
 */
interface ModelConstructor<T extends Model> {
  new (data: Partial<BaseModel>): T
  fromFirestore(data: any): T
}

/**
 * Base repository class implementing CRUD operations
 * This is the Model part of MVC in the Data Access Layer
 */
export abstract class BaseRepository<T extends Model> {
  protected collectionName: string
  protected modelClass: ModelConstructor<T>

  constructor(collectionName: string, modelClass: ModelConstructor<T>) {
    this.collectionName = collectionName
    this.modelClass = modelClass
  }

  /**
   * Get a document by ID
   */
  async findById(id: string): Promise<T | null> {
    const data = await firestoreService.getDocument(this.collectionName, id)
    if (!data) return null
    return this.modelClass.fromFirestore(data)
  }

  /**
   * Get all documents
   */
  async findAll(): Promise<T[]> {
    const dataArray = await firestoreService.getDocuments(this.collectionName)
    return dataArray.map((data) => this.modelClass.fromFirestore(data))
  }

  /**
   * Create a new document
   */
  async create(data: Partial<T>): Promise<string> {
    const model = new this.modelClass({
      ...data,
      createdAt: new Date(),
      updatedAt: new Date()
    })
    const id = await firestoreService.createDocumentWithAutoId(
      this.collectionName,
      model.toFirestore()
    )
    return id
  }

  /**
   * Update an existing document
   */
  async update(id: string, data: Partial<T>): Promise<void> {
    await firestoreService.updateDocument(this.collectionName, id, {
      ...data,
      updatedAt: new Date()
    } as any)
  }

  /**
   * Delete a document
   */
  async delete(id: string): Promise<void> {
    await firestoreService.deleteDocument(this.collectionName, id)
  }

  /**
   * Query documents with constraints
   */
  async query(...constraints: any[]): Promise<T[]> {
    const dataArray = await firestoreService.getDocuments(this.collectionName, constraints)
    return dataArray.map((data) => this.modelClass.fromFirestore(data))
  }
}

