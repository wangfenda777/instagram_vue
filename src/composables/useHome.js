import { ref, onMounted } from 'vue'
import { getStoryFeed } from '@/api/story.js'
import { getPostFeed } from '@/api/post.js'
import { useAppStore } from '@/pinia/modules/appStore.js'

export function useHome() {
  const appStore = useAppStore()
  const stories = ref([])
  const posts = ref([])
  const page = ref(1)
  const hasMore = ref(true)
  const loading = ref(false)

  // 获取快拍列表
  const fetchStories = async () => {
    try {
      const data = await getStoryFeed()
      stories.value = data.map(item => ({
        id: item.storyId,
        name: item.username,
        avatar: appStore.baseUrl + item.avatar,
        borderColor: item.hasUnread
          ? 'linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)'
          : '#dbdbdb'
      }))
    } catch (e) {
      console.error('获取快拍失败', e)
    }
  }

  // 获取帖子列表
  const fetchPosts = async () => {
    if (loading.value || !hasMore.value) return
    loading.value = true
    try {
      const data = await getPostFeed(page.value)
      const list = data.list.map(item => ({
        id: item.postId,
        username: item.username,
        location: item.location,
        avatar: appStore.baseUrl + item.avatar,
        isVerified: item.isVerified,
        showFollow: !item.isFollowing,
        images: item.mediaList.map(m => appStore.baseUrl + m.url),
        likes: formatCount(item.likesCount),
        comments: formatCount(item.commentsCount),
        shares: formatCount(item.sharesCount),
        content: item.content,
        isLiked: item.isLiked,
        isSaved: item.isSaved,
        date: formatDate(item.createdAt)
      }))
      posts.value.push(...list)
      hasMore.value = data.hasMore
      page.value++
    } catch (e) {
      console.error('获取帖子失败', e)
    } finally {
      loading.value = false
    }
  }

  onMounted(() => {
    fetchStories()
    fetchPosts()
  })

  return { stories, posts, hasMore, loading, fetchPosts }
}

function formatCount(num) {
  if (num >= 10000) return (num / 10000).toFixed(1).replace(/\.0$/, '') + '万'
  if (num >= 1000) return num.toLocaleString()
  return String(num)
}

function formatDate(timestamp) {
  const d = new Date(timestamp)
  return `${d.getMonth() + 1}月${d.getDate()}日`
}
