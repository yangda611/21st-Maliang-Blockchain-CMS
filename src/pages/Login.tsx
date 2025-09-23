import React, { useState } from 'react'
import { Form, Input, Button, Card, Typography, message } from 'antd'
import { UserOutlined, LockOutlined, LoginOutlined } from '@ant-design/icons'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { authAPI } from '@/services/api'
import styled from 'styled-components'

const { Title, Text } = Typography

const LoginContainer = styled.div`
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
      radial-gradient(circle at 20% 80%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, rgba(16, 185, 129, 0.1) 0%, transparent 50%);
    animation: pulse 4s ease-in-out infinite;
  }
`

const LoginCard = styled(Card)`
  width: 400px;
  border-radius: 16px;
  box-shadow: 
    0 20px 40px rgba(0, 0, 0, 0.3),
    0 0 0 1px rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  background: rgba(45, 45, 45, 0.9);
  border: none;
  animation: fadeIn 0.8s ease-out;
  
  .ant-card-body {
    padding: 40px;
  }
`

const Logo = styled.div`
  text-align: center;
  margin-bottom: 32px;
  
  .logo-icon {
    font-size: 48px;
    color: #3b82f6;
    margin-bottom: 16px;
    animation: pulse 2s infinite;
  }
`

const Login: React.FC = () => {
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuthStore()

  const onFinish = async (values: { username: string; password: string }) => {
    setLoading(true)
    
    try {
      // 尝试使用真实 API 登录
      try {
        const response = await authAPI.login(values)
        login(response.user, response.token)
        message.success('登录成功！')
        
        // 重定向到之前访问的页面或首页
        const from = location.state?.from?.pathname || '/dashboard'
        navigate(from, { replace: true })
      } catch (apiError) {
        console.warn('API 登录失败，使用模拟登录:', apiError)
        
        // 模拟登录 API 调用
        await new Promise(resolve => setTimeout(resolve, 1500))
        
        // 模拟登录验证
        if (values.username === 'admin' && values.password === 'admin123') {
          const mockUser = {
            id: '1',
            username: '管理员',
            email: 'admin@cms.com',
            role: 'admin',
          }
          
          const mockToken = 'mock-jwt-token-' + Date.now()
          
          login(mockUser, mockToken)
          message.success('登录成功！')
          
          // 重定向到之前访问的页面或首页
          const from = location.state?.from?.pathname || '/dashboard'
          navigate(from, { replace: true })
        } else {
          message.error('用户名或密码错误！')
        }
      }
    } catch (error) {
      message.error('登录失败，请重试！')
    } finally {
      setLoading(false)
    }
  }

  return (
    <LoginContainer>
      <LoginCard>
        <Logo>
          <div className="logo-icon">
            <LoginOutlined />
          </div>
          <Title level={2} style={{ color: '#ffffff', margin: 0 }}>
            CMS 管理后台
          </Title>
          <Text type="secondary" style={{ color: '#a1a1aa' }}>
            管理员登录系统
          </Text>
        </Logo>
        
        <Form
          name="login"
          onFinish={onFinish}
          autoComplete="off"
          size="large"
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: '请输入用户名!' }]}
          >
            <Input
              prefix={<UserOutlined style={{ color: '#a1a1aa' }} />}
              placeholder="用户名"
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '8px',
                color: '#ffffff',
              }}
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: '请输入密码!' }]}
          >
            <Input.Password
              prefix={<LockOutlined style={{ color: '#a1a1aa' }} />}
              placeholder="密码"
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '8px',
                color: '#ffffff',
              }}
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              block
              style={{
                height: '48px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)',
                border: 'none',
                fontSize: '16px',
                fontWeight: 'bold',
              }}
            >
              {loading ? '登录中...' : '登录'}
            </Button>
          </Form.Item>
        </Form>
        
        <div style={{ textAlign: 'center', marginTop: '24px' }}>
          <Text type="secondary" style={{ color: '#6b7280', fontSize: '12px' }}>
            默认账号：admin / admin123
          </Text>
        </div>
      </LoginCard>
    </LoginContainer>
  )
}

export default Login