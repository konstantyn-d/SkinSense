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
      <h1 class="mb-xl">📈 Progress Tracking</h1>

      <!-- Summary Cards -->
      <div class="d-flex gap-md flex-wrap mb-xl">
        <div class="stat-card" style="flex: 1; min-width: 200px;">
          <div class="stat-card-icon">🎯</div>
          <div class="stat-card-label">Active Issues</div>
          <div class="stat-card-value">3</div>
        </div>
        <div class="stat-card" style="flex: 1; min-width: 200px;">
          <div class="stat-card-icon">📊</div>
          <div class="stat-card-label">Avg Progress</div>
          <div class="stat-card-value">63%</div>
        </div>
        <div class="stat-card" style="flex: 1; min-width: 200px;">
          <div class="stat-card-icon">✅</div>
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
</style>

