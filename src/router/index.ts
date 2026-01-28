import { createRouter, createWebHistory } from 'vue-router'
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
      component: LoginView
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: DashboardView,
      meta: { requiresAuth: true }
    }
  ]
})

export default router

