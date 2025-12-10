'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Card, Form, Button, Row, Col, Spinner, Image } from 'react-bootstrap'
import DashboardLayout from '@/components/Layout/DashboardLayout'
import api from '@/lib/api'
import { toast } from 'react-toastify'
import Link from 'next/link'

const MAX_FILE_SIZE = 200 * 1024
const API_BASE_URL = process.env.NEXT_PUBLIC_UPLOAD_URL || ''

export default function EditEmployeePage() {
  const { id } = useParams()
  const router = useRouter()

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const [currentPhotoUrl, setCurrentPhotoUrl] = useState(null)
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [fileError, setFileError] = useState('')

  const [formData, setFormData] = useState({
    employee_code: '',
    full_name: '',
    email: '',
    phone: '',
    address: '',
    position: '',
    department: '',
    salary: '',
    hire_date: '',
    birth_date: '',
    gender: '',
    status: 'Active'
  })

  useEffect(() => {
    fetchEmployee()
  }, [])

  const fetchEmployee = async () => {
    try {
      const res = await api.get(`/employees/${id}`)
      const emp = res.data.data.employee

      const photo = emp.photo
        ? `${API_BASE_URL}/${emp.photo}`
        : null

      setCurrentPhotoUrl(photo)
      setImagePreview(photo)

      setFormData({
        employee_code: emp.employee_code ?? '',
        full_name: emp.full_name ?? '',
        email: emp.email ?? '',
        phone: emp.phone ?? '',
        address: emp.address ?? '',
        position: emp.position ?? '',
        department: emp.department ?? '',
        salary: emp.salary ?? '',
        hire_date: emp.hire_date?.split('T')[0] ?? '',
        birth_date: emp.birth_date?.split('T')[0] ?? '',
        gender: emp.gender ?? '',
        status: emp.status ?? 'Active'
      })
    } catch {
      toast.error('Failed to load employee data')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    setFileError('')

    if (!file) {
      setImageFile(null)
      setImagePreview(currentPhotoUrl)
      return
    }

    if (!file.type.startsWith('image/')) {
      setFileError('File harus berupa gambar')
      return
    }

    if (file.size > MAX_FILE_SIZE) {
      setFileError('Ukuran maksimal 200KB')
      return
    }

    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (fileError) return

    setSaving(true)

    try {
      const data = new FormData()

      // ✅ HARUS MATCH BACKEND
      Object.entries(formData).forEach(([key, val]) => {
        data.append(key, val ?? '')
      })

      // ✅ PHOTO
      if (imageFile) {
        data.append('photo', imageFile)
      }

      // ✅ METHOD OVERRIDE
      data.append('_method', 'PUT')

      const res = await api.post(`/employees/${id}`, data)

      if (res.data.success) {
        toast.success('Employee updated successfully')
        router.push('/employees')
      } else {
        toast.error(res.data.message)
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update employee')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="text-center py-5">
          <Spinner animation="border" />
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>

      <Link href="/employees" className="btn btn-outline-secondary btn-sm mb-3">
        ← Back
      </Link>

      <Form onSubmit={handleSubmit}>
        <Row>

          {/* PHOTO */}
          <Col md={4}>
            <Card className="mb-4">
              <Card.Body className="text-center">
                <Image
                  src={imagePreview || '/images/default-avatar.png'}
                  roundedCircle
                  width={120}
                  height={120}
                  style={{ objectFit: 'cover' }}
                />
                <Form.Control
                  type="file"
                  accept="image/*"
                  className="mt-3"
                  onChange={handleImageChange}
                  disabled={saving}
                />
                {fileError && <div className="text-danger small">{fileError}</div>}
              </Card.Body>
            </Card>
          </Col>

          {/* FORM */}
          <Col md={8}>
            <Card>
              <Card.Body>

                {Object.keys(formData).map(key => (
                  <Form.Group className="mb-3" key={key}>
                    <Form.Label>{key.replace('_', ' ').toUpperCase()}</Form.Label>
                    <Form.Control
                      name={key}
                      value={formData[key]}
                      onChange={handleChange}
                    />
                  </Form.Group>
                ))}

                <Button type="submit" disabled={saving}>
                  {saving ? 'Saving...' : 'Save Changes'}
                </Button>

              </Card.Body>
            </Card>
          </Col>

        </Row>
      </Form>
    </DashboardLayout>
  )
}
