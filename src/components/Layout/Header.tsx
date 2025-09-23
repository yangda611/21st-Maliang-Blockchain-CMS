import React from 'react'
import { Layout, Avatar, Dropdown, Button, Space, Typography } from 'antd'
import { UserOutlined, LogoutOutlined, SettingOutlined } from '@ant-design/icons'
import { useAuthStore } from '@/store/authStore'
import styled from 'styled-components'

const { Header: AntHeader } = Layout
const { Text } = Typography

const StyledHeader = styled(AntHeader)`
  background: rgba(45, 45, 45, 0.9);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  position: relative;
  z-index: 100;
`

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  
  .logo-icon {
    font-size: 24px;
    color: #3b82f6;
  }
  
  .logo-text {
    font-size: 18px;
    font-weight: bold;
    color: #ffffff;
  }
`

const UserSection = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`

const Header: React.FC = () => {
  const { user, logout } = useAuthStore()

  const handleLogout = () => {
    logout()
  }

  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: '个人资料',
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: '系统设置',
    },
    {
      type: 'divider' as const,
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
      onClick: handleLogout,
    },
  ]

  return (
    <StyledHeader>
      <Logo>
        <div className="logo-icon">📊</div>
        <div className="logo-text">CMS 管理后台</div>
      </Logo>
      
      <UserSection>
        <Space>
          <Text style={{ color: '#a1a1aa' }}>
            欢迎回来，{user?.username}
          </Text>
          <Dropdown
            menu={{ items: userMenuItems }}
            placement="bottomRight"
            arrow
          >
            <Button
              type="text"
              style={{
                padding: '4px 8px',
                height: 'auto',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <Avatar
                size="small"
                icon={<UserOutlined />}
                style={{
                  background: 'linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)',
                }}
              />
            </Button>
          </Dropdown>
        </Space>
      </UserSection>
    </StyledHeader>
  )
}

export default Header