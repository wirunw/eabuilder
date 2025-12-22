<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <Header @toggle-sidebar="toggleSidebar" />
    
    <!-- Sidebar -->
    <Sidebar :is-open="sidebarOpen" @close-sidebar="closeSidebar" />

    <!-- Main Content -->
    <main class="pt-16">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <!-- Header Section -->
        <div class="mb-8">
          <h1 class="text-3xl font-bold text-gray-900 mb-2">สรุปผล Workflow</h1>
          <p class="text-gray-600">
            ดูผลลัพธ์สุดท้ายจากการสร้าง Enterprise Architecture Workflow ด้วย AI
          </p>
        </div>

        <!-- Progress Overview -->
        <div class="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-xl font-semibold text-gray-900">ภาพรวมความคืบหน้า</h2>
            <div class="flex items-center space-x-2">
              <span class="text-sm text-gray-600">สถานะ:</span>
              <span class="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                สำเร็จ {{ completedPhases.length }}/{{ totalPhases }} ขั้นตอน
              </span>
            </div>
          </div>

          <div class="w-full bg-gray-200 rounded-full h-3 mb-6">
            <div 
              class="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full transition-all duration-500"
              :style="{ width: `${progress}%` }"
            ></div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="text-center">
              <div class="w-20 h-20 bg-gradient-to-br from-green-50 to-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span class="text-2xl font-bold text-green-600">{{ completedPhases.length }}</span>
              </div>
              <p class="text-sm text-gray-600">ขั้นตอนที่สำเร็จ</p>
            </div>
            <div class="text-center">
              <div class="w-20 h-20 bg-gradient-to-br from-blue-50 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span class="text-2xl font-bold text-blue-600">{{ Math.round(progress) }}%</span>
              </div>
              <p class="text-sm text-gray-600">ความคืบหน้าทั้งหมด</p>
            </div>
            <div class="text-center">
              <div class="w-20 h-20 bg-gradient-to-br from-purple-50 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span class="text-2xl font-bold text-purple-600">{{ estimatedTime }}</span>
              </div>
              <p class="text-sm text-gray-600">เวลาที่ใช้ทั้งหมด</p>
            </div>
          </div>
        </div>

        <!-- Workflow Result -->
        <div v-if="workflowResult" class="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-xl font-semibold text-gray-900">ผลลัพธ์ Workflow สุดท้าย</h2>
            <div class="flex items-center space-x-2">
              <span class="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                สร้างสำเร็จ
              </span>
              <span class="text-sm text-gray-500">{{ generatedAt }}</span>
            </div>
          </div>

          <div class="prose max-w-none">
            <div class="whitespace-pre-wrap bg-gray-50 rounded-lg p-6 font-mono text-sm">
              {{ workflowResult }}
            </div>
          </div>
        </div>

        <!-- Phase Results Summary -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div
            v-for="phase in phases"
            :key="phase.id"
            class="bg-white rounded-lg shadow-md p-6"
          >
            <div class="flex items-start justify-between mb-4">
              <div class="flex items-center space-x-3">
                <div class="w-10 h-10 bg-gradient-to-r from-primary-50 to-primary-100 rounded-lg flex items-center justify-center">
                  <span class="text-xl">{{ phase.icon }}</span>
                </div>
                <div>
                  <h3 class="font-semibold text-gray-900">{{ phase.title }}</h3>
                  <p class="text-sm text-gray-600">{{ phase.description }}</p>
                </div>
              </div>
              <div 
                v-if="phase.completed"
                class="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center"
              >
                <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
            </div>

            <div v-if="phase.data && Object.keys(phase.data).length > 0" class="space-y-3">
              <div
                v-for="(value, key) in phase.data"
                :key="key"
                class="border-l-2 border-gray-200 pl-4"
              >
                <p class="text-sm font-medium text-gray-700 capitalize">{{ formatKey(key) }}:</p>
                <p class="text-sm text-gray-600">{{ formatValue(value) }}</p>
              </div>
            </div>
            <div v-else class="text-sm text-gray-500 italic">
              ยังไม่มีข้อมูลสำหรับขั้นตอนนี้
            </div>
          </div>
        </div>

        <!-- Export Options -->
        <div class="bg-white rounded-xl shadow-lg p-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-6">ส่งออกข้อมูล</h2>
          
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <button
              @click="exportToText"
              class="flex flex-col items-center p-4 border-2 border-gray-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors"
            >
              <svg class="w-8 h-8 text-gray-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
              <span class="text-sm font-medium text-gray-900">ส่งออกเป็น TXT</span>
              <span class="text-xs text-gray-500">ข้อความธรรมดา</span>
            </button>

            <button
              @click="exportToPDF"
              class="flex flex-col items-center p-4 border-2 border-gray-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors"
            >
              <svg class="w-8 h-8 text-gray-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
              </svg>
              <span class="text-sm font-medium text-gray-900">ส่งออกเป็น PDF</span>
              <span class="text-xs text-gray-500">เอกสาร PDF</span>
            </button>

            <button
              @click="exportToJSON"
              class="flex flex-col items-center p-4 border-2 border-gray-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors"
            >
              <svg class="w-8 h-8 text-gray-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l-4 4m0-4l-4 4"></path>
              </svg>
              <span class="text-sm font-medium text-gray-900">ส่งออกเป็น JSON</span>
              <span class="text-xs text-gray-500">ข้อมูลดิบ</span>
            </button>

            <button
              @click="shareResults"
              class="flex flex-col items-center p-4 border-2 border-gray-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors"
            >
              <svg class="w-8 h-8 text-gray-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m9.032 4.026a9.001 9.001 0 01-7.432 0m9.032-4.026A9.001 9.001 0 0112 3c-4.474 0-8.268 2.943-9.543 7a9.97 9.97 0 011.563 3.029m7.432 4.026A9.97 9.97 0 019.543 7m0 0a9.001 9.001 0 00-9.543 7"></path>
              </svg>
              <span class="text-sm font-medium text-gray-900">แชร์ผลลัพธ์</span>
              <span class="text-xs text-gray-500">ส่งต่อผู้อื่น</span>
            </button>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="mt-8 flex items-center justify-between">
          <button
            @click="goToDashboard"
            class="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            กลับไปแดชบอร์ด
          </button>
          
          <div class="flex items-center space-x-4">
            <button
              @click="startNewWorkflow"
              class="px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 transition-colors"
            >
              เริ่ม Workflow ใหม่
            </button>
            <button
              v-if="!workflowResult"
              @click="generateWorkflow"
              :disabled="loading || completedPhases.length < totalPhases"
              class="px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-lg hover:from-primary-700 hover:to-primary-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <span v-if="loading" class="flex items-center">
                <div class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                กำลังสร้าง...
              </span>
              <span v-else>สร้าง Workflow สุดท้าย</span>
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
import { useWorkflowStore } from '@/stores/workflow'

