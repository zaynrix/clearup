import { Model, type BaseModel } from './BaseModel'

export interface UserData extends BaseModel {
  email: string
  displayName?: string
  photoURL?: string
  role?: string
}

export class User extends Model implements UserData {
  email: string
  displayName?: string
  photoURL?: string
  role?: string

  constructor(data: Partial<UserData> = {}) {
    super(data)
    this.email = data.email || ''
    this.displayName = data.displayName
    this.photoURL = data.photoURL
    this.role = data.role || 'user'
  }

  /**
   * Create User instance from Firestore data
   */
  static fromFirestore(data: any): User {
    return new User({
      ...data,
      createdAt: data.createdAt ? new Date(data.createdAt) : undefined,
      updatedAt: data.updatedAt ? new Date(data.updatedAt) : undefined
    })
  }
}

