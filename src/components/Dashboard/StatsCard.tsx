import React from 'react'
import { Card, Statistic, Row, Col } from 'antd'
import { 
  UserOutlined, 
  TeamOutlined, 
  UserAddOutlined, 
  RiseOutlined 
} from '@ant-design/icons'
import styled from 'styled-components'

const StyledCard = styled(Card)`
  background: rgba(45, 45, 45, 0.8);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4);
  }
  
  .ant-card-body {
    padding: 24px;
  }
  
  .ant-statistic-title {
    color: #a1a1aa !important;
    font-size: 14px;
    margin-bottom: 8px;
  }
  
  .ant-statistic-content {
    color: #ffffff !important;
    font-size: 28px;
    font-weight: bold;
  }
  
  .ant-statistic-content-suffix {
    color: #10b981 !important;
    font-size: 16px;
  }
`

const IconWrapper = styled.div<{ color: string }>`
  width: 60px;
  height: 60px;
  border-radius: 12px;
  background: linear-gradient(135deg, ${props => props.color}20 0%, ${props => props.color}10 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
  
  .anticon {
    font-size: 24px;
    color: ${props => props.color};
  }
`

interface StatsCardProps {
  title: string
  value: number
  suffix?: string
  icon: React.ReactNode
  color: string
  precision?: number
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  suffix,
  icon,
  color,
  precision = 0,
}) => {
  return (
    <StyledCard>
      <IconWrapper color={color}>
        {icon}
      </IconWrapper>
      <Statistic
        title={title}
        value={value}
        suffix={suffix}
        precision={precision}
      />
    </StyledCard>
  )
}

interface StatsCardsProps {
  data: {
    totalUsers: number
    activeUsers: number
    newUsers: number
    growthRate: number
  }
}

const StatsCards: React.FC<StatsCardsProps> = ({ data }) => {
  return (
    <Row gutter={[24, 24]}>
      <Col xs={24} sm={12} lg={6}>
        <StatsCard
          title="总用户数"
          value={data.totalUsers}
          icon={<UserOutlined />}
          color="#3b82f6"
        />
      </Col>
      <Col xs={24} sm={12} lg={6}>
        <StatsCard
          title="活跃用户"
          value={data.activeUsers}
          icon={<TeamOutlined />}
          color="#10b981"
        />
      </Col>
      <Col xs={24} sm={12} lg={6}>
        <StatsCard
          title="新增用户"
          value={data.newUsers}
          icon={<UserAddOutlined />}
          color="#f59e0b"
        />
      </Col>
      <Col xs={24} sm={12} lg={6}>
        <StatsCard
          title="增长率"
          value={data.growthRate}
          suffix="%"
          precision={1}
          icon={<RiseOutlined />}
          color="#ef4444"
        />
      </Col>
    </Row>
  )
}

export default StatsCards