export default {
  name: 'Summary',
  components: {
    Header,
    Sidebar
  },
  setup() {
    const router = useRouter()
    const workflowStore = useWorkflowStore()
    
    const sidebarOpen = ref(false)
    const loading = ref(false)

    const phases = computed(() => workflowStore.phases.filter(p => p.id <= 6))
    const progress = computed(() => workflowStore.progress)
    const completedPhases = computed(() => workflowStore.getCompletedPhases())
    const totalPhases = computed(() => phases.value.length)
    const workflowResult = computed(() => workflowStore.workflowResult)

    // Mock data for demo
    const estimatedTime = ref('45 นาที')
    const generatedAt = ref(new Date().toLocaleString('th-TH'))

    const toggleSidebar = () => {
      sidebarOpen.value = !sidebarOpen.value
    }

    const closeSidebar = () => {
      sidebarOpen.value = false
    }

    const formatKey = (key) => {
      const keyMap = {
        usageLevel: 'ระดับการใช้งาน',
        department: 'แผนก/หน่วยงาน',
        stakeholders: 'ผู้มีส่วนได้ส่วนเสีย',
        context: 'บริบทเพิ่มเติม',
        goals: 'เป้าหมาย',
        targets: 'เป้าหมายเชิงปริมาณ',
        scope: 'ขอบเขต',
        steps: 'ขั้นตอน',
        diagram: 'แผนภาพ',
        refinements: 'การปรับปรุง'
      }
      return keyMap[key] || key
    }

    const formatValue = (value) => {
      if (typeof value === 'object') {
        return JSON.stringify(value, null, 2)
      }
      return String(value)
    }

    const generateWorkflow = async () => {
      if (completedPhases.value.length < totalPhases.value) {
        alert('กรุณาทำขั้นตอนทั้งหมดให้สำเร็จก่อน')
        return
      }

      loading.value = true
      try {
        const result = await workflowStore.generateWorkflow()
        if (result.success) {
          generatedAt.value = new Date().toLocaleString('th-TH')
        }
      } catch (error) {
        console.error('Generate workflow error:', error)
      } finally {
        loading.value = false
      }
    }

    const exportToText = () => {
      const textContent = generateTextExport()
      const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `workflow-summary-${new Date().toISOString().split('T')[0]}.txt`
      a.click()
      URL.revokeObjectURL(url)
    }

    const exportToPDF = () => {
      // Placeholder for PDF export
      alert('ฟังก์ชันส่งออก PDF จะเปิดให้ใช้งานเร็วๆ นี้')
    }

    const exportToJSON = () => {
      const jsonContent = JSON.stringify(workflowStore.getWorkflowData(), null, 2)
      const blob = new Blob([jsonContent], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `workflow-data-${new Date().toISOString().split('T')[0]}.json`
      a.click()
      URL.revokeObjectURL(url)
    }

    const shareResults = () => {
      const shareText = `EA Flow Builder - สรุปผล Workflow\nความคืบหน้า: ${Math.round(progress.value)}%\nสำเร็จ ${completedPhases.value.length}/${totalPhases.value} ขั้นตอน`
      
      if (navigator.share) {
        navigator.share({
          title: 'EA Flow Builder - สรุปผล Workflow',
          text: shareText
        })
      } else {
        navigator.clipboard.writeText(shareText)
        alert('คัดลอกข้อมูลไปยังคลิปบอร์ดแล้ว')
      }
    }

    const generateTextExport = () => {
      let content = 'EA Flow Builder - สรุปผล Workflow\n'
      content += '=' .repeat(50) + '\n\n'
      content += `สร้างเมื่อ: ${generatedAt.value}\n`
      content += `ความคืบหน้า: ${Math.round(progress.value)}%\n`
      content += `สำเร็จ: ${completedPhases.value.length}/${totalPhases.value} ขั้นตอน\n\n`

      content += 'ข้อมูลต่อไปนี้คือผลลัพธ์จากแต่ละขั้นตอน:\n\n'

      phases.value.forEach(phase => {
        if (phase.completed) {
          content += `--- ${phase.title} ---\n`
          content += `${phase.description}\n`
          if (phase.data && Object.keys(phase.data).length > 0) {
            Object.entries(phase.data).forEach(([key, value]) => {
              content += `${formatKey(key)}: ${formatValue(value)}\n`
            })
          }
          content += '\n'
        }
      })

      if (workflowResult.value) {
        content += '--- ผลลัพธ์ Workflow สุดท้าย ---\n'
        content += workflowResult.value + '\n'
      }

      return content
    }

    const goToDashboard = () => {
      router.push('/dashboard')
    }

    const startNewWorkflow = () => {
      if (confirm('คุณต้องการเริ่ม workflow ใหม่ทั้งหมดหรือไม่? ข้อมูลทั้งหมดจะถูกลบไป')) {
        workflowStore.resetAllPhases()
        router.push('/dashboard')
      }
    }

    return {
      sidebarOpen,
      loading,
      phases,
      progress,
      completedPhases,
      totalPhases,
      workflowResult,
      estimatedTime,
      generatedAt,
      toggleSidebar,
      closeSidebar,
      formatKey,
      formatValue,
      generateWorkflow,
      exportToText,
      exportToPDF,
      exportToJSON,
      shareResults,
      goToDashboard,
      startNewWorkflow
    }
  }
}
</script>
