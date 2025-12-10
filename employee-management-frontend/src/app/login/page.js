'use client'
import { useState } from 'react'
import { Container, Row, Col, Card, Form, Button, Alert, InputGroup } from 'react-bootstrap'
import { useAuth } from '@/components/AuthContext'
import Link from 'next/link'

export default function LoginPage() {
  const { login } = useAuth()
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false) // State untuk visibility

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    // Memanggil fungsi login dari AuthContext
    const result = await login(formData)
    
    if (!result.success) {
      setError(result.message)
    }
    
    setLoading(false)
  }

  return (
    <div 
      className="d-flex align-items-center justify-content-center"
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '2rem 0'
      }}
    >
      <Container>
        <div className="text-center mb-5 fade-in">
          <div 
            className="d-inline-flex align-items-center justify-content-center mb-3"
            style={{
              width: '80px',
              height: '80px',
              background: 'white',
              borderRadius: '20px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
            }}
          >
            <i className="bi bi-building text-primary" style={{ fontSize: '2.5rem' }}></i>
          </div>
          <h2 className="text-white fw-bold">Employee Management</h2>
          <p className="text-white-50">Sign in to your account</p>
        </div>
        
        <Row className="justify-content-center">
          <Col md={5} lg={4}>
            {/* Login Card */}
            <Card className="shadow-lg border-0 fade-in" style={{ borderRadius: '16px', animationDelay: '0.1s' }}>
              <Card.Body className="p-4">
                <h4 className="fw-bold mb-4 text-center">Sign In</h4>
                
                {error && <Alert variant="danger" className="mb-3">{error}</Alert>}
                
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label className="small fw-bold">Email address</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      disabled={loading}
                      placeholder="Enter email"
                      size="lg"
                    />
                  </Form.Group>

                  {/* Password Input dengan Visibility Toggle */}
                  <Form.Group className="mb-4">
                    <Form.Label className="small fw-bold">Password</Form.Label>
                    <InputGroup size="lg">
                      <Form.Control
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        disabled={loading}
                        placeholder="Enter password"
                      />
                      <Button 
                        variant="outline-secondary" 
                        onClick={() => setShowPassword(!showPassword)}
                        disabled={loading}
                        style={{ borderLeft: 'none', boxShadow: 'none' }}
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                      >
                        <i className={showPassword ? "bi bi-eye-slash" : "bi bi-eye"}></i>
                      </Button>
                    </InputGroup>
                  </Form.Group>

                  <Button
                    variant="primary"
                    type="submit"
                    className="w-100 fw-bold"
                    size="lg"
                    disabled={loading}
                    style={{ borderRadius: '10px' }}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Signing in...
                      </>
                    ) : (
                      'Sign In'
                    )}
                  </Button>
                  
                  <div className="text-center mt-3">
                    <Link href="#" className="text-primary small fw-bold text-decoration-none">
                      Forgot Password?
                    </Link>
                  </div>

                </Form>
              </Card.Body>
            </Card>
          </Col>

          {/* Default Credentials Card (Kolom Kanan) */}
          <Col md={5} lg={4} className="mt-4 mt-md-0">
             <Card className="shadow-lg border-0 fade-in" style={{ borderRadius: '16px', animationDelay: '0.2s' }}>
                <Card.Body className="p-4 bg-light">
                  <h5 className="fw-bold mb-3">Default Credentials:</h5>
                  
                  <ul className="list-unstyled small">
                    <li className="mb-2">
                      <span className="badge bg-danger me-2">Super Admin</span>
                      {/* 💡 FIX EMAIL HERE */}
                      <strong className="d-block mt-1">superadmin@company.com</strong> 
                    </li>
                    <li className="mb-2">
                      <span className="badge bg-primary me-2">Admin</span>
                      <strong className="d-block mt-1">admin@company.com</strong>
                    </li>
                    <li className="mb-2">
                      <span className="badge bg-warning me-2">Manager</span>
                      <strong className="d-block mt-1">manager1@company.com</strong>
                    </li>
                    <li className="mb-2">
                      <span className="badge bg-secondary me-2">User</span>
                      <strong className="d-block mt-1">user1@company.com</strong>
                    </li>
                  </ul>
                  
                  <hr/>
                  
                  <div className="text-center mt-3 fw-bold">
                    Password: <span className="text-success">123456</span>
                  </div>
                </Card.Body>
             </Card>
          </Col>
        </Row>
      </Container>
    </div>
  )
}