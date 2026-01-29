import {
  ref,
  uploadBytes,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
  type UploadResult,
  type UploadTask
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
   * Upload file with progress tracking
   */
  uploadFileWithProgress(
    path: string,
    file: File | Blob,
    onProgress?: (progress: number) => void,
    metadata?: { contentType?: string; customMetadata?: Record<string, string> }
  ): UploadTask {
    const storageRef = ref(storage, path)
    const uploadTask = uploadBytesResumable(storageRef, file, metadata)
    
    if (onProgress) {
      uploadTask.on('state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          onProgress(progress)
        },
        (error) => {
          console.error('Upload error:', error)
        },
        () => {
          // Upload completed
        }
      )
    }
    
    return uploadTask
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

  /**
   * Upload file with progress and get download URL
   */
  async uploadAndGetUrlWithProgress(
    path: string,
    file: File | Blob,
    onProgress?: (progress: number) => void,
    metadata?: { contentType?: string; customMetadata?: Record<string, string> }
  ): Promise<string> {
    const uploadTask = this.uploadFileWithProgress(path, file, onProgress, metadata)
    await uploadTask
    return await this.getDownloadUrl(path)
  }
}

export const storageService = new StorageService()

