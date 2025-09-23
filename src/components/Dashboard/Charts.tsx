import React, { useEffect, useRef } from 'react'
import { Card, Row, Col } from 'antd'
import * as echarts from 'echarts'
import styled from 'styled-components'

const StyledCard = styled(Card)`
  background: rgba(45, 45, 45, 0.8);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  margin-bottom: 24px;
  
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
`

const ChartContainer = styled.div`
  width: 100%;
  height: 300px;
  position: relative;
`

interface ChartData {
  name: string
  value: number
  date?: string
}

interface ChartsProps {
  userGrowthData: ChartData[]
  userActivityData: ChartData[]
  loading: boolean
}

const Charts: React.FC<ChartsProps> = ({ userGrowthData, userActivityData, loading }) => {
  const growthChartRef = useRef<HTMLDivElement>(null)
  const activityChartRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (userGrowthData.length > 0 && growthChartRef.current) {
      const chart = echarts.init(growthChartRef.current)
      
      const option = {
        backgroundColor: 'transparent',
        tooltip: {
          trigger: 'axis',
          backgroundColor: 'rgba(45, 45, 45, 0.9)',
          borderColor: 'rgba(255, 255, 255, 0.1)',
          textStyle: {
            color: '#ffffff',
          },
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true,
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: userGrowthData.map(item => item.name),
          axisLine: {
            lineStyle: {
              color: '#4a4a4a',
            },
          },
          axisLabel: {
            color: '#a1a1aa',
          },
        },
        yAxis: {
          type: 'value',
          axisLine: {
            lineStyle: {
              color: '#4a4a4a',
            },
          },
          axisLabel: {
            color: '#a1a1aa',
          },
          splitLine: {
            lineStyle: {
              color: '#3a3a3a',
            },
          },
        },
        series: [
          {
            name: '新增用户',
            type: 'line',
            smooth: true,
            data: userGrowthData.map(item => item.value),
            lineStyle: {
              color: '#3b82f6',
              width: 3,
            },
            itemStyle: {
              color: '#3b82f6',
            },
            areaStyle: {
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  {
                    offset: 0,
                    color: 'rgba(59, 130, 246, 0.3)',
                  },
                  {
                    offset: 1,
                    color: 'rgba(59, 130, 246, 0.05)',
                  },
                ],
              },
            },
            animationDelay: (idx: number) => idx * 50,
          },
        ],
        animation: true,
        animationDuration: 1000,
        animationEasing: 'cubicOut' as any,
      }
      
      chart.setOption(option)
      
      const handleResize = () => chart.resize()
      window.addEventListener('resize', handleResize)
      
      return () => {
        window.removeEventListener('resize', handleResize)
        chart.dispose()
      }
    }
  }, [userGrowthData])

  useEffect(() => {
    if (userActivityData.length > 0 && activityChartRef.current) {
      const chart = echarts.init(activityChartRef.current)
      
      const option = {
        backgroundColor: 'transparent',
        tooltip: {
          trigger: 'axis',
          backgroundColor: 'rgba(45, 45, 45, 0.9)',
          borderColor: 'rgba(255, 255, 255, 0.1)',
          textStyle: {
            color: '#ffffff',
          },
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true,
        },
        xAxis: {
          type: 'category',
          data: userActivityData.map(item => item.name),
          axisLine: {
            lineStyle: {
              color: '#4a4a4a',
            },
          },
          axisLabel: {
            color: '#a1a1aa',
          },
        },
        yAxis: {
          type: 'value',
          axisLine: {
            lineStyle: {
              color: '#4a4a4a',
            },
          },
          axisLabel: {
            color: '#a1a1aa',
          },
          splitLine: {
            lineStyle: {
              color: '#3a3a3a',
            },
          },
        },
        series: [
          {
            name: '活跃用户',
            type: 'bar',
            data: userActivityData.map(item => item.value),
            itemStyle: {
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  {
                    offset: 0,
                    color: '#10b981',
                  },
                  {
                    offset: 1,
                    color: '#059669',
                  },
                ],
              },
              borderRadius: [4, 4, 0, 0],
            },
            animationDelay: (idx: number) => idx * 100,
          },
        ],
        animation: true,
        animationDuration: 1000,
        animationEasing: 'elasticOut' as any,
      }
      
      chart.setOption(option)
      
      const handleResize = () => chart.resize()
      window.addEventListener('resize', handleResize)
      
      return () => {
        window.removeEventListener('resize', handleResize)
        chart.dispose()
      }
    }
  }, [userActivityData])

  if (loading) {
    return (
      <Row gutter={[24, 24]}>
        <Col xs={24} lg={12}>
          <StyledCard title="用户增长趋势" loading>
            <ChartContainer />
          </StyledCard>
        </Col>
        <Col xs={24} lg={12}>
          <StyledCard title="用户活跃度" loading>
            <ChartContainer />
          </StyledCard>
        </Col>
      </Row>
    )
  }

  return (
    <Row gutter={[24, 24]}>
      <Col xs={24} lg={12}>
        <StyledCard title="用户增长趋势">
          <ChartContainer ref={growthChartRef} />
        </StyledCard>
      </Col>
      <Col xs={24} lg={12}>
        <StyledCard title="用户活跃度">
          <ChartContainer ref={activityChartRef} />
        </StyledCard>
      </Col>
    </Row>
  )
}

export default Charts