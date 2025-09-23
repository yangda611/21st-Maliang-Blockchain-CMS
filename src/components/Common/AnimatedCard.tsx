import React from 'react'
import styled, { keyframes } from 'styled-components'

const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`

const StyledCard = styled.div<{ delay?: number }>`
  animation: ${fadeInUp} 0.6s ease-out ${props => props.delay || 0}ms both;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-4px);
  }
`

interface AnimatedCardProps {
  children: React.ReactNode
  delay?: number
  className?: string
}

const AnimatedCard: React.FC<AnimatedCardProps> = ({
  children,
  delay = 0,
  className,
}) => {
  return (
    <StyledCard delay={delay} className={className}>
      {children}
    </StyledCard>
  )
}

export default AnimatedCard