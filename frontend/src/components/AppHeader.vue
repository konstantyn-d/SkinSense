<script setup>
// App header component
</script>

<template>
  <header class="app-header">
    <div class="container">
      <div class="header-content">
        <div class="logo-section">
          <div class="logo-icon">✨</div>
          <div class="logo-text">
            <h1 class="logo-title">SkinSense</h1>
            <p class="logo-subtitle">AI-Powered Skin Analysis</p>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<style scoped>
.app-header {
  background: var(--color-background-main);
  padding: var(--spacing-lg) 0;
  border-bottom: 1px solid var(--color-border-light);
  position: sticky;
  top: 0;
  z-index: var(--z-index-sticky);
  backdrop-filter: blur(10px);
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo-section {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.logo-icon {
  width: 48px;
  height: 48px;
  background: var(--color-background-main);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-neumorphic-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--font-size-2xl);
}

.logo-text {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.logo-title {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  line-height: 1;
  background: linear-gradient(135deg, var(--color-primary-main), var(--color-secondary-main));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0;
}

.logo-subtitle {
  font-size: var(--font-size-xs);
  color: var(--color-text-secondary);
  font-weight: var(--font-weight-medium);
  text-transform: uppercase;
  letter-spacing: 1px;
  margin: 0;
}

@media (max-width: 640px) {
  .logo-icon {
    width: 40px;
    height: 40px;
    font-size: var(--font-size-xl);
  }

  .logo-title {
    font-size: var(--font-size-lg);
  }

  .logo-subtitle {
    font-size: 0.65rem;
  }
}
</style>

