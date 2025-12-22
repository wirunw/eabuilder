<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <Header @toggle-sidebar="toggleSidebar" />
    
    <!-- Sidebar -->
    <Sidebar :is-open="sidebarOpen" @close-sidebar="closeSidebar" />

    <!-- Main Content -->
    <main class="pt-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <!-- Welcome Section -->
        <div class="mb-8">
          <h1 class="text-3xl font-bold text-gray-900 mb-2">
            ยินดีต้อนรับกลับมา, {{ currentUser?.username }}!
          </h1>
          <p class="text-gray-600">
            ดำเนินการสร้าง Enterprise Architecture Workflow ด้วยความช่วยเหลือจาก AI
          </p>
        </div>

        <!-- Progress Overview Card -->
        <div class="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-xl font-semibold text-gray-900">ภาพรวมความคืบหน้า</h2>
            <span class="text-sm text-gray-500">
              อัปเดตล่าสุด: {{ lastUpdated }}
            </span>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <!-- Overall Progress -->
            <div class="text-center">
              <div class="relative w-32 h-32 mx-auto mb-4">
                <svg class="w-32 h-32 transform -rotate-90">
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="#e5e7eb"
                    stroke-width="12"
                    fill="none"
                  />
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="url(#gradient)"
                    stroke-width="12"
                    fill="none"
                    stroke-dasharray="351.86"
                    :stroke-dashoffset="351.86 - (351.86 * progress) / 100"
                    class="transition-all duration-500"
                  />
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stop-color="#dc2626" />
                      <stop offset="100%" stop-color="#991b1b" />
                    </linearGradient>
                  </defs>
                </svg>
                <div class="absolute inset-0 flex items-center justify-center">
                  <span class="text-2xl font-bold text-gray-900">{{ Math.round(progress) }}%</span>
                </div>
              </div>
              <p class="text-sm text-gray-600">ความคืบหน้าทั้งหมด</p>
            </div>

            <!-- Completed Phases -->
            <div class="text-center">
              <div class="w-32 h-32 bg-gradient-to-br from-green-50 to-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span class="text-3xl font-bold text-green-600">{{ completedPhases.length }}</span>
              </div>
              <p class="text-sm text-gray-600">ขั้นตอนที่สำเร็จ</p>
              <p class="text-xs text-gray-500">จากทั้งหมด {{ totalPhases }} ขั้นตอน</p>
            </div>

            <!-- Time Spent -->
            <div class="text-center">
              <div class="w-32 h-32 bg-gradient-to-br from-blue-50 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span class="text-3xl font-bold text-blue-600">{{ timeSpent }}</span>
              </div>
              <p class="text-sm text-gray-600">เวลาที่ใช้ทั้งหมด</p>
              <p class="text-xs text-gray-500">ประมาณการ</p>
            </div>
          </div>

          <!-- Progress Bar -->
          <div class="w-full bg-gray-200 rounded-full h-4">
            <div 
              class="bg-gradient-to-r from-primary-600 to-primary-700 h-4 rounded-full transition-all duration-500"
              :style="{ width: `${progress}%` }"
            ></div>
          </div>
        </div>

        <!-- Phase Status Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div
            v-for="phase in phases"
            :key="phase.id"
            class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer"
            @click="navigateToPhase(phase.id)"
          >
            <div class="flex items-start justify-between mb-4">
              <div class="w-12 h-12 bg-gradient-to-r from-primary-50 to-primary-100 rounded-lg flex items-center justify-center">
                <span class="text-2xl">{{ phase.icon }}</span>
              </div>
              <div 
                v-if="phase.completed"
                class="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center"
              >
                <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <div 
                v-else-if="phase.id === currentPhase"
                class="w-6 h-6 bg-yellow-500 rounded-full animate-pulse"
              ></div>
              <div 
                v-else
                class="w-6 h-6 bg-gray-300 rounded-full"
              ></div>
            </div>
            
            <h3 class="font-semibold text-gray-900 mb-2">{{ phase.title }}</h3>
            <p class="text-sm text-gray-600 mb-4">{{ phase.description }}</p>
            
            <div class="flex items-center justify-between">
              <span class="text-xs text-gray-500">
                {{ phase.completed ? 'สำเร็จแล้ว' : phase.id === currentPhase ? 'กำลังดำเนินการ' : 'ยังไม่เริ่ม' }}
              </span>
              <button class="text-primary-600 hover:text-primary-700 text-sm font-medium">
                {{ phase.completed ? 'ดูรายละเอียด' : phase.id === currentPhase ? 'ทำต่อ' : 'เริ่ม' }}
              </button>
            </div>
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="bg-white rounded-xl shadow-lg p-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-6">การดำเนินการด่วน</h2>
          
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <button
              @click="continueCurrentPhase"
              class="p-4 bg-gradient-to-r from-primary-50 to-primary-100 rounded-lg hover:from-primary-100 hover:to-primary-200 transition-colors"
            >
              <svg class="w-6 h-6 text-primary-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
              </svg>
              <p class="text-sm font-medium text-gray-900">ทำต่อ</p>
              <p class="text-xs text-gray-600">ขั้นตอนปัจจุบัน</p>
            </button>

            <button
              @click="resetWorkflow"
              class="p-4 bg-gradient-to-r from-red-50 to-red-100 rounded-lg hover:from-red-100 hover:to-red-200 transition-colors"
            >
              <svg class="w-6 h-6 text-red-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
              </svg>
              <p class="text-sm font-medium text-gray-900">เริ่มใหม่</p>
              <p class="text-xs text-gray-600">ล้างข้อมูลทั้งหมด</p>
            </button>

            <button
              @click="exportData"
              class="p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-lg hover:from-green-100 hover:to-green-200 transition-colors"
            >
              <svg class="w-6 h-6 text-green-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
              <p class="text-sm font-medium text-gray-900">ส่งออก</p>
              <p class="text-xs text-gray-600">ดาวน์โหลดผลลัพธ์</p>
            </button>

            <button
              @click="viewSummary"
              class="p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg hover:from-blue-100 hover:to-blue-200 transition-colors"
            >
              <svg class="w-6 h-6 text-blue-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
              <p class="text-sm font-medium text-gray-900">สรุปผล</p>
              <p class="text-xs text-gray-600">ดูผลลัพธ์สุดท้าย</p>
            </button>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import Header from '@/components/layout/Header.vue'
