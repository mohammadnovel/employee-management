'use client'
import { useState } from 'react'
import { Card, Button, Form, Row, Col, ListGroup } from 'react-bootstrap'
import DashboardLayout from '@/components/Layout/DashboardLayout'

export default function ReportsPage() {
  const [reportType, setReportType] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  const reports = [
    {
      title: 'Employee Report',
      icon: 'people',
      description: 'Complete employee information report',
      color: 'primary'
    },
    {
      title: 'Attendance Report',
      icon: 'calendar-check',
      description: 'Employee attendance summary',
      color: 'success'
    },
    {
      title: 'Leave Report',
      icon: 'calendar-x',
      description: 'Leave requests and approvals',
      color: 'warning'
    },
    {
      title: 'Salary Report',
      icon: 'cash-coin',
      description: 'Salary and payment records',
      color: 'info'
    }
  ]

  return (
    <DashboardLayout>
      <h2 className="mb-4">Reports</h2>

      <Row>
        {reports.map((report, index) => (
          <Col md={6} lg={3} key={index} className="mb-4">
            <Card className="h-100 hover-shadow">
              <Card.Body className="text-center">
                <div 
                  className={`rounded-circle d-inline-flex align-items-center justify-content-center mb-3`}
                  style={{ width: '60px', height: '60px', backgroundColor: `var(--bs-${report.color})` }}
                >
                  <i className={`bi bi-${report.icon} text-white`} style={{ fontSize: '1.5rem' }}></i>
                </div>
                <h5>{report.title}</h5>
                <p className="text-muted small">{report.description}</p>
                <Button variant={report.color} size="sm" className="mt-2">
                  <i className="bi bi-download me-2"></i>
                  Generate
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <Card className="mt-4">
        <Card.Header>
          <h5 className="mb-0">Custom Report Generator</h5>
        </Card.Header>
        <Card.Body>
          <Form>
            <Row>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Report Type</Form.Label>
                  <Form.Select
                    value={reportType}
                    onChange={(e) => setReportType(e.target.value)}
                  >
                    <option value="">Select Report Type</option>
                    <option value="employee">Employee Report</option>
                    <option value="attendance">Attendance Report</option>
                    <option value="leave">Leave Report</option>
                    <option value="salary">Salary Report</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>Start Date</Form.Label>
                  <Form.Control
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>End Date</Form.Label>
                  <Form.Control
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col md={2} className="d-flex align-items-end">
                <Button variant="primary" className="w-100 mb-3">
                  <i className="bi bi-file-earmark-arrow-down me-2"></i>
                  Generate
                </Button>
              </Col>
            </Row>
          </Form>
        </Card.Body>
      </Card>
    </DashboardLayout>
  )
}
