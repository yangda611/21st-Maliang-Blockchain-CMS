import React from 'react'
import { Spin } from 'antd'
import styled, { keyframes } from 'styled-components'

const pulse = keyframes`
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.7;
    transform: scale(1.1);
  }
`

const StyledSpin = styled(Spin)`
  .ant-spin-dot {
    i {
      background-color: #3b82f6;
      animation: ${pulse} 1.4s infinite ease-in-out;
    }
    
    i:nth-child(1) {
      animation-delay: -0.32s;
    }
    
    i:nth-child(2) {
      animation-delay: -0.16s;
    }
  }
  
  .ant-spin-text {
    color: #ffffff;
    font-size: 14px;
    margin-top: 16px;
  }
`

interface LoadingSpinnerProps {
  size?: 'small' | 'default' | 'large'
  tip?: string
  spinning?: boolean
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'large',
  tip = '加载中...',
  spinning = true,
}) => {
  return (
    <StyledSpin size={size} tip={tip} spinning={spinning} />
  )
}

export default LoadingSpinner