<script setup>
import AppHeader from '../components/AppHeader.vue'
import BottomNavigation from '../components/BottomNavigation.vue'
</script>

<template>
  <div class="main-layout">
    <!-- Header -->
    <AppHeader />

    <!-- Main Content Area -->
    <main class="main-content">
      <slot />
    </main>

    <!-- Bottom Navigation -->
    <BottomNavigation />
  </div>
</template>

<style scoped>
.main-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: var(--color-background-main);
}

.main-content {
  flex: 1;
  padding-bottom: 100px; /* Space for bottom navigation */
  min-height: calc(100vh - 80px); /* Adjust based on header height */
}

@media (max-width: 640px) {
  .main-content {
    padding-bottom: 90px;
  }
}
</style>

