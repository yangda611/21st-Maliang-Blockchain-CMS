'use client'

import { useState, useEffect } from 'react'
import { SignInPage, Testimonial } from '@/components/ui/sign-in'
import { signInAdmin, testSupabaseConnection } from '@/lib/supabase'

const sampleTestimonials: Testimonial[] = [
  {
    avatarSrc: "https://randomuser.me/api/portraits/women/57.jpg",
    name: "Sarah Chen",
    handle: "@sarahdigital",
    text: "Amazing platform! The user experience is seamless and the features are exactly what I needed."
  },
  {
    avatarSrc: "https://randomuser.me/api/portraits/men/64.jpg",
    name: "Marcus Johnson",
    handle: "@marcustech",
    text: "This service has transformed how I work. Clean design, powerful features, and excellent support."
  },
  {
    avatarSrc: "https://randomuser.me/api/portraits/men/32.jpg",
    name: "David Martinez",
    handle: "@davidcreates",
    text: "I've tried many platforms, but this one stands out. Intuitive, reliable, and genuinely helpful for productivity."
  },
];

export default function AdminLoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  const [connectionStatus, setConnectionStatus] = useState<string>('检查中...')

  // 页面加载时测试 Supabase 连接
  useEffect(() => {
    const testConnection = async () => {
      const result = await testSupabaseConnection()
      setConnectionStatus(result.success ? '✅ 数据库连接正常' : `❌ ${result.message}`)
    }
    testConnection()
  }, [])

  const handleSignIn = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsLoading(true)
    setMessage(null)

    const formData = new FormData(event.currentTarget)
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    try {
      const { user, error } = await signInAdmin(email, password)
      
      if (error) {
        setMessage({ type: 'error', text: error })
      } else if (user) {
        setMessage({ type: 'success', text: '登录成功！欢迎回来，管理员！' })
        // 这里可以添加跳转到管理后台的逻辑
        // router.push('/maliang-admin/dashboard')
      }
    } catch (error) {
      setMessage({ type: 'error', text: '登录失败，请检查网络连接' })
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignIn = () => {
    setMessage({ type: 'error', text: 'Google 登录功能暂未开放' })
  }
  
  const handleResetPassword = () => {
    setMessage({ type: 'error', text: '密码重置功能暂未开放，请联系系统管理员' })
  }

  const handleCreateAccount = () => {
    setMessage({ type: 'error', text: '注册功能暂未开放，请联系系统管理员' })
  }

  return (
    <div className="bg-background text-foreground relative">
      {/* 消息提示 */}
      {message && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg max-w-sm ${
          message.type === 'success' 
            ? 'bg-green-500 text-white' 
            : 'bg-red-500 text-white'
        }`}>
          <div className="flex items-center justify-between">
            <span>{message.text}</span>
            <button 
              onClick={() => setMessage(null)}
              className="ml-4 text-white hover:text-gray-200"
            >
              ×
            </button>
          </div>
        </div>
      )}

      <SignInPage
        title={
          <span className="font-light text-foreground tracking-tighter">
            Maliang Admin
          </span>
        }
        description={`登录到Maliang区块链CMS系统 - ${connectionStatus}`}
        heroImageSrc="https://images.unsplash.com/photo-1642615835477-d303d7dc9ee9?w=2160&q=80"
        testimonials={sampleTestimonials}
        onSignIn={handleSignIn}
        onGoogleSignIn={handleGoogleSignIn}
        onResetPassword={handleResetPassword}
        onCreateAccount={handleCreateAccount}
      />

      {/* 加载状态覆盖层 */}
      {isLoading && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
            <div className="flex items-center space-x-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
              <span className="text-gray-700 dark:text-gray-300">正在登录...</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

