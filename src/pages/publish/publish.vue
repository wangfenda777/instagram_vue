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
      <view class="caption-editor" :style="{ minHeight: `${textareaHeight}rpx` }">
        <view class="caption-highlight" :style="{ minHeight: `${textareaHeight}rpx` }">
          <text
            v-for="(segment, index) in formattedSegments"
            :key="`${segment.type}-${index}`"
            :class="segment.type === 'tag' ? 'segment-tag' : 'segment-text'"
          >{{ segment.type === 'text' && !segment.text ? ' ' : segment.text }}</text>
        </view>
        <textarea
          class="textarea"
          :value="content"
          :cursor="caretPosition"
          placeholder="写一段文案..."
          maxlength="2000"
          :auto-height="true"
          @input="handleContentInput"
          @blur="handleContentBlur"
        />
      </view>

      <view v-if="shouldShowSuggestions" class="tag-suggestion-panel">
        <view v-if="isSearchingTags" class="tag-suggestion-status">
          <text>标签搜索中...</text>
        </view>
        <view v-else-if="tagSearchError" class="tag-suggestion-status error-text">
          <text>{{ tagSearchError }}</text>
        </view>
        <view v-else>
          <view
            v-for="tag in tagSuggestions"
            :key="tag.id || tag.name"
            class="tag-suggestion-item"
            @mousedown.prevent="applyTagSuggestion(tag)"
            @click="applyTagSuggestion(tag)"
          >
            <view class="tag-suggestion-info">
              <text class="tag-suggestion-name">{{ tag.name }}</text>
              <text v-if="tag.postCount" class="tag-suggestion-count">{{ tag.postCount }} 条内容</text>
            </view>
          </view>
        </view>
      </view>
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
import { usePublishTagAutocomplete } from '@/composables/usePublishTagAutocomplete.js'

const imageList = ref([])
const content = ref('')
const location = ref('')
const uploading = ref(false)
const uploadProgress = ref('')

const {
  textareaHeight,
  caretPosition,
  formattedSegments,
  tagSuggestions,
  isSearchingTags,
  tagSearchError,
  shouldShowSuggestions,
  handleContentInput,
  applyTagSuggestion,
  hideSuggestions
} = usePublishTagAutocomplete(content)

const canPublish = computed(() => {
  return imageList.value.length > 0 && !uploading.value
})

const handleContentBlur = () => {
  setTimeout(() => {
    hideSuggestions()
  }, 200)
}

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
    const mediaUrls = []
    for (let i = 0; i < imageList.value.length; i++) {
      uploadProgress.value = `${i + 1}/${imageList.value.length}`
      const file = await getFileFromPath(imageList.value[i].preview)
      const result = await uploadImage(file)
      mediaUrls.push(result.url)
    }

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

const getFileFromPath = (path) => {
  return new Promise((resolve, reject) => {
    if (path.startsWith('blob:')) {
      fetch(path)
        .then(res => res.blob())
        .then(blob => {
          const file = new File([blob], 'image.jpg', { type: 'image/jpeg' })
          resolve(file)
        })
        .catch(reject)
    } else {
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

.caption-editor {
  position: relative;
}

.caption-highlight,
.textarea {
  width: 100%;
  min-height: 200rpx;
  padding: 0;
  font-size: 28rpx;
  line-height: 1.5;
  white-space: pre-wrap;
  word-break: break-all;
}

.caption-highlight {
  pointer-events: none;
  color: transparent;
}

.segment-text {
  color: #111111;
}

.segment-tag {
  color: #0095f6;
  padding-right: 16rpx;
}

.textarea {
  position: absolute;
  top: 0;
  left: 0;
  background: transparent;
  color: rgba(0, 0, 0, 0.02);
  caret-color: #111111;
  z-index: 2;
}

.tag-suggestion-panel {
  margin-top: 24rpx;
  border: 2rpx solid #f1f1f1;
  border-radius: 20rpx;
  background: #fff;
  overflow: hidden;
}

.tag-suggestion-status {
  padding: 24rpx;
  font-size: 26rpx;
  color: #8e8e93;
}

.error-text {
  color: #ff3b30;
}

.tag-suggestion-item {
  display: flex;
  align-items: center;
  gap: 20rpx;
  padding: 24rpx;
  border-bottom: 1rpx solid #f2f2f7;
}

.tag-suggestion-item:last-child {
  border-bottom: none;
}

.tag-suggestion-icon {
  width: 64rpx;
  height: 64rpx;
  border-radius: 50%;
  border: 1rpx solid #dcdce0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28rpx;
  color: #111111;
  flex-shrink: 0;
}

.tag-suggestion-info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 6rpx;
}

.tag-suggestion-name {
  font-size: 28rpx;
  font-weight: 600;
  color: #111111;
}

.tag-suggestion-count {
  font-size: 24rpx;
  color: #8e8e93;
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
