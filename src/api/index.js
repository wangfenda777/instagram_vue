const BASE_URL = 'https://api.example.com'

// 请求拦截器
const requestInterceptor = (config) => {
  const token = uni.getStorageSync('token')
  if (token) {
    config.header.Authorization = `Bearer ${token}`
  }
  return config
}

// 响应拦截器
const responseInterceptor = (response) => {
  const { code, message, data } = response.data

  if (code === 200) {
    return data
  } else if (code === 401) {
    uni.removeStorageSync('token')
    uni.navigateTo({ url: '/pages/login/login' })
    return Promise.reject(new Error('未登录'))
  } else {
    uni.showToast({ title: message || '请求失败', icon: 'none' })
    return Promise.reject(new Error(message))
  }
}

// 封装请求方法
export const request = (options) => {
  return new Promise((resolve, reject) => {
    const config = requestInterceptor({
      url: BASE_URL + options.url,
      method: options.method || 'GET',
      data: options.data || {},
      header: options.header || {}
    })

    uni.request({
      ...config,
      success: (res) => {
        resolve(responseInterceptor(res))
      },
      fail: (err) => {
        uni.showToast({ title: '网络错误', icon: 'none' })
        reject(err)
      }
    })
  })
}
