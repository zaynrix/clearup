<template>
  <div class="dashboard-view">
    <!-- Background overlay similar to home page -->
    <div class="background-overlay"></div>
    
    <div class="dashboard-container">
      <header class="dashboard-header">
        <h1>Dashboard</h1>
        <div class="header-actions">
          <router-link to="/" class="home-link">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M9 22V12H15V22" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            Home
          </router-link>
          <button @click="handleLogout" :disabled="isLoading" class="logout-button">
            Logout
          </button>
        </div>
      </header>

      <div v-if="errorMessage" class="error-message">
        {{ errorMessage }}
      </div>

      <div v-if="user" class="user-info">
        <h2>Welcome, {{ user.displayName || user.email }}!</h2>
        <div class="user-details">
          <p><strong>Email:</strong> {{ user.email }}</p>
          <p><strong>Role:</strong> {{ user.role || 'user' }}</p>
          <p v-if="user.createdAt">
            <strong>Member since:</strong> {{ formatDate(user.createdAt) }}
          </p>
        </div>
        <div v-if="isAdmin" class="admin-link-section">
          <router-link to="/admin-dashboard" class="admin-link">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M2 17L12 22L22 17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M2 12L12 17L22 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            Go to Admin Dashboard
          </router-link>
        </div>
      </div>

      <div v-else class="loading-message">
        <div class="loading-spinner"></div>
        <p>Loading user information...</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { AuthViewController } from '@/features/auth/controllers/AuthViewController'
import { userService } from '@/features/auth/services/UserService'

const router = useRouter()
const viewController = new AuthViewController()

const isLoading = computed(() => viewController.isLoading)
const errorMessage = computed(() => viewController.errorMessage)
const user = computed(() => viewController.user)
const isAdmin = ref(false)

onMounted(async () => {
  await viewController.loadCurrentUser()
  if (user.value?.id) {
    isAdmin.value = await userService.isAdmin(user.value.id)
  }
})

const handleLogout = async () => {
  await viewController.logout()
  router.push('/login')
}

const formatDate = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString()
}
</script>

<style scoped>
.dashboard-view {
  min-height: 100vh;
  padding: 20px;
  background: linear-gradient(135deg, #0A0E27 0%, #1A1F3A 100%);
  position: relative;
}

.background-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, rgba(10, 14, 39, 0.95) 0%, rgba(26, 31, 58, 0.95) 100%);
  z-index: 0;
}

.dashboard-container {
  max-width: 800px;
  margin: 0 auto;
  background: rgba(245, 247, 250, 0.05);
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(91, 32, 150, 0.3);
  backdrop-filter: blur(10px);
  position: relative;
  z-index: 1;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid rgba(91, 32, 150, 0.3);
}

.header-actions {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.home-link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  color: rgba(245, 247, 250, 0.8);
  text-decoration: none;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 500;
  transition: all 0.2s ease;
  border: 1px solid rgba(91, 32, 150, 0.3);
}

.home-link:hover {
  color: #F5F7FA;
  background: rgba(91, 32, 150, 0.1);
  border-color: rgba(91, 32, 150, 0.5);
}

.dashboard-header h1 {
  margin: 0;
  color: #F5F7FA;
}

.logout-button {
  padding: 0.5rem 1rem;
  background: linear-gradient(103deg, #5B2096 0.52%, #C19DE6 125.79%);
  color: #F5F7FA;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  transition: transform 0.2s ease, opacity 0.2s ease;
}

.logout-button:hover:not(:disabled) {
  opacity: 0.9;
  transform: translateY(-1px);
}

.logout-button:active:not(:disabled) {
  transform: translateY(0);
}

.logout-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

.error-message {
  padding: 0.75rem;
  background-color: #fee;
  color: #c33;
  border-radius: 4px;
  margin-bottom: 1rem;
  font-size: 0.9rem;
}

.user-info {
  margin-top: 2rem;
}

.user-info h2 {
  color: #F5F7FA;
  margin-bottom: 1rem;
}

.user-details {
  background-color: rgba(245, 247, 250, 0.1);
  padding: 1.5rem;
  border-radius: 4px;
  border: 1px solid rgba(67, 24, 111, 0.2);
}

.user-details p {
  margin: 0.5rem 0;
  color: #F5F7FA;
}

.loading-message {
  text-align: center;
  padding: 2rem;
  color: rgba(245, 247, 250, 0.7);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(91, 32, 150, 0.2);
  border-top-color: #5B2096;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.admin-link-section {
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid rgba(67, 24, 111, 0.3);
}

.admin-link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: linear-gradient(103deg, #5B2096 0.52%, #C19DE6 125.79%);
  color: #F5F7FA;
  text-decoration: none;
  border-radius: 6px;
  font-weight: 500;
  transition: transform 0.2s ease, opacity 0.2s ease;
}

.admin-link:hover {
  opacity: 0.9;
  transform: translateY(-1px);
}

.admin-link svg {
  transition: transform 0.2s ease;
}

.admin-link:hover svg {
  transform: translateY(-2px);
}
</style>
