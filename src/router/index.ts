import { createRouter, createWebHistory } from 'vue-router'
import { authService } from '@/features/auth/services/AuthService'
import { userService } from '@/features/auth/services/UserService'
import { maintenanceService } from '@/features/admin/services/MaintenanceService'
import { analyticsTrackingService } from '@/shared/services/analyticsTrackingService'
import { auth } from '@/shared/services/config'
import { authRoutes } from '@/features/auth/routes'
import { homeRoutes } from '@/features/home/routes'
import { dashboardRoutes } from '@/features/dashboard/routes'
import { adminRoutes } from '@/features/admin/routes'
import { aboutRoutes } from '@/features/about/routes'
import { servicesRoutes } from '@/features/services/routes'
import { legalRoutes } from '@/features/legal/routes'
import { contactRoutes } from '@/features/contact/routes'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    ...homeRoutes,
    ...authRoutes,
    ...dashboardRoutes,
    ...adminRoutes,
    ...aboutRoutes,
    ...servicesRoutes,
    ...legalRoutes,
    ...contactRoutes
  ],
  scrollBehavior(to, from, savedPosition) {
    // If there's a saved position (e.g., browser back/forward), use it
    if (savedPosition) {
      return savedPosition
    }
    // If navigating to a hash, scroll to that element
    if (to.hash) {
      return {
        el: to.hash,
        behavior: 'smooth'
      }
    }
    // Otherwise, scroll to top instantly for better UX
    return { top: 0, left: 0 }
  }
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
  
  // Skip maintenance check for maintenance page itself, login page, and secret maintenance toggle route
  const isMaintenanceRoute = to.name === 'maintenance' || to.name === 'secret-maintenance-toggle'
  const isLoginRoute = to.name === 'login'
  const isAdminRoute = to.path.startsWith('/admin-dashboard')
  const isDashboardRoute = to.path.startsWith('/dashboard')
  
  // Wait for auth to be ready (needed to check if user is admin)
  // We need to wait for auth even for public routes to check admin status for maintenance bypass
  await waitForAuth()
  
  const currentUser = authService.getCurrentUser()
  let isAdmin = false
  
  // Check if user is admin (needed for maintenance bypass)
  if (currentUser) {
    try {
      isAdmin = await userService.isAdmin(currentUser.uid)
    } catch (error) {
      console.error('Error checking admin status:', error)
    }
  }

  // Check maintenance mode for ALL routes except maintenance page, login page, and admin routes
  // Login page is accessible but login functionality will be blocked for non-admins in the LoginView
  // This applies to: /, /about, /services, /contact, /work, /dashboard (for non-admins), etc.
  if (!isMaintenanceRoute && !isAdminRoute && !isLoginRoute) {
    try {
      const isMaintenanceActive = await maintenanceService.isMaintenanceModeActive()
      if (isMaintenanceActive) {
        // Allow admins to bypass maintenance mode for all routes
        if (isAdmin) {
          // Admin can proceed to any route
        } else {
          // Block all routes for non-admin users during maintenance
          // This includes: home, about, services, contact, work, dashboard, etc.
          if (to.name !== 'maintenance') {
            next({ name: 'maintenance' })
            return
          }
        }
      }
    } catch (error) {
      // If maintenance check fails, log but don't block navigation
      console.error('Error checking maintenance mode:', error)
    }
  }

  // Now handle route-specific guards
  if (requiresAuth && !currentUser) {
    // Redirect to login if route requires auth and user is not logged in
    // But if maintenance is active and user is not admin, they'll be redirected to maintenance page above
    next({ name: 'login', query: { redirect: to.fullPath } })
    return
  }

  if (requiresAdmin && currentUser) {
    // Check if user is admin
    if (!isAdmin) {
      // Redirect non-admin users to dashboard
      next({ name: 'dashboard' })
      return
    }
  }

  if (requiresGuest && currentUser) {
    // Redirect logged-in users to appropriate dashboard based on role
    if (isAdmin) {
      next({ name: 'admin-dashboard' })
    } else {
      next({ name: 'dashboard' })
    }
    return
  }

  next()
})

// Reset scroll position after navigation (backup in case scrollBehavior doesn't work)
// Also track page visits for analytics
router.afterEach((to, from) => {
  // Only reset scroll if navigating to a different route and not using hash
  if (to.path !== from.path && !to.hash) {
    // Use nextTick to ensure DOM is ready, then reset scroll
    setTimeout(() => {
      window.scrollTo(0, 0)
    }, 0)
  }

  // Track page visit for analytics (skip admin dashboard to avoid tracking admin activity)
  if (to.path && !to.path.startsWith('/admin-dashboard')) {
    analyticsTrackingService.trackPageVisit(to.path).catch(error => {
      console.error('Failed to track page visit:', error)
    })
  }
})

export default router
