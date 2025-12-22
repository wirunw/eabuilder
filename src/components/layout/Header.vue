<template>
  <header class="bg-white shadow-md border-b border-gray-200">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <!-- Logo and Title -->
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-8 h-8 bg-gradient-to-r from-primary-600 to-primary-700 rounded-lg flex items-center justify-center">
              <span class="text-white font-bold text-sm">EA</span>
            </div>
          </div>
          <div class="ml-4">
            <h1 class="text-xl font-bold text-gray-900">EA Flow Builder</h1>
            <p class="text-xs text-gray-500">Enterprise Architecture Workflow</p>
          </div>
        </div>

        <!-- Navigation Menu -->
        <nav class="hidden md:flex space-x-8">
          <router-link 
            to="/dashboard" 
            class="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            :class="{ 'text-primary-600 bg-primary-50': $route.path === '/dashboard' }"
          >
            แดชบอร์ด
          </router-link>
          <router-link 
            v-for="phase in phases" 
            :key="phase.id"
            :to="`/phase/${phase.id}`" 
            class="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            :class="{ 'text-primary-600 bg-primary-50': $route.path === `/phase/${phase.id}` }"
          >
            {{ phase.title }}
          </router-link>
          <router-link 
            to="/summary" 
            class="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            :class="{ 'text-primary-600 bg-primary-50': $route.path === '/summary' }"
          >
            สรุปผล
          </router-link>
        </nav>

        <!-- User Menu -->
        <div class="flex items-center space-x-4">
          <!-- Progress Indicator -->
          <div class="hidden sm:block">
            <div class="flex items-center space-x-2">
              <div class="w-32 bg-gray-200 rounded-full h-2">
                <div 
                  class="bg-gradient-to-r from-primary-600 to-primary-700 h-2 rounded-full transition-all duration-300"
                  :style="{ width: `${progress}%` }"
                ></div>
              </div>
              <span class="text-xs text-gray-600">{{ Math.round(progress) }}%</span>
            </div>
          </div>

          <!-- User Dropdown -->
          <div class="relative" @click="showUserMenu = !showUserMenu">
            <button class="flex items-center space-x-3 text-sm rounded-lg hover:bg-gray-100 p-2 transition-colors">
              <div class="w-8 h-8 bg-gradient-to-r from-primary-600 to-primary-700 rounded-full flex items-center justify-center">
                <span class="text-white font-medium text-xs">{{ userInitials }}</span>
              </div>
              <span class="hidden md:block font-medium text-gray-700">{{ currentUser?.username || 'User' }}</span>
              <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </button>

            <!-- Dropdown Menu -->
            <div 
              v-if="showUserMenu" 
              class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50"
              @click.stop
            >
              <div class="px-4 py-2 border-b border-gray-200">
                <p class="text-sm font-medium text-gray-900">{{ currentUser?.username || 'User' }}</p>
                <p class="text-xs text-gray-500">{{ currentUser?.email || 'user@example.com' }}</p>
              </div>
              <button 
                @click="handleLogout"
                class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
              >
                ออกจากระบบ
              </button>
            </div>
          </div>

          <!-- Mobile Menu Button -->
          <button 
            @click="$emit('toggle-sidebar')"
            class="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </button>
        </div>
      </div>
    </div>
  </header>
</template>

<script>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useWorkflowStore } from '@/stores/workflow'

export default {
  name: 'Header',
  emits: ['toggle-sidebar'],
  setup() {
    const router = useRouter()
    const authStore = useAuthStore()
    const workflowStore = useWorkflowStore()
    
    const showUserMenu = ref(false)

    const currentUser = computed(() => authStore.currentUser)
    const progress = computed(() => workflowStore.progress)
    const phases = computed(() => workflowStore.phases.filter(p => p.id <= 6))

    const userInitials = computed(() => {
      const username = currentUser.value?.username || 'User'
      return username.substring(0, 2).toUpperCase()
    })

    const handleLogout = () => {
      authStore.logout()
      router.push('/login')
    }

    // Close dropdown when clicking outside
    document.addEventListener('click', () => {
      showUserMenu.value = false
    })

    return {
      showUserMenu,
      currentUser,
      progress,
      phases,
      userInitials,
      handleLogout
    }
  }
}
</script>
