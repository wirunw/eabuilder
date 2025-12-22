<template>
  <form @submit.prevent="$emit('submit')" class="space-y-8">
    <!-- Workflow Steps Section -->
    <div>
      <h2 class="text-xl font-semibold text-gray-900 mb-6">ขั้นตอนใน Workflow</h2>
      
      <div class="space-y-4">
        <div v-for="(step, index) in formData.steps" :key="index" class="flex items-center space-x-3">
          <div class="flex items-center space-x-2">
            <span class="w-8 h-8 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center font-semibold text-sm">
              {{ index + 1 }}
            </span>
            <svg v-if="index < formData.steps.length - 1" class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
            </svg>
          </div>
          <input
            :value="step"
            @input="updateStep(index, $event.target.value)"
            type="text"
            class="form-textarea flex-1"
            placeholder="ระบุขั้นตอน..."
          />
          <button
            type="button"
            @click="removeStep(index)"
            class="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
            </svg>
          </button>
        </div>
        
        <button
          type="button"
          @click="addStep"
          class="flex items-center space-x-2 p-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-400 hover:bg-primary-50 transition-colors text-gray-600 hover:text-primary-600"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
          </svg>
          <span>เพิ่มขั้นตอน</span>
        </button>
      </div>

      <!-- Workflow Preview -->
      <div v-if="formData.steps.length > 0" class="mt-8 p-6 bg-gray-50 rounded-lg">
        <h3 class="text-lg font-medium text-gray-900 mb-4">ตัวอย่างลำดับขั้นตอน:</h3>
        <div class="flex flex-wrap items-center gap-2">
          <span v-for="(step, index) in formData.steps.filter(s => s.trim())" :key="index" 
                class="px-3 py-2 bg-white border border-gray-200 rounded-md text-sm">
            {{ index + 1 }}. {{ step }}
            <svg v-if="index < formData.steps.filter(s => s.trim()).length - 1" class="w-4 h-4 text-gray-400 inline-block ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
            </svg>
          </span>
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
          <p class="text-sm text-blue-800 whitespace-pre-line">{{ aiSuggestion }}</p>
        </div>
      </div>
    </div>
  </form>
</template>

<script>
export default {
  name: 'Phase4Content',
  props: {
    formData: {
      type: Object,
      required: true
    },
    aiSuggestion: {
      type: String,
      default: ''
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  emits: ['update-form-data', 'get-ai-suggestion', 'submit'],
  methods: {
    addStep() {
      const newSteps = [...this.formData.steps, '']
      this.$emit('update-form-data', { steps: newSteps })
    },
    removeStep(index) {
      const newSteps = this.formData.steps.filter((_, i) => i !== index)
      this.$emit('update-form-data', { steps: newSteps })
    },
    updateStep(index, value) {
      const newSteps = [...this.formData.steps]
      newSteps[index] = value
      this.$emit('update-form-data', { steps: newSteps })
    }
  }
}
</script>
