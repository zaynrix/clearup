<template>
  <div v-if="isOpen" class="booking-panel-overlay" @click.self="closePanel">
    <div class="booking-panel" :class="{ 'panel-open': isOpen }">
      <div class="panel-header">
        <h2>Book a Meeting</h2>
        <button @click="closePanel" class="close-button">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </div>

      <div class="panel-content">
        <form @submit.prevent="handleSubmit" class="booking-form">
          <!-- User Information -->
          <div class="form-section">
            <h3>Your Information</h3>
            <div class="form-group">
              <label>Name *</label>
              <input 
                v-model="formData.userName" 
                type="text" 
                class="form-input" 
                placeholder="John Doe"
                required
              />
            </div>
            <div class="form-group">
              <label>Email *</label>
              <input 
                v-model="formData.userEmail" 
                type="email" 
                class="form-input" 
                placeholder="john@example.com"
                required
              />
            </div>
            <div class="form-group">
              <label>Phone (Optional)</label>
              <input 
                v-model="formData.userPhone" 
                type="tel" 
                class="form-input" 
                placeholder="+1234567890"
              />
            </div>
          </div>

          <!-- Date Selection -->
          <div class="form-section">
            <h3>Select Date</h3>
            <div class="calendar-container">
              <div class="calendar-header">
                <button type="button" @click="previousMonth" class="calendar-nav">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M15 18L9 12L15 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </button>
                <h4>{{ currentMonthYear }}</h4>
                <button type="button" @click="nextMonth" class="calendar-nav">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 18L15 12L9 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </button>
              </div>
              <div class="calendar-grid">
                <div class="calendar-day-header" v-for="day in dayHeaders" :key="day">
                  {{ day }}
                </div>
                <div 
                  v-for="day in calendarDays" 
                  :key="day.date.toISOString()"
                  class="calendar-day"
                  :class="{
                    'other-month': !day.isCurrentMonth,
                    'selected': isSelectedDate(day.date),
                    'disabled': day.isPast || day.isToday
                  }"
                  @click="selectDate(day.date)"
                >
                  {{ day.day }}
                </div>
              </div>
            </div>
          </div>

          <!-- Time Selection -->
          <div v-if="selectedDate" class="form-section">
            <h3>Select Time</h3>
            <div v-if="loadingTimeSlots" class="loading-time-slots">
              Loading available times...
            </div>
            <div v-else class="time-slots-grid">
              <button
                v-for="slot in availableTimeSlots"
                :key="slot.time"
                type="button"
                @click="selectTime(slot.time)"
                class="time-slot-button"
                :class="{
                  'selected': formData.meetingTime === slot.time,
                  'unavailable': !slot.available
                }"
                :disabled="!slot.available"
              >
                {{ formatTime(slot.time) }}
              </button>
            </div>
            <p v-if="!loadingTimeSlots && availableTimeSlots.length === 0" class="no-slots-message">
              No available time slots for this date. Please select another date.
            </p>
            <p v-else-if="!loadingTimeSlots && availableTimeSlots.filter(s => s.available).length === 0" class="no-slots-message">
              All time slots are booked or blocked for this date. Please select another date.
            </p>
          </div>

          <!-- Contact Method -->
          <div class="form-section">
            <h3>Confirmation Method</h3>
            <div class="contact-method-group">
              <label class="radio-option">
                <input 
                  type="radio" 
                  v-model="formData.contactMethod" 
                  value="email"
                />
                <span>Email</span>
              </label>
              <label class="radio-option">
                <input 
                  type="radio" 
                  v-model="formData.contactMethod" 
                  value="whatsapp"
                />
                <span>WhatsApp</span>
              </label>
            </div>
          </div>

          <!-- Notes (Optional) -->
          <div class="form-section">
            <div class="form-group">
              <label>Additional Notes (Optional)</label>
              <textarea 
                v-model="formData.notes" 
                class="form-textarea" 
                rows="3"
                placeholder="Any additional information you'd like to share..."
              ></textarea>
            </div>
          </div>

          <!-- Error/Success Messages -->
          <div v-if="errorMessage" class="error-message">
            {{ errorMessage }}
          </div>
          <div v-if="successMessage" class="success-message">
            {{ successMessage }}
          </div>

          <!-- Form Actions -->
          <div class="form-actions">
            <button type="button" @click="closePanel" class="btn-secondary">
              Cancel
            </button>
            <button 
              type="submit" 
              class="btn-primary"
              :disabled="isSubmitting || !isFormValid"
            >
              <span v-if="isSubmitting">Booking...</span>
              <span v-else>Book Meeting</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { bookingController } from '../controllers/BookingController'
import type { TimeSlot } from '../models/Booking'

interface Props {
  isOpen: boolean
}

