import React from 'react'
import { Layout } from 'antd'
import Header from './Header'
import Sidebar from './Sidebar'
import styled from 'styled-components'

const { Content } = Layout

const StyledLayout = styled(Layout)`
  height: 100vh;
  background: #1a1a1a;
`

const StyledContent = styled(Content)`
  margin: 0;
  padding: 24px;
  background: #1a1a1a;
  overflow-y: auto;
  position: relative;
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: #2d2d2d;
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #4a4a4a;
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: #5a5a5a;
  }
`

interface MainLayoutProps {
  children: React.ReactNode
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <StyledLayout>
      <Sidebar />
      <Layout>
        <Header />
        <StyledContent>
          {children}
        </StyledContent>
      </Layout>
    </StyledLayout>
  )
}

export default MainLayout