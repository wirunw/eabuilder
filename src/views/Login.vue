<template>
  <div class="min-h-screen flex items-center justify-center px-4">
    <div class="max-w-md w-full">
      <!-- Login Card -->
      <div class="bg-white rounded-2xl shadow-2xl overflow-hidden slide-in-up">
        <!-- Header -->
        <div class="bg-gradient-to-r from-primary-600 to-primary-700 p-8 text-center">
          <div class="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
            <span class="text-2xl">🎯</span>
          </div>
          <h1 class="text-2xl font-bold text-white mb-2">EA Flow Builder</h1>
          <p class="text-primary-100 text-sm">Enterprise Architecture Workflow</p>
        </div>

        <!-- Login Form -->
        <div class="p-8">
          <form @submit.prevent="handleLogin" class="space-y-6">
            <!-- Username Field -->
            <div>
              <label for="username" class="block text-sm font-medium text-gray-700 mb-2">
                ชื่อผู้ใช้
              </label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                  </svg>
                </div>
                <input
                  id="username"
                  v-model="form.username"
                  type="text"
                  required
                  class="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all duration-200"
                  placeholder="กรอกชื่อผู้ใช้"
                />
              </div>
            </div>

            <!-- Password Field -->
            <div>
              <label for="password" class="block text-sm font-medium text-gray-700 mb-2">
                รหัสผ่าน
              </label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                  </svg>
                </div>
                <input
                  id="password"
                  v-model="form.password"
                  :type="showPassword ? 'text' : 'password'"
                  required
                  class="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all duration-200"
                  placeholder="กรอกรหัสผ่าน"
                />
                <button
                  type="button"
                  @click="showPassword = !showPassword"
                  class="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  <svg v-if="showPassword" class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"></path>
                  </svg>
                  <svg v-else class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                  </svg>
                </button>
              </div>
            </div>

            <!-- Remember Me & Forgot Password -->
            <div class="flex items-center justify-between">
              <label class="flex items-center">
                <input
                  v-model="form.remember"
                  type="checkbox"
                  class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <span class="ml-2 text-sm text-gray-600">จดจำฉันไว้</span>
              </label>
              <a href="#" class="text-sm text-primary-600 hover:text-primary-500">
                ลืมรหัสผ่าน?
              </a>
            </div>

            <!-- Login Button -->
            <button
              type="submit"
              :disabled="loading"
              class="w-full bg-gradient-to-r from-primary-600 to-primary-700 text-white py-3 px-4 rounded-lg font-medium hover:from-primary-700 hover:to-primary-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span v-if="loading" class="flex items-center justify-center">
                <div class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                กำลังเข้าสู่ระบบ...
              </span>
              <span v-else>เข้าสู่ระบบ</span>
            </button>
          </form>

          <!-- Demo Account Info -->
          <div class="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p class="text-sm text-blue-800">
              <strong>บัญชีทดสอบ:</strong><br>
              ชื่อผู้ใช้: admin<br>
              รหัสผ่าน: admin123
            </p>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="text-center mt-8 text-gray-600 text-sm">
        <p>&copy; 2025 EA Flow Builder. All rights reserved.</p>
        <p class="mt-2">Powered by OpenAI GPT-5.2 mini</p>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

export default {
  name: 'Login',
  setup() {
    const router = useRouter()
    const authStore = useAuthStore()
    
    const form = reactive({
      username: '',
      password: '',
      remember: false
    })
    
    const showPassword = ref(false)
    const loading = ref(false)

    const handleLogin = async () => {
      loading.value = true
      
      try {
        const result = await authStore.login({
          username: form.username,
          password: form.password
        })
        
        if (result.success) {
          router.push('/dashboard')
        }
      } catch (error) {
        console.error('Login error:', error)
      } finally {
        loading.value = false
      }
    }

    return {
      form,
      showPassword,
      loading,
      handleLogin
    }
  }
}
</script>
