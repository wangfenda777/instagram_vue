<template>
  <Layout>
    <view class="explore">
      <!-- 搜索框 -->
      <view class="search-bar">
        <view class="search-input">
          <image class="search-icon" src="/static/icons/search.svg" mode="aspectFit" />
          <input
            class="input"
            v-model="searchKeyword"
            placeholder="搜索"
            placeholder-class="placeholder"
            @confirm="handleSearch"
          />
        </view>
      </view>

      <!-- 瀑布流内容 -->
      <view class="waterfall">
        <view class="waterfall-column">
          <view
            class="waterfall-item"
            v-for="item in column1"
            :key="item.id"
            :class="{ 'item-video-wrap': item.type === 'video' }"
          >
            <view v-if="item.type === 'image'" class="item-image">
              <image class="media" :src="item.images[0]" mode="aspectFill" />
              <image
                v-if="item.images.length > 1"
                class="multi-icon"
                src="/static/icons/copy.svg"
                mode="aspectFit"
              />
            </view>
            <view v-else class="item-video">
              <image class="media" :src="item.cover" mode="aspectFill" />
              <image class="play-icon" src="/static/icons/video.svg" mode="aspectFit" />
            </view>
          </view>
        </view>

        <view class="waterfall-column">
          <view
            class="waterfall-item"
            v-for="item in column2"
            :key="item.id"
            :class="{ 'item-video-wrap': item.type === 'video' }"
          >
            <view v-if="item.type === 'image'" class="item-image">
              <image class="media" :src="item.images[0]" mode="aspectFill" />
              <image
                v-if="item.images.length > 1"
                class="multi-icon"
                src="/static/icons/copy.svg"
                mode="aspectFit"
              />
            </view>
            <view v-else class="item-video">
              <image class="media" :src="item.cover" mode="aspectFill" />
              <image class="play-icon" src="/static/icons/video.svg" mode="aspectFit" />
            </view>
          </view>
        </view>

        <view class="waterfall-column">
          <view
            class="waterfall-item"
            v-for="item in column3"
            :key="item.id"
            :class="{ 'item-video-wrap': item.type === 'video' }"
          >
            <view v-if="item.type === 'image'" class="item-image">
              <image class="media" :src="item.images[0]" mode="aspectFill" />
              <image
                v-if="item.images.length > 1"
                class="multi-icon"
                src="/static/icons/copy.svg"
                mode="aspectFit"
              />
            </view>
            <view v-else class="item-video">
              <image class="media" :src="item.cover" mode="aspectFill" />
              <image class="play-icon" src="/static/icons/video.svg" mode="aspectFit" />
            </view>
          </view>
        </view>
      </view>
    </view>
  </Layout>
</template>

<script setup>
import Layout from '@/components/common/Layout.vue'
import { useExplore } from '@/composables/useExplore'

const { column1, column2, column3, searchKeyword, handleSearch } = useExplore()
</script>

<style scoped>
.explore {
  padding-bottom: 20rpx;
}

/* 搜索框 */
.search-bar {
  padding: 20rpx 24rpx;
  position: sticky;
  top: 0;
  background: var(--page-bg);
  z-index: 10;
}

.search-input {
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 16rpx;
  padding: 16rpx 24rpx;
  gap: 16rpx;
}

.search-icon {
  width: 36rpx;
  height: 36rpx;
}

.input {
  flex: 1;
  font-size: 28rpx;
  color: var(--text-color);
}

.placeholder {
  color: var(--theme-secondary);
}

/* 瀑布流 */
.waterfall {
  display: flex;
  gap: 2rpx;
  padding: 0 4rpx;
}

.waterfall-column {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2rpx;
}

.waterfall-item {
  position: relative;
  overflow: hidden;
}

.item-image {
  position: relative;
  width: 100%;
  padding-bottom: 100%;
  overflow: hidden;
}

.item-video {
  position: relative;
  width: 100%;
  padding-bottom: calc(200% + 2rpx);
  overflow: hidden;
}

.media {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.multi-icon {
  position: absolute;
  top: 16rpx;
  right: 16rpx;
  width: 32rpx;
  height: 32rpx;
  filter: drop-shadow(0 2rpx 4rpx rgba(0, 0, 0, 0.3));
}

.play-icon {
  position: absolute;
  top: 16rpx;
  right: 16rpx;
  width: 40rpx;
  height: 40rpx;
  filter: drop-shadow(0 2rpx 4rpx rgba(0, 0, 0, 0.3));
}
</style>
