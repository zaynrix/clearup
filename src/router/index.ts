import { createRouter, createWebHistory } from 'vue-router'
import { authService } from '@/services/firebase'
import { userService } from '@/layers/business/services/UserService'
import { auth } from '@/services/firebase/config'
import HomeView from '@/layers/presentation/views/HomeView.vue'
import LoginView from '@/layers/presentation/views/LoginView.vue'
import RegisterView from '@/layers/presentation/views/RegisterView.vue'
import DashboardView from '@/layers/presentation/views/DashboardView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/home',
      redirect: '/'
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      meta: { requiresGuest: true }
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView,
      meta: { requiresGuest: true }
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('@/layers/presentation/views/AdminDashboardView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/admin-dashboard',
      name: 'admin-dashboard',
      component: () => import('@/layers/presentation/views/AdminDashboardView.vue'),
      meta: { requiresAuth: true, requiresAdmin: true }
    }
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
    // Redirect to dashboard if route requires guest but user is logged in
    next({ name: 'dashboard' })
    return
  }

  next()
})

export default router

