'use client'
import { useState } from 'react'
import { Nav, Collapse } from 'react-bootstrap'
import { usePathname } from 'next/navigation'
import { useAuth } from '../AuthContext'
import Link from 'next/link'
// import styles from './Sidebar.module.css'

export default function Sidebar({ isOpen, toggleSidebar }) {
  const pathname = usePathname()
  const { menus } = useAuth()
  const [openMenus, setOpenMenus] = useState({})

  const toggleMenu = (menuId) => {
    setOpenMenus(prev => ({
      ...prev,
      [menuId]: !prev[menuId]
    }))
  }

  const isActive = (url) => {
    return pathname === url
  }

  const isParentActive = (children) => {
    return children?.some(child => pathname === child.url)
  }

  return (
    <>
      {/* Overlay untuk mobile */}
      {isOpen && (
        <div 
          className="sidebar-overlay d-lg-none"
          onClick={toggleSidebar}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            zIndex: 1040
          }}
        />
      )}

      {/* Sidebar */}
      <div 
        className={`sidebar ${isOpen ? 'open' : ''}`}
        style={{
          width: '260px',
          height: '100vh',
          position: 'fixed',
          top: 0,
          left: isOpen ? 0 : '-260px',
          backgroundColor: '#1e293b',
          color: 'white',
          transition: 'left 0.3s ease',
          zIndex: 1050,
          overflowY: 'auto',
          paddingTop: '70px'
        }}
      >
        <Nav className="flex-column px-3 py-4">
          {menus.map((menu) => (
            <div key={menu.id} className="mb-2">
              {menu.children && menu.children.length > 0 ? (
                // Menu with children
                <>
                  <div
                    className={`nav-link text-white d-flex align-items-center justify-content-between cursor-pointer ${
                      isParentActive(menu.children) ? 'bg-primary bg-opacity-25' : ''
                    }`}
                    onClick={() => toggleMenu(menu.id)}
                    style={{ 
                      cursor: 'pointer',
                      borderRadius: '8px',
                      padding: '12px 16px',
                      transition: 'all 0.2s'
                    }}
                  >
                    <span>
                      <i className={`${menu.icon} me-3`}></i>
                      {menu.display_name}
                    </span>
                    <i className={`bi bi-chevron-${openMenus[menu.id] ? 'up' : 'down'}`}></i>
                  </div>
                  
                  <Collapse in={openMenus[menu.id]}>
                    <div className="ms-3">
                      {menu.children.map((child) => (
                        <Link
                          key={child.id}
                          href={child.url}
                          className={`nav-link text-white-50 d-flex align-items-center ${
                            isActive(child.url) ? 'text-white bg-primary bg-opacity-25' : ''
                          }`}
                          style={{
                            borderRadius: '8px',
                            padding: '10px 16px',
                            fontSize: '0.9rem',
                            transition: 'all 0.2s'
                          }}
                        >
                          <i className={`${child.icon || 'bi bi-circle'} me-3 small`}></i>
                          {child.display_name}
                        </Link>
                      ))}
                    </div>
                  </Collapse>
                </>
              ) : (
                // Menu without children
                <Link
                  href={menu.url || '#'}
                  className={`nav-link text-white d-flex align-items-center ${
                    isActive(menu.url) ? 'bg-primary bg-opacity-25' : ''
                  }`}
                  style={{
                    borderRadius: '8px',
                    padding: '12px 16px',
                    transition: 'all 0.2s'
                  }}
                >
                  <i className={`${menu.icon} me-3`}></i>
                  {menu.display_name}
                </Link>
              )}
            </div>
          ))}
        </Nav>

        {/* Footer */}
        <div className="border-top border-secondary p-3 mt-auto">
          <small className="text-white-50 d-block text-center">
            Employee Management v1.0
          </small>
        </div>
      </div>

      <style jsx global>{`
        @media (min-width: 992px) {
          .sidebar {
            left: 0 !important;
          }
        }
        
        .sidebar::-webkit-scrollbar {
          width: 6px;
        }
        
        .sidebar::-webkit-scrollbar-track {
          background: #1e293b;
        }
        
        .sidebar::-webkit-scrollbar-thumb {
          background: #475569;
          border-radius: 3px;
        }
        
        .nav-link:hover {
          background-color: rgba(59, 130, 246, 0.15) !important;
        }
      `}</style>
    </>
  )
}
