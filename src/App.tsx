import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import ProtectedRoute from '@/components/ProtectedRoute'
import MainLayout from '@/components/Layout/MainLayout'
import Login from '@/pages/Login'
import Dashboard from '@/pages/Dashboard'

const App: React.FC = () => {
  const { isAuthenticated } = useAuthStore()

  return (
    <Routes>
      {/* 登录页面 */}
      <Route 
        path="/login" 
        element={
          isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />
        } 
      />
      
      {/* 受保护的路由 */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <MainLayout>
              <Navigate to="/dashboard" replace />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <MainLayout>
              <Dashboard />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      
      {/* 404 页面 */}
      <Route
        path="*"
        element={
          <ProtectedRoute>
            <MainLayout>
              <div style={{ 
                textAlign: 'center', 
                padding: '100px 20px',
                color: '#ffffff'
              }}>
                <h1>404 - 页面未找到</h1>
                <p>您访问的页面不存在</p>
              </div>
            </MainLayout>
          </ProtectedRoute>
        }
      />
    </Routes>
  )
}

export default App