interface Emits {
  (e: 'close'): void
  (e: 'booking-created', bookingId: string): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const formData = ref({
  userName: '',
  userEmail: '',
  userPhone: '',
  meetingDate: null as Date | null,
  meetingTime: '',
  contactMethod: 'email' as 'email' | 'whatsapp',
  notes: ''
})

const selectedDate = ref<Date | null>(null)
const currentMonth = ref(new Date().getMonth())
const currentYear = ref(new Date().getFullYear())
const availableTimeSlots = ref<TimeSlot[]>([])
const loadingTimeSlots = ref(false)
const isSubmitting = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

const dayHeaders = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

const currentMonthYear = computed(() => {
  const date = new Date(currentYear.value, currentMonth.value, 1)
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
})

const calendarDays = computed(() => {
  const firstDay = new Date(currentYear.value, currentMonth.value, 1)
  const lastDay = new Date(currentYear.value, currentMonth.value + 1, 0)
  const startDate = new Date(firstDay)
  startDate.setDate(startDate.getDate() - startDate.getDay())
  
  const days: Array<{
    date: Date
    day: number
    isCurrentMonth: boolean
    isPast: boolean
    isToday: boolean
  }> = []
  
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  for (let i = 0; i < 42; i++) {
    const date = new Date(startDate)
    date.setDate(startDate.getDate() + i)
    const dateOnly = new Date(date)
    dateOnly.setHours(0, 0, 0, 0)
    
    days.push({
      date,
      day: date.getDate(),
      isCurrentMonth: date.getMonth() === currentMonth.value,
      isPast: dateOnly < today,
      isToday: dateOnly.getTime() === today.getTime()
    })
  }
  
  return days
})

const isFormValid = computed(() => {
  return !!(
    formData.value.userName &&
    formData.value.userEmail &&
    selectedDate.value &&
    formData.value.meetingTime
  )
})

const isSelectedDate = (date: Date): boolean => {
  if (!selectedDate.value) return false
  const d1 = new Date(date)
  const d2 = new Date(selectedDate.value)
  d1.setHours(0, 0, 0, 0)
  d2.setHours(0, 0, 0, 0)
  return d1.getTime() === d2.getTime()
}

const selectDate = async (date: Date) => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const dateOnly = new Date(date)
  dateOnly.setHours(0, 0, 0, 0)
  
  if (dateOnly < today) return
  
  selectedDate.value = date
  formData.value.meetingDate = date
  formData.value.meetingTime = ''
  await loadTimeSlots(date)
}

const selectTime = (time: string) => {
  const slot = availableTimeSlots.value.find(s => s.time === time)
  if (slot && slot.available) {
    formData.value.meetingTime = time
  }
}

const previousMonth = () => {
  if (currentMonth.value === 0) {
    currentMonth.value = 11
    currentYear.value--
  } else {
    currentMonth.value--
  }
}

const nextMonth = () => {
  if (currentMonth.value === 11) {
    currentMonth.value = 0
    currentYear.value++
  } else {
    currentMonth.value++
  }
}

const loadTimeSlots = async (date: Date) => {
  loadingTimeSlots.value = true
  errorMessage.value = ''
  
  try {
    const result = await bookingController.getAvailableTimeSlots(date)
    if (result.success && result.data) {
      availableTimeSlots.value = result.data
    } else {
      errorMessage.value = result.error || 'Failed to load available time slots'
    }
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'Failed to load time slots'
  } finally {
    loadingTimeSlots.value = false
  }
}

const formatTime = (time: string): string => {
  const [hours, minutes] = time.split(':').map(Number)
  const date = new Date()
  date.setHours(hours || 0, minutes || 0)
  return date.toLocaleTimeString('en-US', { 
    hour: 'numeric', 
    minute: '2-digit',
    hour12: true 
  })
}

const handleSubmit = async () => {
  if (!isFormValid.value) {
    errorMessage.value = 'Please fill in all required fields'
    return
  }
  
  isSubmitting.value = true
  errorMessage.value = ''
  successMessage.value = ''
  
  try {
    const result = await bookingController.createBooking({
      ...formData.value,
      meetingDate: selectedDate.value!,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
    })
    
    if (result.success && result.data) {
      successMessage.value = 'Meeting booked successfully! You will receive a confirmation shortly.'
      
      // Reset form
      formData.value = {
        userName: '',
        userEmail: '',
        userPhone: '',
        meetingDate: null,
        meetingTime: '',
        contactMethod: 'email',
        notes: ''
      }
      selectedDate.value = null
      availableTimeSlots.value = []
      
      // Emit event and close after delay
      if (result.data.id) {
        emit('booking-created', result.data.id)
      }
      
      setTimeout(() => {
        closePanel()
      }, 2000)
    } else {
      errorMessage.value = result.error || 'Failed to book meeting'
    }
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'Failed to book meeting'
  } finally {
    isSubmitting.value = false
  }
}

