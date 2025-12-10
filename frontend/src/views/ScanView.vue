<script setup>
import MainLayout from '../layouts/MainLayout.vue'
// Scan page logic will be implemented in Stage 9
</script>

<template>
  <MainLayout>
    <div class="scan-view">
    <div class="container">
      <div class="text-center mb-xl">
        <h1 class="mb-md">📸 Scan Page</h1>
        <p class="text-secondary">
          Camera integration and AI analysis will be implemented in Stage 9
        </p>
      </div>

      <div class="neumorphic-card text-center" style="max-width: 600px; margin: 0 auto;">
        <div class="scan-icon mb-lg">📷</div>
        <h2 class="mb-md">Start Your Skin Analysis</h2>
        <p class="text-secondary mb-lg">
          Take a photo of your face to analyze your skin health
        </p>
        <button class="neumorphic-button btn-primary btn-lg">
          Begin Scan (Coming Soon)
        </button>
      </div>
    </div>
  </div>
  </MainLayout>
</template>

<style scoped>
.scan-view {
  padding: var(--spacing-xl) 0;
  min-height: 100vh;
  display: flex;
  align-items: center;
}

.scan-icon {
  font-size: 5rem;
  width: 120px;
  height: 120px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-background-main);
  border-radius: var(--radius-full);
  box-shadow: var(--shadow-neumorphic-lg);
}
</style>

