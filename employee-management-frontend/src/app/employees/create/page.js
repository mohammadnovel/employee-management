'use client'
import { useState } from 'react'
import { Card, Form, Button, Row, Col, Image, Alert, Spinner } from 'react-bootstrap'
import { useRouter } from 'next/navigation'
import DashboardLayout from '@/components/Layout/DashboardLayout'
import api from '@/lib/api'
import { toast } from 'react-toastify'
import Link from 'next/link'

// Batas ukuran file dalam bytes (200 KB)
const MAX_FILE_SIZE = 200 * 1024 

export default function CreateEmployeePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  
  // 💡 STATE BARU UNTUK FOTO
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
    gender: 'Male',
    status: 'Active'
  })

  const departments = ['IT', 'HR', 'Finance', 'Marketing', 'Sales', 'Operations']
  const positions = ['Developer', 'Manager', 'Staff', 'Supervisor', 'Director', 'Analyst']

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  // 💡 Handler untuk upload foto dan validasi
  const handleImageChange = (e) => {
    const file = e.target.files[0]
    setFileError('') // Reset error
    
    if (!file) {
      setImageFile(null)
      setImagePreview(null)
      return
    }

    // 1. Validasi Tipe File
    if (!file.type.startsWith('image/')) {
        setFileError('File harus berupa gambar (JPG, PNG, GIF).')
        setImageFile(null)
        setImagePreview(null)
        return
    }

    // 2. Validasi Ukuran File (max 200KB)
    if (file.size > MAX_FILE_SIZE) {
      setFileError(`Ukuran file melebihi batas 200KB. Ukuran saat ini: ${(file.size / 1024).toFixed(2)} KB.`)
      setImageFile(null)
      setImagePreview(null)
      return
    }

    // File valid
    setImageFile(file)

    // Buat pratinjau
    const reader = new FileReader()
    reader.onloadend = () => {
      setImagePreview(reader.result)
    }
    reader.readAsDataURL(file)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (fileError) return 
    
    setLoading(true)

    try {
      // 💡 Menggunakan FormData karena kita mengirim file
      const data = new FormData()

      // Tambahkan semua data teks ke FormData
      Object.keys(formData).forEach(key => {
        // Konversi nilai salary ke tipe Number jika perlu di backend, 
        // tapi FormData akan mengirimnya sebagai string.
        data.append(key, formData[key]) 
      })

      // 💡 Tambahkan file foto dengan KEY 'photo' sesuai backend req.file
      if (imageFile) {
        data.append('photo', imageFile) 
      }
      
      const response = await api.post('/employees', data, {
        // Axios/Browser akan otomatis mengatur Content-Type: multipart/form-data
      })
      
      if (response.data.success) {
        toast.success('Employee created successfully!')
        // Arahkan ke rute dashboard/employees yang benar
        router.push('/dashboard/employees') 
      }
    } catch (error) {
      // Menangani error dari backend, termasuk error batasan ukuran Multer (400 Bad Request)
      toast.error(error.response?.data?.message || 'Failed to create employee')
    } finally {
      setLoading(false)
    }
  }

  return (
    <DashboardLayout>
      <div className="mb-4">
        <Link href="/dashboard/employees" className="btn btn-outline-secondary">
          <i className="bi bi-arrow-left me-2"></i>Back to Employees
        </Link>
      </div>

      <div className="d-flex align-items-center mb-4">
        <div className="bg-primary bg-opacity-10 p-3 rounded me-3">
          <i className="bi bi-person-plus-fill text-primary fs-4"></i>
        </div>
        <div>
          <h2 className="mb-0">Add New Employee</h2>
          <p className="text-muted mb-0">Fill in the details below, including profile photo.</p>
        </div>
      </div>

      <Card className="shadow-sm">
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <Row>
              {/* Kolom Kiri: Form Data Teks */}
              <Col md={9}>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label><i className="bi bi-hash me-1"></i>Employee Code *</Form.Label>
                      <Form.Control
                        type="text"
                        name="employee_code"
                        value={formData.employee_code}
                        onChange={handleChange}
                        placeholder="e.g., EMP001"
                        required
                        disabled={loading}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label><i className="bi bi-person me-1"></i>Full Name *</Form.Label>
                      <Form.Control
                        type="text"
                        name="full_name"
                        value={formData.full_name}
                        onChange={handleChange}
                        required
                        disabled={loading}
                      />
                    </Form.Group>
                  </Col>
                </Row>
                
                {/* Email dan Phone di baris berikutnya */}
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label><i className="bi bi-envelope me-1"></i>Email *</Form.Label>
                      <Form.Control
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        disabled={loading}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label><i className="bi bi-telephone me-1"></i>Phone *</Form.Label>
                      <Form.Control
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        disabled={loading}
                      />
                    </Form.Group>
                  </Col>
                </Row>
                
              </Col>
              
              {/* Kolom Kanan: Photo Upload */}
              <Col md={3}>
                <Form.Group controlId="formFile" className="mb-3 text-center">
                    <Form.Label><i className="bi bi-camera me-1"></i>Profile Photo</Form.Label>
                    
                    {/* Photo Preview */}
                    <div className="mb-2 d-flex justify-content-center">
                        <Image 
                            src={imagePreview || '/images/default-avatar.png'} // Pastikan path ini benar
                            roundedCircle
                            style={{ width: '100px', height: '100px', objectFit: 'cover', border: '2px solid #ddd' }}
                            alt="Profile Preview"
                        />
                    </div>

                    <Form.Control 
                        type="file" 
                        accept="image/*"
                        onChange={handleImageChange}
                        isInvalid={!!fileError} // Menampilkan feedback error jika ada
                        disabled={loading}
                    />
                    
                    {/* Menampilkan pesan error validasi */}
                    {fileError && <Form.Control.Feedback type="invalid">{fileError}</Form.Control.Feedback>}
                    <Form.Text className="text-muted">Max size: 200KB. Tipe: JPG, PNG, GIF.</Form.Text>
                </Form.Group>
              </Col>
            </Row>
            
            <hr className="my-3"/>
            
            {/* Sisa Form (Address, Job Details, Dates) */}

            <Form.Group className="mb-3">
              <Form.Label><i className="bi bi-geo-alt me-1"></i>Address</Form.Label>
              <Form.Control
                as="textarea"
                name="address"
                value={formData.address}
                onChange={handleChange}
                rows={2}
                disabled={loading}
              />
            </Form.Group>

            <Row>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label><i className="bi bi-briefcase me-1"></i>Position *</Form.Label>
                  <Form.Select
                    name="position"
                    value={formData.position}
                    onChange={handleChange}
                    required
                    disabled={loading}
                  >
                    <option value="">Select Position</option>
                    {positions.map(pos => (
                      <option key={pos} value={pos}>{pos}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label><i className="bi bi-building me-1"></i>Department *</Form.Label>
                  <Form.Select
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    required
                    disabled={loading}
                  >
                    <option value="">Select Department</option>
                    {departments.map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label><i className="bi bi-cash me-1"></i>Salary *</Form.Label>
                  <Form.Control
                    type="number"
                    name="salary"
                    value={formData.salary}
                    onChange={handleChange}
                    required
                    disabled={loading}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={3}>
                <Form.Group className="mb-3">
                  <Form.Label><i className="bi bi-calendar-check me-1"></i>Hire Date *</Form.Label>
                  <Form.Control
                    type="date"
                    name="hire_date"
                    value={formData.hire_date}
                    onChange={handleChange}
                    required
                    disabled={loading}
                  />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group className="mb-3">
                  <Form.Label><i className="bi bi-calendar-heart me-1"></i>Birth Date *</Form.Label>
                  <Form.Control
                    type="date"
                    name="birth_date"
                    value={formData.birth_date}
                    onChange={handleChange}
                    required
                    disabled={loading}
                  />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group className="mb-3">
                  <Form.Label><i className="bi bi-gender-ambiguous me-1"></i>Gender *</Form.Label>
                  <Form.Select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    disabled={loading}
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group className="mb-3">
                  <Form.Label><i className="bi bi-toggle-on me-1"></i>Status *</Form.Label>
                  <Form.Select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    disabled={loading}
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="On Leave">On Leave</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <hr className="my-4" />

            <div className="d-flex gap-2">
              <Button type="submit" variant="primary" disabled={loading || !!fileError}>
                <i className="bi bi-check-circle me-2"></i>
                {loading ? <><Spinner as="span" animation="border" size="sm" /> Creating...</> : 'Create Employee'}
              </Button>
              <Link href="/dashboard/employees" className="btn btn-secondary" disabled={loading}>
                <i className="bi bi-x-circle me-2"></i>
                Cancel
              </Link>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </DashboardLayout>
  )
}