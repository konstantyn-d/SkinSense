<script setup>
import { ref } from 'vue'
import MainLayout from '../layouts/MainLayout.vue'

// Progress page logic will be fully implemented in Stage 10
const sampleProgress = ref([
  { name: 'Acne', progress: 65, status: 'improving' },
  { name: 'Dark Spots', progress: 40, status: 'active' },
  { name: 'Wrinkles', progress: 85, status: 'improving' }
])
</script>

<template>
  <MainLayout>
    <div class="progress-view">
    <div class="container">
      <h1 class="page-title mb-xl">
        <svg class="title-icon" width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M20.0005 7L14.1543 12.9375C14.0493 13.0441 13.9962 13.0976 13.9492 13.1396C13.1899 13.8193 12.0416 13.8193 11.2822 13.1396C11.2352 13.0976 11.1817 13.0442 11.0767 12.9375C10.9716 12.8308 10.9191 12.7774 10.8721 12.7354C10.1127 12.0557 8.96397 12.0557 8.20461 12.7354C8.15771 12.7773 8.10532 12.8305 8.00078 12.9367L4 17M20.0005 7L20 13M20.0005 7H14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        Progress Tracking
      </h1>

      <!-- Summary Cards -->
      <div class="d-flex gap-md flex-wrap mb-xl">
        <div class="stat-card" style="flex: 1; min-width: 200px;">
          <div class="stat-card-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20.0005 7L14.1543 12.9375C14.0493 13.0441 13.9962 13.0976 13.9492 13.1396C13.1899 13.8193 12.0416 13.8193 11.2822 13.1396C11.2352 13.0976 11.1817 13.0442 11.0767 12.9375C10.9716 12.8308 10.9191 12.7774 10.8721 12.7354C10.1127 12.0557 8.96397 12.0557 8.20461 12.7354C8.15771 12.7773 8.10532 12.8305 8.00078 12.9367L4 17M20.0005 7L20 13M20.0005 7H14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <div class="stat-card-label">Active Issues</div>
          <div class="stat-card-value">3</div>
        </div>
        <div class="stat-card" style="flex: 1; min-width: 200px;">
          <div class="stat-card-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 11V20M9 11H4.59961C4.03956 11 3.75981 11 3.5459 11.109C3.35774 11.2049 3.20487 11.3577 3.10899 11.5459C3 11.7598 3 12.04 3 12.6001V20H9M9 11V5.6001C9 5.04004 9 4.75981 9.10899 4.5459C9.20487 4.35774 9.35774 4.20487 9.5459 4.10899C9.75981 4 10.0396 4 10.5996 4H13.3996C13.9597 4 14.2403 4 14.4542 4.10899C14.6423 4.20487 14.7948 4.35774 14.8906 4.5459C14.9996 4.75981 15 5.04005 15 5.6001V8M9 20H15M15 20L21 20.0001V9.6001C21 9.04005 20.9996 8.75981 20.8906 8.5459C20.7948 8.35774 20.6429 8.20487 20.4548 8.10899C20.2409 8 19.9601 8 19.4 8H15M15 20V8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <div class="stat-card-label">Avg Progress</div>
          <div class="stat-card-value">63%</div>
        </div>
        <div class="stat-card" style="flex: 1; min-width: 200px;">
          <div class="stat-card-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12.9258 20.6314C15.0319 19.6781 20 16.7333 20 10.165V6.19691C20 5.07899 20 4.5192 19.7822 4.0918C19.5905 3.71547 19.2837 3.40973 18.9074 3.21799C18.4796 3 17.9203 3 16.8002 3H7.2002C6.08009 3 5.51962 3 5.0918 3.21799C4.71547 3.40973 4.40973 3.71547 4.21799 4.0918C4 4.51962 4 5.08009 4 6.2002V10.165C4 16.7333 8.9678 19.6781 11.074 20.6314C11.2972 20.7325 11.4094 20.7829 11.6621 20.8263C11.8215 20.8537 12.1795 20.8537 12.3389 20.8263C12.5907 20.7831 12.7017 20.7328 12.9235 20.6324L12.9258 20.6314Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <div class="stat-card-label">Resolved</div>
          <div class="stat-card-value">0</div>
        </div>
      </div>

      <!-- Sample Progress Cards -->
      <h2 class="mb-lg">Active Issues (Sample Data)</h2>
      <div class="d-flex flex-column gap-md">
        <div 
          v-for="issue in sampleProgress" 
          :key="issue.name"
          class="neumorphic-card"
        >
          <div class="d-flex justify-between align-center mb-md">
            <h3>{{ issue.name }}</h3>
            <span class="badge badge-primary">{{ issue.status }}</span>
          </div>
          <div class="d-flex justify-between mb-sm">
            <span class="text-secondary">Progress</span>
            <span class="font-semibold">{{ issue.progress }}%</span>
          </div>
          <div class="progress-bar">
            <div class="progress-bar-fill" :style="{ width: issue.progress + '%' }"></div>
          </div>
        </div>
      </div>

      <p class="text-center text-secondary mt-xl">
        Full progress tracking implementation will be added in Stage 10
      </p>
    </div>
  </div>
  </MainLayout>
</template>

<style scoped>
.progress-view {
  padding: var(--spacing-xl) 0;
  min-height: 100vh;
}

.page-title {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  color: var(--color-text-primary);
}

.title-icon {
  color: var(--color-primary-main);
}
</style>

