'use client'
import { useState } from 'react'
import { Card, Table, Badge, Button, Form, Row, Col } from 'react-bootstrap'
import DashboardLayout from '@/components/Layout/DashboardLayout'

export default function AttendancePage() {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])

  return (
    <DashboardLayout>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Attendance List</h2>
        <Button variant="primary">
          <i className="bi bi-plus-circle me-2"></i>
          Mark Attendance
        </Button>
      </div>

      <Card className="mb-3">
        <Card.Body>
          <Row>
            <Col md={3}>
              <Form.Group>
                <Form.Label>Date</Form.Label>
                <Form.Control
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
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
            <Col md={3}>
              <Form.Group>
                <Form.Label>Status</Form.Label>
                <Form.Select>
                  <option>All Status</option>
                  <option>Present</option>
                  <option>Absent</option>
                  <option>Late</option>
                  <option>Leave</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={3} className="d-flex align-items-end">
              <Button variant="primary" className="w-100">
                <i className="bi bi-search me-2"></i>
                Search
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      <Card>
        <Card.Body>
          <div className="mb-3 d-flex gap-2">
            <Badge bg="success">Present: 85%</Badge>
            <Badge bg="warning">Late: 8%</Badge>
            <Badge bg="danger">Absent: 4%</Badge>
            <Badge bg="info">Leave: 3%</Badge>
          </div>

          <Table responsive hover>
            <thead>
              <tr>
                <th>Employee</th>
                <th>Code</th>
                <th>Department</th>
                <th>Check In</th>
                <th>Check Out</th>
                <th>Status</th>
                <th>Notes</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan="7" className="text-center text-muted">
                  Select date and filters to view attendance records
                </td>
              </tr>
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </DashboardLayout>
  )
}
