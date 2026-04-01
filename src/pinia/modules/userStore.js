import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserStore = defineStore('user', () => {
  const userInfo = ref(null)
  const token = ref('')

  const setUserInfo = (info) => {
    userInfo.value = info
  }

  const setToken = (val) => {
    token.value = val
    uni.setStorageSync('token', val)
  }

  const logout = () => {
    userInfo.value = null
    token.value = ''
    uni.removeStorageSync('token')
  }

  return {
    userInfo,
    token,
    setUserInfo,
    setToken,
    logout
  }
}, {
  persist: true
})
