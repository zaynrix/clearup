<template>
  <div class="login-view">
    <div class="login-container">
      <h2>Login</h2>
      
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
          />
        </div>

        <div v-if="errorMessage" class="error-message">
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
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { AuthViewController } from '../controllers/AuthViewController'

const router = useRouter()
const viewController = new AuthViewController()

const email = ref('')
const password = ref('')

const isLoading = computed(() => viewController.isLoading)
const errorMessage = computed(() => viewController.errorMessage)

const handleLogin = async () => {
  const success = await viewController.login(email.value, password.value)
  if (success) {
    router.push('/dashboard')
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
  background-color: #fee;
  color: #c33;
  border-radius: 4px;
  font-size: 0.9rem;
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
</style>
