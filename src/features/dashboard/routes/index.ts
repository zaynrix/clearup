import type { RouteRecordRaw } from 'vue-router'
import DashboardView from '../views/DashboardView.vue'

export const dashboardRoutes: RouteRecordRaw[] = [
  {
    path: '/dashboard',
    name: 'dashboard',
    component: DashboardView,
    meta: { requiresAuth: true }
  }
]

