---
name: dev-spec
description: Vue 项目开发规范检查与指导，确保代码结构统一、可维护性强
trigger: 当用户创建新页面、新组件或需要规范检查时使用
---

# Instagram 项目开发规范 Skill

## Skill 功能说明

这个 skill 用于：
1. **新建页面/组件时**：自动按规范创建文件结构
2. **代码审查时**：检查是否符合项目规范
3. **重构代码时**：按规范调整现有代码
4. **接口文档时**：生成标准格式的接口文档

## 使用方式

```bash
# 创建新页面（自动生成规范结构）
/dev-spec create page <页面名>

# 检查现有代码是否符合规范
/dev-spec check <文件路径>

# 生成接口文档模板
/dev-spec doc <页面名>

# 查看规范说明
/dev-spec guide
```

---

## 一、目录结构规范

```
src/
├── pages/                  # 页面组件目录
│   ├── index/             # 首页
│   │   └── index.vue
│   ├── login/             # 登录页
│   │   └── login.vue
│   ├── profile/           # 个人主页
│   │   └── profile.vue
│   └── explore/           # 探索页
│       └── explore.vue
├── doc/                    # 接口文档目录
│   ├── login.md           # 登录模块接口文档
│   ├── profile.md         # 个人主页接口文档
│   ├── home.md            # 首页接口文档
│   └── explore.md         # 探索页接口文档
├── composables/           # 组合式函数目录
│   ├── useLogin.js
│   ├── useProfile.js
│   ├── useHome.js
│   └── useExplore.js
├── utils/                 # 工具函数目录
│   ├── index.js          # 通用工具函数
│   ├── request.js        # 请求封装
│   ├── storage.js        # 本地存储
│   ├── format.js         # 格式化工具
│   └── validate.js       # 校验工具
├── components/           # 公共组件目录
│   └── common/
│       ├── Layout.vue
│       └── ImageSwiper.vue
├── static/               # 静态资源
│   ├── images/
│   └── icons/
└── App.vue

**规范要点**：
- 每个页面独立文件夹，只包含 `.vue` 文件
- 接口文档统一放在 `src/doc/` 目录
- 所有业务逻辑抽离到 `composables/`
- 工具函数统一放 `utils/`
- 公共组件放 `components/common/`

---

## 二、页面开发规范

### 2.1 页面文件命名
- 文件夹名与页面名保持一致（小驼峰或短横线）
- 示例：`pages/login/login.vue`、`pages/user-profile/user-profile.vue`

### 2.2 页面基本结构模板

```vue
<template>
  <Layout>
    <view class="page-container">
      <!-- 页面内容 -->
    </view>
  </Layout>
</template>

<script setup>
import Layout from '@/components/common/Layout.vue'
import { usePageName } from '@/composables/usePageName'

// 解构所需的数据和方法
const { 
  loading,
  data,
  handleAction 
} = usePageName()
</script>

<style scoped>
/* ========== 容器样式 ========== */
.page-container {
  padding: 20rpx;
}

/* ========== 组件样式 ========== */

/* ========== 响应式适配 ========== */
</style>
```

### 2.3 页面开发 Checklist

- [ ] 创建页面文件夹和 `.vue` 文件
- [ ] 在 `pages.json` 配置路由
- [ ] 创建对应的 `composable` 文件
- [ ] 编写接口文档到 `src/doc/` 目录
- [ ] 使用 `Layout` 组件包裹
- [ ] 样式按模块分区注释

---

## 三、组合式函数规范

### 3.1 文件命名
- 使用 `use` 前缀 + 功能名（驼峰命名）
- 示例：`useLogin.js`、`useUserProfile.js`、`useImageUpload.js`

### 3.2 标准结构模板

```javascript
import { ref, computed, onMounted } from 'vue'
import { request } from '@/utils/request'

/**
 * 页面名称 - 功能描述
 * @returns {Object} 返回的响应式数据和方法
 */
