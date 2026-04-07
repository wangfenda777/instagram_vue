import axios from 'axios'
import { useUserStore } from '@/pinia/modules/userStore.js'
import { refreshTokenApi } from './auth.js'

const service = axios.create({
  timeout: 10000
})

// 刷新状态
let isRefreshing = false
let pendingQueue = []

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
    } else if (code === 401) {
      const userStore = useUserStore()
      const originalConfig = response.config

      // 没有 refreshToken，直接跳登录
      if (!userStore.refreshToken) {
        goLogin(userStore)
        return Promise.reject(new Error('未登录'))
      }

      // 如果正在刷新，排队等待
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          pendingQueue.push({ resolve, reject, config: originalConfig })
        })
      }

      // 开始刷新
      isRefreshing = true
      return refreshTokenApi(userStore.refreshToken)
        .then((res) => {
          const { code: refreshCode, data: refreshData } = res.data

          if (refreshCode === 200) {
            // 刷新成功，更新 token
            userStore.setAuth(refreshData)

            // 重发队列中的请求
            pendingQueue.forEach(({ resolve, config }) => {
              config.headers.Authorization = `Bearer ${refreshData.token}`
              resolve(service(config))
            })

            // 重发当前请求
            originalConfig.headers.Authorization = `Bearer ${refreshData.token}`
            return service(originalConfig)
          } else {
            // refreshToken 也过期了
            pendingQueue.forEach(({ reject }) => reject(new Error('登录过期')))
            goLogin(userStore)
            return Promise.reject(new Error('登录过期'))
          }
        })
        .catch(() => {
          pendingQueue.forEach(({ reject }) => reject(new Error('登录过期')))
          goLogin(userStore)
          return Promise.reject(new Error('登录过期'))
        })
        .finally(() => {
          isRefreshing = false
          pendingQueue = []
        })
    } else {
      uni.showToast({ title: message || '请求失败', icon: 'none' })
      return Promise.reject(new Error(message))
    }
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
