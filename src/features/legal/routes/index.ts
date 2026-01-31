import type { RouteRecordRaw } from 'vue-router'
import PrivacyPolicyView from '../views/PrivacyPolicyView.vue'
import TermsOfServiceView from '../views/TermsOfServiceView.vue'
import CookiePolicyView from '../views/CookiePolicyView.vue'

export const legalRoutes: RouteRecordRaw[] = [
  {
    path: '/privacy-policy',
    name: 'privacy-policy',
    component: PrivacyPolicyView
  },
  {
    path: '/terms-of-service',
    name: 'terms-of-service',
    component: TermsOfServiceView
  },
  {
    path: '/cookie-policy',
    name: 'cookie-policy',
    component: CookiePolicyView
  }
]

