import type { RouteRecordRaw } from 'vue-router'
import AdminDashboardView from '../views/AdminDashboardView.vue'

export const adminRoutes: RouteRecordRaw[] = [
  {
    path: '/admin-dashboard',
    name: 'admin-dashboard',
    component: AdminDashboardView,
    meta: { requiresAuth: true, requiresAdmin: true }
  }
]

