import { ref, computed } from 'vue'

export function useExplore() {
  const exploreList = ref([
    { id: 1, type: 'image', images: ['/static/images/home/1.jpg'], width: 1, height: 1 },
    { id: 2, type: 'video', video: '/static/video/1.mp4', cover: '/static/images/home/2.jpg', width: 1, height: 2 },
    { id: 3, type: 'image', images: ['/static/images/home/3.jpg', '/static/images/home/4.jpg'], width: 1, height: 1 },
    { id: 4, type: 'image', images: ['/static/images/home/5.jpg'], width: 1, height: 1 },
    { id: 5, type: 'image', images: ['/static/images/home/6.jpg', '/static/images/home/7.jpg', '/static/images/home/8.jpg'], width: 1, height: 1 },
    { id: 6, type: 'video', video: '/static/video/2.mp4', cover: '/static/images/home/9.jpg', width: 1, height: 2 },
    { id: 7, type: 'image', images: ['/static/images/home/10.jpg'], width: 1, height: 1 },
    { id: 8, type: 'image', images: ['/static/images/home/11.jpg', '/static/images/home/12.jpg'], width: 1, height: 1 },
    { id: 9, type: 'video', video: '/static/video/3.mp4', cover: '/static/images/home/13.jpg', width: 1, height: 2 },
    { id: 10, type: 'image', images: ['/static/images/home/1.jpg'], width: 1, height: 1 },
    { id: 11, type: 'image', images: ['/static/images/home/2.jpg', '/static/images/home/3.jpg'], width: 1, height: 1 },
    { id: 12, type: 'video', video: '/static/video/4.mp4', cover: '/static/images/home/4.jpg', width: 1, height: 2 },
    { id: 13, type: 'image', images: ['/static/images/home/1.jpg'], width: 1, height: 1 },
    { id: 14, type: 'video', video: '/static/video/1.mp4', cover: '/static/images/home/2.jpg', width: 1, height: 2 },
    { id: 15, type: 'image', images: ['/static/images/home/3.jpg', '/static/images/home/4.jpg'], width: 1, height: 1 },
    { id: 16, type: 'image', images: ['/static/images/home/5.jpg'], width: 1, height: 1 },
    { id: 17, type: 'image', images: ['/static/images/home/6.jpg', '/static/images/home/7.jpg', '/static/images/home/8.jpg'], width: 1, height: 1 },
    { id: 18, type: 'video', video: '/static/video/2.mp4', cover: '/static/images/home/9.jpg', width: 1, height: 2 },
    { id: 19, type: 'image', images: ['/static/images/home/10.jpg'], width: 1, height: 1 },
    { id: 20, type: 'image', images: ['/static/images/home/11.jpg', '/static/images/home/12.jpg'], width: 1, height: 1 },
    { id: 21, type: 'video', video: '/static/video/3.mp4', cover: '/static/images/home/13.jpg', width: 1, height: 2 },
    { id: 22, type: 'image', images: ['/static/images/home/1.jpg'], width: 1, height: 1 },
    { id: 23, type: 'image', images: ['/static/images/home/2.jpg', '/static/images/home/3.jpg'], width: 1, height: 1 },
    { id: 24, type: 'video', video: '/static/video/4.mp4', cover: '/static/images/home/4.jpg', width: 1, height: 2 }
  ])

  const searchKeyword = ref('')

  // 瀑布流分列
  const column1 = computed(() => {
    const result = []
    const heights = [0, 0, 0]
    exploreList.value.forEach(item => {
      const minIndex = heights.indexOf(Math.min(...heights))
      if (minIndex === 0) result.push(item)
      heights[minIndex] += item.type === 'video' ? 2 : 1
    })
    return result
  })

  const column2 = computed(() => {
    const result = []
    const heights = [0, 0, 0]
    exploreList.value.forEach(item => {
      const minIndex = heights.indexOf(Math.min(...heights))
      if (minIndex === 1) result.push(item)
      heights[minIndex] += item.type === 'video' ? 2 : 1
    })
    return result
  })

  const column3 = computed(() => {
    const result = []
    const heights = [0, 0, 0]
    exploreList.value.forEach(item => {
      const minIndex = heights.indexOf(Math.min(...heights))
      if (minIndex === 2) result.push(item)
      heights[minIndex] += item.type === 'video' ? 2 : 1
    })
    return result
  })

  function handleSearch() {
    console.log('搜索:', searchKeyword.value)
  }

  return {
    exploreList,
    column1,
    column2,
    column3,
    searchKeyword,
    handleSearch
  }
}
