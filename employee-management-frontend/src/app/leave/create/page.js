'use client'
import { useState } from 'react'
import { Card, Form, Button, Row, Col } from 'react-bootstrap'
import { useRouter } from 'next/navigation'
import DashboardLayout from '@/components/Layout/DashboardLayout'
import { toast } from 'react-toastify'

export default function ApplyLeavePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    leave_type: '',
    start_date: '',
    end_date: '',
    reason: '',
    contact_during_leave: ''
  })

  const leaveTypes = ['Annual', 'Sick', 'Personal', 'Unpaid', 'Emergency']

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const calculateDays = () => {
    if (formData.start_date && formData.end_date) {
      const start = new Date(formData.start_date)
      const end = new Date(formData.end_date)
      const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1
      return days > 0 ? days : 0
    }
    return 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    // API call here
    setTimeout(() => {
      toast.success('Leave request submitted successfully!')
      router.push('/dashboard/leave')
    }, 1000)
  }

  return (
    <DashboardLayout>
      <div className="mb-4">
        <Button variant="outline-secondary" onClick={() => router.back()}>
          <i className="bi bi-arrow-left me-2"></i>Back
        </Button>
      </div>

      <h2 className="mb-4">Apply for Leave</h2>

      <Row>
        <Col md={8}>
          <Card>
            <Card.Body>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Leave Type *</Form.Label>
                  <Form.Select
                    name="leave_type"
                    value={formData.leave_type}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Leave Type</option>
                    {leaveTypes.map(type => (
                      <option key={type} value={type}>{type} Leave</option>
                    ))}
                  </Form.Select>
                </Form.Group>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Start Date *</Form.Label>
                      <Form.Control
                        type="date"
                        name="start_date"
                        value={formData.start_date}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>End Date *</Form.Label>
                      <Form.Control
                        type="date"
                        name="end_date"
                        value={formData.end_date}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>

                {calculateDays() > 0 && (
                  <div className="alert alert-info mb-3">
                    <i className="bi bi-info-circle me-2"></i>
                    Total days: <strong>{calculateDays()} day(s)</strong>
                  </div>
                )}

                <Form.Group className="mb-3">
                  <Form.Label>Reason *</Form.Label>
                  <Form.Control
                    as="textarea"
                    name="reason"
                    value={formData.reason}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Please provide a detailed reason for your leave..."
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Contact During Leave</Form.Label>
                  <Form.Control
                    type="text"
                    name="contact_during_leave"
                    value={formData.contact_during_leave}
                    onChange={handleChange}
                    placeholder="Phone number or email"
                  />
                </Form.Group>

                <div className="d-flex gap-2">
                  <Button type="submit" variant="primary" disabled={loading}>
                    {loading ? 'Submitting...' : 'Submit Request'}
                  </Button>
                  <Button type="button" variant="secondary" onClick={() => router.back()}>
                    Cancel
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="mb-3">
            <Card.Header>
              <h6 className="mb-0">Leave Balance</h6>
            </Card.Header>
            <Card.Body>
              <div className="d-flex justify-content-between mb-2">
                <span>Total Annual Leave:</span>
                <strong>15 days</strong>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>Used:</span>
                <strong className="text-danger">7 days</strong>
              </div>
              <div className="d-flex justify-content-between">
                <span>Available:</span>
                <strong className="text-success">8 days</strong>
              </div>
            </Card.Body>
          </Card>

          <Card>
            <Card.Header>
              <h6 className="mb-0">Leave Policy</h6>
            </Card.Header>
            <Card.Body>
              <small className="text-muted">
                <ul className="ps-3 mb-0">
                  <li>Submit at least 3 days in advance</li>
                  <li>Sick leave requires medical certificate</li>
                  <li>Annual leave max 2 weeks consecutive</li>
                  <li>Emergency leave requires documentation</li>
                </ul>
              </small>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </DashboardLayout>
  )
}
