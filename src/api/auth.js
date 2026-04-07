import { request } from './index.js'
import axios from 'axios'

// 用户登录
export const login = (data) => {
  return request({
    url: '/api/auth/login',
    method: 'POST',
    data
  })
}

// 刷新 Token（直接用 axios，不走拦截器，避免死循环）
export const refreshTokenApi = (refreshToken) => {
  return axios.post('/api/auth/refresh', { refreshToken })
}

// 退出登录
export const logout = () => {
  return request({
    url: '/api/auth/logout',
    method: 'POST'
  })
}
