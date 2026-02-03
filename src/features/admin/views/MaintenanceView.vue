<template>
  <div class="maintenance-view">
    <div class="maintenance-container">
      <div class="maintenance-icon">
        <svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M2 17L12 22L22 17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M2 12L12 17L22 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
      <h1 class="maintenance-title">Website Under Maintenance</h1>
      <p class="maintenance-message">
        {{ maintenanceMessage || 'We are currently performing scheduled maintenance to improve your experience. Please check back later.' }}
      </p>
      <div v-if="estimatedEndTime" class="estimated-time">
        <p>Estimated completion time:</p>
        <p class="time-value">{{ formatEstimatedTime(estimatedEndTime) }}</p>
      </div>
      <div class="maintenance-footer">
        <p>Thank you for your patience.</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { maintenanceController } from '../controllers/MaintenanceController'
import type { MaintenanceRequest } from '../models/MaintenanceRequest'

const maintenanceMessage = ref<string>('')
const estimatedEndTime = ref<Date | null>(null)

const loadMaintenanceInfo = async () => {
  try {
    const result = await maintenanceController.getActiveMaintenanceRequest()
    if (result.success && result.data) {
      const request: MaintenanceRequest = result.data
      maintenanceMessage.value = request.message || ''
      estimatedEndTime.value = request.estimatedEndTime || null
    }
  } catch (error) {
    console.error('Failed to load maintenance info:', error)
  }
}

const formatEstimatedTime = (date: Date): string => {
  if (!date) return ''
  const d = date instanceof Date ? date : new Date(date)
  return d.toLocaleString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short'
  })
}

onMounted(() => {
  loadMaintenanceInfo()
})
</script>

<style scoped>
.maintenance-view {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem;
}

.maintenance-container {
  max-width: 600px;
  width: 100%;
  background: white;
  border-radius: 16px;
  padding: 3rem 2rem;
  text-align: center;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.maintenance-icon {
  color: #5B2096;
  margin-bottom: 2rem;
  display: flex;
  justify-content: center;
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.7;
    transform: scale(1.05);
  }
}

.maintenance-title {
  font-size: 2rem;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 1rem;
}

.maintenance-message {
  font-size: 1.1rem;
  color: #666;
  line-height: 1.6;
  margin-bottom: 2rem;
}

.estimated-time {
  background: #f5f5f5;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 2rem;
}

.estimated-time p {
  margin: 0.5rem 0;
  color: #333;
}

.time-value {
  font-weight: 600;
  color: #5B2096;
  font-size: 1.1rem;
}

.maintenance-footer {
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid #e0e0e0;
}

.maintenance-footer p {
  color: #888;
  font-size: 0.9rem;
}

@media (max-width: 768px) {
  .maintenance-container {
    padding: 2rem 1.5rem;
  }

  .maintenance-title {
    font-size: 1.5rem;
  }

  .maintenance-message {
    font-size: 1rem;
  }
}
</style>

