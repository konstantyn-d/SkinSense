<script setup>
// App header component
</script>

<template>
  <header class="app-header">
    <div class="container">
      <div class="header-content">
        <div class="logo-section">
          <div class="logo-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 7.69431C10 2.99988 3 3.49988 3 9.49991C3 15.4999 12 20.5001 12 20.5001C12 20.5001 21 15.4999 21 9.49991C21 3.49988 14 2.99988 12 7.69431Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
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
  background: linear-gradient(135deg, var(--color-primary-main), var(--color-secondary-main));
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-neumorphic-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.logo-icon svg {
  width: 24px;
  height: 24px;
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
  }

  .logo-icon svg {
    width: 20px;
    height: 20px;
  }

  .logo-title {
    font-size: var(--font-size-lg);
  }

  .logo-subtitle {
    font-size: 0.65rem;
  }
}
</style>

