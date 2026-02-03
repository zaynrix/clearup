<template>
  <div class="oauth-callback-view">
    <div class="callback-container">
      <div v-if="isProcessing" class="processing-state">
        <div class="spinner"></div>
        <h2>Connecting Google Calendar...</h2>
        <p>Please wait while we connect your Google account.</p>
      </div>
      <div v-else-if="isSuccess" class="success-state">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="#28a745" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <h2>Successfully Connected!</h2>
        <p>Your Google Calendar account has been connected successfully.</p>
        <button @click="goToAdminDashboard" class="btn-primary">Go to Admin Dashboard</button>
      </div>
      <div v-else class="error-state">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 8V12M12 16H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="#dc3545" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <h2>Connection Failed</h2>
        <p>{{ errorMessage || 'Failed to connect your Google Calendar account.' }}</p>
        <button @click="goToAdminDashboard" class="btn-primary">Go to Admin Dashboard</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { googleCalendarController } from '../controllers/GoogleCalendarController'

const router = useRouter()
const route = useRoute()

const isProcessing = ref(true)
const isSuccess = ref(false)
const errorMessage = ref('')

const goToAdminDashboard = () => {
  router.push({ name: 'admin-dashboard', query: { tab: 'google-calendar' } })
}

onMounted(async () => {
  try {
    const code = route.query.code as string
    const state = route.query.state as string

    if (!code || !state) {
      errorMessage.value = 'Invalid OAuth callback. Missing authorization code or state.'
      isProcessing.value = false
      return
    }

    const result = await googleCalendarController.handleOAuthCallback(code, state)
    
    if (result.success) {
      isSuccess.value = true
      // Redirect after 2 seconds
      setTimeout(() => {
        goToAdminDashboard()
      }, 2000)
    } else {
      errorMessage.value = result.error || 'Failed to connect Google Calendar'
    }
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'An unexpected error occurred'
  } finally {
    isProcessing.value = false
  }
})
</script>

<style scoped>
.oauth-callback-view {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.callback-container {
  background: white;
  border-radius: 12px;
  padding: 40px;
  max-width: 500px;
  width: 100%;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.processing-state,
.success-state,
.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.processing-state h2,
.success-state h2,
.error-state h2 {
  margin: 0;
  color: #333;
}

.processing-state p,
.success-state p,
.error-state p {
  margin: 0;
  color: #666;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #5B2096;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.btn-primary {
  background-color: #5B2096;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s;
}

.btn-primary:hover {
  background-color: #4a1a7a;
}
</style>

