import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'

// Initialize Firebase early to ensure it's available throughout the app
import '@/services/firebase/config'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
