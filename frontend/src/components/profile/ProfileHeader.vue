<script setup>
import { computed } from 'vue'
import { useAuthStore } from '../../stores/authStore'
import { useRouter } from 'vue-router'
import { getInitials } from '../../utils/format'

const props = defineProps({
  totalScans: {
    type: Number,
    default: 0
  },
  resolvedIssues: {
    type: Number,
    default: 0
  }
})

const authStore = useAuthStore()
const router = useRouter()

const userInitials = computed(() => {
  return getInitials(authStore.user?.user_metadata?.full_name || authStore.userEmail || 'User')
})

const userName = computed(() => {
  return authStore.user?.user_metadata?.full_name || 'User'
})

const userEmail = computed(() => {
  return authStore.userEmail || ''
})

const handleLogout = async () => {
  const result = await authStore.signOut()
  if (result.success) {
    router.push('/login')
  }
}
</script>

<template>
  <div class="profile-header neumorphic-card">
    <div class="header-content">
      <!-- Avatar and Info -->
      <div class="user-info">
        <div class="avatar avatar-xl">{{ userInitials }}</div>
        <div class="user-details">
          <h2 class="user-name">{{ userName }}</h2>
          <p class="user-email">{{ userEmail }}</p>
        </div>
      </div>

      <!-- Stats Badges -->
      <div class="stats-badges">
        <div class="stat-badge">
          <span class="stat-badge-icon">📊</span>
          <div class="stat-badge-content">
            <span class="stat-badge-value">{{ totalScans }}</span>
            <span class="stat-badge-label">Total Scans</span>
          </div>
        </div>
        <div class="stat-badge">
          <span class="stat-badge-icon">✅</span>
          <div class="stat-badge-content">
            <span class="stat-badge-value">{{ resolvedIssues }}</span>
            <span class="stat-badge-label">Resolved</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Logout Button -->
    <button class="neumorphic-button logout-button" @click="handleLogout">
      <span>🚪</span>
      Logout
    </button>
  </div>
</template>

<style scoped>
.profile-header {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--spacing-lg);
  flex-wrap: wrap;
}

.user-info {
  display: flex;
  align-items: center;
  gap: var(--spacing-lg);
}

.user-details {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.user-name {
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
  margin: 0;
}

.user-email {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  margin: 0;
}

.stats-badges {
  display: flex;
  gap: var(--spacing-md);
}

.stat-badge {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm) var(--spacing-md);
  background: var(--color-background-main);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-flat);
}

.stat-badge-icon {
  font-size: var(--font-size-2xl);
}

.stat-badge-content {
  display: flex;
  flex-direction: column;
}

.stat-badge-value {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
  line-height: 1;
}

.stat-badge-label {
  font-size: var(--font-size-xs);
  color: var(--color-text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.logout-button {
  align-self: flex-start;
}

@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    align-items: flex-start;
  }

  .stats-badges {
    width: 100%;
    justify-content: space-between;
  }

  .logout-button {
    width: 100%;
  }
}
</style>

