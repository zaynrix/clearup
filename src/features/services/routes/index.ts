import type { RouteRecordRaw } from 'vue-router'
import ServicesView from '../views/ServicesView.vue'

export const servicesRoutes: RouteRecordRaw[] = [
  {
    path: '/services',
    name: 'services',
    component: ServicesView
  }
]

