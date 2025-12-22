<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <Header @toggle-sidebar="toggleSidebar" />
    
    <!-- Sidebar -->
    <Sidebar :is-open="sidebarOpen" @close-sidebar="closeSidebar" />

    <!-- Main Content -->
    <main class="pt-16">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <!-- Phase Header -->
        <div class="mb-8">
          <div class="flex items-center space-x-4 mb-4">
            <div class="w-16 h-16 bg-gradient-to-r from-primary-50 to-primary-100 rounded-xl flex items-center justify-center">
              <span class="text-3xl">{{ currentPhaseData.icon }}</span>
            </div>
            <div>
              <h1 class="text-3xl font-bold text-gray-900">{{ currentPhaseData.title }}</h1>
              <p class="text-gray-600">{{ currentPhaseData.description }}</p>
            </div>
          </div>
          
          <!-- Progress Bar -->
          <div class="bg-white rounded-lg p-4 shadow-sm">
            <div class="flex items-center justify-between mb-2">
              <span class="text-sm font-medium text-gray-700">ขั้นตอนที่ {{ currentPhaseData.id }} จาก {{ totalPhases }}</span>
              <span class="text-sm text-gray-500">{{ Math.round(progress) }}% สำเร็จ</span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-2">
              <div 
                class="bg-gradient-to-r from-primary-600 to-primary-700 h-2 rounded-full transition-all duration-500"
                :style="{ width: `${progress}%` }"
              ></div>
            </div>
          </div>
        </div>

        <!-- Main Form -->
        <div class="bg-white rounded-xl shadow-lg p-8">
          <form @submit.prevent="handleSubmit" class="space-y-8">
            <!-- Usage Level Section -->
            <div class="border-b border-gray-200 pb-8">
              <h2 class="text-xl font-semibold text-gray-900 mb-6">ระดับการใช้งาน Workflow</h2>
              
              <div class="space-y-4">
                <label class="flex items-start space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                       :class="{ 'border-primary-500 bg-primary-50': formData.usageLevel === 'internal' }">
                  <input
                    v-model="formData.usageLevel"
                    type="radio"
                    value="internal"
                    class="mt-1 w-4 h-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                  />
                  <div class="flex-1">
                    <div class="font-medium text-gray-900">ภายในองค์กร</div>
                    <p class="text-sm text-gray-600 mt-1">Workflow สำหรับใช้ภายในบริษัท ไม่เกี่ยวข้องกับภายนอก</p>
                  </div>
                </label>

                <label class="flex items-start space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                       :class="{ 'border-primary-500 bg-primary-50': formData.usageLevel === 'external' }">
                  <input
                    v-model="formData.usageLevel"
                    type="radio"
                    value="external"
                    class="mt-1 w-4 h-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                  />
                  <div class="flex-1">
                    <div class="font-medium text-gray-900">ระหว่างองค์กร</div>
                    <p class="text-sm text-gray-600 mt-1">Workflow ที่เกี่ยวข้องกับหน่วยงานภายนอก เช่น ลูกค้า ผู้จัดจำหน่าย</p>
                  </div>
                </label>

                <label class="flex items-start space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                       :class="{ 'border-primary-500 bg-primary-50': formData.usageLevel === 'mixed' }">
                  <input
                    v-model="formData.usageLevel"
                    type="radio"
                    value="mixed"
                    class="mt-1 w-4 h-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                  />
                  <div class="flex-1">
                    <div class="font-medium text-gray-900">ผสมผสน</div>
                    <p class="text-sm text-gray-600 mt-1">Workflow ที่มีทั้งส่วนภายในและภายนอกองค์กร</p>
                  </div>
                </label>
              </div>
            </div>

            <!-- Additional Context -->
            <div>
              <h2 class="text-xl font-semibold text-gray-900 mb-6">ข้อมูลเพิ่มเติม (ถ้ามี)</h2>
              
              <div class="space-y-6">
                <div>
                  <label for="department" class="block text-sm font-medium text-gray-700 mb-2">
                    แผนก/หน่วยงานหลัก
                  </label>
                  <input
                    id="department"
                    v-model="formData.department"
                    type="text"
                    class="form-textarea"
                    placeholder="เช่น แผนกการเงิน, แผนกบุคคล, แผนกขายและการตลาด"
                  />
                </div>

                <div>
                  <label for="stakeholders" class="block text-sm font-medium text-gray-700 mb-2">
                    ผู้มีส่วนได้ส่วนเสียหลัก (Stakeholders)
                  </label>
                  <textarea
                    id="stakeholders"
                    v-model="formData.stakeholders"
                    rows="3"
                    class="form-textarea"
                    placeholder="ระบุผู้มีส่วนได้ส่วนเสียที่เกี่ยวข้องกับ workflow นี้..."
                  ></textarea>
                </div>

                <div>
                  <label for="context" class="block text-sm font-medium text-gray-700 mb-2">
                    บริบทเพิ่มเติม
                  </label>
                  <textarea
                    id="context"
                    v-model="formData.context"
                    rows="4"
                    class="form-textarea"
                    placeholder="บรรยายรายละเอียดเพิ่มเติมเกี่ยวกับบริบทของ workflow ที่ต้องการสร้าง..."
                  ></textarea>
                </div>
              </div>
            </div>

            <!-- AI Suggestion Section -->
            <div v-if="aiSuggestion" class="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <div class="flex items-start space-x-3">
                <div class="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                  </svg>
                </div>
                <div class="flex-1">
                  <h3 class="font-medium text-blue-900 mb-2">คำแนะนำจาก AI</h3>
                  <p class="text-sm text-blue-800">{{ aiSuggestion }}</p>
                </div>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="flex items-center justify-between pt-6">
              <button
                type="button"
                @click="getAISuggestion"
                :disabled="loading || !formData.usageLevel"
                class="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-secondary-500 to-secondary-600 text-white rounded-lg hover:from-secondary-600 hover:to-secondary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <svg v-if="loading" class="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle>
                  <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span v-else>
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                  </svg>
                </span>
                <span>{{ loading ? 'กำลังวิเคราะห์...' : 'ขอคำแนะนำจาก AI' }}</span>
              </button>

              <div class="flex items-center space-x-4">
                <button
                  type="button"
                  @click="goToPrevious"
                  class="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  ย้อนกลับ
                </button>
                <button
                  type="submit"
                  :disabled="!isFormValid || loading"
                  class="px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-lg hover:from-primary-700 hover:to-primary-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  ถัดไป
                </button>
              </div>
            </div>
          </form>
        </div>

        <!-- Navigation Info -->
        <div class="mt-8 bg-gray-100 rounded-lg p-6">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="font-medium text-gray-900">ขั้นตอนถัดไป</h3>
              <p class="text-sm text-gray-600">กำหนดเป้าหมายและวัตถุประสงค์ของ workflow</p>
            </div>
            <div class="text-right">
              <p class="text-sm text-gray-500">Phase 2:</p>
              <p class="font-medium text-gray-900">Goal & Target Setting</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Header from '@/components/layout/Header.vue'
