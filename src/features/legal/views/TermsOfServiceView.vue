<template>
  <div class="legal-view">
    <!-- Show maintenance if page is disabled (unless admin) -->
    <PageMaintenance 
      v-if="isPageDisabled('terms-of-service-page') && !isAdminUser"
      :message="siteSettings.maintenanceMessage || 'This page is currently unavailable. Please check back later.'"
    />
    
    <template v-else>
      <!-- Background elements -->
      <div class="background-image"></div>
      <div class="background-overlay"></div>
      <div class="stars"></div>
      <div class="vector-shape vector-left"></div>
      <div class="vector-shape vector-right"></div>
      
      <!-- Main content -->
      <div class="legal-container">
      <!-- Loading State -->
      <div v-if="isLoading" class="loading-state">
        <div class="loading-spinner"></div>
        <p>Loading content...</p>
      </div>
      
      <!-- Error State -->
      <div v-else-if="error" class="error-state">
        <p>{{ error }}</p>
        <button @click="loadContent" class="retry-button">Retry</button>
      </div>
      
      <!-- Content -->
      <template v-else>
        <div class="legal-header">
          <h1 class="legal-title">{{ termsOfService?.title || 'Terms of Service' }}</h1>
          <p class="legal-updated">Last Updated: {{ termsOfService?.lastUpdated || 'January 31, 2026' }}</p>
        </div>
        
        <div class="legal-content">
          <div 
            v-for="section in termsOfService?.sections" 
            :key="section.id"
            class="legal-section"
          >
            <h2 class="section-heading">{{ section.heading }}</h2>
            <p class="section-content">{{ section.content }}</p>
          </div>
        </div>
        
        <div class="legal-footer">
          <router-link to="/" class="back-link">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            Back to Home
          </router-link>
        </div>
      </template>
    </div>

      <!-- Footer Section -->
      <FooterSection />
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { LegalViewController } from '../controllers/LegalViewController'
import FooterSection from '@/shared/components/FooterSection.vue'
import PageMaintenance from '@/shared/components/PageMaintenance.vue'
import { useSiteSettings } from '@/shared/composables/useSiteSettings'
import { authService } from '@/features/auth/services/AuthService'
import { userService } from '@/features/auth/services/UserService'

const viewController = new LegalViewController()
const isLoading = ref(false)
const error = ref<string | null>(null)
const termsOfService = ref<{ title: string; lastUpdated: string; sections: Array<{ id: string; heading: string; content: string }> } | null>(null)

// Site settings and admin check
const { isPageDisabled, siteSettings } = useSiteSettings()
const isAdminUser = computed(() => {
  const user = authService.getCurrentUser()
  return user ? userService.isAdmin(user.uid) : false
})

const loadContent = async () => {
  isLoading.value = true
  error.value = null
  
  try {
    await viewController.loadLegalContent()
    termsOfService.value = viewController.getTermsOfService()
    
    if (viewController.errorMessage) {
      error.value = viewController.errorMessage
    }
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Failed to load content'
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  window.scrollTo(0, 0)
  loadContent()
})
</script>

<style scoped>
.legal-view {
  min-height: 100vh;
  position: relative;
  background: #0B0B0F;
  color: #F5F7FA;
}

.background-image {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url('/images/backgrounds/hero-bg.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  z-index: 0;
}

.background-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(11, 11, 15, 0.92);
  z-index: 1;
}

.stars {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: 
    radial-gradient(2px 2px at 20% 30%, white, transparent),
    radial-gradient(2px 2px at 60% 70%, white, transparent),
    radial-gradient(1px 1px at 50% 50%, white, transparent),
    radial-gradient(1px 1px at 80% 10%, white, transparent),
    radial-gradient(2px 2px at 90% 40%, white, transparent),
    radial-gradient(1px 1px at 33% 60%, white, transparent),
    radial-gradient(1px 1px at 55% 25%, white, transparent);
  background-repeat: repeat;
  background-size: 200% 200%;
  animation: sparkle 20s linear infinite;
  z-index: 1;
  opacity: 0.3;
}

@keyframes sparkle {
  from { background-position: 0% 0%; }
  to { background-position: 100% 100%; }
}

