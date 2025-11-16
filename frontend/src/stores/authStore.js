/**
 * Authentication Store (Pinia)
 * 
 * Manages user authentication state and operations
 */

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { supabase } from '../lib/supabaseClient'

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref(null)
  const session = ref(null)
  const loading = ref(false)
  const error = ref(null)

  // Getters
  const isAuthenticated = computed(() => !!session.value)
  const accessToken = computed(() => session.value?.access_token || null)
  const userEmail = computed(() => user.value?.email || null)
  const userId = computed(() => user.value?.id || null)

  // Actions

  /**
   * Check current session on app initialization
   */
  const checkSession = async () => {
    loading.value = true
    error.value = null

    try {
      const { data: { session: currentSession }, error: sessionError } = await supabase.auth.getSession()
      
      if (sessionError) throw sessionError

      if (currentSession) {
        session.value = currentSession
        user.value = currentSession.user
        
        // Update localStorage for route guard compatibility
        localStorage.setItem('isAuthenticated', 'true')
        
        console.log('✅ Session restored:', user.value.email)
      } else {
        // No active session
        localStorage.removeItem('isAuthenticated')
      }
    } catch (err) {
      console.error('Error checking session:', err)
      error.value = err.message
      localStorage.removeItem('isAuthenticated')
    } finally {
      loading.value = false
    }
  }

  /**
   * Sign up with email and password
   */
  const signUpWithEmail = async (email, password, fullName = '') => {
    loading.value = true
    error.value = null

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName
          }
        }
      })

      if (signUpError) throw signUpError

      // Check if email confirmation is required
      if (data.user && !data.session) {
        return {
          success: true,
          requiresConfirmation: true,
          message: 'Please check your email to confirm your account'
        }
      }

      // Auto sign-in after registration
      if (data.session) {
        session.value = data.session
        user.value = data.user
        localStorage.setItem('isAuthenticated', 'true')
        
        console.log('✅ User registered and signed in:', user.value.email)
        
        return {
          success: true,
          requiresConfirmation: false,
          message: 'Account created successfully'
        }
      }

    } catch (err) {
      console.error('Sign up error:', err)
      error.value = err.message
      return {
        success: false,
        message: err.message
      }
    } finally {
      loading.value = false
    }
  }

  /**
   * Sign in with email and password
   */
  const signInWithEmail = async (email, password) => {
    loading.value = true
    error.value = null

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (signInError) throw signInError

      session.value = data.session
      user.value = data.user
      localStorage.setItem('isAuthenticated', 'true')
      
      console.log('✅ User signed in:', user.value.email)
      
      return {
        success: true,
        message: 'Signed in successfully'
      }

    } catch (err) {
      console.error('Sign in error:', err)
      error.value = err.message
      return {
        success: false,
        message: err.message
      }
    } finally {
      loading.value = false
    }
  }

  /**
   * Sign in with Google OAuth
   */
  const signInWithGoogle = async () => {
    loading.value = true
    error.value = null

    try {
      const { data, error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/profile`
        }
      })

      if (oauthError) throw oauthError

      // OAuth will redirect, so we don't update state here
      return {
        success: true,
        message: 'Redirecting to Google...'
      }

    } catch (err) {
      console.error('Google sign in error:', err)
      error.value = err.message
      return {
        success: false,
        message: err.message
      }
    } finally {
      loading.value = false
    }
  }

  /**
   * Sign out
   */
  const signOut = async () => {
    loading.value = true
    error.value = null

    try {
      const { error: signOutError } = await supabase.auth.signOut()
      
      if (signOutError) throw signOutError

      // Clear state
      session.value = null
      user.value = null
      localStorage.removeItem('isAuthenticated')
      
      console.log('✅ User signed out')
      
      return {
        success: true,
        message: 'Signed out successfully'
      }

    } catch (err) {
      console.error('Sign out error:', err)
      error.value = err.message
      return {
        success: false,
        message: err.message
      }
    } finally {
      loading.value = false
    }
  }

  /**
   * Reset password
   */
  const resetPassword = async (email) => {
    loading.value = true
    error.value = null

    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      })

      if (resetError) throw resetError

      return {
        success: true,
        message: 'Password reset email sent'
      }

    } catch (err) {
      console.error('Password reset error:', err)
      error.value = err.message
      return {
        success: false,
        message: err.message
      }
    } finally {
      loading.value = false
    }
  }

  /**
   * Listen to auth state changes
   */
  const initAuthListener = () => {
    supabase.auth.onAuthStateChange((event, currentSession) => {
      console.log('Auth state changed:', event)
      
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        session.value = currentSession
        user.value = currentSession?.user || null
        localStorage.setItem('isAuthenticated', 'true')
      } else if (event === 'SIGNED_OUT') {
        session.value = null
        user.value = null
        localStorage.removeItem('isAuthenticated')
      }
    })
  }

  return {
    // State
    user,
    session,
    loading,
    error,
    
    // Getters
    isAuthenticated,
    accessToken,
    userEmail,
    userId,
    
    // Actions
    checkSession,
    signUpWithEmail,
    signInWithEmail,
    signInWithGoogle,
    signOut,
    resetPassword,
    initAuthListener
  }
})