import Sidebar from '@/components/layout/Sidebar.vue'
import { useWorkflowStore } from '@/stores/workflow'

export default {
  name: 'Phase1',
  components: {
    Header,
    Sidebar
  },
  setup() {
    const router = useRouter()
    const workflowStore = useWorkflowStore()
    
    const sidebarOpen = ref(false)
    const loading = ref(false)
    const aiSuggestion = ref('')

    const formData = ref({
      usageLevel: '',
      department: '',
      stakeholders: '',
      context: ''
    })

    const currentPhaseData = computed(() => workflowStore.currentPhaseData)
    const progress = computed(() => workflowStore.progress)
    const totalPhases = computed(() => workflowStore.phases.length)

    const isFormValid = computed(() => {
      return formData.value.usageLevel.trim() !== ''
    })

    const toggleSidebar = () => {
      sidebarOpen.value = !sidebarOpen.value
    }

    const closeSidebar = () => {
      sidebarOpen.value = false
    }

    const getAISuggestion = async () => {
      if (!formData.value.usageLevel) return

      loading.value = true
      try {
        const prompt = `ให้คำแนะนำสำหรับการสร้าง workflow ในระดับ${formData.value.usageLevel === 'internal' ? 'ภายในองค์กร' : formData.value.usageLevel === 'external' ? 'ระหว่างองค์กร' : 'ผสมผสน'} พร้อมข้อมูลเพิ่มเติม: แผนก ${formData.value.department || 'ไม่ระบุ'}, ผู้มีส่วนได้ส่วนเสีย: ${formData.value.stakeholders || 'ไม่ระบุ'}, บริบท: ${formData.value.context || 'ไม่ระบุ'}`
        
        const result = await workflowStore.callOpenAI(prompt, 1)
        if (result.success) {
          aiSuggestion.value = result.result
        }
      } catch (error) {
        console.error('AI suggestion error:', error)
      } finally {
        loading.value = false
      }
    }

    const handleSubmit = async () => {
      if (!isFormValid.value) return

      try {
        // Save phase data
        workflowStore.updatePhaseData(1, formData.value)
        workflowStore.markPhaseCompleted(1)
        
        // Move to next phase
        workflowStore.setCurrentPhase(2)
        router.push('/phase/2')
      } catch (error) {
        console.error('Submit error:', error)
      }
    }

    const goToPrevious = () => {
      router.push('/dashboard')
    }

    // Load existing data if available
    onMounted(() => {
      const existingData = workflowStore.getPhaseById(1)?.data
      if (existingData) {
        formData.value = { ...formData.value, ...existingData }
      }
    })

    return {
      sidebarOpen,
      loading,
      aiSuggestion,
      formData,
      currentPhaseData,
      progress,
      totalPhases,
      isFormValid,
      toggleSidebar,
      closeSidebar,
      getAISuggestion,
      handleSubmit,
      goToPrevious
    }
  }
}
</script>
