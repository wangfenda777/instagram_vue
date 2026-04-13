import axios from 'axios'
import { useUserStore } from '@/pinia/modules/userStore.js'

// 上传图片
export const uploadImage = (file) => {
  const userStore = useUserStore()
  const formData = new FormData()
  formData.append('file', file)

  return axios.post('/api/upload/image', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      'Authorization': `Bearer ${userStore.token}`
    }
  }).then(res => {
    const { code, message, data } = res.data
    if (code === 200) {
      return data
    } else {
      uni.showToast({ title: message || '上传失败', icon: 'none' })
      return Promise.reject(new Error(message))
    }
  }).catch(err => {
    uni.showToast({ title: '上传失败', icon: 'none' })
    return Promise.reject(err)
  })
}

// 上传头像
export const uploadAvatar = (file) => {
  const userStore = useUserStore()
  const formData = new FormData()
  formData.append('file', file)

  return axios.post('/api/upload/avatar', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      'Authorization': `Bearer ${userStore.token}`
    }
  }).then(res => {
    const { code, message, data } = res.data
    if (code === 200) {
      return data
    } else {
      uni.showToast({ title: message || '上传失败', icon: 'none' })
      return Promise.reject(new Error(message))
    }
  }).catch(err => {
    uni.showToast({ title: '上传失败', icon: 'none' })
    return Promise.reject(err)
  })
}

// 上传视频
export const uploadVideo = (file) => {
  const userStore = useUserStore()
  const formData = new FormData()
  formData.append('file', file)

  return axios.post('/api/upload/video', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      'Authorization': `Bearer ${userStore.token}`
    }
  }).then(res => {
    const { code, message, data } = res.data
    if (code === 200) {
      return data
    } else {
      uni.showToast({ title: message || '上传失败', icon: 'none' })
      return Promise.reject(new Error(message))
    }
  }).catch(err => {
    uni.showToast({ title: '上传失败', icon: 'none' })
    return Promise.reject(err)
  })
}
