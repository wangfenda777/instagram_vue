<template>
  <Layout>
    <view class="profile-page">
      <!-- 顶部导航 -->
      <view class="header">
        <view class="header-center">
          <text class="username">{{ userInfo.username }}</text>
          <image class="dropdown-icon" src="/static/icons/direction.svg" mode="aspectFit" />
          <view v-if="userInfo.hasNotification" class="notification-dot"></view>
        </view>
        <view class="header-right">
          <image class="icon" src="/static/icons/add.svg" mode="aspectFit" />
          <image class="icon" src="/static/icons/elip.svg" mode="aspectFit" />
        </view>
      </view>

      <!-- 用户信息区域 -->
      <view class="user-info">
        <view class="avatar-section">
          <view class="avatar-wrapper">
            <image class="avatar" :src="userInfo.avatar" mode="aspectFill" />
            <view class="add-story">
              <text class="add-icon">+</text>
            </view>
          </view>
        </view>

   

        <view class="stats-section">
          <view class="user-name">
            <text>{{ userInfo.displayName }}</text>
          </view>
          <view class="stats">
            <view class="stat-item">
              <text class="stat-number">{{ userInfo.posts }}</text>
              <text class="stat-label">帖子</text>
            </view>
            <view class="stat-item" @click="goFollowList(0)">
              <text class="stat-number">{{ userInfo.followers }}</text>
              <text class="stat-label">粉丝</text>
            </view>
            <view class="stat-item" @click="goFollowList(1)">
              <text class="stat-number">{{ userInfo.following }}</text>
              <text class="stat-label">已关注</text>
            </view>
          </view>
        </view>
      </view>



      <view class="action-buttons">
        <view class="btn btn-primary" @click="goEditProfile">编辑主页</view>
        <view class="btn btn-primary">分享主页</view>
        <view class="btn btn-icon">
          <image src="/static/icons/direction.svg" mode="aspectFit" />
        </view>
      </view>

      <!-- 发现用户 -->
      <view class="discover-section">
        <view class="section-header">
          <text class="section-title">发现用户</text>
        </view>
        <scroll-view class="discover-scroll" scroll-x>
          <view class="discover-list">
            <view class="discover-item" v-for="user in discoverUsers" :key="user.id">
              <view class="discover-close" @click="removeDiscoverUser(user.id)">
                <image src="/static/icons/close.svg" mode="aspectFit" />
              </view>
              <image class="discover-avatar" :src="user.avatar" mode="aspectFill" />
              <text class="discover-username">{{ user.username }}</text>
              <text class="discover-tag">{{ user.tag }}</text>
              <view class="discover-btn" @click="followUser(user.id)">
                <text>{{ user.isFollowing ? '已关注' : '关注' }}</text>
              </view>
            </view>
          </view>
        </scroll-view>
      </view>

      <!-- Tab切换 -->
      <view class="tabs">
        <view
          class="tab-item"
          :class="{ active: activeTab === 0 }"
          @click="switchTab(0)"
        >
          <image src="/static/icons/book.svg" mode="aspectFit" />
        </view>
        <view
          class="tab-item"
          :class="{ active: activeTab === 1 }"
          @click="switchTab(1)"
        >
          <image src="/static/icons/video.svg" mode="aspectFit" />
        </view>
        <view
          class="tab-item"
          :class="{ active: activeTab === 2 }"
          @click="switchTab(2)"
        >
          <image src="/static/icons/star.svg" mode="aspectFit" />
        </view>
      </view>

      <!-- Tab内容 -->
      <view class="tab-content" v-if="activeTab === 0">
        <!-- 图片网格 -->
        <view class="posts-grid">
          <view class="post-item" v-for="post in userPosts" :key="post.id">
            <image :src="post.image" mode="aspectFill" />
          </view>
        </view>
      </view>

      <view class="tab-content" v-if="activeTab === 1">
        <view class="posts-grid">
          <view class="post-item" v-for="post in userVideos" :key="post.id">
            <image :src="post.cover" mode="aspectFill" />
          </view>
        </view>
      </view>

      <view class="tab-content" v-if="activeTab === 2">
        <view class="posts-grid">
          <view class="post-item" v-for="post in userTagged" :key="post.id">
            <image :src="post.image" mode="aspectFill" />
          </view>
        </view>
      </view>

      <!-- 完善主页 -->
      <view class="profile-tasks">
        <view class="tasks-header">
          <view class="tasks-title">完善主页</view>
          <view class="tasks-progress">{{ profileTasks.filter(t => t.completed).length }}/{{ profileTasks.length }}已完成</view>
        </view>
        <!-- 进度条 -->
        <view class="progress-bar-wrap">
          <view class="progress-bar-fill" :style="{ width: (profileTasks.filter(t => t.completed).length / profileTasks.length * 100) + '%' }"></view>
        </view>
        <!-- 横向滚动卡片 -->
        <scroll-view class="tasks-scroll" scroll-x>
          <view class="tasks-list">
            <view
              class="task-card"
              :class="{ 'completed-card': task.completed }"
              v-for="task in profileTasks"
              :key="task.id"
            >
              <view class="task-icon-wrap" :class="{ done: task.completed }">
                <image :src="task.iconSrc" mode="aspectFit" />
                <view class="check-badge" v-if="task.completed">
                  <text class="check-text">✓</text>
                </view>
              </view>
              <text class="task-title">{{ task.title }}</text>
              <text class="task-desc">{{ task.description }}</text>
              <view class="task-btn">
                <text>{{ task.buttonText }}</text>
              </view>
            </view>
          </view>
        </scroll-view>
      </view>
    </view>
  </Layout>
