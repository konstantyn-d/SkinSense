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
          <div class="logo-icon">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 7.69431C10 2.99988 3 3.49988 3 9.49991C3 15.4999 12 20.5001 12 20.5001C12 20.5001 21 15.4999 21 9.49991C21 3.49988 14 2.99988 12 7.69431Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
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
            <span class="success-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12.9258 20.6314C15.0319 19.6781 20 16.7333 20 10.165V6.19691C20 5.07899 20 4.5192 19.7822 4.0918C19.5905 3.71547 19.2837 3.40973 18.9074 3.21799C18.4796 3 17.9203 3 16.8002 3H7.2002C6.08009 3 5.51962 3 5.0918 3.21799C4.71547 3.40973 4.40973 3.71547 4.21799 4.0918C4 4.51962 4 5.08009 4 6.2002V10.165C4 16.7333 8.9678 19.6781 11.074 20.6314C11.2972 20.7325 11.4094 20.7829 11.6621 20.8263C11.8215 20.8537 12.1795 20.8537 12.3389 20.8263C12.5907 20.7831 12.7017 20.7328 12.9235 20.6324L12.9258 20.6314Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </span>
            {{ successMessage }}
          </div>

          <!-- Error Message -->
          <div v-if="formErrors.general" class="error-message mb-lg">
            <span class="error-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 8.44971V12.4497M7.33173 3.9375L3.9375 7.33173L3.93442 7.33462C3.59057 7.67847 3.41824 7.85081 3.29492 8.05204C3.18526 8.23098 3.10425 8.4263 3.05526 8.63037C3 8.86055 3 9.10506 3 9.59424V14.4058C3 14.8949 3 15.1395 3.05526 15.3697C3.10425 15.5738 3.18526 15.7688 3.29492 15.9478C3.41857 16.1495 3.59182 16.3228 3.9375 16.6685L7.33173 20.0627C7.67763 20.4086 7.85021 20.5812 8.05204 20.7048C8.23099 20.8145 8.42581 20.8958 8.62988 20.9448C8.85971 21 9.10382 21 9.59151 21H14.4075C14.8952 21 15.1404 21 15.3702 20.9448C15.5743 20.8958 15.7693 20.8145 15.9482 20.7049C16.1501 20.5812 16.323 20.4086 16.6689 20.0627L20.0632 16.6685C20.4091 16.3226 20.5817 16.1496 20.7053 15.9478C20.815 15.7688 20.8953 15.5738 20.9443 15.3697C20.9996 15.1395 21 14.895 21 14.4058V9.59424C21 9.10506 20.9996 8.86055 20.9443 8.63037C20.8953 8.4263 20.815 8.23099 20.7053 8.05205C20.5817 7.85022 20.4091 7.67761 20.0632 7.33173L16.6689 3.9375C16.3233 3.59181 16.15 3.41857 15.9482 3.29492C15.7693 3.18526 15.5743 3.10425 15.3702 3.05526C15.14 3 14.8945 3 14.4053 3H9.59375C9.10457 3 8.86006 3 8.62988 3.05526C8.42581 3.10425 8.23099 3.18526 8.05204 3.29492C7.85204 3.41748 7.68106 3.58847 7.3414 3.92813L7.33173 3.9375ZM12.0498 15.4497V15.5497L11.9502 15.5499V15.4497H12.0498Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </span>
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
  background: linear-gradient(135deg, var(--color-primary-main), var(--color-secondary-main));
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-neumorphic-lg);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.logo-icon svg {
  width: 40px;
  height: 40px;
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

.success-icon,
.error-icon {
  display: flex;
  align-items: center;
  justify-content: center;
}

.success-icon svg,
.error-icon svg {
  width: 20px;
  height: 20px;
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
