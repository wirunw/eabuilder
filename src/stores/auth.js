import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

// Local user accounts for development
const LOCAL_VALID_USERS = [
  { username: 'admin@eabuilder.com', password: 'mdx1apollo', name: 'Administrator', role: 'admin', id: 1 },
  { username: 'user1@eabuilder.com', password: 'mdx1apollo', name: 'User 1', role: 'user', id: 2 },
  { username: 'user2@eabuilder.com', password: 'mdx1apollo', name: 'User 2', role: 'user', id: 3 },
  { username: 'mdx1', password: 'mdx1apollo', name: 'ปดพ.1 ผู้บริหารดิจิทัลทางการแพทย์', role: 'user', id: 4 },
  { username: 'admin', password: 'admin123', name: 'Admin User', role: 'admin', id: 5 }
]

// Check if we're in development mode
const isDevelopment = import.meta.env.DEV

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref(null)
  const token = ref(localStorage.getItem('auth_token') || null)
  const loading = ref(false)
  const error = ref(null)

  // Getters
  const isAuthenticated = computed(() => !!token.value)
  const currentUser = computed(() => user.value)

  // Actions
  const login = async (credentials) => {
    loading.value = true
    error.value = null

    try {
      if (isDevelopment) {
        // Use local authentication for development
        const localUser = LOCAL_VALID_USERS.find(u => 
          u.username === credentials.username && u.password === credentials.password
        )

        if (localUser) {
          // Create a simple token for local development
          const devToken = btoa(JSON.stringify({ 
            userId: localUser.id, 
            username: localUser.username,
            role: localUser.role 
          }))
          
          token.value = devToken
          user.value = {
            id: localUser.id,
            username: localUser.username,
            name: localUser.name,
            role: localUser.role
          }
          
          // Store in localStorage
          localStorage.setItem('auth_token', devToken)
          localStorage.setItem('auth_user', JSON.stringify(user.value))
          
          return { success: true, data: { token: devToken, user: user.value } }
        } else {
          error.value = 'Invalid username or password'
          return { success: false, error: 'Invalid username or password' }
        }
      } else {
        // Use Netlify Functions for production
        const response = await fetch('/.netlify/functions/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(credentials)
        })

        const data = await response.json()

        if (response.ok) {
          token.value = data.token
          user.value = data.user
          
          // Store token in localStorage
          localStorage.setItem('auth_token', data.token)
          
          // Store user info in localStorage
          localStorage.setItem('auth_user', JSON.stringify(data.user))
          
          return { success: true, data }
        } else {
          error.value = data.error || 'Login failed'
          return { success: false, error: data.error }
        }
      }
    } catch (err) {
      error.value = isDevelopment 
        ? 'Login failed. Please check your credentials.'
        : 'Network error. Please try again.'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  const logout = () => {
    token.value = null
    user.value = null
    localStorage.removeItem('auth_token')
    localStorage.removeItem('auth_user')
  }

  const initializeAuth = () => {
    const storedToken = localStorage.getItem('auth_token')
    const storedUser = localStorage.getItem('auth_user')
    
    if (storedToken && storedUser) {
      token.value = storedToken
      try {
        user.value = JSON.parse(storedUser)
      } catch (e) {
        console.error('Failed to parse stored user data')
        logout()
      }
    }
  }

  const validateToken = async () => {
    if (!token.value) return false

    if (isDevelopment) {
      // In development, just check if token exists and is valid format
      try {
        const decoded = JSON.parse(atob(token.value))
        return decoded && decoded.userId && decoded.username
      } catch (e) {
        logout()
        return false
      }
    } else {
      // Use Netlify Functions for production
      try {
        const response = await fetch('/.netlify/functions/validate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token.value}`
          }
        })

        if (response.ok) {
          return true
        } else {
          logout()
          return false
        }
      } catch (err) {
        logout()
        return false
      }
    }
  }

  // Initialize auth on store creation
  initializeAuth()

  return {
    // State
    user,
    token,
    loading,
    error,
    
    // Getters
    isAuthenticated,
    currentUser,
    
    // Actions
    login,
    logout,
    initializeAuth,
    validateToken
  }
})
