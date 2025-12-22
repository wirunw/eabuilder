<template>
  <form @submit.prevent="$emit('submit')" class="space-y-8">
    <!-- Usage Level Section -->
    <div class="border-b border-gray-200 pb-8">
      <h2 class="text-xl font-semibold text-gray-900 mb-6">ระดับการใช้งาน Workflow</h2>
      
      <div class="space-y-4">
        <label class="flex items-start space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
               :class="{ 'border-primary-500 bg-primary-50': formData.usageLevel === 'internal' }">
          <input
            :checked="formData.usageLevel === 'internal'"
            @input="$emit('update-form-data', { usageLevel: $event.target.value })"
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
            :checked="formData.usageLevel === 'external'"
            @input="$emit('update-form-data', { usageLevel: $event.target.value })"
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
            :checked="formData.usageLevel === 'mixed'"
            @input="$emit('update-form-data', { usageLevel: $event.target.value })"
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
            :value="formData.department"
            @input="$emit('update-form-data', { department: $event.target.value })"
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
            :value="formData.stakeholders"
            @input="$emit('update-form-data', { stakeholders: $event.target.value })"
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
            :value="formData.context"
            @input="$emit('update-form-data', { context: $event.target.value })"
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
  </form>
</template>

<script>
export default {
  name: 'Phase1Content',
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
  emits: ['update-form-data', 'get-ai-suggestion', 'submit']
}
</script>
