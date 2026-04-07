import { ref } from 'vue'
import { login as loginApi } from '@/api/auth.js'
import { useUserStore } from '@/pinia/modules/userStore.js'

export const useLogin = () => {
  const isLoggedIn = ref(false)

  const login = async (account, password) => {
    if (account && password) {
      try {
        const res = await loginApi({ account, password })
        const userStore = useUserStore()
        userStore.setAuth(res)
        isLoggedIn.value = true

        uni.switchTab({
          url: '/pages/index/index'
        })
      } catch (e) {
        // 接口封装层已有 toast 提示
      }
    }
  }

  const logout = () => {
    const userStore = useUserStore()
    userStore.clearAuth()
    isLoggedIn.value = false
  }

  const checkLogin = () => {
    const userStore = useUserStore()
    if (userStore.token) {
      isLoggedIn.value = true
      return true
    }
    return false
  }

  return {
    isLoggedIn,
    login,
    logout,
    checkLogin
  }
}
