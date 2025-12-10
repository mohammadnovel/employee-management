'use client'
import { useState, useEffect } from 'react'
import { Card, Table, Button, Badge, Spinner, Form, InputGroup, Modal } from 'react-bootstrap' // 💡 Tambahkan Modal
import DashboardLayout from '@/components/Layout/DashboardLayout'
import api from '@/lib/api'
import { toast } from 'react-toastify'
import Link from 'next/link'

export default function UserListPage() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  
  // 💡 STATE BARU UNTUK DELETE
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const response = await api.get('/users')
      if (response.data.success) {
        // Asumsi data.data adalah array of users
        setUsers(response.data.data) 
      }
    } catch (error) {
      toast.error('Failed to fetch users')
    } finally {
      setLoading(false)
    }
  }

  // 💡 LOGIC DELETE
  const handleDelete = async () => {
    if (!selectedUser) return;
    
    try {
      // Pastikan API endpoint untuk delete user adalah /users/:id
      await api.delete(`/users/${selectedUser.id}`) 
      toast.success(`User ${selectedUser.username} deleted successfully`)
      
      // Tutup modal dan refresh list
      setShowDeleteModal(false)
      setSelectedUser(null)
      fetchUsers()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete user')
    }
  }

  const getRoleBadge = (role) => {
    const badges = {
      super_admin: 'danger',
      admin: 'primary',
      manager: 'warning',
      user: 'secondary'
    }
    return badges[role] || 'secondary'
  }

  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(search.toLowerCase()) ||
    user.email.toLowerCase().includes(search.toLowerCase()) ||
    user.full_name.toLowerCase().includes(search.toLowerCase())
  )

  // 💡 PERBAIKAN 1: Ikon hilang biasanya karena masalah CSS atau Next.js tidak me-render client component di awal.
  // Pastikan Bootstrap Icons terinstal dengan benar di root layout/global CSS. 
  // Di sini, kita akan memastikan penulisan ikon sudah benar.

  return (
    <DashboardLayout>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2><i className="bi bi-people-fill me-2"></i> User Management</h2>
        <Link href="/dashboard/users/create" className="btn btn-primary">
          <i className="bi bi-person-plus me-2"></i>
          Create User
        </Link>
      </div>

      <Card>
        <Card.Body>
          <InputGroup className="mb-3">
            <InputGroup.Text>
              <i className="bi bi-search"></i>
            </InputGroup.Text>
            <Form.Control
              placeholder="Search users..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </InputGroup>

          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="primary" />
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-center py-5 text-muted">
              <i className="bi bi-person-x fs-1 mb-3 d-block"></i>
              <h5>No users found</h5>
              <p>Try adjusting your search or filter</p>
            </div>
          ) : (
            <Table responsive hover>
              <thead>
                <tr>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Full Name</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map(user => (
                  <tr key={user.id}>
                    <td>{user.username}</td>
                    <td>{user.email}</td>
                    <td>{user.full_name}</td>
                    <td>
                      <Badge bg={getRoleBadge(user.role)}>
                        {user.role.replace('_', ' ').toUpperCase()}
                      </Badge>
                    </td>
                    <td>
                      <Badge bg={user.is_active ? 'success' : 'danger'}>
                        {user.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                    </td>
                    <td className="text-nowrap">
                      <Link 
                        href={`/users/${user.id}/edit`} 
                        className="btn btn-sm btn-outline-primary me-2"
                        aria-label="Edit User"
                      >
                        <i className="bi bi-pencil-square"></i> {/* Ikon Diperbaiki */}
                      </Link>
                      
                      {/* 💡 PERBAIKAN 2: Tambahkan onClick handler untuk Delete */}
                      <Button 
                        size="sm" 
                        variant="outline-danger"
                        onClick={() => {
                          setSelectedUser(user)
                          setShowDeleteModal(true)
                        }}
                        aria-label="Delete User"
                      >
                        <i className="bi bi-trash3"></i> {/* Ikon Diperbaiki */}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete user{' '}
          <strong>{selectedUser?.username}</strong> ({selectedUser?.full_name})?
          This action cannot be undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </DashboardLayout>
  )
}