import { firestoreService } from '@/shared/services'
import { Model, type BaseModel } from '@/shared/BaseModel'

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
   * If data.id is provided, uses that ID; otherwise generates a new one
   */
  async create(data: Partial<T>): Promise<string> {
    const model = new this.modelClass({
      ...data,
      createdAt: new Date(),
      updatedAt: new Date()
    })
    
    const firestoreData = model.toFirestore()
    const id = firestoreData.id || ''
    
    // Remove id from data as Firestore uses document ID, not a field
    const { id: _, ...dataWithoutId } = firestoreData
    
    if (id) {
      // Use provided ID
      await firestoreService.createDocument(
        this.collectionName,
        id,
        dataWithoutId
      )
      return id
    } else {
      // Generate new ID
      const newId = await firestoreService.createDocumentWithAutoId(
        this.collectionName,
        dataWithoutId
      )
      return newId
    }
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

