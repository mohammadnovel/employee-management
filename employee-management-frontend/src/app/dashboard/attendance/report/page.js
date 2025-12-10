'use client'
import { useState } from 'react'
import { Card, Table, Form, Row, Col, Button, Badge } from 'react-bootstrap'
import DashboardLayout from '@/components/Layout/DashboardLayout'

export default function AttendanceReportPage() {
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  return (
    <DashboardLayout>
      <h2 className="mb-4">Attendance Report</h2>

      <Card className="mb-3">
        <Card.Body>
          <Row>
            <Col md={3}>
              <Form.Group>
                <Form.Label>Start Date</Form.Label>
                <Form.Control
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group>
                <Form.Label>End Date</Form.Label>
                <Form.Control
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group>
                <Form.Label>Department</Form.Label>
                <Form.Select>
                  <option>All Departments</option>
                  <option>IT</option>
                  <option>HR</option>
                  <option>Finance</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={3} className="d-flex align-items-end gap-2">
              <Button variant="primary" className="flex-grow-1">
                <i className="bi bi-search me-2"></i>
                Generate
              </Button>
              <Button variant="success">
                <i className="bi bi-download"></i>
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      <Row className="mb-3">
        <Col md={3}>
          <Card className="text-center">
            <Card.Body>
              <h4 className="text-success">85%</h4>
              <small className="text-muted">Present</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center">
            <Card.Body>
              <h4 className="text-warning">8%</h4>
              <small className="text-muted">Late</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center">
            <Card.Body>
              <h4 className="text-danger">4%</h4>
              <small className="text-muted">Absent</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center">
            <Card.Body>
              <h4 className="text-info">3%</h4>
              <small className="text-muted">Leave</small>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Card>
        <Card.Body>
          <Table responsive striped hover>
            <thead>
              <tr>
                <th>Employee</th>
                <th>Department</th>
                <th>Total Days</th>
                <th>Present</th>
                <th>Late</th>
                <th>Absent</th>
                <th>Leave</th>
                <th>Percentage</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan="8" className="text-center text-muted">
                  Select date range and click Generate to view report
                </td>
              </tr>
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </DashboardLayout>
  )
}
