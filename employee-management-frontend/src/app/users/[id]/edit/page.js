'use client'
import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Card, Form, Button, Row, Col, Spinner, Alert } from 'react-bootstrap'
import DashboardLayout from '@/components/Layout/DashboardLayout'
import api from '@/lib/api'
import { toast } from 'react-toastify'
import Link from 'next/link'

export default function EditUserPage() {
  // Ambil ID dari URL (dynamic segment)
  const { id } = useParams()
  const router = useRouter()
  
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  
  // State untuk form
  const [formData, setFormData] = useState({
    username: '',
    full_name: '',
    email: '',
    role: 'user', // Default role untuk fallback
    is_active: true
  })

  // Daftar role yang tersedia
  const availableRoles = [
    { value: 'super_admin', label: 'Super Admin' },
    { value: 'admin', label: 'Admin' },
    { value: 'manager', label: 'Manager' },
    { value: 'user', label: 'User' }
  ]

  // Fetch data saat halaman dibuka
  useEffect(() => {
    if (id) fetchUserData()
  }, [id])

  const fetchUserData = async () => {
    try {
      setError(null)
      const response = await api.get(`/users/${id}`)
      if (response.data.success) {
        const data = response.data.data
        
        // Map data dari API ke state form
        setFormData({
            username: data.username || '',
            full_name: data.full_name || '',
            email: data.email || '',
            role: data.role || 'user',
            // Konversi 1/0 atau true/false dari API ke boolean state
            is_active: data.is_active === 1 || data.is_active === true 
        })
      } else {
        setError(response.data.message || 'Failed to load user data.')
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to connect to the server or user not found.')
      toast.error('Failed to load user data')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({ 
        ...prev, 
        // Mengurus checkbox vs input teks
        [name]: type === 'checkbox' ? checked : value 
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError(null)

    // Siapkan data untuk dikirim, konversi boolean is_active ke integer (1 atau 0)
    const dataToSend = {
        ...formData,
        is_active: formData.is_active ? 1 : 0
    }

    try {
      // Menggunakan method PUT untuk update data
      await api.put(`/users/${id}`, dataToSend)
      toast.success('User updated successfully')
      router.push('/dashboard/users') // Kembali ke halaman list setelah sukses
    } catch (err) {
      console.error(err)
      setError(err.response?.data?.message || 'Failed to update user')
      toast.error('Failed to update user')
    } finally {
      setSaving(false)
    }
  }

  // --- RENDERING KONDISIONAL ---

  if (loading) {
     return (
        <DashboardLayout>
            <div className="text-center py-5">
                <Spinner animation="border" variant="primary" />
                <p className="mt-2 text-muted">Loading user data...</p>
            </div>
        </DashboardLayout>
     )
  }
  
  // Tampilkan pesan error jika gagal mengambil data
  if (error && !loading) {
      return (
          <DashboardLayout>
              <Alert variant="danger" className="mt-3">
                  <i className="bi bi-exclamation-triangle me-2"></i> 
                  Error loading data: {error}
                  <Link href="/dashboard/users" className="btn btn-sm btn-danger ms-3">Go back to list</Link>
              </Alert>
          </DashboardLayout>
      )
  }


  return (
    <DashboardLayout>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">
            <i className="bi bi-person-fill-gear me-2"></i>
            Edit User: {formData.username}
        </h2>
      </div>

      <Card className="shadow-sm">
        <Card.Body>
          {error && <Alert variant="danger">{error}</Alert>}

          <Form onSubmit={handleSubmit}>
            
            {/* Row 1: Username & Full Name */}
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Username</Form.Label>
                  <Form.Control 
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                    disabled={saving}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Full Name</Form.Label>
                  <Form.Control 
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleChange}
                    required
                    disabled={saving}
                  />
                </Form.Group>
              </Col>
            </Row>

            {/* Row 2: Email & Role */}
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control 
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    disabled={saving}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Role</Form.Label>
                  <Form.Select 
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    required
                    disabled={saving}
                  >
                    <option value="">Select Role</option>
                    {availableRoles.map(r => (
                       <option key={r.value} value={r.value}>{r.label}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            {/* Row 3: Status */}
            <Row className="mb-4">
              <Col md={12}>
                <Form.Group>
                  <Form.Check 
                    type="checkbox"
                    label="Is Active"
                    name="is_active"
                    checked={formData.is_active}
                    onChange={handleChange}
                    disabled={saving}
                  />
                  <Form.Text className="text-muted">
                    Uncheck to temporarily disable this user account.
                  </Form.Text>
                </Form.Group>
              </Col>
            </Row>

            <div className="d-flex gap-2 pt-3 border-top">
                <Button variant="primary" type="submit" disabled={saving}>
                    {saving ? <><Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /> Saving...</> : 'Save Changes'}
                </Button>
                <Button variant="secondary" onClick={() => router.push('/users')} disabled={saving}>
                    Cancel
                </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </DashboardLayout>
  )
}