import { Model, type BaseModel } from './BaseModel'

export interface RoleData extends BaseModel {
  name: string
  description?: string
  permissions: string[]
}

export class Role extends Model implements RoleData {
  name: string
  description?: string
  permissions: string[]

  constructor(data: Partial<RoleData> = {}) {
    super(data)
    this.name = data.name || ''
    this.description = data.description
    this.permissions = data.permissions || []
  }

  /**
   * Create Role instance from Firestore data
   */
  static fromFirestore(data: any): Role {
    return new Role({
      ...data,
      createdAt: data.createdAt ? new Date(data.createdAt) : undefined,
      updatedAt: data.updatedAt ? new Date(data.updatedAt) : undefined
    })
  }
}

