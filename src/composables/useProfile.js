import { ref } from 'vue'

export function useProfile() {
  // 用户信息
  const userInfo = ref({
    username: 'qiwang6189',
    displayName: 'Qi Wang',
    avatar: '/static/images/avatar/1.jpg',
    posts: 1,
    followers: 9,
    following: 44,
    hasNotification: true
  })

  // 发现用户列表
  const discoverUsers = ref([
    {
      id: 1,
      username: 'user_one',
      avatar: '/static/images/avatar/2.jpg',
      tag: '为你推荐',
      isFollowing: false
    },
    {
      id: 2,
      username: 'user_two',
      avatar: '/static/images/avatar/3.jpg',
      tag: '为你推荐',
      isFollowing: false
    },
    {
      id: 3,
      username: 'user_three',
      avatar: '/static/images/avatar/4.jpg',
      tag: '为你推荐',
      isFollowing: false
    },
    {
      id: 4,
      username: 'user_four',
      avatar: '/static/images/avatar/5.jpg',
      tag: '为你推荐',
      isFollowing: false
    },
    {
      id: 5,
      username: 'user_five',
      avatar: '/static/images/avatar/2.jpg',
      tag: '为你推荐',
      isFollowing: false
    }
  ])

  // 当前选中的tab
  const activeTab = ref(0)

  // 用户帖子（图片网格）
  const userPosts = ref([
    { id: 1, image: '/static/images/home/1.jpg', type: 'image' },
    { id: 2, image: '/static/images/home/2.jpg', type: 'image' },
    { id: 3, image: '/static/images/home/3.jpg', type: 'image' }
  ])

  // 用户视频
  const userVideos = ref([
    { id: 1, cover: '/static/images/home/4.jpg', type: 'video' },
    { id: 2, cover: '/static/images/home/5.jpg', type: 'video' }
  ])

  // 关联内容（他人标记）
  const userTagged = ref([
    { id: 1, image: '/static/images/home/6.jpg' },
    { id: 2, image: '/static/images/home/7.jpg' }
  ])


  // 完善主页任务
  const profileTasks = ref([
    {
      id: 1,
      title: '添加你的姓名',
      description: '帮助朋友找到你的账户',
      iconSrc: '/static/icons/user.svg',
      completed: true,
      buttonText: '编辑姓名'
    },
    {
      id: 2,
      title: '添加头像',
      description: '选择一张头像照片',
      iconSrc: '/static/icons/add.svg',
      completed: true,
      buttonText: '更换头像'
    },
    {
      id: 3,
      title: '添加个性签名',
      description: '介绍一下你自己',
      iconSrc: '/static/icons/elip.svg',
      completed: false,
      buttonText: '添加个性签名'
    },
    {
      id: 4,
      title: '查找用户并关注',
      description: '关注至少5个账户',
      iconSrc: '/static/icons/direction.svg',
      completed: false,
      buttonText: '查找更多'
    }
  ])

  // 关注用户
  const followUser = (userId) => {
    const user = discoverUsers.value.find(u => u.id === userId)
    if (user) {
      user.isFollowing = !user.isFollowing
    }
  }

  // 移除发现用户
  const removeDiscoverUser = (userId) => {
    const index = discoverUsers.value.findIndex(u => u.id === userId)
    if (index > -1) {
      discoverUsers.value.splice(index, 1)
    }
  }

  // 切换tab
  const switchTab = (index) => {
    activeTab.value = index
  }

  return {
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
  }
}