const closePanel = () => {
  emit('close')
  // Reset form when closing
  setTimeout(() => {
    formData.value = {
      userName: '',
      userEmail: '',
      userPhone: '',
      meetingDate: null,
      meetingTime: '',
      contactMethod: 'email',
      notes: ''
    }
    selectedDate.value = null
    availableTimeSlots.value = []
    errorMessage.value = ''
    successMessage.value = ''
  }, 300)
}

// Watch for panel open to reset to current month
watch(() => props.isOpen, (isOpen) => {
  if (isOpen) {
    const today = new Date()
    currentMonth.value = today.getMonth()
    currentYear.value = today.getFullYear()
  }
})
</script>

<style scoped>
.booking-panel-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  z-index: 10000;
  display: flex;
  justify-content: flex-end;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.booking-panel {
  width: 100%;
  max-width: 500px;
  height: 100%;
  background: #0B0B0F;
  border-left: 1px solid rgba(91, 32, 150, 0.3);
  display: flex;
  flex-direction: column;
  transform: translateX(100%);
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  overflow-y: auto;
}

.booking-panel.panel-open {
  transform: translateX(0);
}

.panel-header {
  padding: 1.5rem;
  border-bottom: 1px solid rgba(91, 32, 150, 0.3);
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(91, 32, 150, 0.05);
}

.panel-header h2 {
  margin: 0;
  color: #F5F7FA;
  font-size: 1.5rem;
  font-weight: 600;
}

.close-button {
  background: transparent;
  border: none;
  color: #F5F7FA;
  cursor: pointer;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  transition: background 0.2s ease;
}

.close-button:hover {
  background: rgba(245, 247, 250, 0.1);
}

.panel-content {
  flex: 1;
  padding: 1.5rem;
  overflow-y: auto;
}

