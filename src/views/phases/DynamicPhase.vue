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

        <!-- Phase Content -->
        <div class="bg-white rounded-xl shadow-lg p-8">
          <!-- Phase 1: Context Analysis -->
          <div v-if="currentPhaseId === 1">
            <Phase1Content 
              :form-data="formData" 
              :ai-suggestion="aiSuggestion" 
              :loading="loading"
              @update-form-data="updateFormData"
              @get-ai-suggestion="getAISuggestion"
            />
          </div>

          <!-- Phase 2: Goal & Target Setting -->
          <div v-else-if="currentPhaseId === 2">
            <Phase2Content 
              :form-data="formData" 
              :ai-suggestion="aiSuggestion" 
              :loading="loading"
              @update-form-data="updateFormData"
              @get-ai-suggestion="getAISuggestion"
            />
          </div>

          <!-- Phase 3: Scope Definition -->
          <div v-else-if="currentPhaseId === 3">
            <Phase3Content 
              :form-data="formData" 
              :ai-suggestion="aiSuggestion" 
              :loading="loading"
              @update-form-data="updateFormData"
              @get-ai-suggestion="getAISuggestion"
            />
          </div>

          <!-- Phase 4: Workflow Step Sequence -->
          <div v-else-if="currentPhaseId === 4">
            <Phase4Content 
              :form-data="formData" 
              :ai-suggestion="aiSuggestion" 
              :loading="loading"
              @update-form-data="updateFormData"
              @get-ai-suggestion="getAISuggestion"
            />
          </div>

          <!-- Phase 5: Workflow Diagram Generation -->
          <div v-else-if="currentPhaseId === 5">
            <Phase5Content 
              :form-data="formData" 
              :ai-suggestion="aiSuggestion" 
              :loading="loading"
              @update-form-data="updateFormData"
              @get-ai-suggestion="getAISuggestion"
            />
          </div>

          <!-- Phase 6: Workflow Refinement -->
          <div v-else-if="currentPhaseId === 6">
            <Phase6Content 
              :form-data="formData" 
              :ai-suggestion="aiSuggestion" 
              :loading="loading"
              @update-form-data="updateFormData"
              @get-ai-suggestion="getAISuggestion"
            />
          </div>

          <!-- Action Buttons -->
          <div class="flex items-center justify-between pt-6">
            <button
              type="button"
              @click="getAISuggestion"
              :disabled="loading || !canGetAISuggestion"
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
                type="button"
                @click="handleSubmit"
                :disabled="!isFormValid || loading"
                class="px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-lg hover:from-primary-700 hover:to-primary-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {{ isLastPhase ? 'สรุปผล' : 'ถัดไป' }}
              </button>
            </div>
          </div>
        </div>

        <!-- Navigation Info -->
        <div class="mt-8 bg-gray-100 rounded-lg p-6">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="font-medium text-gray-900">{{ isLastPhase ? 'ขั้นตอนสุดท้าย' : 'ขั้นตอนถัดไป' }}</h3>
              <p class="text-sm text-gray-600">{{ isLastPhase ? 'สรุปผลลัพธ์ทั้งหมด' : nextPhaseData?.description }}</p>
            </div>
            <div class="text-right">
              <p class="text-sm text-gray-500">{{ isLastPhase ? 'สรุป' : `Phase ${nextPhaseData?.id}` }}:</p>
              <p class="font-medium text-gray-900">{{ isLastPhase ? 'Summary' : nextPhaseData?.title }}</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import Header from '@/components/layout/Header.vue'
import Sidebar from '@/components/layout/Sidebar.vue'
import { useWorkflowStore } from '@/stores/workflow'

// Import phase content components
import Phase1Content from '@/components/phases/Phase1Content.vue'
import Phase2Content from '@/components/phases/Phase2Content.vue'
import Phase3Content from '@/components/phases/Phase3Content.vue'
import Phase4Content from '@/components/phases/Phase4Content.vue'
import Phase5Content from '@/components/phases/Phase5Content.vue'
import Phase6Content from '@/components/phases/Phase6Content.vue'