import Sidebar from '@/components/layout/Sidebar.vue'
import { useAuthStore } from '@/stores/auth'
import { useWorkflowStore } from '@/stores/workflow'

export default {
  name: 'Dashboard',
  components: {
    Header,
    Sidebar
  },
  setup() {
    const router = useRouter()
    const authStore = useAuthStore()
    const workflowStore = useWorkflowStore()
    
    const sidebarOpen = ref(false)

    const currentUser = computed(() => authStore.currentUser)
    const phases = computed(() => workflowStore.phases.filter(p => p.id <= 6))
    const currentPhase = computed(() => workflowStore.currentPhase)
    const progress = computed(() => workflowStore.progress)
    const completedPhases = computed(() => workflowStore.getCompletedPhases())
    const totalPhases = computed(() => phases.value.length)

    // Mock data for demo
    const lastUpdated = ref(new Date().toLocaleString('th-TH'))
    const timeSpent = ref('45 นาที')

    const toggleSidebar = () => {
      sidebarOpen.value = !sidebarOpen.value
    }

    const closeSidebar = () => {
      sidebarOpen.value = false
    }

    const navigateToPhase = (phaseId) => {
      router.push(`/phase/${phaseId}`)
    }

    const continueCurrentPhase = () => {
      // Find first incomplete phase
      const incompletePhase = phases.value.find(p => !p.completed)
      if (incompletePhase) {
        navigateToPhase(incompletePhase.id)
      } else {
        // All phases completed, go to summary
        router.push('/summary')
      }
    }

    const resetWorkflow = () => {
      if (confirm('คุณต้องการเริ่ม workflow ใหม่ทั้งหมดหรือไม่? ข้อมูลทั้งหมดจะถูกลบไป')) {
        workflowStore.resetAllPhases()
        lastUpdated.value = new Date().toLocaleString('th-TH')
        timeSpent.value = '0 นาที'
      }
    }

    const exportData = () => {
      // Placeholder for export functionality
      alert('ฟังก์ชันส่งออกข้อมูลจะเปิดให้ใช้งานเมื่อสำเร็จทุกขั้นตอน')
    }

    const viewSummary = () => {
      router.push('/summary')
    }

    return {
      sidebarOpen,
      currentUser,
      phases,
      currentPhase,
      progress,
      completedPhases,
      totalPhases,
      lastUpdated,
      timeSpent,
      toggleSidebar,
      closeSidebar,
      navigateToPhase,
      continueCurrentPhase,
      resetWorkflow,
      exportData,
      viewSummary
    }
  }
}
</script>
