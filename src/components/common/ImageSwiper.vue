<template>
  <view class="image-swiper">
    <swiper
      class="swiper"
      :current="current"
      @change="onChange"
      :indicator-dots="false"
      :autoplay="false"
      :circular="false"
    >
      <swiper-item v-for="(img, index) in images" :key="index">
        <image class="swiper-image" :src="img" mode="aspectFill" />
      </swiper-item>
    </swiper>
    <!-- 指示点 -->
    <view class="dots" v-if="images.length > 1">
      <view
        class="dot"
        v-for="(img, index) in images"
        :key="index"
        :class="{ active: index === current }"
      />
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'

defineProps({
  images: {
    type: Array,
    default: () => []
  }
})

const current = ref(0)

function onChange(e) {
  current.value = e.detail.current
}
</script>

<style scoped>
.image-swiper {
  position: relative;
  width: 100%;
}

.swiper {
  width: 100%;
  height: 750rpx;
}

.swiper-image {
  width: 100%;
  height: 100%;
}

.dots {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 16rpx 0;
  gap: 8rpx;
}

.dot {
  width: 12rpx;
  height: 12rpx;
  border-radius: 50%;
  background-color: #c4c4c4;
  transition: background-color 0.3s;
}

.dot.active {
  background-color: var(--theme-link);
}
</style>