.booking-form {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.form-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-section h3 {
  margin: 0;
  color: #F5F7FA;
  font-size: 1.125rem;
  font-weight: 600;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid rgba(91, 32, 150, 0.2);
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  color: rgba(245, 247, 250, 0.8);
  font-size: 0.9rem;
  font-weight: 500;
}

.form-input,
.form-textarea {
  padding: 0.75rem 1rem;
  background: rgba(245, 247, 250, 0.05);
  border: 1px solid rgba(91, 32, 150, 0.3);
  border-radius: 8px;
  color: #F5F7FA;
  font-size: 0.95rem;
  font-family: inherit;
  transition: border-color 0.3s ease, background 0.3s ease;
}

.form-input:focus,
.form-textarea:focus {
  outline: none;
  border-color: rgba(91, 32, 150, 0.6);
  background: rgba(245, 247, 250, 0.08);
}

.form-textarea {
  resize: vertical;
  min-height: 80px;
}

/* Calendar Styles */
.calendar-container {
  background: rgba(245, 247, 250, 0.03);
  border: 1px solid rgba(91, 32, 150, 0.2);
  border-radius: 12px;
  padding: 1rem;
}

.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.calendar-header h4 {
  margin: 0;
  color: #F5F7FA;
  font-size: 1.125rem;
  font-weight: 600;
}

.calendar-nav {
  background: rgba(91, 32, 150, 0.2);
  border: 1px solid rgba(91, 32, 150, 0.3);
  border-radius: 6px;
  color: #F5F7FA;
  padding: 0.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s ease;
}

.calendar-nav:hover {
  background: rgba(91, 32, 150, 0.3);
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 0.5rem;
}

.calendar-day-header {
  text-align: center;
  color: rgba(245, 247, 250, 0.6);
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.5rem;
  text-transform: uppercase;
}

.calendar-day {
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  cursor: pointer;
  color: rgba(245, 247, 250, 0.7);
  font-weight: 500;
  transition: all 0.2s ease;
  background: rgba(245, 247, 250, 0.03);
  border: 1px solid transparent;
}

.calendar-day:hover:not(.disabled):not(.other-month) {
  background: rgba(91, 32, 150, 0.2);
  border-color: rgba(91, 32, 150, 0.4);
}

.calendar-day.selected {
  background: linear-gradient(103deg, #5B2096 0.52%, #C19DE6 125.79%);
  color: #F5F7FA;
  border-color: rgba(193, 157, 230, 0.5);
  font-weight: 600;
}

.calendar-day.other-month {
  opacity: 0.3;
  cursor: not-allowed;
}

.calendar-day.disabled {
  opacity: 0.4;
  cursor: not-allowed;
  background: rgba(245, 247, 250, 0.02);
}

/* Time Slots */
.time-slots-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 0.75rem;
}

.time-slot-button {
  padding: 0.75rem 1rem;
  background: rgba(245, 247, 250, 0.05);
  border: 1px solid rgba(91, 32, 150, 0.3);
  border-radius: 8px;
  color: rgba(245, 247, 250, 0.8);
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.time-slot-button:hover:not(:disabled) {
  background: rgba(91, 32, 150, 0.2);
  border-color: rgba(91, 32, 150, 0.5);
  color: #F5F7FA;
}

.time-slot-button.selected {
  background: linear-gradient(103deg, #5B2096 0.52%, #C19DE6 125.79%);
  border-color: rgba(193, 157, 230, 0.5);
  color: #F5F7FA;
  font-weight: 600;
}

.time-slot-button.unavailable {
  opacity: 0.4;
  cursor: not-allowed;
  background: rgba(245, 247, 250, 0.02);
}

.time-slot-button:disabled {
  cursor: not-allowed;
}

.loading-time-slots {
  text-align: center;
  padding: 2rem;
  color: rgba(245, 247, 250, 0.6);
}

.no-slots-message {
  text-align: center;
  padding: 1rem;
  color: rgba(245, 247, 250, 0.6);
  font-style: italic;
}

/* Contact Method */
.contact-method-group {
  display: flex;
  gap: 1rem;
}

.radio-option {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: rgba(245, 247, 250, 0.05);
  border: 1px solid rgba(91, 32, 150, 0.3);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.radio-option:hover {
  background: rgba(91, 32, 150, 0.1);
  border-color: rgba(91, 32, 150, 0.5);
}

.radio-option input[type="radio"] {
  margin: 0;
  cursor: pointer;
}

.radio-option input[type="radio"]:checked + span {
  color: #C19DE6;
  font-weight: 600;
}

.radio-option span {
  color: rgba(245, 247, 250, 0.8);
  font-size: 0.95rem;
}

/* Messages */
.error-message {
  padding: 0.75rem 1rem;
  background: rgba(239, 68, 68, 0.15);
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: 8px;
  color: #f87171;
  font-size: 0.9rem;
}

.success-message {
  padding: 0.75rem 1rem;
  background: rgba(34, 197, 94, 0.15);
  border: 1px solid rgba(34, 197, 94, 0.3);
  border-radius: 8px;
  color: #4ade80;
  font-size: 0.9rem;
}

/* Form Actions */
.form-actions {
  display: flex;
  gap: 1rem;
  padding-top: 1rem;
  border-top: 1px solid rgba(91, 32, 150, 0.2);
}

.btn-primary,
.btn-secondary {
  flex: 1;
  padding: 0.875rem 1.5rem;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
}

.btn-primary {
  background: linear-gradient(103deg, #5B2096 0.52%, #C19DE6 125.79%);
  color: #F5F7FA;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(91, 32, 150, 0.4);
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-secondary {
  background: transparent;
  color: rgba(245, 247, 250, 0.8);
  border: 1.5px solid rgba(91, 32, 150, 0.3);
}

.btn-secondary:hover {
  background: rgba(91, 32, 150, 0.1);
  border-color: rgba(91, 32, 150, 0.5);
  color: #F5F7FA;
}

/* Responsive */
@media (max-width: 768px) {
  .booking-panel {
    max-width: 100%;
    border-left: none;
  }
  
  .panel-header {
    padding: 1rem;
  }
  
  .panel-header h2 {
    font-size: 1.25rem;
  }
  
  .panel-content {
    padding: 1rem;
  }
  
  .calendar-container {
    padding: 0.75rem;
  }
  
  .calendar-header {
    flex-wrap: wrap;
    gap: 0.5rem;
  }
  
  .calendar-header h4 {
    font-size: 1rem;
    width: 100%;
    text-align: center;
  }
  
  .calendar-grid {
    gap: 0.25rem;
  }
  
  .calendar-day {
    padding: 0.25rem;
    font-size: 0.75rem;
    min-height: 36px;
  }
  
  .calendar-day-header {
    font-size: 0.7rem;
    padding: 0.25rem;
  }
  
  .time-slots-grid {
    grid-template-columns: repeat(auto-fill, minmax(70px, 1fr));
    gap: 0.5rem;
  }
  
  .time-slot-btn {
    padding: 0.5rem 0.75rem;
    font-size: 0.85rem;
  }
  
  .contact-method-options {
    flex-direction: column;
    gap: 0.75rem;
  }
  
  .radio-option {
    width: 100%;
  }
  
  .panel-actions {
    flex-direction: column-reverse;
  }
  
  .panel-actions button {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .calendar-grid {
    gap: 0.2rem;
  }
  
  .calendar-day {
    padding: 0.2rem;
    font-size: 0.7rem;
    min-height: 32px;
  }
  
  .calendar-day-header {
    font-size: 0.65rem;
    padding: 0.2rem;
  }
  
  .time-slots-grid {
    grid-template-columns: repeat(3, 1fr);
  }
  
  .form-section h3 {
    font-size: 1rem;
  }
}
</style>

