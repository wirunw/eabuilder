<template>
  <aside 
    class="fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out"
    :class="{ '-translate-x-full': !isOpen, 'translate-x-0': isOpen }"
  >
    <!-- Close Button -->
    <div class="absolute top-4 right-4">
      <button 
        @click="$emit('close-sidebar')"
        class="p-2 rounded-lg hover:bg-gray-100 transition-colors"
      >
        <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      </button>
    </div>

    <!-- Sidebar Content -->
    <div class="h-full overflow-y-auto pt-16 pb-4 px-4">
      <!-- User Info -->
      <div class="mb-8 p-4 bg-gradient-to-r from-primary-50 to-primary-100 rounded-lg">
        <div class="flex items-center space-x-3">
          <div class="w-12 h-12 bg-gradient-to-r from-primary-600 to-primary-700 rounded-full flex items-center justify-center">
            <span class="text-white font-bold text-lg">{{ userInitials }}</span>
          </div>
          <div>
            <p class="font-medium text-gray-900">{{ currentUser?.username || 'User' }}</p>
            <p class="text-xs text-gray-600">{{ currentUser?.role || 'Enterprise Architect' }}</p>
          </div>
        </div>
      </div>

      <!-- Progress Overview -->
      <div class="mb-8">
        <h3 class="text-sm font-semibold text-gray-700 mb-4">ความคืบหน้าทั้งหมด</h3>
        <div class="bg-gray-50 rounded-lg p-4">
          <div class="flex items-center justify-between mb-2">
            <span class="text-sm text-gray-600">ดำเนินการแล้ว</span>
            <span class="text-sm font-medium text-primary-600">{{ completedPhases.length }}/{{ totalPhases }}</span>
          </div>
          <div class="w-full bg-gray-200 rounded-full h-3">
            <div 
              class="bg-gradient-to-r from-primary-600 to-primary-700 h-3 rounded-full transition-all duration-500"
              :style="{ width: `${progress}%` }"
            ></div>
          </div>
          <p class="text-xs text-gray-500 mt-2">{{ Math.round(progress) }}% สำเร็จ</p>
        </div>
      </div>

      <!-- Phase Navigation -->
      <div class="space-y-2">
        <h3 class="text-sm font-semibold text-gray-700 mb-4">ขั้นตอนการทำงาน</h3>
        
        <!-- Dashboard Link -->
        <router-link
          to="/dashboard"
          class="flex items-center space-x-3 p-3 rounded-lg transition-all duration-200"
          :class="isDashboardActive ? 'bg-primary-100 text-primary-700' : 'hover:bg-gray-100 text-gray-700'"
          @click="$emit('close-sidebar')"
        >
          <div class="w-8 h-8 flex items-center justify-center rounded-lg">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
            </svg>
          </div>
          <div class="flex-1">
            <p class="font-medium">แดชบอร์ด</p>
            <p class="text-xs text-gray-500">ภาพรวมโปรเจค</p>
          </div>
        </router-link>

        <!-- Phase Links -->
        <router-link
          v-for="phase in phases"
          :key="phase.id"
          :to="`/phase/${phase.id}`"
          class="flex items-center space-x-3 p-3 rounded-lg transition-all duration-200"
          :class="isPhaseActive(phase.id) ? 'bg-primary-100 text-primary-700' : 'hover:bg-gray-100 text-gray-700'"
          @click="$emit('close-sidebar')"
        >
          <div class="w-8 h-8 flex items-center justify-center rounded-lg bg-white shadow-sm">
            <span class="text-lg">{{ phase.icon }}</span>
          </div>
          <div class="flex-1">
            <p class="font-medium">{{ phase.title }}</p>
            <p class="text-xs text-gray-500">{{ phase.description }}</p>
          </div>
          <div class="ml-auto">
            <div 
              v-if="phase.completed"
              class="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center"
            >
              <svg class="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <div 
              v-else-if="isPhaseActive(phase.id)"
              class="w-5 h-5 bg-yellow-500 rounded-full animate-pulse"
            ></div>
            <div 
              v-else
              class="w-5 h-5 bg-gray-300 rounded-full"
            ></div>
          </div>
        </router-link>

        <!-- Summary Link -->
        <router-link
          to="/summary"
          class="flex items-center space-x-3 p-3 rounded-lg transition-all duration-200"
          :class="isSummaryActive ? 'bg-primary-100 text-primary-700' : 'hover:bg-gray-100 text-gray-700'"
          @click="$emit('close-sidebar')"
        >
          <div class="w-8 h-8 flex items-center justify-center rounded-lg">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
          </div>
          <div class="flex-1">
            <p class="font-medium">สรุปผล</p>
            <p class="text-xs text-gray-500">ดูผลลัพธ์สุดท้าย</p>
          </div>
        </router-link>
      </div>

      <!-- Actions -->
      <div class="mt-8 pt-8 border-t border-gray-200">
        <button
          @click="handleResetWorkflow"
          class="w-full flex items-center justify-center space-x-2 p-3 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
          </svg>
          <span class="text-sm font-medium">เริ่มใหม่</span>
        </button>
      </div>
    </div>

    <!-- Overlay for mobile -->
    <div 
      v-if="isOpen"
      class="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
      @click="$emit('close-sidebar')"
    ></div>
  </aside>
</template>

<script>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useWorkflowStore } from '@/stores/workflow'

export default {
  name: 'Sidebar',
  props: {
    isOpen: {
      type: Boolean,
      default: false
    }
  },
  emits: ['close-sidebar'],
  setup(props) {
    const route = useRoute()
    const router = useRouter()
    const authStore = useAuthStore()
    const workflowStore = useWorkflowStore()

    const currentUser = computed(() => authStore.currentUser)
    const phases = computed(() => workflowStore.phases.filter(p => p.id <= 6))
    const progress = computed(() => workflowStore.progress)
    const completedPhases = computed(() => workflowStore.getCompletedPhases())
    const totalPhases = computed(() => phases.value.length)

    const userInitials = computed(() => {
      const username = currentUser.value?.username || 'User'
      return username.substring(0, 2).toUpperCase()
    })

    const isDashboardActive = computed(() => route.path === '/dashboard')
    const isSummaryActive = computed(() => route.path === '/summary')

    const isPhaseActive = (phaseId) => {
      return route.path === `/phase/${phaseId}`
    }

    const handleResetWorkflow = () => {
      if (confirm('คุณต้องการเริ่ม workflow ใหม่ทั้งหมดหรือไม่? ข้อมูลทั้งหมดจะถูกลบไป')) {
        workflowStore.resetAllPhases()
        // Redirect to dashboard
        if (route.path !== '/dashboard') {
          router.push('/dashboard')
        }
      }
    }

    return {
      currentUser,
      phases,
      progress,
      completedPhases,
      totalPhases,
      userInitials,
      isDashboardActive,
      isSummaryActive,
      isPhaseActive,
      handleResetWorkflow
    }
  }
}
</script>
