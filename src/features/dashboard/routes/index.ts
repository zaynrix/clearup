import type { RouteRecordRaw } from 'vue-router'
import AdminDashboardView from '@/features/admin/views/AdminDashboardView.vue'

export const dashboardRoutes: RouteRecordRaw[] = [
  {
    path: '/dashboard',
    name: 'dashboard',
    component: AdminDashboardView,
    meta: { requiresAuth: true }
  }
]

