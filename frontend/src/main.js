import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { useAuthStore } from './stores/authStore'

// Import global styles
import './styles/design-tokens.css'
import './styles/global.css'
import './styles/neumorphic.css'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

// Initialize auth store and check session
const authStore = useAuthStore()
authStore.initAuthListener()
authStore.checkSession()

app.mount('#app')