</template>

<script setup>
import Layout from '@/components/common/Layout.vue'
import { useProfile } from '@/composables/useProfile'

const {
  userInfo,
  discoverUsers,
  activeTab,
  userPosts,
  userVideos,
  userTagged,
  profileTasks,
  followUser,
  removeDiscoverUser,
  switchTab
} = useProfile()

const goEditProfile = () => {
  uni.navigateTo({ url: '/pages/profile/edit-profile' })
}

const goFollowList = (tab) => {
  const info = userInfo.value || {}
  const query = [
    `userId=${encodeURIComponent(info.userId || '')}`,
    `username=${encodeURIComponent(info.username || '')}`,
    `followers=${encodeURIComponent(info.followers || 0)}`,
    `following=${encodeURIComponent(info.following || 0)}`,
    `tab=${tab}`
  ].join('&')

  uni.navigateTo({
    url: `/pages/profile/follow-list?${query}`
  })
}
</script>

<style scoped>
.profile-page {
  background: var(--page-bg);
  min-height: 100vh;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20rpx 32rpx;
  border-bottom: 1rpx solid var(--theme-border);
}

.header-center {
  position: relative;
  display: flex;
  align-items: center;
  gap: 8rpx;
}

.username {
  font-size: 32rpx;
  font-weight: 600;
  color: var(--text-color);
}

.dropdown-icon {
  width: 24rpx;
  height: 24rpx;
}

.notification-dot {
  position: absolute;
  top: -4rpx;
  right: -4rpx;
  width: 16rpx;
  height: 16rpx;
  background: var(--theme-error);
  border-radius: 50%;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 32rpx;
}

.header-right .icon {
  width: 48rpx;
  height: 48rpx;
}

.user-info {
  display: flex;
  padding: 32rpx;
  gap: 40rpx;
}

.avatar-wrapper {
  position: relative;
  width: 180rpx;
  height: 180rpx;
}

.avatar {
  width: 100%;
  height: 100%;
  border-radius: 50%;
}

.add-story {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 48rpx;
  height: 48rpx;
  background: var(--theme-link);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 4rpx solid var(--page-bg);
}

.add-icon {
  color: #fff;
  font-size: 32rpx;
  font-weight: 300;
}

.stats-section {
  padding-top: 20rpx;
  text-align: left;
  display: flex;
  flex-direction: column;
  justify-content: left;
  gap: 16rpx;
}

.stats {
  width: 100%s;
  display: flex;
  gap: 32rpx;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: left;
}

.stat-number {
  font-size: 30rpx;
  font-weight: 600;
  color: var(--text-color);
}

.stat-label {
  font-size: 18rpx;
  color: var(--text-color);
}

.user-name {
  font-size: 28rpx;
  font-weight: 600;
  color: var(--text-color);
}

.action-buttons {
  display: flex;
  align-items: center;
  gap: 12rpx;
  padding: 0 32rpx 24rpx;
}

.btn {
  flex: 1;
  height: 64rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 16rpx;
  font-size: 24rpx;
  font-weight: 600;
}

.btn-primary {
  background: var(--theme-secondary);
  color: var(--text-color);
}

.btn-icon {
  flex: 0 0 64rpx;
  background: var(--theme-secondary);
}

.btn-icon image {
  width: 32rpx;
  height: 32rpx;
}

.discover-section {
  padding: 24rpx 0;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 32rpx 16rpx;
}

.section-title {
  font-size: 20rpx;
  font-weight: 600;
  color: var(--text-color);
}

.discover-scroll {
  white-space: nowrap;
  padding: 0 32rpx;
}

.discover-list {
  display: inline-flex;
  gap: 4rpx;
}