export default {
  name: 'DynamicPhase',
  components: {
    Header,
    Sidebar,
    Phase1Content,
    Phase2Content,
    Phase3Content,
    Phase4Content,
    Phase5Content,
    Phase6Content
  },
  setup() {
    const router = useRouter()
    const route = useRoute()
    const workflowStore = useWorkflowStore()
    
    const sidebarOpen = ref(false)
    const loading = ref(false)
    const aiSuggestion = ref('')
    const currentPhaseId = ref(parseInt(route.params.id))

    const formData = ref({
      // Phase 1 fields
      usageLevel: '',
      // Phase 2 fields
      businessGoals: [''],
      businessObjectives: [''],
      kpis: [''],
      // Phase 3 fields
      scopeDescription: '',
      departments: [''],
      relatedPositions: [''],
      // Phase 4 fields
      steps: [''],
      // Phase 5 fields
      riskAssessment: '',
      challenges: [''],
      successFactors: [''],
      // Phase 6 fields
      currentState: '',
      improvements: [''],
      benefits: ['']
    })

    const currentPhaseData = computed(() => workflowStore.currentPhaseData)
    const progress = computed(() => workflowStore.progress)
    const totalPhases = computed(() => workflowStore.phases.length)
    const nextPhaseData = computed(() => workflowStore.phases.find(p => p.id === currentPhaseId.value + 1))
    const isLastPhase = computed(() => currentPhaseId.value === totalPhases.value)

    const isFormValid = computed(() => {
      switch (currentPhaseId.value) {
        case 1:
          return formData.value.usageLevel && formData.value.usageLevel.trim() !== ''
        case 2:
          return formData.value.businessGoals.some(g => g.trim()) && 
                 formData.value.businessObjectives.some(o => o.trim()) && 
                 formData.value.kpis.some(k => k.trim())
        case 3:
          return formData.value.scopeDescription && formData.value.scopeDescription.trim() !== '' && 
                 formData.value.departments.some(d => d.trim())
        case 4:
          return formData.value.steps.some(s => s.trim())
        case 5:
          return formData.value.riskAssessment && formData.value.riskAssessment.trim() !== ''
        case 6:
          return formData.value.currentState && formData.value.currentState.trim() !== ''
        default:
          return false
      }
    })

    const canGetAISuggestion = computed(() => {
      switch (currentPhaseId.value) {
        case 1:
          return formData.value.usageLevel && formData.value.usageLevel.trim() !== ''
        case 2:
          return formData.value.businessGoals.some(g => g.trim()) || 
                 formData.value.businessObjectives.some(o => g.trim())
        case 3:
          return formData.value.scopeDescription && formData.value.scopeDescription.trim() !== ''
        case 4:
          return formData.value.steps.some(s => s.trim())
        case 5:
          return formData.value.riskAssessment && formData.value.riskAssessment.trim() !== ''
        case 6:
          return formData.value.currentState && formData.value.currentState.trim() !== ''
        default:
          return false
      }
    })

    const toggleSidebar = () => {
      sidebarOpen.value = !sidebarOpen.value
    }

    const closeSidebar = () => {
      sidebarOpen.value = false
    }

    const updateFormData = (newData) => {
      formData.value = { ...formData.value, ...newData }
    }

    const getAISuggestion = async () => {
      if (!canGetAISuggestion.value) return

      loading.value = true
      try {
        let prompt = ''
        
        switch (currentPhaseId.value) {
          case 1:
            prompt = `ให้คำแนะนำสำหรับการสร้าง workflow ในระดับ${formData.value.usageLevel === 'internal' ? 'ภายในองค์กร' : formData.value.usageLevel === 'external' ? 'ระหว่างองค์กร' : 'ผสมผสน'} พร้อมข้อมูลเพิ่มเติม: แผนก ${formData.value.department || 'ไม่ระบุ'}, ผู้มีส่วนได้ส่วนเสีย: ${formData.value.stakeholders || 'ไม่ระบุ'}, บริบท: ${formData.value.context || 'ไม่ระบุ'}`
            break
          case 2:
            prompt = `ให้คำแนะนำเพิ่มเติมสำหรับเป้าหมายและวัตถุประสงค์ของ workflow โดยมีเป้าหมาย: ${formData.value.goals.join(', ')}, วัตถุประสงค์: ${formData.value.objectives.join(', ')}, KPIs: ${formData.value.kpis.join(', ')}`
            break
          case 3:
            prompt = `ให้คำแนะนำเพิ่มเติมสำหรับการกำหนดขอบเขต workflow โดยมีขอบเขต: ${formData.value.scope}, แผนกที่เกี่ยวข้อง: ${formData.value.departments.join(', ')}, ตำแหน่ง: ${formData.value.positions.join(', ')}`
            break
          case 4:
            prompt = `ให้คำแนะนำเพิ่มเติมสำหรับขั้นตอนใน workflow โดยมีขั้นตอนปัจจุบัน: ${formData.value.steps.join(' -> ')}`
            break
          case 5:
            prompt = `ให้คำแนะนำสำหรับการสร้าง diagram ของ workflow`
            break
          case 6:
            prompt = `ให้คำแนะนำสำหรับการปรับปรุง workflow โดยมีการปรับปรุงที่ต้องการ: ${formData.value.refinements.join(', ')}`
            break
        }
        
        const result = await workflowStore.callOpenAI(prompt, currentPhaseId.value)
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
        workflowStore.updatePhaseData(currentPhaseId.value, formData.value)
        workflowStore.markPhaseCompleted(currentPhaseId.value)
        
        // Navigate to next phase or summary
        if (isLastPhase.value) {
          router.push('/summary')
        } else {
          workflowStore.setCurrentPhase(currentPhaseId.value + 1)
          router.push(`/phase/${currentPhaseId.value + 1}`)
        }
      } catch (error) {
        console.error('Submit error:', error)
      }
    }

    const goToPrevious = () => {
      if (currentPhaseId.value > 1) {
        router.push(`/phase/${currentPhaseId.value - 1}`)
      } else {
        router.push('/dashboard')
      }
    }

    // Watch for route changes
    watch(() => route.params.id, (newId) => {
      currentPhaseId.value = parseInt(newId)
      workflowStore.setCurrentPhase(currentPhaseId.value)
      
      // Load existing data for the new phase
      const existingData = workflowStore.getPhaseById(currentPhaseId.value)?.data
      if (existingData) {
        formData.value = { ...formData.value, ...existingData }
      }
      
      // Reset AI suggestion when changing phases
      aiSuggestion.value = ''
    })

    // Load existing data on mount
    onMounted(() => {
      workflowStore.setCurrentPhase(currentPhaseId.value)
      const existingData = workflowStore.getPhaseById(currentPhaseId.value)?.data
      if (existingData) {
        formData.value = { ...formData.value, ...existingData }
      }
    })

    return {
      sidebarOpen,
      loading,
      aiSuggestion,
      formData,
      currentPhaseId,
      currentPhaseData,
      progress,
      totalPhases,
      nextPhaseData,
      isLastPhase,
      isFormValid,
      canGetAISuggestion,
      toggleSidebar,
      closeSidebar,
      updateFormData,
      getAISuggestion,
      handleSubmit,
      goToPrevious
    }
  }
}
</script>
