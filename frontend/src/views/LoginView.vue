<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/authStore'

const router = useRouter()
const authStore = useAuthStore()

// State
const activeTab = ref('login') // 'login' or 'register'
const formData = ref({
  email: '',
  password: '',
  fullName: '',
  confirmPassword: ''
})
const formErrors = ref({})
const successMessage = ref('')

// Computed
const isLoading = computed(() => authStore.loading)

// Methods
const switchTab = (tab) => {
  activeTab.value = tab
  formErrors.value = {}
  successMessage.value = ''
}

const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email)
}

const validateForm = () => {
  formErrors.value = {}

  if (!formData.value.email) {
    formErrors.value.email = 'Email is required'
  } else if (!validateEmail(formData.value.email)) {
    formErrors.value.email = 'Invalid email format'
  }

  if (!formData.value.password) {
    formErrors.value.password = 'Password is required'
  } else if (formData.value.password.length < 6) {
    formErrors.value.password = 'Password must be at least 6 characters'
  }

  if (activeTab.value === 'register') {
    if (!formData.value.fullName) {
      formErrors.value.fullName = 'Full name is required'
    }

    if (!formData.value.confirmPassword) {
      formErrors.value.confirmPassword = 'Please confirm your password'
    } else if (formData.value.password !== formData.value.confirmPassword) {
      formErrors.value.confirmPassword = 'Passwords do not match'
    }
  }

  return Object.keys(formErrors.value).length === 0
}

const handleLogin = async () => {
  if (!validateForm()) return

  const result = await authStore.signInWithEmail(
    formData.value.email,
    formData.value.password
  )

  if (result.success) {
    router.push('/profile')
  } else {
    formErrors.value.general = result.message
  }
}

const handleRegister = async () => {
  if (!validateForm()) return

  const result = await authStore.signUpWithEmail(
    formData.value.email,
    formData.value.password,
    formData.value.fullName
  )

  if (result.success) {
    if (result.requiresConfirmation) {
      successMessage.value = result.message
      // Stay on registration page to show confirmation message
    } else {
      // Auto-login successful, redirect to profile
      router.push('/profile')
    }
  } else {
    formErrors.value.general = result.message
  }
}

const handleGoogleLogin = async () => {
  const result = await authStore.signInWithGoogle()
  
  if (!result.success) {
    formErrors.value.general = result.message
  }
  // If successful, user will be redirected by OAuth flow
}

const handleSubmit = () => {
  if (activeTab.value === 'login') {
    handleLogin()
  } else {
    handleRegister()
  }
}
</script>

<template>
  <div class="login-view">
    <div class="container">
      <div class="login-container">
        <!-- Logo Section -->
        <div class="logo-section mb-xl">
          <div class="logo-icon">✨</div>
          <h1 class="logo-title">SkinSense</h1>
          <p class="logo-subtitle">AI-Powered Skin Analysis</p>
        </div>

        <!-- Auth Card -->
        <div class="neumorphic-card auth-card">
          <!-- Tab Switcher -->
          <div class="tab-switcher mb-lg">
            <button
              :class="['tab-button', { active: activeTab === 'login' }]"
              @click="switchTab('login')"
            >
              Login
            </button>
            <button
              :class="['tab-button', { active: activeTab === 'register' }]"
              @click="switchTab('register')"
            >
              Register
            </button>
          </div>

          <!-- Success Message -->
          <div v-if="successMessage" class="success-message mb-lg">
            <span class="success-icon">✅</span>
            {{ successMessage }}
          </div>

          <!-- Error Message -->
          <div v-if="formErrors.general" class="error-message mb-lg">
            <span class="error-icon">❌</span>
            {{ formErrors.general }}
          </div>

          <!-- Login Form -->
          <form v-if="activeTab === 'login'" @submit.prevent="handleSubmit" class="auth-form">
            <div class="form-group">
              <label for="login-email" class="form-label">Email</label>
              <input
                id="login-email"
                v-model="formData.email"
                type="email"
                class="neumorphic-input"
                :class="{ 'input-error': formErrors.email }"
                placeholder="your@email.com"
                autocomplete="email"
              />
              <span v-if="formErrors.email" class="field-error">{{ formErrors.email }}</span>
            </div>

            <div class="form-group">
              <label for="login-password" class="form-label">Password</label>
              <input
                id="login-password"
                v-model="formData.password"
                type="password"
                class="neumorphic-input"
                :class="{ 'input-error': formErrors.password }"
                placeholder="••••••••"
                autocomplete="current-password"
              />
              <span v-if="formErrors.password" class="field-error">{{ formErrors.password }}</span>
            </div>

            <button
              type="submit"
              class="neumorphic-button btn-primary w-full btn-lg"
              :disabled="isLoading"
            >
              <span v-if="isLoading" class="spinner spinner-sm"></span>
              <span v-else>Login</span>
            </button>
          </form>

          <!-- Register Form -->
          <form v-else @submit.prevent="handleSubmit" class="auth-form">
            <div class="form-group">
              <label for="register-name" class="form-label">Full Name</label>
              <input
                id="register-name"
                v-model="formData.fullName"
                type="text"
                class="neumorphic-input"
                :class="{ 'input-error': formErrors.fullName }"
                placeholder="John Doe"
                autocomplete="name"
              />
              <span v-if="formErrors.fullName" class="field-error">{{ formErrors.fullName }}</span>
            </div>

            <div class="form-group">
              <label for="register-email" class="form-label">Email</label>
              <input
                id="register-email"
                v-model="formData.email"
                type="email"
                class="neumorphic-input"
                :class="{ 'input-error': formErrors.email }"
                placeholder="your@email.com"
                autocomplete="email"
              />
              <span v-if="formErrors.email" class="field-error">{{ formErrors.email }}</span>
            </div>

            <div class="form-group">
              <label for="register-password" class="form-label">Password</label>
              <input
                id="register-password"
                v-model="formData.password"
                type="password"
                class="neumorphic-input"
                :class="{ 'input-error': formErrors.password }"
                placeholder="••••••••"
                autocomplete="new-password"
              />
              <span v-if="formErrors.password" class="field-error">{{ formErrors.password }}</span>
            </div>

            <div class="form-group">
              <label for="register-confirm" class="form-label">Confirm Password</label>
              <input
                id="register-confirm"
                v-model="formData.confirmPassword"
                type="password"
                class="neumorphic-input"
                :class="{ 'input-error': formErrors.confirmPassword }"
                placeholder="••••••••"
                autocomplete="new-password"
              />
              <span v-if="formErrors.confirmPassword" class="field-error">{{ formErrors.confirmPassword }}</span>
            </div>

            <button
              type="submit"
              class="neumorphic-button btn-primary w-full btn-lg"
              :disabled="isLoading"
            >
              <span v-if="isLoading" class="spinner spinner-sm"></span>
              <span v-else>Create Account</span>
            </button>
          </form>

          <!-- Divider -->
          <!-- Google OAuth temporarily disabled - requires configuration in Supabase -->
          <!-- 
          <div class="divider-with-text">
            <span>or</span>
          </div>

          <button
            class="neumorphic-button w-full"
            @click="handleGoogleLogin"
            :disabled="isLoading"
          >
            <span class="google-icon">🔐</span>
            Continue with Google
          </button>
          -->
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.login-view {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-xl);
  background: var(--color-background-main);
}

