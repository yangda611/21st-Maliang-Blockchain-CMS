import axios from 'axios'

// 创建 axios 实例
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// 请求拦截器
api.interceptors.request.use(
  (config) => {
    // 从 localStorage 获取 token
    const token = localStorage.getItem('auth-storage')
    if (token) {
      try {
        const authData = JSON.parse(token)
        if (authData.state?.token) {
          config.headers.Authorization = `Bearer ${authData.state.token}`
        }
      } catch (error) {
        console.error('Failed to parse auth token:', error)
      }
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token 过期或无效，清除本地存储并跳转到登录页
      localStorage.removeItem('auth-storage')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// API 接口定义
export interface LoginRequest {
  username: string
  password: string
}

export interface LoginResponse {
  user: {
    id: string
    username: string
    email: string
    role: string
  }
  token: string
}

export interface DashboardData {
  userStats: {
    totalUsers: number
    activeUsers: number
    newUsers: number
    growthRate: number
  }
  userGrowthData: Array<{
    name: string
    value: number
  }>
  userActivityData: Array<{
    name: string
    value: number
  }>
  topUsers: Array<{
    id: string
    username: string
    email: string
    lastLogin: string
    status: 'active' | 'inactive'
  }>
}

// API 方法
export const authAPI = {
  login: (data: LoginRequest): Promise<LoginResponse> => {
    return api.post('/auth/login', data).then(res => res.data)
  },
  
  logout: (): Promise<void> => {
    return api.post('/auth/logout').then(res => res.data)
  },
  
  getProfile: (): Promise<LoginResponse['user']> => {
    return api.get('/auth/profile').then(res => res.data)
  },
}

export const dashboardAPI = {
  getDashboardData: (): Promise<DashboardData> => {
    return api.get('/dashboard').then(res => res.data)
  },
  
  refreshData: (): Promise<DashboardData> => {
    return api.get('/dashboard/refresh').then(res => res.data)
  },
}

export default api