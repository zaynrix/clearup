import { BaseService } from '@/shared/BaseService'
import { firestoreService } from '@/shared/services'
import { Availability, type AvailabilityData } from '../models/Availability'

const COLLECTION_NAME = 'availability'

/**
 * Availability Service - Manages admin availability and blocked time slots
 */
export class AvailabilityService extends BaseService {
  /**
   * Block a time slot (mark as unavailable)
   */
  async blockTimeSlot(
    date: Date | string,
    timeSlot: string,
    reason?: string,
    blockedBy?: string
  ): Promise<Availability> {
    try {
      const dateStr: string = typeof date === 'string' ? date : date.toISOString().split('T')[0]
      
      // Check if already exists
      const existing = await this.getAvailability(dateStr, timeSlot)
      
      if (existing && existing.id) {
        // Update existing
        await firestoreService.updateDocument(COLLECTION_NAME, existing.id, {
          isBlocked: true,
          reason,
          blockedBy,
          updatedAt: new Date()
        })
        existing.isBlocked = true
        existing.reason = reason
        existing.blockedBy = blockedBy
        return existing
      } else {
        // Create new
        const availability = new Availability({
          date: dateStr,
          timeSlot,
          isBlocked: true,
          reason,
          blockedBy,
          createdAt: new Date(),
          updatedAt: new Date()
        })
        
        const firestoreData = availability.toFirestore() as AvailabilityData
        const id = await firestoreService.createDocumentWithAutoId<AvailabilityData>(
          COLLECTION_NAME,
          firestoreData
        )
        availability.id = id
        return availability
      }
    } catch (error) {
      this.handleError(error)
      throw error
    }
  }

  /**
   * Unblock a time slot (mark as available)
   */
  async unblockTimeSlot(date: Date | string, timeSlot: string): Promise<void> {
    try {
      const dateStr: string = typeof date === 'string' ? date : date.toISOString().split('T')[0]
      const existing = await this.getAvailability(dateStr, timeSlot)
      
      if (existing && existing.id) {
        await firestoreService.updateDocument(COLLECTION_NAME, existing.id, {
          isBlocked: false,
          updatedAt: new Date()
        })
      }
    } catch (error) {
      this.handleError(error)
      throw error
    }
  }

  /**
   * Get availability for a specific date and time
   */
  async getAvailability(date: Date | string, timeSlot: string): Promise<Availability | null> {
    try {
      const dateStr: string = typeof date === 'string' ? date : date.toISOString().split('T')[0]
      const all = await this.getAvailabilityByDate(dateStr)
      return all.find(a => a.timeSlot === timeSlot) || null
    } catch (error) {
      this.handleError(error)
      throw error
    }
  }

  /**
   * Get all availability for a specific date
   */
  async getAvailabilityByDate(date: Date | string): Promise<Availability[]> {
    try {
      const dateStr = typeof date === 'string' ? date : date.toISOString().split('T')[0]
      const all = await this.getAllAvailability()
      return all.filter(a => {
        const aDate = typeof a.date === 'string' ? a.date : new Date(a.date).toISOString().split('T')[0]
        return aDate === dateStr
      })
    } catch (error) {
      this.handleError(error)
      throw error
    }
  }

  /**
   * Get all availability records
   */
  async getAllAvailability(): Promise<Availability[]> {
    try {
      // Get all documents without ordering (to avoid needing composite index)
      // We'll sort in memory instead
      const data = await firestoreService.getDocuments<AvailabilityData>(COLLECTION_NAME)
      const availability = data.map(item => Availability.fromFirestore(item))
      
      // Sort in memory by date, then by timeSlot
      return availability.sort((a, b) => {
        const dateA: string = typeof a.date === 'string' ? a.date : new Date(a.date).toISOString().split('T')[0]
        const dateB: string = typeof b.date === 'string' ? b.date : new Date(b.date).toISOString().split('T')[0]
        if (dateA !== dateB) {
          return dateA.localeCompare(dateB)
        }
        return a.timeSlot.localeCompare(b.timeSlot)
      })
    } catch (error) {
      this.handleError(error)
      throw error
    }
  }

  /**
   * Get blocked time slots for a date range
   */
  async getBlockedSlots(startDate: Date, endDate: Date): Promise<Availability[]> {
    try {
      const all = await this.getAllAvailability()
      const start: string = startDate.toISOString().split('T')[0]
      const end: string = endDate.toISOString().split('T')[0]
      
      return all.filter(a => {
        const aDate: string = typeof a.date === 'string' ? a.date : new Date(a.date).toISOString().split('T')[0]
        return a.isBlocked && aDate >= start && aDate <= end
      })
    } catch (error) {
      this.handleError(error)
      throw error
    }
  }

  /**
   * Delete availability record
   */
  async deleteAvailability(availabilityId: string): Promise<void> {
    try {
      await firestoreService.deleteDocument(COLLECTION_NAME, availabilityId)
    } catch (error) {
      this.handleError(error)
      throw error
    }
  }
}

export const availabilityService = new AvailabilityService()

