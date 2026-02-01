import type { RouteRecordRaw } from 'vue-router'
import ContactView from '../views/ContactView.vue'

export const contactRoutes: RouteRecordRaw[] = [
  {
    path: '/contact',
    name: 'contact',
    component: ContactView
  }
]

