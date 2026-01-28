import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
  type UploadResult
} from 'firebase/storage'
import { storage } from './config'

export class StorageService {
  /**
   * Upload a file to Firebase Storage
   */
  async uploadFile(
    path: string,
    file: File | Blob,
    metadata?: { contentType?: string; customMetadata?: Record<string, string> }
  ): Promise<UploadResult> {
    const storageRef = ref(storage, path)
    return await uploadBytes(storageRef, file, metadata)
  }

  /**
   * Get download URL for a file
   */
  async getDownloadUrl(path: string): Promise<string> {
    const storageRef = ref(storage, path)
    return await getDownloadURL(storageRef)
  }

  /**
   * Delete a file from Storage
   */
  async deleteFile(path: string): Promise<void> {
    const storageRef = ref(storage, path)
    await deleteObject(storageRef)
  }

  /**
   * Upload file and get download URL
   */
  async uploadAndGetUrl(
    path: string,
    file: File | Blob,
    metadata?: { contentType?: string; customMetadata?: Record<string, string> }
  ): Promise<string> {
    await this.uploadFile(path, file, metadata)
    return await this.getDownloadUrl(path)
  }
}

export const storageService = new StorageService()

