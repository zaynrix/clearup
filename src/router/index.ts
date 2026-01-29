import { createRouter, createWebHistory } from 'vue-router'
import { authService } from '@/features/auth/services/AuthService'
import { userService } from '@/features/auth/services/UserService'
import { auth } from '@/shared/services/config'
import { authRoutes } from '@/features/auth/routes'
import { homeRoutes } from '@/features/home/routes'
import { dashboardRoutes } from '@/features/dashboard/routes'
import { adminRoutes } from '@/features/admin/routes'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    ...homeRoutes,
    ...authRoutes,
    ...dashboardRoutes,
    ...adminRoutes
  ]
})

// Wait for Firebase Auth to initialize (for persistence)
const waitForAuth = (): Promise<void> => {
  return new Promise((resolve) => {
    // If auth is already initialized, resolve immediately
    if (auth.currentUser !== null) {
      resolve()
      return
    }
    
    // Wait for auth state to be determined (either user or null)
    const unsubscribe = authService.onAuthStateChange(() => {
      unsubscribe()
      resolve()
    })
    
    // Timeout after 2 seconds to prevent infinite waiting
    setTimeout(() => {
      unsubscribe()
      resolve()
    }, 2000)
  })
}

// Navigation guards
router.beforeEach(async (to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const requiresAdmin = to.matched.some(record => record.meta.requiresAdmin)
  const requiresGuest = to.matched.some(record => record.meta.requiresGuest)
  
  // Wait for auth to be ready if route requires auth (Firebase Auth persistence initialization)
  if (requiresAuth || requiresGuest) {
    await waitForAuth()
  }
  
  const currentUser = authService.getCurrentUser()

  if (requiresAuth && !currentUser) {
    // Redirect to login if route requires auth and user is not logged in
    next({ name: 'login', query: { redirect: to.fullPath } })
    return
  }

  if (requiresAdmin && currentUser) {
    // Check if user is admin
    const isAdmin = await userService.isAdmin(currentUser.uid)
    if (!isAdmin) {
      // Redirect non-admin users to dashboard
      next({ name: 'dashboard' })
      return
    }
  }

  if (requiresGuest && currentUser) {
    // Redirect logged-in users to appropriate dashboard based on role
    const isAdmin = await userService.isAdmin(currentUser.uid)
    if (isAdmin) {
      next({ name: 'admin-dashboard' })
    } else {
      next({ name: 'dashboard' })
    }
    return
  }

  next()
})

export default router
