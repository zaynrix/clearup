import type { RouteRecordRaw } from 'vue-router'
import AdminDashboardView from '../views/AdminDashboardView.vue'
import MaintenanceView from '../views/MaintenanceView.vue'

export const adminRoutes: RouteRecordRaw[] = [
  {
    path: '/admin-dashboard',
    name: 'admin-dashboard',
    component: AdminDashboardView,
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/maintenance',
    name: 'maintenance',
    component: MaintenanceView
  },
  {
    path: '/secret-maintenance-toggle',
    name: 'secret-maintenance-toggle',
    component: MaintenanceView,
    meta: { requiresAuth: true, requiresAdmin: true }
  }
]

