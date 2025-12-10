'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import {
  Card,
  Button,
  Spinner,
  Row,
  Col,
  Badge,
  Table,
  Image
} from 'react-bootstrap'
import DashboardLayout from '@/components/Layout/DashboardLayout'
import api from '@/lib/api'
import Link from 'next/link'

export default function EmployeeDetail() {
  const { id } = useParams()
  const router = useRouter()

  const [employee, setEmployee] = useState(null)
  const [loading, setLoading] = useState(true)

  const BASE_URL = process.env.NEXT_PUBLIC_UPLOAD_URL

  useEffect(() => {
    if (id) fetchEmployee()
  }, [id])

  const fetchEmployee = async () => {
    try {
      const response = await api.get(`/employees/${id}`)
      if (response.data.success) {
        setEmployee(response.data.data.employee)
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
        </div>
      </DashboardLayout>
    )
  }

  if (!employee) {
    return (
      <DashboardLayout>
        <div className="alert alert-danger">Employee not found</div>
        <Button onClick={() => router.back()}>Go Back</Button>
      </DashboardLayout>
    )
  }

  // ================= FOTO HANDLER =================
  const buildPhotoUrl = (photo) => {
    if (!photo) return null

    // kalau sudah full URL → langsung pakai
    if (photo.startsWith('http')) return photo

    // kalau masih path / filename → gabung BASE_URL
    return `${BASE_URL}/${photo}`
  }

  const photoUrl = buildPhotoUrl(
    employee.photo || employee.photo_url || employee.avatar
  )

  return (
    <DashboardLayout>
      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">
          <Button
            variant="link"
            onClick={() => router.back()}
            className="text-decoration-none text-dark p-0 me-3"
          >
            <i className="bi bi-arrow-left fs-4"></i>
          </Button>
          Employee Details
        </h2>

        <Link href={`/employees/${id}/edit`} className="btn btn-primary">
          <i className="bi bi-pencil me-2"></i>Edit
        </Link>
      </div>

      <Row>
        {/* PROFILE */}
        <Col md={4}>
          <Card className="shadow-sm mb-4">
            <Card.Body className="text-center">
              {photoUrl ? (
                <Image
                  src={photoUrl}
                  alt="Employee Photo"
                  roundedCircle
                  style={{
                    width: '120px',
                    height: '120px',
                    objectFit: 'cover'
                  }}
                  className="mb-3"
                />
              ) : (
                <div
                  className="bg-light rounded-circle d-inline-flex justify-content-center align-items-center mb-3"
                  style={{ width: '120px', height: '120px' }}
                >
                  <i className="bi bi-person fs-1 text-secondary"></i>
                </div>
              )}

              <h4 className="mb-1">
                {employee.full_name ||
                  `${employee.first_name || ''} ${employee.last_name || ''}`}
              </h4>

              <p className="text-muted mb-1">{employee.position || '-'}</p>

              <Badge bg="info" className="mb-2">
                {employee.department || '-'}
              </Badge>

              <div className="mt-2">
                <Badge
                  bg={employee.status === 'Active' ? 'success' : 'secondary'}
                >
                  {employee.status || 'Inactive'}
                </Badge>
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* DETAIL */}
        <Col md={8}>
          <Card className="shadow-sm">
            <Card.Header className="bg-white fw-bold">
              General Information
            </Card.Header>

            <Card.Body>
              <Table borderless responsive>
                <tbody>
                  <tr>
                    <td width="30%" className="text-muted">Employee Code</td>
                    <td className="fw-bold">
                      {employee.employee_code || employee.employee_id || '-'}
                    </td>
                  </tr>

                  <tr>
                    <td className="text-muted">Email</td>
                    <td>{employee.email || '-'}</td>
                  </tr>

                  <tr>
                    <td className="text-muted">Phone</td>
                    <td>{employee.phone || '-'}</td>
                  </tr>

                  <tr>
                    <td className="text-muted">Date of Joining</td>
                    <td>
                      {employee.hire_date
                        ? new Date(employee.hire_date).toLocaleDateString()
                        : '-'}
                    </td>
                  </tr>

                  <tr>
                    <td className="text-muted">Birth Date</td>
                    <td>
                      {employee.birth_date
                        ? new Date(employee.birth_date).toLocaleDateString()
                        : '-'}
                    </td>
                  </tr>

                  <tr>
                    <td className="text-muted">Address</td>
                    <td>{employee.address || '-'}</td>
                  </tr>
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </DashboardLayout>
  )
}
