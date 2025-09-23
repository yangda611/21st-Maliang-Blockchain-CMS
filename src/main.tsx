import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ConfigProvider } from 'antd'
import zhCN from 'antd/locale/zh_CN'
import App from './App.tsx'
import './index.css'

// 暗黑主题配置
const darkTheme = {
  algorithm: 'dark' as const,
  token: {
    colorBgBase: '#1a1a1a',
    colorBgContainer: '#2d2d2d',
    colorBgElevated: '#3a3a3a',
    colorPrimary: '#3b82f6',
    colorSuccess: '#10b981',
    colorWarning: '#f59e0b',
    colorError: '#ef4444',
    colorText: '#ffffff',
    colorTextSecondary: '#a1a1aa',
    borderRadius: 12,
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  },
  components: {
    Layout: {
      bodyBg: '#1a1a1a',
      siderBg: '#2d2d2d',
      headerBg: '#2d2d2d',
    },
    Menu: {
      darkItemBg: '#2d2d2d',
      darkItemSelectedBg: '#3b82f6',
      darkItemHoverBg: '#3a3a3a',
    },
  },
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <ConfigProvider locale={zhCN} theme={darkTheme}>
        <App />
      </ConfigProvider>
    </BrowserRouter>
  </React.StrictMode>,
)