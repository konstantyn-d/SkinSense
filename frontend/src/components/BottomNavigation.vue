<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

// Navigation items
const navItems = [
  {
    name: 'Profile',
    path: '/profile',
    icon: '👤',
    label: 'Profile'
  },
  {
    name: 'Scan',
    path: '/scan',
    icon: '📸',
    label: 'Scan'
  },
  {
    name: 'Progress',
    path: '/progress',
    icon: '📈',
    label: 'Progress'
  }
]

// Check if nav item is active
const isActive = (path) => {
  return route.path === path
}

// Navigate to route
const navigateTo = (path) => {
  router.push(path)
}
</script>

<template>
  <nav class="bottom-navigation">
    <div class="nav-container">
      <button
        v-for="item in navItems"
        :key="item.name"
        :class="['nav-item', { active: isActive(item.path) }]"
        @click="navigateTo(item.path)"
      >
        <div class="nav-icon">{{ item.icon }}</div>
        <span class="nav-label">{{ item.label }}</span>
      </button>
    </div>
  </nav>
</template>

<style scoped>
.bottom-navigation {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: var(--color-background-main);
  border-top: 1px solid var(--color-border-light);
  padding: var(--spacing-sm) 0;
  z-index: var(--z-index-fixed);
  box-shadow: 0 -4px 12px rgba(163, 177, 198, 0.15);
}

.nav-container {
  max-width: var(--max-width-content);
  margin: 0 auto;
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 0 var(--spacing-md);
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-sm) var(--spacing-lg);
  background: transparent;
  border: none;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--transition-fast);
  color: var(--color-text-secondary);
  min-width: 80px;
}

.nav-item:hover {
  background: var(--color-background-dark);
  color: var(--color-text-primary);
}

.nav-item.active {
  color: var(--color-primary-main);
}

.nav-item.active .nav-icon {
  background: linear-gradient(135deg, var(--color-primary-main), var(--color-primary-light));
  box-shadow: 
    6px 6px 12px rgba(108, 99, 255, 0.2),
    -6px -6px 12px rgba(255, 255, 255, 0.3);
  transform: scale(1.1);
}

.nav-icon {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--font-size-xl);
  background: var(--color-background-main);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-neumorphic-sm);
  transition: all var(--transition-base);
}

.nav-label {
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

@media (max-width: 640px) {
  .nav-item {
    min-width: 60px;
    padding: var(--spacing-sm);
  }

  .nav-icon {
    width: 40px;
    height: 40px;
    font-size: var(--font-size-lg);
  }

  .nav-label {
    font-size: 0.65rem;
  }
}
</style>

