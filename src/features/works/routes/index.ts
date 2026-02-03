import type { RouteRecordRaw } from 'vue-router'
import WorksView from '../views/WorksView.vue'
import WorkDetailView from '../views/WorkDetailView.vue'

export const worksRoutes: RouteRecordRaw[] = [
  {
    path: '/works',
    name: 'works',
    component: WorksView
  },
  {
    path: '/works/:id',
    name: 'work-detail',
    component: WorkDetailView,
    props: true
  }
]
