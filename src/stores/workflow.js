import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useWorkflowStore = defineStore('workflow', () => {
  // State
  const currentPhase = ref(1)
  const phases = ref([
    {
      id: 1,
      name: 'Phase 1: Context Analysis',
      title: 'วิเคราะห์บริบท (Context Analysis)',
      description: 'กำหนดระดับการใช้งาน (ภายในองค์กร หรือ ระหว่างองค์กร)',
      icon: '🎯',
      completed: false,
      data: {}
    },
    {
      id: 2,
      name: 'Phase 2: Goal & Target Setting',
      title: 'กำหนดเป้าหมาย (Goal & Target Setting)',
      description: 'กำหนดเป้าหมายทางธุรกิจ และวัตถุประสงค์ของ workflow ที่จะสร้าง',
      icon: '🎯',
      completed: false,
      data: {}
    },
    {
      id: 3,
      name: 'Phase 3: Scope Definition',
      title: 'กำหนดขอบเขต (Scope Definition)',
      description: 'กำหนดขอบเขตของ workflow: หน่วยงาน/แผนก ตำแหน่งที่เกี่ยวข้องทั้งหมดใน workflow',
      icon: '📋',
      completed: false,
      data: {}
    },
    {
      id: 4,
      name: 'Phase 4: Workflow Step Sequence',
      title: 'ลำดับขั้นตอน Workflow',
      description: 'AI ช่วยคิดขั้นตอนทั้งหมดใน workflow',
      icon: '🔄',
      completed: false,
      data: {}
    },
    {
      id: 5,
      name: 'Phase 5: Workflow Diagram Generation',
      title: 'สร้างผังภาพ workflow',
      description: 'แปลงขั้นตอนทั้งหมดเป็น PowerPoint diagram (AI สร้างให้)',
      icon: '📊',
      completed: false,
      data: {}
    },
    {
      id: 6,
      name: 'Phase 6: Workflow Refinement',
      title: 'ปรับปรุงและแก้ไข Workflow',
      description: 'ปรับปรุงและแก้ไข workflow ตามความเหมาะสม',
      icon: '✏️',
      completed: false,
      data: {}
    }
  ])

  const loading = ref(false)
  const error = ref(null)
  const workflowResult = ref(null)

  // Getters
  const currentPhaseData = computed(() => phases.value.find(p => p.id === currentPhase.value))
  const isCurrentPhaseCompleted = computed(() => currentPhaseData.value?.completed || false)
  const progress = computed(() => {
    const completedPhases = phases.value.filter(p => p.completed).length
    return (completedPhases / phases.value.length) * 100
  })
  const canProceedToNext = computed(() => {
    return isCurrentPhaseCompleted.value && currentPhase.value < phases.value.length
  })
  const canGoToPrevious = computed(() => currentPhase.value > 1)

  // Actions
  const setCurrentPhase = (phaseId) => {
    if (phaseId >= 1 && phaseId <= phases.value.length) {
      currentPhase.value = phaseId
    }
  }

  const nextPhase = () => {
    if (canProceedToNext.value) {
      currentPhase.value++
    }
  }

  const previousPhase = () => {
    if (canGoToPrevious.value) {
      currentPhase.value--
    }
  }

  const updatePhaseData = (phaseId, data) => {
    const phase = phases.value.find(p => p.id === phaseId)
    if (phase) {
      phase.data = { ...phase.data, ...data }
    }
  }

  const markPhaseCompleted = (phaseId, completed = true) => {
    const phase = phases.value.find(p => p.id === phaseId)
    if (phase) {
      phase.completed = completed
    }
  }

  const resetPhase = (phaseId) => {
    const phase = phases.value.find(p => p.id === phaseId)
    if (phase) {
      phase.data = {}
      phase.completed = false
    }
  }

  const resetAllPhases = () => {
    phases.value.forEach(phase => {
      phase.data = {}
      phase.completed = false
    })
    currentPhase.value = 1
    workflowResult.value = null
  }

  // AI Integration Actions
  const callOpenAI = async (prompt, phaseId) => {
    loading.value = true
    error.value = null

    try {
      const response = await fetch('/.netlify/functions/openai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          phaseId,
          workflowData: getWorkflowData()
        })
      })

      const data = await response.json()

      if (response.ok) {
        updatePhaseData(phaseId, { aiResponse: data.result })
        return { success: true, result: data.result }
      } else {
        error.value = data.error || 'AI service error'
        return { success: false, error: data.error }
      }
    } catch (err) {
      error.value = 'Network error. Please try again.'
      return { success: false, error: 'Network error' }
    } finally {
      loading.value = false
    }
  }

  const generateWorkflow = async (customInstructions = '') => {
    loading.value = true
    error.value = null

    try {
      const response = await fetch('/.netlify/functions/openai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'generate_workflow',
          workflowData: getWorkflowData(),
          customInstructions
        })
      })

      const data = await response.json()

      if (response.ok) {
        workflowResult.value = data.result
        markPhaseCompleted(6)
        return { success: true, result: data.result }
      } else {
        error.value = data.error || 'Failed to generate workflow'
        return { success: false, error: data.error }
      }
    } catch (err) {
      error.value = 'Network error. Please try again.'
      return { success: false, error: 'Network error' }
    } finally {
      loading.value = false
    }
  }

  // Helper Functions
  const getWorkflowData = () => {
    const data = {}
    phases.value.forEach(phase => {
      data[phase.id] = phase.data
    })
    return data
  }

  const getCompletedPhases = () => {
    return phases.value.filter(p => p.completed)
  }

  const getPhaseById = (phaseId) => {
    return phases.value.find(p => p.id === phaseId)
  }

  return {
    // State
    currentPhase,
    phases,
    loading,
    error,
    workflowResult,

    // Getters
    currentPhaseData,
    isCurrentPhaseCompleted,
    progress,
    canProceedToNext,
    canGoToPrevious,

    // Actions
    setCurrentPhase,
    nextPhase,
    previousPhase,
    updatePhaseData,
    markPhaseCompleted,
    resetPhase,
    resetAllPhases,
    callOpenAI,
    generateWorkflow,

    // Helpers
    getWorkflowData,
    getCompletedPhases,
    getPhaseById
  }
})
