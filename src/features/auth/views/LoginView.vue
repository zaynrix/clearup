<template>
  <div class="login-view">
    <div class="login-container">
      <h2>Login</h2>
      
      <div v-if="isMaintenanceMode" class="maintenance-notice">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M2 17L12 22L22 17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M2 12L12 17L22 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <p><strong>Maintenance Mode Active</strong></p>
        <p v-if="maintenanceMessage">{{ maintenanceMessage }}</p>
        <p v-else>Only administrators can log in during maintenance.</p>
      </div>

      <form @submit.prevent="handleLogin" class="login-form">
        <div class="form-group">
          <label for="email">Email:</label>
          <input
            id="email"
            v-model="email"
            type="email"
            required
            placeholder="Enter your email"
            :disabled="isLoading"
            @input="clearErrorOnInput"
          />
        </div>

        <div class="form-group">
          <label for="password">Password:</label>
          <input
            id="password"
            v-model="password"
            type="password"
            required
            placeholder="Enter your password"
            :disabled="isLoading"
            @input="clearErrorOnInput"
          />
        </div>

        <div v-if="errorMessage" class="error-message">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="margin-right: 0.5rem;">
            <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
            <path d="M12 8V12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            <path d="M12 16H12.01" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
          {{ errorMessage }}
        </div>

        <button type="submit" :disabled="isLoading" class="submit-button">
          {{ isLoading ? 'Logging in...' : 'Login' }}
        </button>
      </form>

      <div class="login-footer">
        <router-link to="/" class="home-link">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke="#F5F7FA" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M9 22V12H15V22" stroke="#F5F7FA" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <span>Go to Home</span>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { AuthViewController } from '../controllers/AuthViewController'
import { userService } from '../services/UserService'
import { maintenanceService } from '@/features/admin/services/MaintenanceService'

const router = useRouter()
const route = useRoute()
const viewController = new AuthViewController()

const email = ref('')
const password = ref('')
const isMaintenanceMode = ref(false)
const maintenanceMessage = ref('')

const isLoading = computed(() => viewController.isLoading)
const errorMessage = computed(() => viewController.errorMessage)

// Check maintenance mode on mount
onMounted(async () => {
  try {
    const isActive = await maintenanceService.isMaintenanceModeActive()
    isMaintenanceMode.value = isActive
    
    if (isActive) {
      const activeRequest = await maintenanceService.getActiveMaintenanceRequest()
      if (activeRequest?.message) {
        maintenanceMessage.value = activeRequest.message
      }
    }
  } catch (error) {
    console.error('Error checking maintenance mode:', error)
  }
})

// Clear error when user starts typing
const clearErrorOnInput = () => {
  if (viewController.errorMessage) {
    viewController.clearError()
  }
}

const handleLogin = async () => {
  // First, attempt login
  const success = await viewController.login(email.value, password.value)
  
  if (!success) {
    // Login failed, error message already set by viewController
    return
  }
  
  // Wait a bit for user profile to be loaded
  await new Promise(resolve => setTimeout(resolve, 100))
  
  // Check if maintenance mode is active
  try {
    const isActive = await maintenanceService.isMaintenanceModeActive()
    if (isActive) {
      // Check if user is admin
      const currentUser = viewController.user
      if (currentUser?.id) {
        try {
          const isAdmin = await userService.isAdmin(currentUser.id)
          if (!isAdmin) {
            // Non-admin users cannot login during maintenance
            // Sign out the user since they shouldn't be logged in
            await viewController.logout()
            viewController.setError('Login is currently disabled due to maintenance. Only administrators can access the system during this time.')
            return
          }
          // Admin can proceed with login
        } catch (error) {
          console.error('Error checking admin status:', error)
          await viewController.logout()
          viewController.setError('Unable to verify user permissions. Please try again.')
          return
        }
      } else {
        // User profile not loaded, sign out and show error
        await viewController.logout()
        viewController.setError('Unable to verify user permissions. Please try again.')
        return
      }
    }
  } catch (error) {
    console.error('Error checking maintenance mode:', error)
    // Continue with normal flow if maintenance check fails
  }
  
  // Proceed with normal login redirect flow
  // Get the redirect path from query params, or determine based on user role
  const redirectPath = route.query.redirect as string | undefined
  
  if (redirectPath) {
    // If there's a redirect query param, use it
    router.push(redirectPath)
  } else {
    // Otherwise, check if user is admin and redirect accordingly
    const currentUser = viewController.user
    if (currentUser?.id) {
      try {
        const isAdmin = await userService.isAdmin(currentUser.id)
        if (isAdmin) {
          router.push('/admin-dashboard')
        } else {
          router.push('/dashboard')
        }
      } catch (error) {
        // If admin check fails, default to regular dashboard
        console.error('Error checking admin status:', error)
        router.push('/dashboard')
      }
    } else {
      // Fallback to dashboard if user info not available
      router.push('/dashboard')
    }
  }
}
</script>

