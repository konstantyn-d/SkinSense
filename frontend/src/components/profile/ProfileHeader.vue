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
          <span class="stat-badge-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 11V20M9 11H4.59961C4.03956 11 3.75981 11 3.5459 11.109C3.35774 11.2049 3.20487 11.3577 3.10899 11.5459C3 11.7598 3 12.04 3 12.6001V20H9M9 11V5.6001C9 5.04004 9 4.75981 9.10899 4.5459C9.20487 4.35774 9.35774 4.20487 9.5459 4.10899C9.75981 4 10.0396 4 10.5996 4H13.3996C13.9597 4 14.2403 4 14.4542 4.10899C14.6423 4.20487 14.7948 4.35774 14.8906 4.5459C14.9996 4.75981 15 5.04005 15 5.6001V8M9 20H15M15 20L21 20.0001V9.6001C21 9.04005 20.9996 8.75981 20.8906 8.5459C20.7948 8.35774 20.6429 8.20487 20.4548 8.10899C20.2409 8 19.9601 8 19.4 8H15M15 20V8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </span>
          <div class="stat-badge-content">
            <span class="stat-badge-value">{{ totalScans }}</span>
            <span class="stat-badge-label">Total Scans</span>
          </div>
        </div>
        <div class="stat-badge">
          <span class="stat-badge-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12.9258 20.6314C15.0319 19.6781 20 16.7333 20 10.165V6.19691C20 5.07899 20 4.5192 19.7822 4.0918C19.5905 3.71547 19.2837 3.40973 18.9074 3.21799C18.4796 3 17.9203 3 16.8002 3H7.2002C6.08009 3 5.51962 3 5.0918 3.21799C4.71547 3.40973 4.40973 3.71547 4.21799 4.0918C4 4.51962 4 5.08009 4 6.2002V10.165C4 16.7333 8.9678 19.6781 11.074 20.6314C11.2972 20.7325 11.4094 20.7829 11.6621 20.8263C11.8215 20.8537 12.1795 20.8537 12.3389 20.8263C12.5907 20.7831 12.7017 20.7328 12.9235 20.6324L12.9258 20.6314Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </span>
          <div class="stat-badge-content">
            <span class="stat-badge-value">{{ resolvedIssues }}</span>
            <span class="stat-badge-label">Resolved</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Logout Button -->
    <button class="neumorphic-button logout-button" @click="handleLogout">
      <svg class="logout-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M15 19L8 12L15 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
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
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-primary-main);
}

.stat-badge-icon svg {
  width: 24px;
  height: 24px;
}

.logout-icon {
  width: 18px;
  height: 18px;
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