.vector-shape {
  position: fixed;
  width: 300px;
  height: 100%;
  z-index: 1;
  opacity: 0.1;
  pointer-events: none;
}

.vector-left {
  left: 0;
  background: linear-gradient(90deg, rgba(91, 32, 150, 0.3) 0%, transparent 100%);
}

.vector-right {
  right: 0;
  background: linear-gradient(270deg, rgba(91, 32, 150, 0.3) 0%, transparent 100%);
}

.legal-container {
  position: relative;
  z-index: 2;
  max-width: 900px;
  margin: 0 auto;
  padding: 120px 24px 80px;
}

.legal-header {
  text-align: center;
  margin-bottom: 60px;
  padding-bottom: 40px;
  border-bottom: 1px solid rgba(91, 32, 150, 0.3);
}

.legal-title {
  font-size: 3rem;
  font-weight: 700;
  color: #F5F7FA;
  margin: 0 0 16px 0;
  font-family: 'Roboto', sans-serif;
  background: linear-gradient(180deg, #F5F7FA 0%, #C19DE6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.legal-updated {
  font-size: 1rem;
  color: rgba(245, 247, 250, 0.6);
  margin: 0;
  font-family: 'Roboto', sans-serif;
}

.legal-content {
  display: flex;
  flex-direction: column;
  gap: 40px;
}

.legal-section {
  background: rgba(245, 247, 250, 0.03);
  border: 1px solid rgba(91, 32, 150, 0.15);
  border-radius: 16px;
  padding: 32px;
  transition: all 0.3s ease;
}

.legal-section:hover {
  border-color: rgba(91, 32, 150, 0.3);
  background: rgba(245, 247, 250, 0.05);
}

.section-heading {
  font-size: 1.5rem;
  font-weight: 600;
  color: #C19DE6;
  margin: 0 0 16px 0;
  font-family: 'Roboto', sans-serif;
}

.section-content {
  font-size: 1rem;
  color: rgba(245, 247, 250, 0.85);
  line-height: 1.8;
  margin: 0;
  font-family: 'Roboto', sans-serif;
}

.legal-footer {
  margin-top: 60px;
  padding-top: 40px;
  border-top: 1px solid rgba(91, 32, 150, 0.3);
  text-align: center;
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: linear-gradient(103deg, #5B2096 0.52%, #C19DE6 125.79%);
  border-radius: 8px;
  color: #F5F7FA;
  font-size: 1rem;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;
  font-family: 'Roboto', sans-serif;
}

.back-link:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(91, 32, 150, 0.4);
}

.back-link svg {
  width: 20px;
  height: 20px;
}

/* Loading and Error States */
.loading-state,
.error-state {
  text-align: center;
  padding: 4rem 2rem;
  color: rgba(245, 247, 250, 0.7);
}

.loading-spinner {
  width: 48px;
  height: 48px;
  border: 4px solid rgba(91, 32, 150, 0.2);
  border-top-color: #5B2096;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.retry-button {
  margin-top: 1rem;
  padding: 0.75rem 1.5rem;
  background: linear-gradient(103deg, #5B2096 0.52%, #C19DE6 125.79%);
  border: none;
  border-radius: 8px;
  color: #F5F7FA;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.retry-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(91, 32, 150, 0.4);
}

/* Responsive Design */
@media (max-width: 768px) {
  .legal-container {
    padding: 100px 16px 60px;
  }

  .legal-title {
    font-size: 2rem;
  }

  .legal-header {
    margin-bottom: 40px;
    padding-bottom: 30px;
  }

  .legal-content {
    gap: 24px;
  }

  .legal-section {
    padding: 24px;
  }

  .section-heading {
    font-size: 1.25rem;
  }

  .section-content {
    font-size: 0.95rem;
  }
}

@media (max-width: 480px) {
  .legal-container {
    padding: 90px 12px 40px;
  }

  .legal-title {
    font-size: 1.75rem;
  }

  .legal-section {
    padding: 20px;
    border-radius: 12px;
  }

  .section-heading {
    font-size: 1.125rem;
  }

  .section-content {
    font-size: 0.9rem;
    line-height: 1.7;
  }
}
</style>

