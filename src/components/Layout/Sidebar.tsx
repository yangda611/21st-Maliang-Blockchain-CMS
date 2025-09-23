import React, { useState } from 'react'
import { Layout, Menu, Button } from 'antd'
import { 
  DashboardOutlined, 
  UserOutlined, 
  FileTextOutlined,
  SettingOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined
} from '@ant-design/icons'
import { useNavigate, useLocation } from 'react-router-dom'
import styled from 'styled-components'

const { Sider } = Layout

const StyledSider = styled(Sider)`
  background: rgba(45, 45, 45, 0.95) !important;
  backdrop-filter: blur(10px);
  border-right: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.1);
  
  .ant-layout-sider-children {
    display: flex;
    flex-direction: column;
  }
  
  .ant-menu {
    background: transparent !important;
    border-right: none !important;
    flex: 1;
  }
  
  .ant-menu-item {
    margin: 4px 12px !important;
    border-radius: 8px !important;
    height: 48px !important;
    line-height: 48px !important;
    
    &:hover {
      background: rgba(59, 130, 246, 0.1) !important;
      color: #3b82f6 !important;
    }
    
    &.ant-menu-item-selected {
      background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%) !important;
      color: #ffffff !important;
      box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
    }
  }
  
  .ant-menu-item-icon {
    font-size: 18px !important;
  }
`

const CollapseButton = styled(Button)`
  position: absolute;
  top: 16px;
  right: -12px;
  z-index: 1000;
  background: rgba(45, 45, 45, 0.9);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #ffffff;
  
  &:hover {
    background: rgba(59, 130, 246, 0.1);
    border-color: #3b82f6;
    color: #3b82f6;
  }
`

const Sidebar: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  const menuItems = [
    {
      key: '/dashboard',
      icon: <DashboardOutlined />,
      label: '首页',
    },
    {
      key: '/users',
      icon: <UserOutlined />,
      label: '用户管理',
      disabled: true, // 暂时禁用，后续扩展
    },
    {
      key: '/content',
      icon: <FileTextOutlined />,
      label: '内容管理',
      disabled: true, // 暂时禁用，后续扩展
    },
    {
      key: '/settings',
      icon: <SettingOutlined />,
      label: '系统设置',
      disabled: true, // 暂时禁用，后续扩展
    },
  ]

  const handleMenuClick = ({ key }: { key: string }) => {
    if (!menuItems.find(item => item.key === key)?.disabled) {
      navigate(key)
    }
  }

  return (
    <StyledSider
      collapsible
      collapsed={collapsed}
      onCollapse={setCollapsed}
      width={250}
      collapsedWidth={80}
      trigger={null}
    >
      <CollapseButton
        type="text"
        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        onClick={() => setCollapsed(!collapsed)}
      />
      
      <Menu
        mode="inline"
        selectedKeys={[location.pathname]}
        items={menuItems}
        onClick={handleMenuClick}
        style={{ marginTop: '24px' }}
      />
    </StyledSider>
  )
}

export default Sidebar