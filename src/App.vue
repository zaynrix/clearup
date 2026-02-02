<script setup lang="ts">
import { RouterView, useRoute, useRouter } from 'vue-router'
import { computed, onMounted, onUnmounted } from 'vue'
import NavigationBar from './shared/components/NavigationBar.vue'
import { authService } from './features/auth/services/AuthService'
import { userService } from './features/auth/services/UserService'
import { maintenanceController } from './features/admin/controllers/MaintenanceController'

const route = useRoute()
const router = useRouter()
const showNavigationBar = computed(() => route.name !== 'admin-dashboard')

// Hidden maintenance toggle functionality
let logoClickCount = 0
let logoClickTimeout: ReturnType<typeof setTimeout> | null = null
let keyComboPressed = false
let keyComboTimeout: ReturnType<typeof setTimeout> | null = null

const handleKeyDown = (e: KeyboardEvent) => {
  // Check for Ctrl + Shift + M
  if (e.ctrlKey && e.shiftKey && e.key === 'M') {
    e.preventDefault()
    keyComboPressed = true
    if (keyComboTimeout) clearTimeout(keyComboTimeout)
    keyComboTimeout = setTimeout(() => {
      keyComboPressed = false
    }, 2000)
    checkAndShowMaintenanceToggle()
  }
}

const handleLogoClick = (e: MouseEvent) => {
  // Check if click is in the top-left corner (first 50px x 50px)
  const target = e.target as HTMLElement
  const rect = target.getBoundingClientRect()
  const clickX = e.clientX - rect.left
  const clickY = e.clientY - rect.top

  if (clickX <= 50 && clickY <= 50) {
    logoClickCount++
    if (logoClickTimeout) clearTimeout(logoClickTimeout)
    logoClickTimeout = setTimeout(() => {
      logoClickCount = 0
    }, 2000)

    if (logoClickCount >= 5) {
      logoClickCount = 0
      checkAndShowMaintenanceToggle()
    }
  } else {
    logoClickCount = 0
  }
}

const checkAndShowMaintenanceToggle = async () => {
  try {
    const currentUser = authService.getCurrentUser()
    if (!currentUser) {
      return
    }

    const isAdmin = await userService.isAdmin(currentUser.uid)
    if (!isAdmin) {
      return
    }

    // Show confirmation modal
    if (confirm('Maintenance Mode Toggle\n\nDo you want to access the maintenance mode panel?')) {
      router.push({ name: 'secret-maintenance-toggle' })
    }
  } catch (error) {
    console.error('Error checking admin status:', error)
  }
}

// Check secret URL route
const checkSecretRoute = async () => {
  if (route.name === 'secret-maintenance-toggle') {
    const currentUser = authService.getCurrentUser()
    if (!currentUser) {
      router.push({ name: 'login' })
      return
    }

    try {
      const isAdmin = await userService.isAdmin(currentUser.uid)
      if (!isAdmin) {
        router.push({ name: 'home' })
        return
      }
      // Redirect to admin dashboard - the tab will be set via query or default
      router.push({ path: '/admin-dashboard', query: { tab: 'maintenance' } })
    } catch (error) {
      console.error('Error checking admin status:', error)
      router.push({ name: 'home' })
    }
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeyDown)
  document.addEventListener('click', handleLogoClick)
  checkSecretRoute()
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown)
  document.removeEventListener('click', handleLogoClick)
  if (logoClickTimeout) clearTimeout(logoClickTimeout)
  if (keyComboTimeout) clearTimeout(keyComboTimeout)
})
</script>

<template>
  <div id="app">
    <NavigationBar v-if="showNavigationBar" />
    <RouterView />
  </div>
</template>

<style>
* {
  box-sizing: border-box;
}
</style>
