'use client'
import { useState } from 'react'
import { Container } from 'react-bootstrap'
import Navbar from './Navbar'
import Sidebar from './Sidebar'
import { useAuth } from '../AuthContext'

export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { loading } = useAuth()

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="dashboard-layout">
      <Navbar toggleSidebar={toggleSidebar} />
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      
      <main 
        style={{
          marginLeft: window.innerWidth >= 992 ? '260px' : '0',
          minHeight: 'calc(100vh - 70px)',
          backgroundColor: '#f8f9fa',
          transition: 'margin-left 0.3s ease'
        }}
      >
        <Container fluid className="py-4">
          {children}
        </Container>
      </main>

      <style jsx global>{`
        @media (min-width: 992px) {
          main {
            margin-left: 260px !important;
          }
        }
      `}</style>
    </div>
  )
}
