<template>
  <div class="dashboard-view">
    <div class="dashboard-container">
      <header class="dashboard-header">
        <h1>Dashboard</h1>
        <button @click="handleLogout" :disabled="isLoading" class="logout-button">
          Logout
        </button>
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
      </div>

      <div v-else class="loading-message">
        Loading user information...
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { AuthViewController } from '@/features/auth/controllers/AuthViewController'

const router = useRouter()
const viewController = new AuthViewController()

const isLoading = computed(() => viewController.isLoading)
const errorMessage = computed(() => viewController.errorMessage)
const user = computed(() => viewController.user)

onMounted(async () => {
  await viewController.loadCurrentUser()
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
  background-color: #f5f5f5;
}

.dashboard-container {
  max-width: 800px;
  margin: 0 auto;
  background: rgba(245, 247, 250, 0.05);
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(67, 24, 111, 0.3);
  backdrop-filter: blur(10px);
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #eee;
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
}
</style>
