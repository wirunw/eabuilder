<template>
  <div id="app" class="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
    <!-- Loading Overlay -->
    <div v-if="loading" class="fixed inset-0 bg-white bg-opacity-90 flex items-center justify-center z-50">
      <div class="text-center">
        <div class="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p class="text-gray-600">กำลังโหลด...</p>
      </div>
    </div>

    <!-- Error Toast -->
    <div 
      v-if="error" 
      class="fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 slide-in-up"
    >
      <div class="flex items-center">
        <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path>
        </svg>
        <span>{{ error }}</span>
      </div>
    </div>

    <!-- Main Content -->
    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </div>
</template>

<script>
import { ref, onMounted, watch } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useWorkflowStore } from '@/stores/workflow'

export default {
  name: 'App',
  setup() {
    const authStore = useAuthStore()
    const workflowStore = useWorkflowStore()
    
    const loading = ref(false)
    const error = ref(null)

    // Watch for errors from stores
    watch(() => authStore.error, (newError) => {
      error.value = newError
      if (newError) {
        setTimeout(() => {
          error.value = null
          authStore.error = null
        }, 5000)
      }
    })

    watch(() => workflowStore.error, (newError) => {
      error.value = newError
      if (newError) {
        setTimeout(() => {
          error.value = null
          workflowStore.error = null
        }, 5000)
      }
    })

    // Watch for loading states
    watch(() => authStore.loading || workflowStore.loading, (isLoading) => {
      loading.value = isLoading
    })

    onMounted(() => {
      // Initialize auth state
      authStore.initializeAuth()
    })

    return {
      loading,
      error
    }
  }
}
</script>

<style>
/* Transition animations */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-in-up {
  animation: slideInUp 0.3s ease-out;
}

@keyframes slideInUp {
  from {
    transform: translateY(100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

/* Custom scrollbar for better UX */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: linear-gradient(135deg, #dc2626, #991b1b);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(135deg, #b91c1c, #7f1d1d);
}

/* Focus styles for accessibility */
*:focus {
  outline: 2px solid #dc2626;
  outline-offset: 2px;
}

/* Remove focus outline for mouse users */
*:focus:not(:focus-visible) {
  outline: none;
}

/* Print styles */
@media print {
  .no-print {
    display: none !important;
  }
  
  body {
    background: white !important;
  }
  
  .print-break-before {
    page-break-before: always;
  }
  
  .print-break-after {
    page-break-after: always;
  }
}
</style>
