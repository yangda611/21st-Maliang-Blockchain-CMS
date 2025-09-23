import { create } from 'zustand'
import { dashboardAPI, type DashboardData } from '@/services/api'

export interface UserStats {
  totalUsers: number
  activeUsers: number
  newUsers: number
  growthRate: number
}

export interface ChartData {
  name: string
  value: number
  date?: string
}

interface DashboardState {
  data: DashboardData | null
  loading: boolean
  error: string | null
  fetchData: () => Promise<void>
  refreshData: () => Promise<void>
}

// 模拟真实数据
const generateMockData = (): DashboardData => {
  const now = new Date()
  const userGrowthData: ChartData[] = []
  const userActivityData: ChartData[] = []
  
  // 生成过去30天的用户增长数据
  for (let i = 29; i >= 0; i--) {
    const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000)
    userGrowthData.push({
      name: date.toISOString().split('T')[0],
      value: Math.floor(Math.random() * 50) + 20,
    })
  }
  
  // 生成过去7天的用户活跃度数据
  for (let i = 6; i >= 0; i--) {
    const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000)
    userActivityData.push({
      name: date.toISOString().split('T')[0],
      value: Math.floor(Math.random() * 200) + 100,
    })
  }
  
  return {
    userStats: {
      totalUsers: 1248,
      activeUsers: 892,
      newUsers: 45,
      growthRate: 12.5,
    },
    userGrowthData,
    userActivityData,
    topUsers: [
      {
        id: '1',
        username: '张三',
        email: 'zhangsan@example.com',
        lastLogin: '2024-01-15 14:30:00',
        status: 'active',
      },
      {
        id: '2',
        username: '李四',
        email: 'lisi@example.com',
        lastLogin: '2024-01-15 13:45:00',
        status: 'active',
      },
      {
        id: '3',
        username: '王五',
        email: 'wangwu@example.com',
        lastLogin: '2024-01-15 12:20:00',
        status: 'inactive',
      },
      {
        id: '4',
        username: '赵六',
        email: 'zhaoliu@example.com',
        lastLogin: '2024-01-15 11:15:00',
        status: 'active',
      },
      {
        id: '5',
        username: '钱七',
        email: 'qianqi@example.com',
        lastLogin: '2024-01-15 10:30:00',
        status: 'active',
      },
    ],
  }
}

export const useDashboardStore = create<DashboardState>((set) => ({
  data: null,
  loading: false,
  error: null,
  
  fetchData: async () => {
    set({ loading: true, error: null })
    
    try {
      // 尝试使用真实 API，失败时使用模拟数据
      try {
        const apiData = await dashboardAPI.getDashboardData()
        set({ data: apiData, loading: false })
      } catch (apiError) {
        console.warn('API 调用失败，使用模拟数据:', apiError)
        // 模拟 API 调用延迟
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        const mockData = generateMockData()
        set({ data: mockData, loading: false })
      }
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : '获取数据失败',
        loading: false 
      })
    }
  },
  
  refreshData: async () => {
    set({ loading: true, error: null })
    
    try {
      // 尝试使用真实 API，失败时使用模拟数据
      try {
        const apiData = await dashboardAPI.refreshData()
        set({ data: apiData, loading: false })
      } catch (apiError) {
        console.warn('API 刷新失败，使用模拟数据:', apiError)
        // 模拟 API 调用延迟
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        const mockData = generateMockData()
        set({ data: mockData, loading: false })
      }
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : '刷新数据失败',
        loading: false 
      })
    }
  },
}))