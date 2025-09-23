import React, { useEffect } from 'react'
import { Row, Col, Typography, Button, Space } from 'antd'
import { ReloadOutlined, DashboardOutlined } from '@ant-design/icons'
import { useDashboardStore } from '@/store/dashboardStore'
import StatsCards from '@/components/Dashboard/StatsCard'
import Charts from '@/components/Dashboard/Charts'
import UserTable from '@/components/Dashboard/UserTable'
import LoadingSpinner from '@/components/Common/LoadingSpinner'
import AnimatedCard from '@/components/Common/AnimatedCard'
import styled from 'styled-components'

const { Title, Text } = Typography

const DashboardContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
      radial-gradient(circle at 20% 20%, rgba(59, 130, 246, 0.05) 0%, transparent 50%),
      radial-gradient(circle at 80% 80%, rgba(16, 185, 129, 0.05) 0%, transparent 50%);
    pointer-events: none;
  }
`

const Header = styled.div`
  margin-bottom: 32px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
`

const TitleSection = styled.div`
  .dashboard-icon {
    font-size: 32px;
    color: #3b82f6;
    margin-right: 12px;
  }
  
  .dashboard-title {
    color: #ffffff;
    margin: 0;
    font-size: 28px;
    font-weight: bold;
  }
  
  .dashboard-subtitle {
    color: #a1a1aa;
    margin: 4px 0 0 0;
    font-size: 14px;
  }
`

const ActionSection = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
`

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 400px;
`

const Dashboard: React.FC = () => {
  const { data, loading, error, fetchData, refreshData } = useDashboardStore()

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const handleRefresh = () => {
    refreshData()
  }

  if (loading && !data) {
    return (
      <DashboardContainer>
        <LoadingContainer>
          <LoadingSpinner size="large" tip="正在加载数据..." />
        </LoadingContainer>
      </DashboardContainer>
    )
  }

  if (error) {
    return (
      <DashboardContainer>
        <div style={{ textAlign: 'center', padding: '100px 20px' }}>
          <Text style={{ color: '#ef4444', fontSize: '16px' }}>
            加载失败: {error}
          </Text>
          <br />
          <Button 
            type="primary" 
            onClick={handleRefresh}
            style={{ marginTop: '16px' }}
          >
            重试
          </Button>
        </div>
      </DashboardContainer>
    )
  }

  if (!data) {
    return null
  }

  return (
    <DashboardContainer>
      <Header>
        <TitleSection>
          <Title level={2} className="dashboard-title">
            <DashboardOutlined className="dashboard-icon" />
            数据概览
          </Title>
          <Text className="dashboard-subtitle">
            实时监控系统用户数据和活跃度
          </Text>
        </TitleSection>
        
        <ActionSection>
          <Space>
            <Text type="secondary" style={{ color: '#a1a1aa' }}>
              最后更新: {new Date().toLocaleString()}
            </Text>
            <Button
              type="primary"
              icon={<ReloadOutlined />}
              onClick={handleRefresh}
              loading={loading}
              style={{
                background: 'linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)',
                border: 'none',
                borderRadius: '8px',
              }}
            >
              刷新数据
            </Button>
          </Space>
        </ActionSection>
      </Header>

      {/* 统计卡片 */}
      <AnimatedCard delay={100}>
        <div style={{ marginBottom: '32px' }}>
          <StatsCards data={data.userStats} />
        </div>
      </AnimatedCard>

      {/* 图表区域 */}
      <AnimatedCard delay={200}>
        <div style={{ marginBottom: '32px' }}>
          <Charts
            userGrowthData={data.userGrowthData}
            userActivityData={data.userActivityData}
            loading={loading}
          />
        </div>
      </AnimatedCard>

      {/* 用户表格 */}
      <AnimatedCard delay={300}>
        <div>
          <UserTable
            data={data.topUsers}
            loading={loading}
            onRefresh={handleRefresh}
          />
        </div>
      </AnimatedCard>
    </DashboardContainer>
  )
}

export default Dashboard