.login-container {
  width: 100%;
  max-width: 480px;
}

/* Logo Section */
.logo-section {
  text-align: center;
}

.logo-icon {
  width: 80px;
  height: 80px;
  margin: 0 auto var(--spacing-md);
  background: var(--color-background-main);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-neumorphic-lg);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
}

.logo-title {
  font-size: var(--font-size-4xl);
  font-weight: var(--font-weight-bold);
  background: linear-gradient(135deg, var(--color-primary-main), var(--color-secondary-main));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: var(--spacing-xs);
}

.logo-subtitle {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  font-weight: var(--font-weight-medium);
  text-transform: uppercase;
  letter-spacing: 1px;
}

/* Auth Card */
.auth-card {
  padding: var(--spacing-2xl);
}

/* Tab Switcher */
.tab-switcher {
  display: flex;
  gap: var(--spacing-sm);
  background: var(--color-background-main);
  padding: var(--spacing-xs);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-neumorphic-inset-sm);
}

.tab-button {
  flex: 1;
  padding: var(--spacing-md);
  background: transparent;
  border: none;
  border-radius: var(--radius-md);
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.tab-button.active {
  background: var(--color-background-main);
  box-shadow: var(--shadow-neumorphic-sm);
  color: var(--color-primary-main);
}

/* Messages */
.success-message,
.error-message {
  padding: var(--spacing-md);
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  font-size: var(--font-size-sm);
}

.success-message {
  background: var(--color-success-light);
  color: white;
}

.error-message {
  background: var(--color-error-light);
  color: white;
}

/* Form */
.auth-form {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.form-label {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-primary);
}

.input-error {
  box-shadow: 
    var(--shadow-neumorphic-inset-sm),
    0 0 0 2px var(--color-error-light) !important;
}

.field-error {
  font-size: var(--font-size-xs);
  color: var(--color-error);
  margin-top: -4px;
}

/* Divider */
.divider-with-text {
  position: relative;
  text-align: center;
  margin: var(--spacing-xl) 0;
}

.divider-with-text::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 1px;
  background: var(--color-border-light);
}

.divider-with-text span {
  position: relative;
  display: inline-block;
  padding: 0 var(--spacing-md);
  background: var(--color-background-main);
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
}

/* Google Button */
.google-icon {
  font-size: var(--font-size-lg);
}

@media (max-width: 640px) {
  .login-view {
    padding: var(--spacing-md);
  }

  .auth-card {
    padding: var(--spacing-xl);
  }

  .logo-title {
    font-size: var(--font-size-3xl);
  }
}
</style>
