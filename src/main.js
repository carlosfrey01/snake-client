import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
const pinia = createPinia()
import App from './App.vue'
import routes from '@/routes'

const app = createApp(App)
app.use(pinia)
app.use(routes)
app.mount('#app')
