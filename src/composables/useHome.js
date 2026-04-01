import { ref } from 'vue'

export function useHome() {
  const stories = ref([
    { id: 1, name: 'kaihavertz29', avatar: '/static/images/avatar/2.jpg', borderColor: 'linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)' },
    { id: 2, name: 'shio_fujiwara', avatar: '/static/images/avatar/3.jpg', borderColor: 'linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)' },
    { id: 3, name: 'esmueller', avatar: '/static/images/avatar/4.jpg', borderColor: 'linear-gradient(45deg, #fccc63, #f09433, #e6683c)' },
    { id: 4, name: 'leo_messi', avatar: '/static/images/avatar/5.jpg', borderColor: 'linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)' },
    { id: 5, name: 'ronaldo', avatar: '/static/images/avatar/6.jpg', borderColor: 'linear-gradient(45deg, #f09433, #e6683c, #dc2743)' },
    { id: 6, name: 'neymar', avatar: '/static/images/avatar/7.jpg', borderColor: 'linear-gradient(45deg, #fccc63, #f09433, #e6683c)' },
    { id: 7, name: 'haaland', avatar: '/static/images/avatar/8.jpg', borderColor: 'linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)' },
    { id: 8, name: 'salah', avatar: '/static/images/avatar/9.jpg', borderColor: 'linear-gradient(45deg, #f09433, #dc2743, #bc1888)' }
  ])

  const posts = ref([
    {
      id: 1,
      username: 'arsenal',
      location: 'Wembley Stadium',
      avatar: '/static/images/avatar/2.jpg',
      showFollow: true,
      images: ['/static/images/home/1.jpg', '/static/images/home/2.jpg'],
      likes: '31.5万',
      comments: '1,305',
      shares: '5,423',
      content: 'Looking for more of the same...',
      date: '3月21日'
    },
    {
      id: 2,
      username: 'kaihavertz29',
      location: 'London, United Kingdom',
      avatar: '/static/images/avatar/3.jpg',
      showFollow: true,
      images: ['/static/images/home/3.jpg', '/static/images/home/4.jpg', '/static/images/home/5.jpg'],
      likes: '18.2万',
      comments: '892',
      shares: '2,100',
      content: 'Great day at the training ground!',
      date: '3月20日'
    },
    {
      id: 3,
      username: 'shio_fujiwara',
      location: 'Tokyo, Japan',
      avatar: '/static/images/avatar/4.jpg',
      showFollow: false,
      images: ['/static/images/home/6.jpg'],
      likes: '5,423',
      comments: '128',
      shares: '67',
      content: 'Beautiful sunset today',
      date: '3月19日'
    },
    {
      id: 4,
      username: 'esmueller',
      location: 'Munich, Germany',
      avatar: '/static/images/avatar/5.jpg',
      showFollow: true,
      images: ['/static/images/home/7.jpg', '/static/images/home/8.jpg'],
      likes: '12.8万',
      comments: '1,024',
      shares: '3,500',
      content: 'What a match! Proud of the team.',
      date: '3月18日'
    },
    {
      id: 5,
      username: 'leo_messi',
      location: 'Miami, Florida',
      avatar: '/static/images/avatar/6.jpg',
      showFollow: true,
      images: ['/static/images/home/9.jpg', '/static/images/home/10.jpg', '/static/images/home/11.jpg'],
      likes: '256万',
      comments: '8.5万',
      shares: '12万',
      content: 'Enjoying the beautiful weather here',
      date: '3月17日'
    }
  ])

  return { stories, posts }
}
