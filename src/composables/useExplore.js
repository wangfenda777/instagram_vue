import { ref, computed } from 'vue'
import { searchTag, searchUser } from '@/api/search.js'
import { useAppStore } from '@/pinia/modules/appStore.js'
import { useUserStore } from '@/pinia/modules/userStore.js'

const SEARCH_DEBOUNCE_DELAY = 350

export function useExplore() {
  const appStore = useAppStore()
  const userStore = useUserStore()
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
  const isSearchMode = ref(false)
  const isSearching = ref(false)
  const hasSearched = ref(false)
  const searchError = ref('')
  const tagResults = ref([])
  const userResults = ref([])

  let searchTimer = null
  let activeRequestId = 0

  const getAvatarUrl = (avatar) => {
    if (!avatar) return '/static/images/avatar/1.jpg'
    return avatar.startsWith('http') ? avatar : appStore.baseUrl + avatar
  }

  const getList = (payload) => {
    if (Array.isArray(payload)) return payload
    if (Array.isArray(payload?.list)) return payload.list
    return []
  }

  const normalizeTag = (item = {}) => ({
    id: item.tagId || item.id || item.tagName || item.name || '',
    name: item.tagName || item.name || '',
    postCount: Number(item.postCount || item.count || item.noteCount || 0),
    cover: item.cover || item.coverUrl || item.thumbnail || ''
  })

  const normalizeUser = (item = {}) => ({
    id: item.userId || item.id || '',
    username: item.username || '',
    displayName: item.displayName || item.bio || '',
    avatar: getAvatarUrl(item.avatar),
    isVerified: Boolean(item.isVerified)
  })

  const clearSearchResult = () => {
    tagResults.value = []
    userResults.value = []
    searchError.value = ''
  }

  const runSearch = async () => {
    const keyword = searchKeyword.value.trim()
    const requestId = ++activeRequestId

    if (!keyword) {
      isSearching.value = false
      hasSearched.value = false
      clearSearchResult()
      return
    }

    isSearching.value = true
    searchError.value = ''
    hasSearched.value = true

    const [tagResult, userResult] = await Promise.allSettled([
      searchTag(keyword),
      searchUser(keyword)
    ])

    if (requestId !== activeRequestId) return

    const nextTags = tagResult.status === 'fulfilled'
      ? getList(tagResult.value).map(normalizeTag)
      : []
    const nextUsers = userResult.status === 'fulfilled'
      ? getList(userResult.value).map(normalizeUser)
      : []

    tagResults.value = nextTags
    userResults.value = nextUsers

    if (tagResult.status === 'rejected' && userResult.status === 'rejected') {
      searchError.value = '搜索失败，请稍后重试'
    }

    isSearching.value = false
  }

  const scheduleSearch = () => {
    if (searchTimer) {
      clearTimeout(searchTimer)
    }

    const keyword = searchKeyword.value.trim()
    if (!keyword) {
      activeRequestId += 1
      isSearching.value = false
      hasSearched.value = false
      clearSearchResult()
      return
    }

    searchTimer = setTimeout(() => {
      runSearch()
    }, SEARCH_DEBOUNCE_DELAY)
  }

  const enterSearchMode = () => {
    isSearchMode.value = true
  }

  const cancelSearch = () => {
    if (searchTimer) {
      clearTimeout(searchTimer)
      searchTimer = null
    }
    activeRequestId += 1
    searchKeyword.value = ''
    isSearchMode.value = false
    isSearching.value = false
    hasSearched.value = false
    clearSearchResult()
  }

  const handleSearchInput = () => {
    if (!isSearchMode.value) {
      enterSearchMode()
    }
    scheduleSearch()
  }

  const goUserDetail = (user) => {
    const targetUserId = String(user?.id || user?.userId || '')
    const currentUserId = String(userStore.userInfo?.userId || '')

    if (!targetUserId) return

    if (targetUserId === currentUserId) {
      uni.switchTab({ url: '/pages/profile/profile' })
      return
    }

    uni.navigateTo({
      url: `/pages/user-detail/user-detail?userId=${encodeURIComponent(targetUserId)}`
    })
  }

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
    enterSearchMode()
    if (searchTimer) {
      clearTimeout(searchTimer)
      searchTimer = null
    }
    runSearch()
  }

  return {
    exploreList,
    column1,
    column2,
    column3,
    searchKeyword,
    isSearchMode,
    isSearching,
    hasSearched,
    searchError,
    tagResults,
    userResults,
    enterSearchMode,
    cancelSearch,
    handleSearchInput,
    handleSearch,
    goUserDetail
  }
}
