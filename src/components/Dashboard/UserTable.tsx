import React from 'react'
import { Card, Table, Tag, Avatar, Space, Typography, Button } from 'antd'
import { UserOutlined, ReloadOutlined } from '@ant-design/icons'
import styled from 'styled-components'

const { Text } = Typography

const StyledCard = styled(Card)`
  background: rgba(45, 45, 45, 0.8);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  
  .ant-card-head {
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    
    .ant-card-head-title {
      color: #ffffff;
      font-weight: bold;
    }
  }
  
  .ant-card-body {
    padding: 24px;
  }
  
  .ant-table {
    background: transparent;
    
    .ant-table-thead > tr > th {
      background: rgba(59, 130, 246, 0.1);
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      color: #ffffff;
      font-weight: bold;
    }
    
    .ant-table-tbody > tr > td {
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
      color: #ffffff;
    }
    
    .ant-table-tbody > tr:hover > td {
      background: rgba(59, 130, 246, 0.05);
    }
  }
`

const StatusTag = styled(Tag)<{ status: 'active' | 'inactive' }>`
  border-radius: 12px;
  border: none;
  font-weight: 500;
  ${props => props.status === 'active' 
    ? `
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
      color: #ffffff;
    `
    : `
      background: linear-gradient(135deg, #6b7280 0%, #4b5563 100%);
      color: #ffffff;
    `
  }
`

interface User {
  id: string
  username: string
  email: string
  lastLogin: string
  status: 'active' | 'inactive'
}

interface UserTableProps {
  data: User[]
  loading: boolean
  onRefresh: () => void
}

const UserTable: React.FC<UserTableProps> = ({ data, loading, onRefresh }) => {
  const columns = [
    {
      title: '用户',
      key: 'user',
      render: (record: User) => (
        <Space>
          <Avatar
            size="small"
            icon={<UserOutlined />}
            style={{
              background: 'linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)',
            }}
          />
          <div>
            <div style={{ color: '#ffffff', fontWeight: 'bold' }}>
              {record.username}
            </div>
            <Text type="secondary" style={{ color: '#a1a1aa', fontSize: '12px' }}>
              {record.email}
            </Text>
          </div>
        </Space>
      ),
    },
    {
      title: '最后登录',
      dataIndex: 'lastLogin',
      key: 'lastLogin',
      render: (text: string) => (
        <Text style={{ color: '#ffffff' }}>
          {text}
        </Text>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: 'active' | 'inactive') => (
        <StatusTag status={status}>
          {status === 'active' ? '活跃' : '离线'}
        </StatusTag>
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: () => (
        <Space>
          <Button type="link" size="small" style={{ color: '#3b82f6' }}>
            查看
          </Button>
          <Button type="link" size="small" style={{ color: '#f59e0b' }}>
            编辑
          </Button>
        </Space>
      ),
    },
  ]

  return (
    <StyledCard
      title="用户列表"
      extra={
        <Button
          type="text"
          icon={<ReloadOutlined />}
          onClick={onRefresh}
          style={{ color: '#3b82f6' }}
        >
          刷新
        </Button>
      }
    >
      <Table
        columns={columns}
        dataSource={data}
        rowKey="id"
        loading={loading}
        pagination={{
          pageSize: 5,
          showSizeChanger: false,
          showQuickJumper: false,
          showTotal: (total) => `共 ${total} 条记录`,
          style: {
            color: '#ffffff',
          },
        }}
        size="middle"
      />
    </StyledCard>
  )
}

export default UserTable