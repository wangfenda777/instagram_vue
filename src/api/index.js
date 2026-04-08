import axios from 'axios'
import { useUserStore } from '@/pinia/modules/userStore.js'

const service = axios.create({
  timeout: 10000
})

// 请求拦截器
service.interceptors.request.use((config) => {
  const userStore = useUserStore()
  if (userStore.token) {
    config.headers.Authorization = `Bearer ${userStore.token}`
  }
  return config
})

// 响应拦截器
service.interceptors.response.use(
  (response) => {
    const { code, message, data } = response.data

    if (code === 200) {
      return data
    }

    if (code === 401) {
      const userStore = useUserStore()
      goLogin(userStore)
      return Promise.reject(new Error(message || '未登录'))
    }

    uni.showToast({ title: message || '请求失败', icon: 'none' })
    return Promise.reject(new Error(message))
  },
  (error) => {
    uni.showToast({ title: '网络错误', icon: 'none' })
    return Promise.reject(error)
  }
)

function goLogin(userStore) {
  userStore.clearAuth()
  uni.navigateTo({ url: '/pages/login/login' })
}

// 保持与现有 API 文件的调用方式兼容
export const request = (options) => {
  return service({
    url: options.url,
    method: options.method || 'GET',
    [options.method === 'POST' ? 'data' : 'params']: options.data || {}
  })
}
