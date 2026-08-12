import type { ReactNode } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { HomePage } from './pages/HomePage'
import { CampaignPage } from './pages/CampaignPage'
import { VerifyPage } from './pages/VerifyPage'
import { PassPage } from './pages/PassPage'
import { AdminLoginPage } from './pages/AdminLoginPage'
import { AdminDashboardPage } from './pages/AdminDashboardPage'

function ProtectedRoute({ children }: { children: ReactNode }) {
  const token = localStorage.getItem('dubwf_admin_token')
  if (!token) {
    return <Navigate to="/admin/login" replace />
  }
  return children
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/campaign" element={<CampaignPage />} />
      <Route path="/verify/:token" element={<VerifyPage />} />
      <Route path="/pass/:token" element={<PassPage />} />
      <Route path="/admin/login" element={<AdminLoginPage />} />
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute>
            <AdminDashboardPage />
          </ProtectedRoute>
        }
      />
    </Routes>
  )
}
