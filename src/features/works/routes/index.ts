import type { RouteRecordRaw } from 'vue-router'
import WorksView from '../views/WorksView.vue'

export const worksRoutes: RouteRecordRaw[] = [
  {
    path: '/works',
    name: 'works',
    component: WorksView
  }
]