.discover-item {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  gap: 6rpx;
  width: 260rpx;
  border: 1rpx solid var(--theme-border);
  border-radius: 12rpx;
  padding: 24rpx;
  position: relative;
}

.discover-close {
  position: absolute;
  top: 8rpx;
  right: 8rpx;
  width: 32rpx;
  height: 32rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.discover-close image {
  width: 20rpx;
  height: 20rpx;
}

.discover-avatar {
  width: 160rpx;
  height: 160rpx;
  border-radius: 50%;
  border: 2rpx solid var(--theme-border);
}

.discover-username {
  font-size: 24rpx;
  font-weight: 600;
  color: var(--text-color);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 100%;
  text-align: center;
}

.discover-tag {
  font-size: 16rpx;
  color: var(--text-secondary);
}

.discover-btn {
  width: 100%;
  height: 56rpx;
  background: var(--theme-link);
  border-radius: 16rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20rpx;
  font-weight: 600;
  color: #fff;
  margin-top: 28rpx;
}

.tabs {
  display: flex;
  border-bottom: 1rpx solid var(--theme-border);
}

.tab-item {
  flex: 1;
  height: 100rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.tab-item image {
  width: 48rpx;
  height: 48rpx;
  opacity: 0.4;
}

.tab-item.active image {
  opacity: 1;
}

.tab-item.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 2rpx;
  background: var(--text-color);
}

.tab-content {
  padding: 4rpx 0;
}

.posts-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 4rpx;
}

.post-item {
  aspect-ratio: 1;
  overflow: hidden;
}

.post-item image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.profile-tasks {
  padding: 32rpx;
  margin-top: 24rpx;
}

.tasks-header {
  margin-bottom: 24rpx;
}

.tasks-title {
  font-size: 20rpx;
  font-weight: 600;
  color: var(--text-color);
}

.tasks-progress {
  font-size: 16rpx;
  color: var(--text-secondary);
}

/* 进度条 */
.progress-bar-wrap {
  height: 4rpx;
  background: var(--theme-secondary);
  border-radius: 4rpx;
  margin-bottom: 32rpx;
  overflow: hidden;
}

.progress-bar-fill {
  height: 100%;
  background: var(--theme-link);
  border-radius: 4rpx;
  transition: width 0.3s;
}

/* 任务卡片横向滚动 */
.tasks-scroll {
  white-space: nowrap;
  overflow: hidden;
}

.tasks-list {
  display: inline-flex;
  gap: 16rpx;
  padding-bottom: 8rpx;
}

.task-card {
  display: inline-flex;
  flex-direction: column;
  width: 280rpx;
  border: 2rpx solid var(--theme-border);
  border-radius: 20rpx;
  padding: 32rpx 20rpx;
  gap: 16rpx;
  vertical-align: top;
  white-space: normal;
  flex-shrink: 0;
  box-sizing: border-box;
  align-items: center;
  text-align: center;
  justify-content: center;
  min-height: 280rpx;
}

.task-card.completed-card {
  opacity: 0.5;
}

.task-icon-wrap {
  width: 88rpx;
  height: 88rpx;
  border-radius: 50%;
  background: var(--theme-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.task-icon-wrap.done {
  background: rgba(0,149,246,0.15);
}

.task-icon-wrap image {
  width: 48rpx;
  height: 48rpx;
}

.check-badge {
  position: absolute;
  bottom: -4rpx;
  right: -4rpx;
  width: 28rpx;
  height: 28rpx;
  background: var(--theme-link);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 3rpx solid var(--page-bg);
}

.check-text {
  color: #fff;
  font-size: 20rpx;
  font-weight: 700;
  line-height: 1;
}

.task-title {
  font-size: 26rpx;
  font-weight: 600;
  color: var(--text-color);
  text-align: center;
}

.task-desc {
  font-size: 24rpx;
  color: var(--text-secondary);
  text-align: center;
}

.task-btn {
  display: block;
  padding: 8rpx 16rpx;
  background: var(--theme-link);
  border-radius: 12rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 26rpx;
  color: #fff;
  margin-top: auto;
}

/* 故事横向滚动（tab=0时底部） */
.stories-scroll {
  white-space: nowrap;
  padding: 16rpx 0;
  border-bottom: 1rpx solid var(--theme-border);
}

.stories-list {
  display: inline-flex;
  gap: 0;
  padding: 0 8rpx;
}

.story-thumb {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  gap: 8rpx;
  width: 120rpx;
}

.story-thumb-img {
  width: 100rpx;
  height: 100rpx;
  border-radius: 50%;
  border: 2rpx solid var(--theme-border);
}

.story-thumb-label {
  font-size: 22rpx;
  color: var(--text-color);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 100%;
  text-align: center;
}
</style>