<style scoped>
.login-view {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 20px;
}

.login-container {
  background: rgba(245, 247, 250, 0.05);
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(67, 24, 111, 0.3);
  width: 100%;
  max-width: 400px;
  backdrop-filter: blur(10px);
}

.login-container h2 {
  margin-bottom: 1.5rem;
  text-align: center;
  color: #F5F7FA;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-weight: 500;
  color: #F5F7FA;
}

.form-group input {
  padding: 0.75rem;
  border: 1px solid rgba(67, 24, 111, 0.5);
  border-radius: 4px;
  font-size: 1rem;
  background-color: rgba(245, 247, 250, 0.1);
  color: #F5F7FA;
  transition: border-color 0.2s;
}

.form-group input::placeholder {
  color: rgba(245, 247, 250, 0.5);
}

.form-group input:focus {
  outline: none;
  border-color: #5B2096;
  background-color: rgba(245, 247, 250, 0.15);
}

.form-group input:disabled {
  background-color: rgba(245, 247, 250, 0.05);
  cursor: not-allowed;
  opacity: 0.6;
}

.error-message {
  padding: 0.75rem;
  background-color: rgba(204, 51, 51, 0.15);
  color: #ff6b6b;
  border-radius: 4px;
  font-size: 0.9rem;
  border: 1px solid rgba(204, 51, 51, 0.3);
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.submit-button {
  padding: 0.75rem;
  background: linear-gradient(103deg, #5B2096 0.52%, #C19DE6 125.79%);
  color: #F5F7FA;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: transform 0.2s ease, opacity 0.2s ease;
}

.submit-button:hover:not(:disabled) {
  opacity: 0.9;
  transform: translateY(-1px);
}

.submit-button:active:not(:disabled) {
  transform: translateY(0);
}

.submit-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

.login-footer {
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid rgba(67, 24, 111, 0.3);
  text-align: center;
}

.home-link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: rgba(245, 247, 250, 0.8);
  text-decoration: none;
  font-size: 0.9rem;
  transition: color 0.2s ease, transform 0.2s ease;
}

.home-link:hover {
  color: #F5F7FA;
  transform: translateY(-1px);
}

.home-link svg {
  transition: transform 0.2s ease;
}

.home-link:hover svg {
  transform: translateY(-2px);
}

.maintenance-notice {
  padding: 1rem;
  background-color: rgba(251, 191, 36, 0.15);
  border: 1px solid rgba(251, 191, 36, 0.3);
  border-radius: 6px;
  margin-bottom: 1.5rem;
  text-align: center;
  color: #fbbf24;
}

.maintenance-notice svg {
  margin-bottom: 0.5rem;
  opacity: 0.8;
}

.maintenance-notice p {
  margin: 0.5rem 0;
  font-size: 0.9rem;
  line-height: 1.5;
}

.maintenance-notice p:first-of-type {
  margin-top: 0;
}

.maintenance-notice strong {
  color: #fbbf24;
  font-weight: 600;
}
</style>
