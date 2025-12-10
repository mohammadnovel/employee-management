'use client'
import { useState } from 'react'
import { Navbar, Container, Nav, NavDropdown, Badge } from 'react-bootstrap'
import { useAuth } from '../AuthContext'
// import styles from './Navbar.module.css'

export default function TopNavbar({ toggleSidebar }) {
  const { user, logout } = useAuth()

  const getRoleBadge = (role) => {
    const badges = {
      super_admin: { variant: 'danger', text: 'Super Admin' },
      admin: { variant: 'primary', text: 'Admin' },
      manager: { variant: 'warning', text: 'Manager' },
      user: { variant: 'secondary', text: 'User' }
    }
    return badges[role] || badges.user
  }

  const roleBadge = getRoleBadge(user?.role)

  return (
    <Navbar bg="white" expand="lg" className="border-bottom shadow-sm sticky-top">
      <Container fluid>
        <button 
          className="btn btn-link text-dark d-lg-none me-3"
          onClick={toggleSidebar}
          aria-label="Toggle sidebar"
        >
          <i className="bi bi-list fs-4"></i>
        </button>
        
        <Navbar.Brand href="/dashboard" className="fw-bold text-primary">
          <i className="bi bi-building me-2"></i>
          Employee MS
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="navbar-nav" />
        
        <Navbar.Collapse id="navbar-nav">
          <Nav className="ms-auto align-items-center">
            {/* Notifications */}
            <Nav.Link href="#" className="position-relative me-3">
              <i className="bi bi-bell fs-5"></i>
              <Badge 
                bg="danger" 
                pill 
                className="position-absolute top-0 start-100 translate-middle"
                style={{ fontSize: '0.65rem' }}
              >
                3
              </Badge>
            </Nav.Link>

            {/* User Menu */}
            <NavDropdown
              title={
                <span>
                  <i className="bi bi-person-circle fs-5 me-2"></i>
                  <span className="d-none d-md-inline">
                    {user?.full_name}
                  </span>
                </span>
              }
              id="user-dropdown"
              align="end"
            >
              <div className="px-3 py-2 text-muted small">
                <div className="fw-bold">{user?.full_name}</div>
                <div className="text-truncate">{user?.email}</div>
                <div className="mt-1">
                  <Badge bg={roleBadge.variant}>{roleBadge.text}</Badge>
                </div>
              </div>
              <NavDropdown.Divider />
              <NavDropdown.Item href="/profile">
                <i className="bi bi-person me-2"></i>
                My Profile
              </NavDropdown.Item>
              <NavDropdown.Item href="/settings/profile">
                <i className="bi bi-gear me-2"></i>
                Settings
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item onClick={logout} className="text-danger">
                <i className="bi bi-box-arrow-right me-2"></i>
                Logout
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}
