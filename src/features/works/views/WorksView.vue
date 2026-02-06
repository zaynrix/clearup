<template>
  <div class="works-view">
    <!-- Show maintenance if page is disabled (unless admin) -->
    <PageMaintenance 
      v-if="isPageDisabled('works-page') && !isAdminUser"
      :message="siteSettings.maintenanceMessage || 'This page is currently unavailable. Please check back later.'"
    />
    
    <template v-else>
      <!-- Background overlay -->
      <div class="background-overlay"></div>

      <div class="works-container">
      <!-- Header Section -->
      <div class="works-header">
        <h1 class="works-title">{{ homeContent?.realResultsTitle || 'Real Results, Real Impact.' }}</h1>
        <p class="works-subtitle">{{ homeContent?.realResultsSubtitle || 'We focus on measurable outcomes that help brands grow, scale, and stand out.' }}</p>
      </div>

      <!-- Works List -->
      <div v-if="works && works.length > 0" class="works-list">
        <WorkCard
          v-for="(work, index) in works"
          :key="getWorkId(work, index)"
          :work="work"
          @click="navigateToWorkDetail"
        />
      </div>

      <!-- Empty State -->
      <div v-else class="works-empty">
        <p class="empty-message">No works available at the moment.</p>
      </div>
    </div>

      <!-- Footer -->
      <FooterSection />
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { WorksController } from '../controllers/WorksController'
import WorkCard from '@/shared/components/WorkCard.vue'
import FooterSection from '@/shared/components/FooterSection.vue'
import PageMaintenance from '@/shared/components/PageMaintenance.vue'
import { useSiteSettings } from '@/shared/composables/useSiteSettings'
import { authService } from '@/features/auth/services/AuthService'
import { userService } from '@/features/auth/services/UserService'
import type { HomeContent } from '@/features/home/models/HomeContent'

const router = useRouter()
const worksController = new WorksController()
const homeContent = ref<HomeContent | null>(null)

// Use real-time site settings composable
const { isPageDisabled, siteSettings } = useSiteSettings()

// Check if user is admin (to allow viewing disabled pages)
const isAdminUser = ref(false)
const works = computed(() => homeContent.value?.realResultsCases || [])

const navigateToWorkDetail = (workId: string | undefined) => {
  if (!workId) {
    console.error('Work ID is missing', { workId, works: works.value })
    return
  }
  console.log('Navigating to work detail:', workId)
  router.push(`/works/${workId}`).catch((error) => {
    console.error('Navigation error:', error)
  })
}

onMounted(async () => {
  // Check if user is admin (to allow viewing disabled pages)
  const currentUser = authService.getCurrentUser()
  if (currentUser) {
    try {
      isAdminUser.value = await userService.isAdmin(currentUser.uid)
    } catch (error) {
      console.error('Error checking admin status:', error)
    }
  }
  
  try {
    const result = await worksController.getWorks()
    if (result.success && result.data) {
      homeContent.value = result.data
      // Ensure all works have IDs
      if (homeContent.value?.realResultsCases) {
        homeContent.value.realResultsCases.forEach((work, index) => {
          if (!work.id) {
            work.id = `work-${Date.now()}-${index}`
          }
        })
        console.log('Works loaded:', homeContent.value.realResultsCases.map(w => ({ id: w.id, headline: w.headline })))
      }
    }
  } catch (error) {
    console.error('Failed to load works:', error)
  }
})

// Computed to get work ID safely
const getWorkId = (work: any, index: number): string => {
  return work.id || `work-${index}`
}
</script>

<style scoped>
.works-view {
  position: relative;
  width: 100%;
  min-height: 100vh;
  background: #0A0A0F;
  padding: 120px 20px 80px;
}

.background-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(180deg, rgba(11, 11, 15, 0.95) 0%, rgba(11, 11, 15, 0.98) 100%);
  z-index: 0;
  pointer-events: none;
}

.works-container {
  position: relative;
  z-index: 1;
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 4rem;
}

/* Header Section */
.works-header {
  text-align: center;
  max-width: 800px;
  margin: 0 auto;
}

.works-title {
  color: #F5F7FA;
  font-family: 'Roboto', sans-serif;
  font-size: 48px;
  font-weight: 700;
  line-height: 1.2;
  margin: 0 0 1rem 0;
}

.works-subtitle {
  color: #ABBED1;
  font-family: 'Roboto', sans-serif;
  font-size: 18px;
  font-weight: 400;
  line-height: 1.6;
  margin: 0;
}

/* Works List */
.works-list {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 4rem;
}

/* Empty State */
.works-empty {
  text-align: center;
  padding: 4rem 2rem;
}

.empty-message {
  color: rgba(245, 247, 250, 0.6);
  font-family: 'Roboto', sans-serif;
  font-size: 18px;
  font-weight: 400;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .works-title {
    font-size: 40px;
  }
}

@media (max-width: 768px) {
  .works-view {
    padding: 100px 20px 60px;
  }

  .works-title {
    font-size: 32px;
  }

  .works-subtitle {
    font-size: 16px;
  }
}

@media (max-width: 480px) {
  .works-view {
    padding: 80px 16px 40px;
  }

  .works-title {
    font-size: 28px;
  }

  .works-subtitle {
    font-size: 14px;
  }
}
</style>
