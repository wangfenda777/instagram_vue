<template>
  <view class="publish-page">
    <!-- 顶部导航栏 -->
    <view class="navbar">
      <view class="navbar-left" @click="handleBack">
        <text class="icon">←</text>
      </view>
      <view class="navbar-title">新帖子</view>
      <view class="navbar-right" :class="{ active: canPublish }" @click="handlePublish">
        <text>分享</text>
      </view>
    </view>

    <!-- 图片选择区 -->
    <view class="image-section">
      <view class="image-grid">
        <view
          v-for="(img, index) in imageList"
          :key="index"
          class="image-item"
        >
          <image :src="img.preview" mode="aspectFill" class="image" />
          <view class="delete-btn" @click="removeImage(index)">
            <text>×</text>
          </view>
        </view>
        <view v-if="imageList.length < 9" class="add-image" @click="chooseImage">
          <text class="add-icon">+</text>
        </view>
      </view>
    </view>

    <!-- 文案输入 -->
    <view class="input-section">
      <textarea
        class="textarea"
        v-model="content"
        placeholder="写一段文案..."
        maxlength="2000"
        :auto-height="true"
      />
    </view>

    <!-- 位置输入 -->
    <view class="location-section">
      <input
        class="location-input"
        v-model="location"
        placeholder="添加位置"
      />
    </view>

    <!-- 加载提示 -->
    <view v-if="uploading" class="loading-mask">
      <view class="loading-box">
        <text>上传中... {{ uploadProgress }}</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue'
import { uploadImage } from '@/api/upload.js'
import { createPost } from '@/api/post.js'

const imageList = ref([])
const content = ref('')
const location = ref('')
const uploading = ref(false)
const uploadProgress = ref('')

const canPublish = computed(() => {
  return imageList.value.length > 0 && !uploading.value
})

// 选择图片
const chooseImage = () => {
  uni.chooseImage({
    count: 9 - imageList.value.length,
    sizeType: ['compressed'],
    sourceType: ['album', 'camera'],
    success: (res) => {
      const tempFiles = res.tempFiles || res.tempFilePaths.map(path => ({ path }))
      tempFiles.forEach(file => {
        imageList.value.push({
          preview: file.path || file.tempFilePath,
          file: file
        })
      })
    }
  })
}

// 删除图片
const removeImage = (index) => {
  imageList.value.splice(index, 1)
}

// 返回
const handleBack = () => {
  if (imageList.value.length > 0 || content.value) {
    uni.showModal({
      title: '提示',
      content: '确定要放弃发布吗？',
      success: (res) => {
        if (res.confirm) {
          uni.switchTab({ url: '/pages/index/index' })
        }
      }
    })
  } else {
    uni.switchTab({ url: '/pages/index/index' })
  }
}

// 发布
const handlePublish = async () => {
  if (!canPublish.value) return

  uploading.value = true
  uploadProgress.value = '0%'

  try {
    // 依次上传所有图片
    const mediaUrls = []
    for (let i = 0; i < imageList.value.length; i++) {
      uploadProgress.value = `${i + 1}/${imageList.value.length}`

      // H5 环境：从 input file 获取 File 对象
      const file = await getFileFromPath(imageList.value[i].preview)
      const result = await uploadImage(file)
      mediaUrls.push(result.url)
    }

    // 发布帖子
    uploadProgress.value = '发布中...'
    await createPost({
      content: content.value,
      location: location.value,
      mediaType: 'image',
      mediaUrls
    })

    uni.showToast({ title: '发布成功', icon: 'success' })
    setTimeout(() => {
      uni.switchTab({ url: '/pages/index/index' })
    }, 1500)
  } catch (e) {
    console.error('发布失败', e)
  } finally {
    uploading.value = false
  }
}

// H5 环境：将临时路径转为 File 对象
const getFileFromPath = (path) => {
  return new Promise((resolve, reject) => {
    // 如果是 blob URL，直接 fetch
    if (path.startsWith('blob:')) {
      fetch(path)
        .then(res => res.blob())
        .then(blob => {
          const file = new File([blob], 'image.jpg', { type: 'image/jpeg' })
          resolve(file)
        })
        .catch(reject)
    } else {
      // 如果是 base64 或其他，需要转换
      reject(new Error('Unsupported path format'))
    }
  })
}
</script>

<style scoped>
.publish-page {
  min-height: 100vh;
  background: #fff;
  padding-top: 88rpx;
}

.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 88rpx;
  background: #fff;
  border-bottom: 2rpx solid #dbdbdb;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 32rpx;
  z-index: 100;
}

.navbar-left {
  width: 80rpx;
}

.navbar-left .icon {
  font-size: 48rpx;
  color: #000;
}

.navbar-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #000;
}

.navbar-right {
  width: 80rpx;
  text-align: right;
  color: #0095f6;
  font-size: 28rpx;
  font-weight: 600;
  opacity: 0.3;
}

.navbar-right.active {
  opacity: 1;
}

.image-section {
  padding: 32rpx;
}

.image-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16rpx;
}

.image-item {
  position: relative;
  width: 100%;
  padding-bottom: 100%;
  background: #fafafa;
  border-radius: 8rpx;
  overflow: hidden;
}

.image-item .image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.delete-btn {
  position: absolute;
  top: 8rpx;
  right: 8rpx;
  width: 48rpx;
  height: 48rpx;
  background: rgba(0, 0, 0, 0.6);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.delete-btn text {
  color: #fff;
  font-size: 36rpx;
  line-height: 1;
}

.add-image {
  width: 100%;
  padding-bottom: 100%;
  background: #fafafa;
  border: 2rpx dashed #dbdbdb;
  border-radius: 8rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.add-icon {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 64rpx;
  color: #8e8e8e;
}

.input-section {
  padding: 32rpx;
  border-top: 2rpx solid #f1f1f1;
}

.textarea {
  width: 100%;
  min-height: 200rpx;
  font-size: 28rpx;
  line-height: 1.5;
}

.location-section {
  padding: 0 32rpx 32rpx;
}

.location-input {
  width: 100%;
  height: 80rpx;
  background: #fafafa;
  border: 2rpx solid #dbdbdb;
  border-radius: 8rpx;
  padding: 0 24rpx;
  font-size: 28rpx;
}

.loading-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.loading-box {
  background: #fff;
  padding: 40rpx 60rpx;
  border-radius: 16rpx;
}

.loading-box text {
  font-size: 28rpx;
  color: #000;
}
</style>
