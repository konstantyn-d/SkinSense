/**
 * Vue Router Configuration
 * 
 * Defines application routes and navigation guards
 */

import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/authStore'
import LoginView from '../views/LoginView.vue'
import ProfileView from '../views/ProfileView.vue'
import ScanView from '../views/ScanView.vue'
import ProgressView from '../views/ProgressView.vue'

// Route definitions
const routes = [
  {
    path: '/',
    redirect: '/profile'
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginView,
    meta: {
      requiresAuth: false,
      title: 'Login - SkinSense'
    }
  },
  {
    path: '/profile',
    name: 'Profile',
    component: ProfileView,
    meta: {
      requiresAuth: true,
      title: 'Profile - SkinSense'
    }
  },
  {
    path: '/scan',
    name: 'Scan',
    component: ScanView,
    meta: {
      requiresAuth: true,
      title: 'Scan - SkinSense'
    }
  },
  {
    path: '/progress',
    name: 'Progress',
    component: ProgressView,
    meta: {
      requiresAuth: true,
      title: 'Progress - SkinSense'
    }
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/profile'
  }
]

// Create router instance
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

// Navigation guard for authentication
router.beforeEach((to, from, next) => {
  // Update document title
  document.title = to.meta.title || 'SkinSense'

  // Check if route requires authentication
  const requiresAuth = to.meta.requiresAuth
  
  // Get auth store
  const authStore = useAuthStore()
  const isAuthenticated = authStore.isAuthenticated

  if (requiresAuth && !isAuthenticated) {
    // Redirect to login if not authenticated
    console.log('🔒 Route requires authentication, redirecting to login')
    next('/login')
  } else if (!requiresAuth && isAuthenticated && to.path === '/login') {
    // Redirect to profile if already authenticated and trying to access login
    console.log('✅ Already authenticated, redirecting to profile')
    next('/profile')
  } else {
    // Allow navigation
    next()
  }
})

// Optional: Navigation guard after each route change
router.afterEach((to, from) => {
  // Scroll to top on route change
  window.scrollTo(0, 0)
})

export default router

