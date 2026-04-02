import { ref } from 'vue'

export const useLogin = () => {
  const isLoggedIn = ref(false)
  const token = ref('')

  const login = (username, password) => {
    if (username && password) {
      token.value = 'mock_token_' + Date.now()
      isLoggedIn.value = true
      
      uni.setStorageSync('token', token.value)
      uni.setStorageSync('isLoggedIn', true)
      
      uni.switchTab({
        url: '/pages/index/index'
      })
    }
  }

  const logout = () => {
    token.value = ''
    isLoggedIn.value = false
    uni.removeStorageSync('token')
    uni.removeStorageSync('isLoggedIn')
  }

  const checkLogin = () => {
    const storedToken = uni.getStorageSync('token')
    const storedIsLoggedIn = uni.getStorageSync('isLoggedIn')
    if (storedToken && storedIsLoggedIn) {
      token.value = storedToken
      isLoggedIn.value = true
      return true
    }
    return false
  }

  return {
    isLoggedIn,
    token,
    login,
    logout,
    checkLogin
  }
}