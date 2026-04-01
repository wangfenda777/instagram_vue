import { request } from './index.js'

// 用户登录
export const login = (data) => {
  return request({
    url: '/api/user/login',
    method: 'POST',
    data
  })
}

// 获取用户信息
export const getUserInfo = (userId) => {
  return request({
    url: '/api/user/info',
    method: 'GET',
    data: { userId }
  })
}