export const usePageName = () => {
  // ========== 响应式状态 ==========
  const loading = ref(false)
  const data = ref([])
  const error = ref('')

  // ========== 计算属性 ==========
  const isEmpty = computed(() => data.value.length === 0)

  // ========== 方法 ==========
  /**
   * 获取数据
   */
  const fetchData = async () => {
    loading.value = true
    try {
      const res = await request({
        url: '/api/xxx',
        method: 'GET'
      })
      data.value = res.data
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  /**
   * 处理操作
   */
  const handleAction = () => {
    // 业务逻辑
  }

  // ========== 生命周期 ==========
  onMounted(() => {
    fetchData()
  })

  // ========== 返回暴露内容 ==========
  return {
    loading,
    data,
    error,
    isEmpty,
    fetchData,
    handleAction
  }
}
```

### 3.3 组合式函数规范要点

- 所有页面逻辑必须封装在 composable 中
- 按功能分区注释（状态、计算属性、方法、生命周期）
- 方法添加 JSDoc 注释
- 只返回需要暴露的数据和方法

---

## 四、接口请求规范

### 4.1 请求参数传递规则

- **GET 请求**：所有参数拼接在 URL 后面作为 Query 参数，不使用路径参数（Path Params）
  - 正确：`GET /api/user/info?userId=1001`
  - 错误：`GET /api/user/1001`、`GET /api/user/:userId`
- **POST 请求**：所有参数放在请求体（Request Body）中，使用 JSON 格式
  - 正确：`POST /api/user/follow`，Body: `{ "userId": "1001" }`
  - 错误：`POST /api/user/1001/follow`
- **不使用 PUT / DELETE 方法**：统一使用 POST 替代，通过不同的路径区分操作
  - 关注：`POST /api/user/follow`
  - 取消关注：`POST /api/user/unfollow`
  - 点赞：`POST /api/post/like`
  - 取消点赞：`POST /api/post/unlike`

### 4.2 文档命名与位置
- 与页面模块同名，后缀 `.md`
- 统一放在 `src/doc/` 目录下
- 示例：`src/doc/login.md`、`src/doc/profile.md`

### 4.3 标准文档模板

```markdown
# 页面名称 - 接口文档

## 1. 接口名称

### 请求信息
- **接口地址**: `/api/xxx`
- **请求方式**: POST / GET / PUT / DELETE
- **接口说明**: 简要描述接口功能

### 请求参数
| 参数名 | 类型 | 必填 | 说明 | 示例 |
|-------|------|------|------|------|
| username | string | 是 | 用户名 | "zhangsan" |
| password | string | 是 | 密码 | "123456" |
| remember | boolean | 否 | 记住密码 | true |

### 请求示例
\`\`\`json
{
  "username": "zhangsan",
  "password": "123456",
  "remember": true
}
\`\`\`

### 响应数据
\`\`\`json
{
  "code": 200,
  "message": "success",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "userInfo": {
      "id": 1,
      "username": "zhangsan",
      "avatar": "https://xxx.com/avatar.jpg"
    }
  }
}
\`\`\`

### 响应字段说明
| 字段名 | 类型 | 说明 |
|-------|------|------|
| code | number | 状态码，200 成功 |
| message | string | 提示信息 |
| data.token | string | 登录凭证 |
| data.userInfo | object | 用户信息 |

### 错误码说明
| 错误码 | 说明 |
|-------|------|
| 400 | 参数错误 |
| 401 | 未授权 |
| 404 | 接口不存在 |
| 500 | 服务器错误 |
\`\`\`

---

## 五、路由配置规范

### 5.1 pages.json 配置

```json
{
  "pages": [
    {
      "path": "pages/login/login",
      "style": {
        "navigationBarTitleText": "登录",
        "navigationBarBackgroundColor": "#ffffff",
        "navigationBarTextStyle": "black"
      }
    }
  ],
  "tabBar": {
    "list": [
      {
        "pagePath": "pages/index/index",
        "text": "首页",
        "iconPath": "static/icons/home.png",
        "selectedIconPath": "static/icons/home-active.png"
      }
    ]
  }
}
```

### 5.2 路由跳转规范

```javascript
// TabBar 页面跳转
uni.switchTab({
  url: '/pages/index/index'
})

// 普通页面跳转（保留当前页面）
uni.navigateTo({
  url: '/pages/detail/detail?id=123'
})

// 重定向（关闭当前页面）
uni.redirectTo({
  url: '/pages/login/login'
})

// 返回上一页
uni.navigateBack({
  delta: 1
})

// 关闭所有页面，跳转到指定页面
uni.reLaunch({
  url: '/pages/index/index'
})
```

---

## 六、工具函数规范

### 6.1 request.js - 请求封装

```javascript
/**
 * 统一请求封装
 * @param {Object} options - 请求配置
 * @returns {Promise}
 */
export const request = (options) => {
  const baseURL = 'https://api.example.com'
  
  return new Promise((resolve, reject) => {
    uni.request({
      url: baseURL + options.url,
      method: options.method || 'GET',
      data: options.data || {},
      header: {
        'Content-Type': 'application/json',
        'Authorization': uni.getStorageSync('token') || ''
      },
      success: (res) => {
        if (res.statusCode === 200) {
          resolve(res.data)
        } else {
          reject(res.data)
        }
      },
      fail: (err) => {
        reject(err)
      }
    })
  })
}
```

### 6.2 storage.js - 本地存储封装

```javascript
/**
 * 设置本地存储
 */
export const setStorage = (key, value) => {
  try {
    uni.setStorageSync(key, value)
  } catch (e) {
    console.error('存储失败', e)
  }
}

/**
 * 获取本地存储
 */
export const getStorage = (key) => {
  try {
    return uni.getStorageSync(key)
  } catch (e) {
    console.error('读取失败', e)
    return null
  }
}

/**
 * 删除本地存储
 */
export const removeStorage = (key) => {
  try {
    uni.removeStorageSync(key)
  } catch (e) {
    console.error('删除失败', e)
  }
}
```

### 6.3 format.js - 格式化工具

```javascript
/**
 * 格式化时间
 * @param {Date|String|Number} date - 时间
 * @param {String} format - 格式 YYYY-MM-DD HH:mm:ss
 */
export const formatDate = (date, format = 'YYYY-MM-DD HH:mm:ss') => {
  const d = new Date(date)
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  const hour = String(d.getHours()).padStart(2, '0')
  const minute = String(d.getMinutes()).padStart(2, '0')
  const second = String(d.getSeconds()).padStart(2, '0')
  
  return format
    .replace('YYYY', year)
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hour)
    .replace('mm', minute)
    .replace('ss', second)
}

/**
 * 格式化数字（千分位）
 */
export const formatNumber = (num) => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}
```

---

## 七、代码规范检查清单

### 7.1 页面组件检查

- [ ] 是否使用 `<script setup>` 语法
- [ ] 是否使用 `Layout` 组件包裹
- [ ] 是否将逻辑抽离到 composable
- [ ] 样式是否使用 `scoped`
- [ ] 样式是否按模块分区注释

### 7.2 组合式函数检查

- [ ] 文件名是否以 `use` 开头
- [ ] 是否按分区注释（状态、方法、生命周期）
- [ ] 是否添加 JSDoc 注释
- [ ] 是否只返回需要暴露的内容

### 7.3 接口文档检查

- [ ] 是否放在 `src/doc/` 目录下
- [ ] 文件名是否与页面模块对应
- [ ] 是否包含请求信息、参数、响应示例
- [ ] 是否有字段说明和错误码说明

### 7.4 路由配置检查

- [ ] 是否在 `pages.json` 中配置
- [ ] TabBar 页面是否配置图标
- [ ] 是否使用正确的跳转 API

---

## 八、Skill 执行逻辑

当用户调用此 skill 时，我会：

1. **创建页面模式** (`/dev-spec create page <name>`)
   - 创建页面文件夹
   - 生成标准 `.vue` 文件
   - 生成对应 `composable` 文件
   - 生成接口文档模板到 `src/doc/`
   - 提示配置 `pages.json`

2. **检查代码模式** (`/dev-spec check <path>`)
   - 读取指定文件
   - 对照规范检查
   - 输出不符合项
   - 给出修改建议

3. **生成文档模式** (`/dev-spec doc <name>`)
   - 生成标准接口文档模板
   - 放在对应页面文件夹

4. **查看规范模式** (`/dev-spec guide`)
   - 输出完整开发规范说明

---

## 九、注意事项

- 所有页面逻辑必须通过 composable 封装，保持组件纯净
- 每个页面必须在 `src/doc/` 下配置对应的接口文档，方便团队协作
- 公共方法优先放入 utils 目录，避免重复代码
- 路由跳转需使用正确的 API，避免页面栈溢出
- 样式按功能模块分区注释，提高可维护性
- 组件命名使用大驼峰，文件夹使用小驼峰或短横线
- 接口请求统一使用 `request` 工具函数
- 本地存储统一使用 `storage` 工具函数
